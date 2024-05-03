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

module.exports = {
  getAllTransactions,
  initializeDatabase,
};
