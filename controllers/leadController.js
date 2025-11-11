const Lead = require("../models/lead.js");

//Unique id for lead
const generateLeadId = async () => {
    const count = await Lead.countDocuments();
    return `LD${(count + 1).toString().padStart(3, "0")}`;
};


//create Lead
exports.createLead = async (req,res) => {
    try {
        const { clientName, clientEmail, clientPhone, source, notes } = req.body;

        const leadId = await generateLeadId();

        const newLead = await Lead.create({
            leadId,
            clientName,
            clientEmail,
            clientPhone,
            source,
            notes,
        });

        res.status(201).json({
            success: true,
            message: "Lead created successfully",
            lead: newLead,
        });

    } catch(err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

//Get All Leads
exports.getAllLeads = async (req, res) => {
    try {

        const leads = await Lead.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, leads });

    } catch(err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

//get Single Lead
exports.getLeadById = async (req,res) => {
    try {

        const lead = await Lead.findById(req.params.id).populate("relatedProjectId");
        if(!lead) return res.status(404).json({ message: "Lead not found" });
        res.status(200).json({ success: true, lead });

    } catch(err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

//update Lead
exports.updateLead = async (req,res) => {
    try {

        const updatedLead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        });

        if(!updatedLead) return res.status(404).json({ message: "Lead Not Found" });

        res.status(200).json({
            success: true,
            message: "Lead updated successfully",
            lead: updatedLead,
        });
    } catch(err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteLead = async (req,res) => {
    try {

        const deletedLead = await Lead.findByIdAndDelete(req.params.id);

        if (!deletedLead) return res.status(404).json({ message: "Lead not found" });

        res.status(200).json({ success: true, message: "Lead deleted successfully" });

    } catch(err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateLeadStatus = async (req,res) => {
    try {

        const { status } = req.body;

        const lead = await Lead.findById(req.params.id);
        if(!lead) return res.status(404).json({ message: "Lead Not found" });

        lead.status = status;
        await lead.save();

        res.status(200).json({
            success: true,
            message: "Lead status updated successfully",
            lead,
        });
    } catch(err) {
        res.status(500).json({ success: false, message: err.message});
    }
};