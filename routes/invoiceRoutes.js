const express = require('express');
const router = express.Router();
const {createInvoice, updateInvoice, getAllInvoices, getInvoiceById, deleteInvoice, updateInvoiceStatus, getVersionHistory} = require('../controllers/invoiceController');

// Route to create a new invoice
router.post('/', createInvoice);

//get all invoices and byId
router.get("/", getAllInvoices);
router.get("/:id", getInvoiceById);

// Route to delete an invoice
router.delete('/:id', deleteInvoice);

// Route to update an existing invoice
router.put('/:id', updateInvoice);

//update invoice status
router.patch("/:id", updateInvoiceStatus);

//version history
router.get("/:id/History", getVersionHistory);

module.exports = router;

