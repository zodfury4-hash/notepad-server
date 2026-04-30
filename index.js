import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import noteRoutes from './noteRoutes.js';

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

app.use("/api/notes", noteRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


export default app;