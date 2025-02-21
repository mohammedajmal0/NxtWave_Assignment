export interface IUser {
  name: string;
  dob: Date;
  email: string;
  password: string;
  companyName: string;
  profilePhoto: string;
  age: string;
}

export interface ILogin {
  email: string;
  password: string;
}
