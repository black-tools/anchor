// import {Controller, NcModule, Req, Route} from "../../anchor";
// import {FooController} from "./custom/foo.controller";
//
// let ctrlFromModel = (modelName: string) => {
//
//     @Controller({
//         path: '/'+modelName
//     })
//     class Ctrl {
//
//         things = [];
//
//         constructor() {
//
//         }
//
//         @Route({
//             path: '',
//             method: 'get'
//         })
//         query(req: Req) {
//             return this.things;
//         }
//
//         @Route({
//             path: '/',
//             method: 'post'
//         })
//         save(req: Req) {
//             let thing = {type: modelName, name: Math.random().toString(36).substring(7)};
//             this.things.push(thing);
//             return thing;
//         }
//
//     }
//
//     return Ctrl;
// };
//
//
//
// @NcModule({
//     declarations: [
//         ... ['users', 'things'].map(x => ctrlFromModel(x)),
//         FooController
//     ]
// })
// export class ApiModule {
//
// }
