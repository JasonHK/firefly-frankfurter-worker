import type { Context } from "hono";
import type { FrankfurterClient } from "frankfurter-js";

declare global
{
    interface __BaseEnv_Env
    {
        FRANKFURTER_ENDPOINT?: string;
    }

    interface WorkerEnv extends Env
    {
        Bindings: Cloudflare.Env;
        Variables: {
            today: Temporal.PlainDate;
            frankfurter: FrankfurterClient;
        };
    }

    type WorkerContext = Context<WorkerEnv>;
}
