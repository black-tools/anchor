import {Controller, NcModule, Route} from "../../anchor";

let ctrlFromModel = (modelName: string) => {
    @Controller({
        path: '/'+modelName
    })
    class Ctrl {

        things = [];

        constructor() {

        }

        @Route({
            path: '/',
            method: 'get'
        })
        query() {
            return this.things;
        }

        @Route({
            path: '/',
            method: 'post'
        })
        save() {
            let thing = {type: modelName, name: Math.random().toString(36).substring(7)};
            this.things.push(thing);
            return thing;
        }

    }

    return Ctrl;
};



@NcModule({
    declarations: [
        ... ['users', 'things'].map(x => ctrlFromModel(x))
    ]
})
export class ApiModule {

}
