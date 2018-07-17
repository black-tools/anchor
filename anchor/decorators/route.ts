export interface RouteConfig {
    path: string;
    method: string;
}

// export interface Req {
//     params: any;
//     query: any;
//     body: any;
// }

export function Route(config: RouteConfig) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        target.__routes__ = target.__routes__ || [];
        target.__routes__.push({config: config, propKey: propertyKey});
    };
}

export function RawRoute(config: RouteConfig) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        target.__routes__ = target.__routes__ || [];
        target.__routes__.push({config: config, propKey: propertyKey, raw: true});
    };
}