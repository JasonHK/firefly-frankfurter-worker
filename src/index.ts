import { Hono } from "hono";

import today from "./_middlewares/today";
import frankfurterClient from "./_middlewares/frankfurter-client";

import v1 from "./v1";

const worker = new Hono<WorkerEnv>();
worker.use(today);
worker.use(frankfurterClient);
worker.route("/", v1);

export default worker;
