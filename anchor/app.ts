import * as express from "express";
// import * as urljoin from 'urljoin';

export interface AppOptions {
    port?: number;
}

export class App {

    static bootstrap(options: AppOptions, module: any) {

        const app = express();

        let m = new module();
        m.__routers__ = m.__config__.declarations.map(r => new r);

        for (const ctrl of m.__routers__) {
            app.use(ctrl.__router__);
        }
        // for (const route of ctrl.__routes__) {
        //     let path = urljoin(ctrl.__config__.path, route.config.path);
        //     if (route.raw) {
        //         router[route.config.method](path, (req, res) => {
        //             ctrl[route.propKey](req, res);
        //         })
        //     } else {
        //         router[route.config.method](path, async (req, res) => {
        //             let params = {...req.query, ...req.params};
        //
        //             const result = ctrl[route.propKey](params, req.body);
        //             if (result.then) {
        //                 res.json(await result);
        //             } else {
        //                 res.json(result);
        //             }
        //         })
        //     }
        // }

        const port = options.port || 3000;
        const server = app.listen(port, () => {
            console.log(
                "  App is running at http://localhost:%d in %s mode",
                port
            );
            console.log("  Press CTRL-C to stop\n");
        });
    }
}