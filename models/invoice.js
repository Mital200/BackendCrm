const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
    invoiceId: { 
        type: String, 
        required: true, 
        unique: true,
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        default: null,
    },
    invoiceType: {
        type: String,
        enum: ["Tax", "Proforma"],
        required: true,
    },
    invoiceNumber: {
        type: String,
        required: true,
        unique: true,
    },
    clientName: {
        type: String,
        required: true,
    },
    clientAddress: {
        type: String,
        default: "",
    },
    services: [
        {
            description: String,
            quantity: Number,
            price: Number,
            GST: Number,
        },
    ],
    total: {
        type: Number,
        required: true,
    },
    taxAmount: {
        type: Number,
        required: true,
    },
    grandTotal: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["Paid", "Cancelled", "Draft","Issued"],
        default: "Draft",
    },
    versionHistory: [
        {
            version: Number,
            date: { type: Date, default: Date.now },
            updatedBy: String,
            changes: Object,
        },
    ],
    createdOn: {
        type: Date,
        default: Date.now,
    },
    lastModified: {
        type: Date,
        default: Date.now,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model("Invoice", invoiceSchema);