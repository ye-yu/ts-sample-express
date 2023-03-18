import { HealthServiceStatus } from "./health-service-status.type.js";

export type HealthStatus = {
	ok: boolean;
	services: HealthServiceStatus[];
};
