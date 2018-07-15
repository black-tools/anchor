// export interface NcModuleI {
//     id: number;
// }

export interface NcModuleConfig {
    declarations?: any[];
    imports?: any[];
}


export function NcModule(config: NcModuleConfig) {
    return function <T extends { new(...args: any[]): any }>(constructor: T) {
        return class extends constructor {
            __config__ = config;
        }
        // return function () {
        // }

        // return class implements NcModuleI {
        //     id: number;
        //
        // }
        // console.log()
        // console.log("ClassDecoratorParams(" + param1 + ", '" + param2 + "') called on: ", target);
    }
}
