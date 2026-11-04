import { Temporal } from "temporal-polyfill";
import { createMiddleware } from "hono/factory";

const today = createMiddleware<WorkerEnv>(async (c, next) =>
{
    c.set("today", Temporal.Now.plainDateISO());
    return next();
});

export default today;
