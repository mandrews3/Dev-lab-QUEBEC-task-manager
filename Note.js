const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();


const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true }
});

const Note = mongoose.model('Note', noteSchema);




router.post('/', async (req, res) => {
    try {
        const newNote = new Note({
            title: req.body.title,
            content: req.body.content
        });
        const savedNote = await newNote.save();
        res.json(savedNote);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/', async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            { title: req.body.title, content: req.body.content },
            { new: true }
        );
        res.json(updatedNote);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.json({ message: 'Note deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

