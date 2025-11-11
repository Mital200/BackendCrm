const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
    leadId: {
        type: String,
        required: true,
        unique: true,
    },
    clientName: {
        type: String,
        required:true,
    },
    clientEmail: {
        type: String,
        required: true,
    },
    clientPhone: {
      type: String,
      required: true,
    },
    source: {
        type: String,
        default: "Unknown",
    },
    status: {
        type: String,
        enum: ["New", "Approached", "Lost", "Quoted", "Converted"],
        default: "New",
    },
    relatedProjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        default: null,
    },
    notes: {
        type: String,
        default: "",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
  },
  { timeStamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);