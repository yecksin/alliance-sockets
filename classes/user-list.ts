import { Usuario } from './usuario';

export class UserList {
  private userList: Usuario[] = [];

  public addUser(usuario: Usuario) {
    this.userList.push(usuario);
    return usuario;
  }

  public configUser(socketId: string, name: string, userId: number) {
    for (const usuario of this.userList) {
      if (usuario.socketId === socketId) {
        usuario.name = name;
        usuario.userId = userId;
        break;
      }
    }
  }

  public getSocketIdsByUserIds(userIds: string | string[]): {
    socketIds: string | string[];
    users: Usuario[];
  } {
    const users = this.userList.filter((usuario: Usuario) => {
      return usuario.userId ? userIds.includes(usuario.userId.toString()) : false;
    });
    return { socketIds: users.map(usuario => usuario.socketId), users };
  }

  public getList() {
    return this.userList.filter(usuario => usuario.name !== 'nameless');
  }

  public getUser(socketId: string) {
    return this.userList.find(usuario => usuario.socketId === socketId);
  }

  public deleteUser(socketId: string) {
    const user = this.getUser(socketId);

    this.userList = this.userList.filter(usuario => usuario.socketId !== socketId);

    return user;
  }
}
