import e from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const router = e.Router();
const JWT_SECRET = "notezilla_secret_123";

// --- SECURITY MIDDLEWARE ---
const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attaches the User ID to the request
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// --- NOTE SCHEMA ---
const noteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

const Note = mongoose.model("Note", noteSchema);

// --- PROTECTED ROUTES ---

// 1. CREATE: Saves note with userId
router.post("/create", protect, async (req, res) => {
    try {
        const { title, content } = req.body;
        const newNote = new Note({
            userId: req.user.id,
            title: title?.trim(),
            content: content?.trim()
        });
        await newNote.save();
        res.status(201).json({ success: true, note: newNote });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// 2. GET: Returns ONLY notes belonging to the logged-in user
router.get("/", protect, async (req, res) => {
    try {
        const dbNotes = await Note.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: dbNotes });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching notes" });
    }
});

// 3. UPDATE: Ensures the user owns the note before updating
router.put("/update/:id", protect, async (req, res) => {
    try {
        const updatedNote = await Note.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id }, // Security Check
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        );
        if (!updatedNote) return res.status(404).json({ message: "Note not found or unauthorized" });
        res.json({ success: true, note: updatedNote });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// 4. DELETE: Ensures the user owns the note before deleting
router.delete("/delete/:id", protect, async (req, res) => {
    try {
        const deletedNote = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!deletedNote) return res.status(404).json({ message: "Note not found" });
        res.json({ success: true, message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Delete failed" });
    }
});

export default router;