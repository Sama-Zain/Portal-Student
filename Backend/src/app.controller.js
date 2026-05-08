import connectDB from "./DB/connections.js";
import { announceRouter, authRouter, courseRouter, gradeRouter, scheduleRouter, userRouter } from "./modules/index.js";

const bootstrap = async (app, express) => {
    app.use(express.json());
    await connectDB()
    app.get("/", (req, res) => {
        res.send("Welcome from Portal-Student");
    });
    app.use("/api/auth", authRouter);
    app.use("/api/course", courseRouter);
    app.use("/api/grades", gradeRouter);
    app.use("/api/schedule", scheduleRouter);
    app.use("/api/user", userRouter);
    app.use("/api/announce", announceRouter);
    app.all("/*dummy", (req, res) => {
  res.status(404).json({ message: "Not Found" });
  });
}

export default bootstrap;