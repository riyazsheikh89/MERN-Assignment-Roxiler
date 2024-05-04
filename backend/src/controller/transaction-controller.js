const axios = require("axios");
const { TRANSACTION_API_END_POINT } = require("../config/env-variables");
const Transaction = require("../model/Transaction");

const getAllTransactions = async (req, res) => {
    try {
        const { page = 1, perPage = 10, search = "" } = req.query;
        const skip = (page - 1) * perPage;
        const query = search
        ? {
            $or: [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ],
            }
        : {};

        const transactions = await Transaction.find(query)
        .skip(skip)
        .limit(parseInt(perPage));

        res.status(200).json({
            success: true,
            message: "Successfuly fetched all transaction",
            data: transactions,
            err: {}
        });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const initializeDatabase = async (req, res) => {
    try {
      const totalDocuments = await Transaction.countDocuments();
      if (totalDocuments > 0) {
        return res.status(200).json({ message: "Database already initialized." });
      }
      // Fetch data from the third-party API
      const response = await axios.get(TRANSACTION_API_END_POINT);
      const products = response.data;
      await Transaction.insertMany(products);

      res.status(200).json({ message: "Database initialized successfully." });
    } catch (error) {
      console.error("Error initializing database:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
};

const getStatistics = async (req, res) => {
  try {
    const { month } = req.query;
    const parsedMonth = parseInt(month);
    if (isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
      return res.status(400).json({ error: 'Invalid month value. Month must be a number between 1 and 12.' });
    }

    // Define the query to filter transactions for the given month
    const query = {
      $expr: { $eq: [{ $month: "$dateOfSale" }, parsedMonth] }
    };

    // Calculate total sale amount for the given month
    const totalSaleAmount = await Transaction.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: "$price" } } }
    ]);

    // Calculate total number of sold items for the given month
    const totalSoldItems = await Transaction.countDocuments({ ...query, sold: true });

    // Calculate total number of not sold items for the given month
    const totalNotSoldItems = await Transaction.countDocuments({ ...query, sold: false });

    // Return the statistics
    res.status(200).json({
      success: true,
      message: "successfully calculated the statistics",
      err: {},
      data: {
        totalSaleAmount: totalSaleAmount.length > 0 ? totalSaleAmount[0].total : 0,
        totalSoldItems: totalSoldItems,
        totalNotSoldItems: totalNotSoldItems
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  getAllTransactions,
  initializeDatabase,
  getStatistics
};
