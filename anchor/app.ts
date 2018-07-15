import * as express from "express";
import * as urljoin from 'urljoin';

// middlewares
import * as bodyParser from 'body-parser';


export interface AppOptions {
    port?: number;
}

export class App {

    static bootstrap(options: AppOptions, module: any) {

        const app = express();

        // middlewares
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());

        let m = new module();
        // console.log('--')
        m.__routers__ = m.__config__.declarations.map(r => new r);
        // console.log('--> ', m.__config__.declarations)

        for (const ctrl of m.__routers__) {
            // console.log(ctrl)
            // console.log(route);
            let router = ctrl.__router__;
            for (const route of ctrl.__routes__) {
                // console.log(ctrl.__config__.path)
                let path = urljoin(ctrl.__config__.path, route.config.path);
                // console.log(path);
                // console.log(this.__router__, route)
                // let rtr = this.__router__ as any;
                // console.log('>>>> ', ctrl, route.config)
                if (route.raw) {
                    router[route.config.method](path, (req, res) => {
                        // console.log('A');
                        // console.log('>> ', req, res)
                        ctrl[route.propKey](req, res);
                    })
                } else {
                    // console.log('>>>> ', path)
                    router[route.config.method](path, async (req, res) => {
                        console.log(req);
                        console.log('----> ', req.body);
                        let params = {...req.query, ...req.params};

                        const result = ctrl[route.propKey](params, req.body);
                        if (result.then) {
                        console.log(result);
                            res.json(await result);
                        } else {
                            res.json(result);
                        }
                    })
                }


            }
            app.use(router);
        }

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