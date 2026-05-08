import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: String,
  code: String,
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  capacity: Number
}, { timestamps: true ,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
    collection: "Course"
});

export default mongoose.model("Course", courseSchema);