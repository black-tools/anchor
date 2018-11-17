import * as express from "express";
import * as urljoin from 'url-join';
import * as path from "path";

export interface ControllerConfig {
    path: string;
    bindAfter?: boolean;
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
                                        try {
                                            res.sendFile(route.config.otherwise);
                                        } catch (err) {
                                            res.status(404).end();
                                        }
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

        }
    }
}