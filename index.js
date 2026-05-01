import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import noteRoutes from './noteRoutes.js';
import authRoutes from './authRoutes.js'; // Import your new auth file
import connectDB from "./db.js";

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- DATABASE ---
connectDB();

// --- ROUTES ---
app.use("/api/auth", authRoutes); // Logic for Register/Login
app.use("/api/notes", noteRoutes); // Logic for Notes (Now Protected)

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;