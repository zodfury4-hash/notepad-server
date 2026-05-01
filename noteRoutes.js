import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./authRoutes.js";

const router = express.Router();

// SECURITY MIDDLEWARE
const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access denied" });
    try {
        req.user = jwt.verify(token, JWT_SECRET); // Extracts User ID
        next();
    } catch (err) { res.status(401).json({ message: "Invalid token" }); }
};

// Note Schema
const noteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const Note = mongoose.model("Note", noteSchema);

// 1. CREATE: Saves with userId
router.post("/create", protect, async (req, res) => {
    try {
        const newNote = new Note({
            ...req.body,
            userId: req.user.id // ID from the token
        });
        await newNote.save();
        res.status(201).json({ success: true, note: newNote });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// 2. GET: Returns notes for this specific user
router.get("/", protect, async (req, res) => {
    try {
        const dbNotes = await Note.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: dbNotes });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching notes" });
    }
});

// 3. UPDATE: Matches by note _id AND userId
router.put("/update/:id", protect, async (req, res) => {
    try {
        const updatedNote = await Note.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id }, // Security Check
            { ...req.body },
            { new: true }
        );
        if (!updatedNote) return res.status(404).json({ message: "Unauthorized or Not Found" });
        res.json({ success: true, note: updatedNote });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// 4. DELETE: Ensures ownership before removal
router.delete("/delete/:id", protect, async (req, res) => {
    try {
        const deletedNote = await Note.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.user.id 
        });
        if (!deletedNote) return res.status(404).json({ message: "Note not found" });
        res.json({ success: true, message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Delete failed" });
    }
});

export default router;