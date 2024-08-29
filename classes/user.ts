export class User {
  public socketId: string;
  public userId: number | null;
  public name: string;

  constructor(socketId: string) {
    this.socketId = socketId;
    this.name = 'nameless';
    this.userId = null;
  }
}
