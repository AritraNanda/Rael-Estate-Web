import Transaction from '../models/transaction.model.js';

export const getTransactions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find()
      .sort({ transactionDate: -1 }) // Sort by transaction date
      .skip(skip)
      .limit(limit)
      .populate('userId', 'username email')
      .populate('subscriptionId', 'name description');

    // Get total count for pagination
    const total = await Transaction.countDocuments();

    res.status(200).json({
      success: true,
      transactions,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + transactions.length < total
    });
  } catch (error) {
    next(error);
  }
}; 