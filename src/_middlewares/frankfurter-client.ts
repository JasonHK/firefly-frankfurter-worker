import { createMiddleware } from "hono/factory";
import { FrankfurterClient } from "frankfurter-js";

const frankfurterClient = createMiddleware<WorkerEnv>(async (c, next) =>
{
    c.set("frankfurter", new FrankfurterClient(
        {
            baseUrl: c.env.FRANKFURTER_ENDPOINT,
            fetch: globalThis.fetch.bind(globalThis),
        }));

    return next();
});

export default frankfurterClient;
