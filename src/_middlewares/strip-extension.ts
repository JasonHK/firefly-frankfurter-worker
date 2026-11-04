import path from "node:path/posix";
import { createMiddleware } from "hono/factory";

const stripExtension = createMiddleware<WorkerEnv>(async (c, next) =>
{
    const extension = path.extname(c.req.path);
    if (extension !== "")
    {
        const dirname = path.dirname(c.req.path);
        const basename = path.basename(c.req.path, extension);

        const url = new URL(path.join(dirname, basename), c.req.url);
        return c.redirect(url, 301);
    }

    return next();
});

export default stripExtension;
