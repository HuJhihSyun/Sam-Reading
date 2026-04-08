import mongoose from "mongoose";

export default async (_nitroApp) => {
  try {
    mongoose.set("strictQuery", true);  // 嚴格模式
    console.log("MongoDB Connecting...");
    await mongoose.connect(
      // database 是由 mongoose.connect() 的 URI 所決定：此處設定 database 為 "sam-reading-project"
      "mongodb+srv://cj654vmp:HuJhihSyun7134@sam-reading-project.xcptjb8.mongodb.net/?appName=sam-reading-project"
    );
    console.log("MongoDB Connected Successfully!");
  } catch (e) {
    console.error("Error MongoDB =>", e);
  }
};
