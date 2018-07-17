import {NcModule, App, Controller, RawRoute, Route} from "../anchor";
import {urlencoded, json} from 'body-parser';
import * as cors from 'cors';

@Controller({
    path: '/'
})
export class AppController {

    @Route({
        path: '/route',
        method: 'get'
    })
    randomRoute(params) {
        return params;
    }


    @Route({
        path: '/route',
        method: 'post'
    })
    postRoute(params, body) {
        return body;
    }

    @RawRoute({
        path: '/*',
        method: 'all'
    })
    all(req, res) {
        res.end('Test server ');
    }
}


@NcModule({
    middlewares: [
        urlencoded({extended: false}),
        json(),
        cors()
    ],
    declarations: [
        AppController,
    ]
})
export class AppModule {

}

App.bootstrap({port: 3000}, AppModule);