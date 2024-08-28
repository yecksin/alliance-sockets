import express from 'express';
import { SERVER_PORT } from '../global/environment';
import socketIO from 'socket.io';
import http from 'http';

import * as socket from '../sockets/socket';

export default class Server {
  private static _instance: Server;

  public app: express.Application;
  public port: number;

  public io: socketIO.Server;
  private httpServer: http.Server;

  private constructor() {
    this.app = express();
    this.port = SERVER_PORT;

    this.httpServer = new http.Server(this.app);
    this.io = new socketIO.Server(this.httpServer, {
      cors: {
        origin: 'http://localhost:4200', // Permitir solicitudes desde esta dirección
        methods: ['GET', 'POST']
      }
    });

    this.listenSockets();
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  private listenSockets() {
    this.io.on('connection', client => {
      socket.connectScoketIO(client, this.io);

      socket.configUser(client, this.io);

      socket.getUsers(client, this.io);

      socket.disconnectSocketIO(client, this.io);

      socket.joinRoom(client, this.io);

      socket.leaveRoom(client, this.io);
    });
  }

  start(callback: () => void) {
    this.httpServer.listen(this.port, callback);
  }
}
