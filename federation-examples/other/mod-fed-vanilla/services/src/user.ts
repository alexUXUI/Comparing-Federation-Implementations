export class UserService {
  userName = "";
  constructor(name: string) {
    this.userName = name;
  }
  setName(name: string) {
    this.userName = name;
  }
  getName() {
    return this.userName;
  }
}

export const User = new UserService("No user identified");
