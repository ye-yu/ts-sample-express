import { LoggerService } from "../logger/logger.service.js";
import { Get } from "../server/decorators/get.decorator.js";
import { Middleware } from "../server/types/middleware.type.js";
import { Request } from "../server/types/request.type.js";
import { HealthCheckFunction } from "./types/health-check-function.type.js";
import { HealthServiceStatus } from "./types/health-service-status.type.js";
import { HealthStatus } from "./types/health-status.type.js";

export class HealthServiceImpl {
	static readonly instance = new HealthServiceImpl();
	readonly healthCheckFunctions: Map<string, HealthCheckFunction> = new Map();
	readonly healthStatuses: Map<string, HealthServiceStatus> = new Map();
	readonly logger = LoggerService.for("health");

	lastHealthyStatus: HealthStatus = {
		ok: false,
		services: [],
	};

	get isHealthy(): HealthStatus {
		return this.lastHealthyStatus;
	}

	registerHealthHook(
		service: string,
		healthCheckFunction: HealthCheckFunction
	) {
		this.healthCheckFunctions.set(service, healthCheckFunction);
		this.healthStatuses.set(service, {
			service,
			ok: false,
			message: "uninitialized",
		});
	}

	@Get("/api/v1/health")
	async healthCheck(): Promise<HealthStatus> {
		let allOk = true;
		const statuses = new Array<HealthServiceStatus>(
			this.healthCheckFunctions.size
		);
		let index = 0;
		for (const [service, check] of this.healthCheckFunctions.entries()) {
			try {
				const checkResult = await check();
				this.healthStatuses.set(service, checkResult);
				allOk &&= checkResult.ok;
				statuses[index++] = checkResult;
			} catch (error) {
				const unhealthy = {
					service,
					ok: false,
					message: error?.message,
				};
				this.healthStatuses.set(service, unhealthy);
				allOk &&= false;
				statuses[index++] = unhealthy;
			}

			const lastHealthCheck = statuses.at(-1);
			if (lastHealthCheck && !lastHealthCheck.ok) {
				this.logger
					.setMeta(lastHealthCheck)
					.error(
						"health check failed for service %s: %s",
						lastHealthCheck.service,
						lastHealthCheck.message ?? "<no message>"
					);
			}
		}

		this.lastHealthyStatus = {
			ok: allOk,
			services: statuses,
		};

		return this.lastHealthyStatus;
	}

	middleware: Middleware = async (_, res, next): Promise<void> => {
		// if last status not health, check again
		if (!this.lastHealthyStatus.ok) {
			await this.healthCheck();
		}

		// if still not healthy, fail request
		if (!this.lastHealthyStatus.ok) {
			res.status(503).json(this.lastHealthyStatus);
		} else {
			next();
		}
	};

	healthCheckInterval: NodeJS.Timer | null = null;
	enableInternalHealthCheckInterval(): void {
		if (this.healthCheckInterval) return;
		this.healthCheckInterval = setInterval(this.healthCheck.bind(this), 5000);
	}

	disableInternalHealthCheckInterval(): void {
		if (!this.healthCheckInterval) return;
		clearInterval(this.healthCheckInterval);
		this.healthCheckInterval = null;
	}
}

export const HealthService = HealthServiceImpl.instance;
