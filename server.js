// ----------------- SETUP -----------------
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// ----------------- MIDDLEWARE -----------------
app.use(express.json());                       // Parse JSON data
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.static("public"));            // Serve static files from public/

// ----------------- MONGOOSE SETUP -----------------
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// ----------------- MONGOOSE MODEL -----------------
const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Note = mongoose.model("Note", noteSchema);

// ----------------- ROUTES -----------------

// Get all notes
app.get("/api/notes", async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add new note
app.post("/api/notes", async (req, res) => {
    try {
        const note = new Note({
            title: req.body.title,
            content: req.body.content,
            date: req.body.date ? new Date(req.body.date) : Date.now()
        });
        const savedNote = await note.save();
        res.json(savedNote);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Update note
app.put("/api/notes/:id", async (req, res) => {
    try {
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                content: req.body.content,
                date: newDate
            },
            { new: true }
        );
        res.json(updatedNote);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Delete note
app.delete("/api/notes/:id", async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.json({ message: "Note deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ----------------- START SERVER -----------------
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

