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
                this.setupMiddlewares();
                this.setupRoutes();
            }

            setupRoutes() {
                this.__routers__ = this.__config__.declarations.map(r => new r);

                for (const ctrl of this.__routers__) {
                    this.__router__.use(ctrl.__router__);
                }
            }

            setupMiddlewares() {
                for (const mw of this.__config__.middlewares) {
                    this.__router__.use(mw)
                }
            }

        }
    }
}
