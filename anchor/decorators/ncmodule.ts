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
            args;

            constructor(...args: any[]) {
                super(...args);
                this.args = args;
                this.__router__ = express.Router();
                this.setupMiddlewares();
                this.setupImportedRouters();
                this.setupRoutes();
            }

            setupImportedRouters() {
                this.__imports__ = (this.__config__.imports || []).map(m => new m(...this.args));
                for (let module of this.__imports__) {
                    this.__router__.use(module.__router__);
                }
            }

            setupRoutes() {
                this.__routers__ = this.__config__.declarations.map(r => new r(...this.args));

                for (const ctrl of this.__routers__) {
                    this.__router__.use(ctrl.__router__);
                }
            }

            setupMiddlewares() {
                const middlewares = this.__config__.middlewares || [];
                for (const mw of middlewares) {
                    this.__router__.use(mw)
                }
            }

        }
    }
}
