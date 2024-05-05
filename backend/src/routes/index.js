const express = require("express");
const router = express.Router();
const {
  getAllTransactions,
  initializeDatabase,
  getStatistics,
  generateBarChart,
  generatePieChart,
  combineAllResponse,
} = require("../controller/transaction-controller");

// Route for creating a new class
router.get("/get-all", getAllTransactions);
router.post("/initialize", initializeDatabase);
router.get("/statistics", getStatistics);
router.get("/bar-chart", generateBarChart);
router.get("/pie-chart", generatePieChart);
router.get("/combine-data", combineAllResponse);

module.exports = router;