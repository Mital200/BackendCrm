const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const leadRoutes = require("./routes/leadRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//leads
app.use("/api/leads", leadRoutes);

//invoices
app.use("/api/invoices", invoiceRoutes);

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


app.get("/", (req, res) => {
  res.send("Welcome to CRM Backend");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});