const Invoice = require('../models/invoice');
const nanoid = require('nanoid').nanoid;

// Create a new invoice
exports.createInvoice = async (req,res) => {
    try {
        const { projectId, invoiceType, clientName, clientAddress, services, updatedBy } = req.body;

        if (!clientName || !invoiceType || !services || !Array.isArray(services) || services.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide valid client details and at least one service.",
            });
        }

        // Calculate totals
        let total = 0;
        let taxAmount = 0;

        services.forEach((item) => {
            const itemTotal = (item.quantity || 0) * (item.price || 0);
            const itemGST = itemTotal * ((item.GST || 0) / 100);
            total += itemTotal;
            taxAmount += itemGST;
        });

        const grandTotal = total + taxAmount;

        // Generate unique invoice number
        const invoiceCount = await Invoice.countDocuments();
        const invoiceNumber = `INV-${String(invoiceCount + 1).padStart(5, '0')}`;

        const invoiceId = nanoid(10);

        const newInvoice = new Invoice({
            invoiceId,
            projectId,
            invoiceType,
            invoiceNumber,
            clientName,
            clientAddress,
            services,
            total,
            taxAmount,
            grandTotal,
            versionHistory: [{
                version: 1,
                updatedBy: updatedBy || "system",
                changes: {created: true} ,
            }],
        });

        await newInvoice.save();

        res.status(201).json({
            success: true,
            message: 'Invoice created successfully',
            newInvoice,
        });
    } catch (err) {
        res.status(500).json({ success: false , message: err.message });
    }
};

exports.getAllInvoices = async (req, res) => {
    try {
        const filters = req.query || {};
        const invoices = await Invoice.find({...filters, isDeleted: false}).sort({ createdAt: -1 });

        if (!invoices || invoices.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No invoices found matching the provided filters",
            });
        }

        res.status(200).json({ success: true, invoices });

    } catch(err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getInvoiceById = async (req,res) => {
    try {
        const { id } = req.params;

        const invoice = await Invoice.findOne({ _id : id, isDeleted: false });

        if(!invoice) return res.status(404).json({ message: "Invoice not found" });

        res.status(200).json({ success: true, invoice });
    } catch(err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteInvoice = async (req,res) => {
    try {
        const { id } = req.params;

        const invoice = await Invoice.findByIdAndDelete(id);

        if(!invoice) return res.status(404).json({ message: "Invoice not found" });

        if (invoice.isDeleted) {
            return res.status(400).json({ success: false, message: "Invoice already deleted" });
        }

        invoice.isDeleted = true;
        invoice.lastModified = new Date();
        await invoice.save();

        res.status(200).json({ success: true, message: "Invoice soft deleted successfully" });

    } catch(err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateInvoice = async (req,res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedBy = updates.updatedBy || "system";
        
        const invoice = await Invoice.findOne({ _id: id, isDeleted: false });
        if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

        if (invoice.status !== "Draft" && invoice.status !== "Cancelled") {
            return res.status(400).json({ message: "Cannot edit issued or paid invoice" });
        }

        //version increment
        const newVersion = (invoice.versionHistory?.length  || 0)+ 1;

        //save changes for version history
        invoice.versionHistory.push({
            version: newVersion,
            updatedBy,
            changes: updates,
        });

        Object.assign(invoice, updates);
        invoice.lastModified = new Date();

        await invoice.save();

        res.status(200).json({
            success: true,
            message: 'Invoice updated successfully',
            invoice,

        });
    } catch (err) {
        res.status(500).json({ success: false , message: err.message });
    }
};

exports.updateInvoiceStatus = async (req,res) => {
    try {
        const { id } = req.params;
        const { status, updatedBy } = req.body;

        const allowed = [ "Draft", "Issued", "Paid", "Cancelled" ];
        if(!(allowed.includes(status))){
            return res.status(400).json({ success: false , message: "Invalid Status"})
        }

        const invoice = await Invoice.findOne({ _id: id, isDeleted: false });
        if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

        invoice.status = status;
        invoice.versionHistory.push({
            version: (invoice.versionHistory?.length  || 0)+ 1,
            date: new Date(),
            updatedBy: updatedBy || "system",
            changes: { status },
        });
        
        await invoice.save();

        res.status(200).json({
            success: true,
            message:"Invoice status updated", 
            invoice,
        });

    } catch(err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getVersionHistory = async (req,res) => {
    try {

        const { id } = req.params;

        const invoice = await Invoice.findById(id);

        if(!invoice) return res.status(400).json({ success: false, message:"Invoice not found"});

        res.status(200).json({ success: true, history: invoice.versionHistory });
    } catch(err) {
        res.status(500).json({success: false, message: err.message});
    }
};