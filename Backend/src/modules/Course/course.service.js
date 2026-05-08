import Course from "../../DB/models/course.model.js";
import Enrollment from "../../DB/models/enrollment.model.js";
import {
  findOne,
  findById,
  findAll,
  create,
  findOneAndDelete
} from "../../DB/database.repository.js";

import {
  BadRequestException,
  NotFoundException
} from "../../utils/response/error.js";

import { successResponse } from "../../utils/response/success.js";

// ✅ Enroll
export const enrollCourse = async (req, res) => {
  const { courseId } = req.body;

  const course = await findById({
    model: Course,
    id: courseId
  });

  if (!course) {
    return NotFoundException({ message: "Course not found" });
  }

  const existing = await findOne({
    model: Enrollment,
    filter: { student: req.user._id, course: courseId }
  });

  if (existing) {
    return BadRequestException({ message: "Already enrolled" });
  }

  const enrollment = await create({
    model: Enrollment,
    data: {
      student: req.user._id,
      course: courseId
    }
  });

  return successResponse({
    res,
    message: "Enrolled successfully",
    data: enrollment
  });
};

// ✅ Withdraw
export const withdrawCourse = async (req, res) => {
  const { courseId } = req.body;

  await findOneAndDelete({
    model: Enrollment,
    filter: { student: req.user._id, course: courseId }
  });

  return successResponse({
    res,
    message: "Withdrawn successfully"
  });
};

// ✅ Get My Courses
export const getMyCourses = async (req, res) => {

  const courses = await findAll({
    model: Enrollment,
    filter: { student: req.user._id },
    options: { populate: "course" }
  });

  return successResponse({
    res,
    data: courses
  });
};