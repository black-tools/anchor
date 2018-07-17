import * as express from "express";
import * as urljoin from 'url-join';

export interface NcModuleConfig {
    declarations?: any[];
    middlewares?: any[];
    imports?: any[];
}


export function NcModule(config: NcModuleConfig) {
    return function <T extends { new(...args: any[]): any }>(constructor: T) {
        return class extends constructor {
            __config__ = config;

            constructor(...args: any[]) {
                super(...args);
                this.__router__ = express.Router();
            }


            instantiateRouters() {
                this.__routers__ = this.__config__.declarations.map(r => new r);
            }

            setupMiddlewares() {
                for (const mw of this.__config__.middlewares) {
                    this.__router__.use(mw)
                }
            }

            setupRouters() {
                for (const ctrl of this.__routers__) {
                    this.__router__.use(ctrl.__router__);

                    let router = ctrl.__router__;
                    for (const route of ctrl.__routes__) {
                        let path = urljoin(ctrl.__config__.path, route.config.path);
                        if (route.raw) {
                            router[route.config.method](path, (req, res) => {
                                ctrl[route.propKey](req, res);
                            })
                        } else {
                            router[route.config.method](path, async (req, res) => {
                                let params = {...req.query, ...req.params};

                                const result = ctrl[route.propKey](params, req.body);
                                if (result.then) {
                                    res.json(await result);
                                } else {
                                    res.json(result);
                                }
                            })
                        }
                    }
                    this.__router__.use(router);
                }
            }

        }
    }
}
