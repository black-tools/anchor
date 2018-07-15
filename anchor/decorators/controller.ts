import * as express from "express";

export interface ControllerConfig {
    path: string;
}

export function Controller(config: ControllerConfig) {
    return function (target: Function // The class the decorator is declared on
    ) {

        // save a reference to the original constructor
        const original = target;
        // the new constructor behaviour
        const f: any = function (...args) {
            this.__router__ = express.Router();
            this.__routes__ = (target.prototype as any).__routes__;
            this.__config__ = config;
            // console.log('ClassWrapper: before class constructor', original.name);
            let instance = original.apply(this, args);
            // console.log('ClassWrapper: after class constructor', original.name);
            return instance;
        };

        // copy prototype so intanceof operator still works
        f.prototype = original.prototype;

        // return new constructor (will override original)
        return f;

        // console.log('target> ', target);


    }

    // return function <T extends { new(...args: any[]): {} }>(constructor: any) {
    //     return class extends constructor {
    //
    //     }

    // __config__ = config;
    // console.log(constructor);

    // return class extends constructor {
    //
    //     constructor(){
    //         // super();
    //         this.__router__ = express.Router();
    //
    //
    //         for (const route of constructor.__routes__) {
    //             // console.log(this.__router__, route)
    //             // let rtr = this.__router__ as any;
    //             let registerFn = this.__router__[route.config.method as string] as (req:any, res:any) => void;
    //             console.log(route);
    //             this.__router__[route.config.method as string](route.config.path, (req, res) => {
    //
    //                 const result = this[route.propKey](req.params, req.body);
    //                 res.end(result);
    //             })
    //         }
    //     }
    //
    //
    //     // console.log(constructor.__routes__);
    // }
    // };
}