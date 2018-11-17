export interface RouteConfig {
    path: string;
    method?: string;
}

export interface StaticRouteConfig {
    path: string;
    root: string;
    otherwise?: string;
}

export function Route(config: RouteConfig) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        target.__routes__ = target.__routes__ || [];
        target.__routes__.push({config: config, propKey: propertyKey});
    };
}

export function RawRoute(config: RouteConfig) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        target.__routes__ = target.__routes__ || [];
        target.__routes__.push({config: config, propKey: propertyKey, type: 'raw'});
    };
}

export function StaticRoute(config: StaticRouteConfig) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        target.__routes__ = target.__routes__ || [];
        target.__routes__.push({config: config, propKey: propertyKey, type: 'static'});
    };
}