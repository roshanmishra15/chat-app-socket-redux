import User from "../models/User.js";

export const uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profilePic = fileUrl;
    await user.save();

    return res.status(200).json({
      message: "Profile picture updated successfully",
      profilePic: fileUrl,
    });
  } catch (error) {
    console.log("Profile upload error:", error.message);
    return res.status(500).json({ message: "Profile upload failed" });
  }
};
