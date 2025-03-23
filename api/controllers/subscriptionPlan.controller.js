import SubscriptionPlan from '../models/subscriptionPlan.model.js';

// Get all subscription plans
export const getSubscriptionPlans = async (req, res, next) => {
  try {
    let plans = await SubscriptionPlan.find().sort({ duration: 1 });
    
    // If no plans exist, create default plans
    if (plans.length === 0) {
      const defaultPlans = [
        {
          planType: 'monthly',
          label: 'Monthly',
          perMonth: 999,
          duration: 1,
          total: 999,
          discount: 0
        },
        {
          planType: 'quarterly',
          label: 'Quarterly',
          perMonth: 899,
          duration: 3,
          total: 2697,
          discount: 10
        },
        {
          planType: 'annually',
          label: 'Annually',
          perMonth: 749,
          duration: 12,
          total: 8988,
          discount: 25
        }
      ];

      plans = await SubscriptionPlan.insertMany(defaultPlans);
    }

    res.status(200).json({
      success: true,
      plans
    });
  } catch (error) {
    next(error);
  }
};

// Update all subscription plans
export const updateSubscriptionPlans = async (req, res, next) => {
  try {
    const { plans } = req.body;

    if (!Array.isArray(plans)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input format'
      });
    }

    // Update each plan
    const updatePromises = plans.map(async (plan) => {
      const { planType, perMonth, duration, total, discount } = plan;
      
      // Validate required fields
      if (!planType || !perMonth || !duration || !total) {
        throw new Error(`Missing required fields for plan type: ${planType}`);
      }

      // Find and update or create if doesn't exist
      return SubscriptionPlan.findOneAndUpdate(
        { planType },
        { perMonth, duration, total, discount },
        { new: true, upsert: true }
      );
    });

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: 'Subscription plans updated successfully'
    });
  } catch (error) {
    next(error);
  }
}; 