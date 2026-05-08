import Announcement from "../../DB/models/announcement.model.js";
import {
  create,
  findAll,
  findById,
  findOneAndDelete
} from "../../DB/database.repository.js";

import {
  NotFoundException
} from "../../utils/response/error.js";

import { successResponse } from "../../utils/response/success.js";

// ✅ Create Announcement (Faculty/Admin)
export const createAnnouncement = async (req, res) => {

  const { title, content } = req.body;

  const announcement = await create({
    model: Announcement,
    data: {
      title,
      content,
      createdBy: req.user._id
    }
  });

  return successResponse({
    res,
    message: "Announcement created successfully",
    data: announcement,
    statusCode: 201
  });
};

// ✅ Get All Announcements (Students)
export const getAnnouncements = async (req, res) => {

  const announcements = await findAll({
    model: Announcement,
    options: { sort: { createdAt: -1 } }
  });

  return successResponse({
    res,
    data: announcements
  });
};

// ✅ Update Announcement
export const updateAnnouncement = async (req, res) => {

  const { id } = req.params;

  const announcement = await findOneAndUpdate({
    model: Announcement,
    id,
    update: req.body
  });

  if (!announcement) {
    return NotFoundException({ message: "Announcement not found" });
  }

  return successResponse({
    res,
    message: "Updated successfully",
    data: announcement
  });
};

// ✅ Delete Announcement
export const deleteAnnouncement = async (req, res) => {

  const { id } = req.params;

  const deleted = await findOneAndDelete({
    model: Announcement,
    filter: { _id: id }
  });

  if (!deleted) {
    return NotFoundException({ message: "Announcement not found" });
  }

  return successResponse({
    res,
    message: "Deleted successfully"
  });
};