import joi from "joi";
import {  RoleEnum } from "../Utils/enums/user.enum.js";
import { BadRequestException } from "../Utils/response/error.js";
import { Types } from "mongoose";
import { log } from "console";

export const generalFields = {
    userName: joi.string().min(3).max(50).message({
      "string.base": "First Name must be a string",
      "string.min": "First Name must be at least 3 characters",
      "string.max": "First Name must be less than 50 characters",
    }),
    password: joi.string().min(6).max(100),
    grade: joi.number().min(0).max(100),
    title: joi.string().min(3).max(50).message({
      "string.base": "First Name must be a string",
      "string.min": "First Name must be at least 3 characters",
      "string.max": "First Name must be less than 50 characters",
    }),
    role: joi.number().valid(...Object.values(RoleEnum)),    // custom validation
    id: joi.string().custom((value, helper) => {
      return (
        Types.ObjectId.isValid(value) || helper.message("Invalid ObjectId")
      );
    }),
    content: joi.string().min(2).max(500).trim().message({
      "any.required": "Content is required",
      "string.min": "Content must be at least 2 characters",
      "string.max": "Content must be less than 500 characters",
    }),
    email: joi.string().email(),

firstName: joi.string().min(2).max(30),

lastName: joi.string().min(2).max(30),

studentID: joi.string(),

academicLevel: joi.string(),
};
export const validation = (schema) => {
  return (req, res, next) => {
    const validationError = [];

    for (const key of Object.keys(schema)) {
      const { error } = schema[key].validate(req[key], {
        abortEarly: false,
      });

      if (error) {
        validationError.push({
          key,
          details: error.details.map((err) => ({
            message: err.message,
            path: err.path,
            type: err.type,
            context: err.context,
          })),
        });
      }
    }

    if (validationError.length > 0) {
      console.log(validationError);

      return res.status(400).json({
        message: "Validation Error",
        errors: validationError,
      });
    }

    next();
  };
};