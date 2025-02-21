import mongoose from "mongoose";
import { IUser } from "../interfaces/user";

const userSchema = new mongoose.Schema<IUser>({
  companyName: {
    type: String,
  },
  name: {
    type: String,
  },
  password: {
    type: String,
  },
  dob: {
    type: Date,
  },
  email: {
    type: String,
    unique: true,
  },
  profilePhoto: {
    type: String,
  },
  age: {
    type: String,
  },
});

const userModel = mongoose.model<IUser>("user_collections", userSchema);

export default userModel;
