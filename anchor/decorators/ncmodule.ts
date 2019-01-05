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
                this.__controllers__ = this.__config__.declarations.map(c => new c(...this.args));
                const regular = this.__controllers__.filter(c => !c.__config__.bindAfter);
                for (const ctrl of regular) {
                    ctrl.setupRoutes(this.__router__)
                }

                const lowPriority = this.__controllers__.filter(c => c.__config__.bindAfter);
                if (lowPriority.length > 0) {
                    this.__after_router__ = express.Router();
                    for (const ctrl of lowPriority) {
                        ctrl.setupRoutes(this.__router__)
                    }
                    this.__router__.use(this.__after_router__);
                }
            }

            setupMiddlewares() {
                const middlewares = this.__config__.middlewares || [];
                for (const mw of middlewares) {
                    this.__router__.use(mw)
                }
            }


            setupEvents(socket){
                const controllers = this.__controllers__;
                for (const ctrl of controllers) {
                    ctrl.setupEvents(socket);
                }
            }

        }
    }
}
