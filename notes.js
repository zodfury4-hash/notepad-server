import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- MONGODB CONNECTION ---
const mongoURI = "mongodb+srv://zodfury4_db_user:3388@cluster0.l6hgyjn.mongodb.net/notepad?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// --- SCHEMA & MODEL ---
const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

const Note = mongoose.model("Note", noteSchema);

// --- ROUTES ---

// 1. POST: Create a new note
app.post("/api/notes", async (req, res) => {
    try {
        const { title, content } = req.body;
        const newNote = new Note({
            title: title?.trim(),
            content: content?.trim()
        });
        await newNote.save();
        res.status(201).json({ success: true, message: "Note saved to MongoDB", note: newNote });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// 2. GET: Retrieve all notes from DB
app.get("/api/notes", async (req, res) => {
    try {
        const dbNotes = await Note.find().sort({ createdAt: -1 }); // Newest first
        res.status(200).json({ success: true, count: dbNotes.length, data: dbNotes });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// 3. PUT: Update by ID
app.put("/api/notes/:id", async (req, res) => {
    try {
        const { title, content } = req.body;
        console.log(req.params.id);
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            { title, content, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        if (!updatedNote) return res.status(404).json({ success: false, message: "Note not found" });
        res.json({ success: true, note: updatedNote });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });;
    }
});

// 4. DELETE: Remove by ID
app.delete("/api/notes/:id", async (req, res) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        if (!deletedNote) return res.status(404).json({ success: false, message: "Note not found" });
        res.json({ success: true, message: "Deleted from MongoDB" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error deleting note" });
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});