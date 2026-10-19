const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');

// GET all active habits
router.get('/', async (req, res) => {
    try {
        // Habits never reordered have no `order` and sort first, newest first
        const habits = await Habit.find({ archived: false }).sort({ order: 1, createdAt: -1 });
        res.json(habits);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT a new display order. Body: { ids: [habitId, ...] } in the desired order.
router.put('/order', async (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.some((id) => typeof id !== 'string')) {
        return res.status(400).json({ message: 'ids must be an array of habit ids' });
    }
    try {
        await Habit.bulkWrite(
            ids.map((id, index) => ({
                updateOne: { filter: { _id: id }, update: { $set: { order: index } } }
            }))
        );
        res.json({ message: 'Order saved' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// POST a new habit
router.post('/', async (req, res) => {
    try {
        // New habits go to the top of the list
        const first = await Habit.findOne({ order: { $ne: null } }).sort({ order: 1 });
        const habit = new Habit({
            order: first ? first.order - 1 : undefined,
            name: req.body.name,
            description: req.body.description,
            icon: req.body.icon,
            color: req.body.color,
            frequency: req.body.frequency
        });
        const newHabit = await habit.save();
        res.status(201).json(newHabit);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PATCH a habit (update/archive)
router.patch('/:id', async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);
        if (!habit) return res.status(404).json({ message: 'Habit not found' });

        if (req.body.name) habit.name = req.body.name;
        if (req.body.description !== undefined) habit.description = req.body.description;
        if (req.body.icon) habit.icon = req.body.icon;
        if (req.body.color) habit.color = req.body.color;
        if (req.body.frequency) habit.frequency = req.body.frequency;
        if (req.body.archived !== undefined) habit.archived = req.body.archived;

        const updatedHabit = await habit.save();
        res.json(updatedHabit);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT set completion for a specific date. Idempotent, so repeated or
// out-of-order requests can't flip the state.
router.put('/:id/completions/:date', async (req, res) => {
    const { date } = req.params;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({ message: 'Date must be YYYY-MM-DD' });
    }
    if (typeof req.body.done !== 'boolean') {
        return res.status(400).json({ message: 'done must be true or false' });
    }
    try {
        const update = req.body.done
            ? { $addToSet: { completions: date } }
            : { $pull: { completions: date } };
        const habit = await Habit.findByIdAndUpdate(req.params.id, update, { returnDocument: 'after' });
        if (!habit) return res.status(404).json({ message: 'Habit not found' });
        res.json(habit);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// POST toggle completion for a specific date
router.post('/:id/toggle', async (req, res) => {
    const { date } = req.body; // Expecting YYYY-MM-DD
    try {
        const habit = await Habit.findById(req.params.id);
        if (!habit) return res.status(404).json({ message: 'Habit not found' });

        const index = habit.completions.indexOf(date);
        if (index > -1) {
            // Already completed, remove it (toggle off)
            habit.completions.splice(index, 1);
        } else {
            // Not completed, add it (toggle on)
            habit.completions.push(date);
        }

        const updatedHabit = await habit.save();
        res.json(updatedHabit);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a habit
router.delete('/:id', async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);
        if (!habit) return res.status(404).json({ message: 'Habit not found' });

        await habit.deleteOne();
        res.json({ message: 'Habit deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
