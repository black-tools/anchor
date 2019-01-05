export function On(method: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        target.__events__ = target.__events__ || [];
        target.__events__.push({method: method, propKey: propertyKey});
    };
}