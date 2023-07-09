const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
    habitName: {
        type: String,
        required: true
    },
    dates: [{
        date: String,
        status: String
    }],
},
    { timestamps: true }
);

const HabitModel =  mongoose.model("Habit", habitSchema);

module.exports = HabitModel;


