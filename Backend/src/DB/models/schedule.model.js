import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },
  day: String,
  time: String,
  location: String
},{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
    collection: "Schedule"
}

);

export default mongoose.model("Schedule", scheduleSchema);