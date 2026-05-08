import User from "../../DB/models/user.model.js";
import {
  findById,
  findAll,
  findOneAndUpdate,
  create,
  findOne
} from "../../DB/database.repository.js";
import { ConflictException , BadRequestException, NotFoundException} from "../../utils/response/error.js";
import { successResponse } from "../../utils/response/success.js";
import bcrypt from "bcryptjs";
import { SALT } from "../../../Config/config.service.js";

export const addUser = async (req, res) => {
  const { 
    firstName, lastName, studentID, academicLevel, 
    email, phoneNumber, userName, password, role 
  } = req.body;

  const existingUser = await findOne({
    model: User,
    filter: { $or: [{ email }, { studentID }, { userName }] }
  });

  if (existingUser) {
    return ConflictException({ message: "User with this Email, ID or Username already exists" });
  }

  const saltRounds = Number(SALT) || 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = await create({
    model: User,
    data: {
      firstName,
      lastName,
      studentID,
      academicLevel,
      email,
      phoneNumber,
      userName,
      password: hashedPassword,
      role: role || RoleEnum.USER 
    }
  });

  return successResponse({
    res,
    message: "Student added successfully by Admin",
    data: newUser
  });
};


// 👤 Get Profile
export const getProfile = async (req, res) => {

  const user = await findById({
    model: User,
    id: req.user._id
  });

  if (!user) {
    return NotFoundException({ message: "User not found" });
  }

  return successResponse({
    res,
    data: user
  });
};

// ✏️ Update Profile
export const updateProfile = async (req, res) => {

  const user = await findOneAndUpdate({
    model: User,
    id: req.user._id,
    update: req.body
  });

  if (!user) {
    return NotFoundException({ message: "User not found" });
  }

  return successResponse({
    res,
    message: "Profile updated successfully",
    data: user
  });
};

// 👥 Get all users (Admin only)
export const getAllUsers = async (req, res) => {

  const users = await findAll({
    model: User
  });

  return successResponse({
    res,
    data: users
  });
};