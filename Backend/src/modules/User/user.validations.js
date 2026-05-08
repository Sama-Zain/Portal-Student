import joi from "joi";

export const addUserSchema = {
  body: joi.object({ 
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    studentID: joi.string().required(),
    academicLevel: joi.string().required(),
    email: joi.string().email().required(),
    phoneNumber: joi.string().optional(),
    userName: joi.string().min(3).required(),
    password: joi.string().min(6).required(),
    role: joi.number().optional()
  }).required()
};