import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UserList } from '../classes/user-list';
import { Usuario } from '../classes/usuario';

export const userList = new UserList();

export const connectScoketIO = (client: Socket, io: socketIO.Server) => {
  const usuario = new Usuario(client.id);
  userList.addUser(usuario);
};

export const disconnectSocketIO = (client: Socket, io: socketIO.Server) => {
  client.on('disconnect', () => {
    userList.deleteUser(client.id);

    io.emit('all-connected-users', userList.getList());

    const rooms = Array.from(client.rooms);
    rooms.forEach(room => {
      client.leave(room);
      io.to(room).emit('updateUserList', getRoomUsers(io, room));
    });
  });
};

export const configUser = (client: Socket, io: socketIO.Server) => {
  client.on('config-user', (payload: { name: string; userId: number }, callback: Function) => {
    const { name, userId } = payload;
    userList.configUser(client.id, name, userId);
    io.emit('all-connected-users', userList.getList());

    callback({
      ok: true,
      mensaje: `user ${payload.name}, configured`
    });
  });
};

// Obtener Usuarios
export const getUsers = (client: Socket, io: socketIO.Server) => {
  client.on('obtener-usuarios', () => {
    io.to(client.id).emit('all-connected-users', userList.getList());
  });
};

export const joinRoom = (client: Socket, io: socketIO.Server) => {
  client.on('join-room', (roomId: string) => {
    client.join(roomId);
    io.to(roomId).emit('updateUserList', getRoomUsers(io, roomId));
  });
};

export const leaveRoom = (client: Socket, io: socketIO.Server) => {
  client.on('leave-room', (roomId: string) => {
    client.leave(roomId);
    io.to(roomId).emit('updateUserList', getRoomUsers(io, roomId));
  });
};

function getRoomUsers(io: socketIO.Server, roomId: any) {
  const room = io.sockets.adapter.rooms.get(roomId);
  return room ? Array.from(room) : [];
}
