const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    description: { type: String, required: true },
    category: { type: String, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Add this
    dueDate: Date,
    status: { type: String, default: 'pending' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

});

module.exports = mongoose.model('Task', taskSchema);
