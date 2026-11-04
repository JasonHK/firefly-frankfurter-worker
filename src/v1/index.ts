import { Hono } from "hono";
import { fromHono } from "chanfana";

import stripExtension from "../_middlewares/strip-extension";

import WeeklyRates from "./weekly-rates";

const v1 = new Hono<WorkerEnv>().basePath("/v1");
v1.use("/*/*/*", stripExtension);

const openApi = fromHono(v1);
openApi.get("/:year/:isoWeek/:currency", WeeklyRates);

export default v1;
