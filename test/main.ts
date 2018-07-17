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

    @RawRoute({
        path: '/*',
        method: 'all'
    })
    all(req, res) {
        res.end('Test server ');
    }
}

console.log('---> 1');


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

console.log('---> 2');


App.bootstrap({}, AppModule);