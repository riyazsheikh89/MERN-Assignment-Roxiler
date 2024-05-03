const express = require("express");
const router = express.Router();
const {getAllTransactions, initializeDatabase} = require("../controller/transaction-controller");

// Route for creating a new class
router.get("/get-all", getAllTransactions);
router.post("/initialize", initializeDatabase);

module.exports = router;