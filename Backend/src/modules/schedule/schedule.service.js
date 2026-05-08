import Enrollment from "../../DB/models/enrollment.model.js";
import Schedule from "../../DB/models/schedule.model.js";
import { successResponse } from "../../utils/response/success.js";

export const getSchedule = async (req, res) => {

  const enrollments = await Enrollment.find({ student: req.user._id })
    .populate({
      path: "course",
      populate: { path: "instructor" }
    });

  const courseIds = enrollments.map(e => e.course._id);

  const schedule = await Schedule.find({
    course: { $in: courseIds }
  }).populate("course");

  return successResponse({
    res,
    data: schedule
  });
};