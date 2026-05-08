import User from "../../DB/models/user.model.js";
import {
  create,
  findOne,
  findById
} from "../../DB/database.repository.js"

import {
  BadRequestException,
  ConflictException,
  NotFoundException
} from "../../utils/response/error.js";

import { successResponse } from "../../utils/response/success.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SALT } from "../../../Config/config.service.js";
import Token from "../../DB/models/token.model.js";
import { getNewLoginCredientials } from "../../utils/token/token.js";


// 🔐 register
export const register = async (req, res) => {
  const { userName, password, role } = req.body;
  const user = await findOne({
    model: User,
    filter: { userName }
  });
  if (user) {
    return ConflictException({ message: "User already exists" });
  }
  const saltRounds = Number(SALT) || 10; 
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const newUser = await create({
    model: User,
    data: {
      userName,
      password: hashedPassword,
      role
    }
  });
  return successResponse({
    res,
    message: "User created successfully",
    data: newUser
  });
};





// 🔐 login
export const login = async (req, res) => {

  const { userName, password } = req.body;

  console.log("REQ BODY:", req.body);

  const user = await findOne({
    model: User,
    filter: { userName }
  });

  console.log("USER FOUND:", user);
  console.log("USER PASSWORD:", user?.password);

  if (!user) {
    return NotFoundException({ message: "User not found" });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return BadRequestException({ message: "Invalid credentials" });
  }

  const { accessToken, refreshToken } = await getNewLoginCredientials(user);

  return successResponse({
    res,
    message: "Login successful",
    data: { accessToken, refreshToken }
  });
};
//3
export const logout = async (req, res) => {
  if (!req.decoded) {
    return res.status(401).json({ message: "Invalid Request: Authentication data missing" });
  }
  const { jti, _id, exp } = req.decoded; 

  if (!jti) {
    return res.status(400).json({ message: "Token does not contain a JTI" });
  }
  await Token.create({
    jti: jti,
    userId: _id,
    expiresIn: new Date(exp * 1000) 
  });

  return successResponse({
    res,
    message: "Logged out successfully and token revoked."
  });
};