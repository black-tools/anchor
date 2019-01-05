import * as express from "express";
import * as http from 'http';
import * as sio from 'socket.io';

export interface AppOptions {
    port?: number;
}

export class App {

    static bootstrap(options: AppOptions, module: any) {

        const app = express();
        const server = http.createServer(app);

        const io = sio(server);
        app.set('sio', io);

        let m = new module(app, server);


        io.on('connection', (socket) => {
            m.setupEvents(socket);
        });

        app.use(m.__router__);


        const port = options.port || 3000;

        server.listen(port, () => {
            console.log("  App is running at http://localhost:%d ", port);
            console.log("  Press CTRL-C to stop\n");
        });
    }
}