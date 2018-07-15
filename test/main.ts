import {NcModule, App, Controller, RawRoute} from "../anchor";
import {ApiModule} from "./api/api.module";

@Controller({
    path: ''
})
export class AppController {

    @RawRoute({
        path: '/*',
        method: 'all'
    })
    all(req, res) {
        res.end('Test server ');
    }
}


@NcModule({
    imports: [
        ApiModule
    ],
    declarations: [
        AppController,
    ]
})
export class AppModule {

}


App.bootstrap({}, AppModule);