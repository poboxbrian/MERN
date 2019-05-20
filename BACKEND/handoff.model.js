const mongoose = require('mongoose');

let Handoff = new mongoose.Schema({
    description: String,
    responsible: String,
    priority: String,
    completed: Boolean
});

module.exports = mongoose.model('Handoff', Handoff);