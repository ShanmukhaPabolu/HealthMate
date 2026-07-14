const Dispute = require('../models/Dispute');

// @desc    Lodge a new dispute support ticket
// @route   POST /api/disputes
// @access  Private
exports.createDispute = async (req, res, next) => {
  try {
    const { againstId, category, description } = req.body;

    const dispute = await Dispute.create({
      raisedBy: req.user.id,
      against: againstId || null,
      category,
      description
    });

    res.status(201).json({
      success: true,
      message: 'Dispute ticket registered successfully.',
      data: dispute
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get dispute tickets list
// @route   GET /api/disputes
// @access  Private
exports.getDisputes = async (req, res, next) => {
  try {
    let query = {};
    
    // Non-admin users only see disputes they raised
    if (req.user.role !== 'admin') {
      query.raisedBy = req.user.id;
    }

    const disputes = await Dispute.find(query)
      .populate('raisedBy', 'name email role')
      .populate('against', 'name email role')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: disputes.length,
      data: disputes
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Resolve dispute ticket
// @route   PATCH /api/disputes/:id/resolve
// @access  Private (Admin only)
exports.resolveDispute = async (req, res, next) => {
  try {
    const { resolutionNotes } = req.body;
    
    let dispute = await Dispute.findById(req.params.id);
    if (!dispute) {
      return res.status(404).json({ success: false, message: 'Dispute ticket not found' });
    }

    dispute.status = 'resolved';
    dispute.resolutionNotes = resolutionNotes || 'Resolved by Administrator.';
    dispute.resolvedAt = Date.now();

    await dispute.save();

    res.status(200).json({
      success: true,
      message: 'Dispute resolved successfully',
      data: dispute
    });
  } catch (err) {
    next(err);
  }
};
