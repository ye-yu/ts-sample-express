import { HealthServiceStatus } from "./health-service-status.type.js";

export type HealthCheckFunction = () => Promise<HealthServiceStatus>;
