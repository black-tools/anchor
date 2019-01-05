import * as express from "express";
import * as urljoin from 'url-join';

export interface ControllerConfig {
    path?: string;
    bindAfter?: boolean;
    name?: string;
}

export function Controller(config: ControllerConfig) {
    return function <T extends { new(...args: any[]): any }>(constructor: T) {
        return class extends constructor {

            constructor(...args: any[]) {
                super(...args);
                this.__config__ = config;
            }

            setupRoutes(router) {
                for (const route of (this.__routes__ || [])) {
                    let path = urljoin(this.__config__.path, route.config.path);

                    router[route.config.method || 'use'](path, async (req, res, next) => {

                        switch (route.type) {
                            case 'raw':
                                try {
                                    this[route.propKey](req, res, next);
                                } catch (err) {
                                    console.error(err);
                                    res.status(500).send(err);
                                }
                                break;
                            case 'static':
                                express.static(route.config.root)(req, res, () => {
                                    if (route.config.otherwise) {
                                        res.sendFile(route.config.otherwise, {}, (err) => {
                                            if (err) {
                                                res.status(err.status).end();
                                            }
                                        });
                                    } else {
                                        res.status(404).end();
                                    }
                                });
                                break;
                            default:
                                try {
                                    let params = {...req.query, ...req.params};

                                    const result = this[route.propKey](params, req.body);
                                    if (result.then) {
                                        res.json(await result);
                                    } else {
                                        res.json(result);
                                    }
                                } catch (err) {
                                    console.error(err);
                                    res.status(500).send(err);
                                }
                                break;
                        }
                    })
                }
            }


            setupEvents(socket) {
                console.log('[setup events]', this.__events__);

                for (const event of (this.__events__ || [])) {
                    const completeEventName = event.method + ' ' + this.__config__.name;
                    console.log('[event name]', event.method, completeEventName);

                    socket.on(completeEventName, async ([rid, params, data]) => {
                        try {
                            const result = this[event.propKey](params, data);
                            if (result.then) {
                                socket.emit('R', [rid, 200, result]);
                            } else {
                                socket.emit('R', [rid, 200, result]);
                            }
                        } catch (err) {
                            console.error(err);
                            socket.emit('R', [rid, 500, err])
                        }
                    });
                }
            }

        }
    }
}