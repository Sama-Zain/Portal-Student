import mongoose from "mongoose";
import { RoleEnum } from "../../utils/enums/user.enum.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: function () {
        return this.role !== RoleEnum.ADMIN;
      },
    },

    lastName: {
      type: String,
      required: function () {
        return this.role !== RoleEnum.ADMIN;
      },
    },

    studentID: {
      type: String,
      unique: true,
      required: function () {
        return this.role !== RoleEnum.ADMIN;
      },
    },

    academicLevel: {
      type: String,
      required: function () {
        return this.role !== RoleEnum.ADMIN;
      },
    },

    major: {
      type: String,
      default: "Computer Science",
    },

    dateOfBirth: {
      type: Date,
    },

    email: {
      type: String,
      unique: true,
      required: function () {
        return this.role !== RoleEnum.ADMIN;
      },
    },

    phoneNumber: {
      type: String,
    },

    gpa: {
      type: Number,
      default: 0.0,
    },

    creditsEarned: {
      type: Number,
      default: 0,
    },

    userName: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: Number,
      default: RoleEnum.USER,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
    collection: "User",
  }
);

const User =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;