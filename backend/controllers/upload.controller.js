export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;

        return res.status(200).json({
            message: "File uploaded successfully",
            url: fileUrl,
            fileName: req.file.originalname,
            fileType: req.file.mimetype,
        });
    } catch (error) {
        console.log("Upload error:", error.message);
        return res.status(500).json({ message: "File upload failed" });
    }
};
