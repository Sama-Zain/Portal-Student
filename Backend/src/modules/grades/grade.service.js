import Grade from "../../DB/models/grade.model.js";
import { successResponse } from "../../utils/response/success.js";

export const getGrades = async (req, res) => {

  const grades = await Grade.find({
    student: req.user._id
  }).populate("course");

  return successResponse({
    res,
    data: grades
  });
};

// Faculty
export const uploadGrade = async (req, res) => {

  const grade = await Grade.create(req.body);

  return successResponse({
    res,
    message: "Grade uploaded successfully",
    data: grade
  });
};