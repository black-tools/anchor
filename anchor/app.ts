import * as express from "express";
// import * as urljoin from 'urljoin';

export interface AppOptions {
    port?: number;
}

export class App {

    static bootstrap(options: AppOptions, module: any) {

        const app = express();

        let m = new module();
        app.use(m.__router__);
        // m.__routers__ = m.__config__.declarations.map(r => new r);

        // for (const ctrl of m.__routers__) {
        // }
        //     app.use(ctrl.__router__);


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