const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    projectId: {
        type: String,
        required: true,
        unique: true,
    },
    projectName: {
        type: String,
        required: true,
    },
    clientName: {
        type: String,
    },
    clientEmail: {
        type: String,
        // required: true,
    },
    clientPhone: {
        type: String,
        // required: true,
    },
    location: {
        type: String,
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    expectedCompletionDate: {
        type: Date,
    },
    actualCompletionDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: [ "New","Active","Completed","On-Hold","Cancelled" ],
        default: "New",
    },
    maintenanceStartDate: {
        type: Date,
    },
    maintenanceDurationInMonths: {
        type: Number,
    },
    documents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Document",
        },
    ],
    expenses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Expense",
        },
    ],
    invoices: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Invoice",
        },
    ],
    leads: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lead",
        },
    ],
    notes: {
        type: String,
    },
});

module.exports = mongoose.model("Project", projectSchema);