const axios = require("axios");
const { TRANSACTION_API_END_POINT, HOST } = require("../config/env-variables");
const Transaction = require("../model/Transaction");

const getAllTransactions = async (req, res) => {
  try {
      const { page = 1, perPage = 10, search = "", month } = req.query;
      const skip = (page - 1) * perPage;
      let query = search
      ? {
          $or: [
              { title: { $regex: search, $options: "i" } },
              { description: { $regex: search, $options: "i" } },
          ],
          }
      : {};

      // If month parameter is provided, add month filter to the query
      if (month) {
        const parsedMonth = parseInt(month);
        if (!isNaN(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12) {
            query.$expr = { 
              $eq: [{ $month: "$dateOfSale" }, parsedMonth] 
            }
        } else {
            return res.status(400).json({ 
              error: 'Invalid month value. Month must be a number between 1 and 12.' 
            });
        }
    }

      const transactions = await Transaction.find(query)
      .skip(skip)
      .limit(parseInt(perPage));

      res.status(200).json({
          success: true,
          message: "Successfully fetched all transactions",
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

const generateBarChart = async (req, res) => {
  try {
    const { month } = req.query;
    const parsedMonth = parseInt(month);
    if (isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
      return res.status(400).json({ error: 'Invalid month value. Month must be a number between 1 and 12.' });
    }

    // Define the query to filter transactions for the given month
    const query = {
      $expr: { $eq: [{ $month: { $toDate: "$dateOfSale" } }, parsedMonth] }
    };

    // Define price ranges
    const priceRanges = [
      { min: 0, max: 100 },
      { min: 101, max: 200 },
      { min: 201, max: 300 },
      { min: 301, max: 400 },
      { min: 401, max: 500 },
      { min: 501, max: 600 },
      { min: 601, max: 700 },
      { min: 701, max: 800 },
      { min: 801, max: 900 },
      { min: 901, max: Number.POSITIVE_INFINITY } // Above 900
    ];

    // Initialize an object to store the count of items in each price range
    const priceRangeCounts = {};

    // Loop through each price range and count the items
    for (const range of priceRanges) {
      const count = await Transaction.countDocuments({ ...query, price: { $gte: range.min, $lte: range.max } });
      priceRangeCounts[`${range.min}-${range.max}`] = count;
    }

    // Return the counts for each price range
    res.status(200).json(priceRangeCounts);
  } catch (error) {
    console.error('Error generating bar chart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const generatePieChart = async (req, res) => {
  try {
    const { month } = req.query;
    const parsedMonth = parseInt(month);
    if (isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
      return res.status(400).json({ error: 'Invalid month value. Month must be a number between 1 and 12.' });
    }

    // Define the query to filter transactions for the given month
    const query = {
      $expr: { $eq: [{ $month: { $toDate: "$dateOfSale" } }, parsedMonth] }
    };

    // Aggregate to find unique categories and count of items in each category
    const categoryItems = await Transaction.aggregate([
      { $match: query },
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    // Construct response object
    const response = {};
    categoryItems.forEach(item => {
      response[item._id] = item.count;
    });

    // Return the unique categories and number of items from each category
    res.status(200).json(response);
  } catch (error) {
    console.error('Error finding unique categories and number of items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const combineAllResponse = async (req, res) => {
  try {
    const { month } = req.query;
    const parsedMonth = parseInt(month);
    if (isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
      return res.status(400).json({ error: 'Invalid month value. Month must be a number between 1 and 12.' });
    }

    // Define promises to fetch data from each API
    const statisticsPromise = axios.get(`${HOST}/statistics?month=${parsedMonth}`);
    const barChartPromise = axios.get(`${HOST}/bar-chart?month=${parsedMonth}`);
    const categoryItemsPromise = axios.get(`${HOST}/pie-chart?month=${parsedMonth}`);

    // Await all promises
    const [statisticsResponse, barChartResponse, categoryItemsResponse] = await Promise.all([
      statisticsPromise,
      barChartPromise,
      categoryItemsPromise
    ]);

    // Combine responses into a single JSON object
    const combinedData = {
      statistics: statisticsResponse.data.data,
      barChart: barChartResponse.data,
      categoryItems: categoryItemsResponse.data
    };

    // Send final response with the combined JSON
    res.status(200).json(combinedData);
  } catch (error) {
    console.error('Error fetching combined data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  getAllTransactions,
  initializeDatabase,
  getStatistics,
  generateBarChart,
  generatePieChart,
  combineAllResponse
};
