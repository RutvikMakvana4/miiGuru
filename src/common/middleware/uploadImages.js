import fs from "fs";
import multer from "multer";

const storeFile = (destination, filename, type = "single") => {
  return async (req, res, next) => {
    // try {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        fs.mkdirSync(destination, { recursive: true });
        cb(null, destination);
      },
      filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
      },
    });

    const upload =
      type === "single"
        ? multer({ storage }).single(filename)
        : multer({ storage }).fields(filename);

    upload(req, res, (err) => {
      if (err) {
        console.error("File upload error:", err);
        return res.status(500).json({ error: "File upload failed" });
      }
      next();
    });
    // } catch (error) {
    //   console.error("Error in storeFile middleware:", error);
    //   return res.status(500).json({ error: "Internal server error" });
    // }
  };
};

export default storeFile;