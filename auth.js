// Register function
app.post("/api/register", async (req, res) => {
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


