
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Agent = require('../models/Agent');
const authMiddleware = require('../middleware/auth');

// @route   GET api/agents
// @desc    Get all agents for the logged in user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const agents = await Agent.find({ createdBy: req.user.id })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(agents);
  } catch (err) {
    console.error('Get agents error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/agents
// @desc    Add new agent
// @access  Private
router.post('/', [
  authMiddleware,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('mobileNumber').notEmpty().withMessage('Mobile number is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ]
], async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { name, email, mobileNumber, password } = req.body;

  try {
    // Check if agent with this email already exists
    let existingAgent = await Agent.findOne({ email });

    if (existingAgent) {
      return res.status(400).json({ message: 'Agent with this email already exists' });
    }

    // Create new agent
    const agent = new Agent({
      name,
      email,
      mobileNumber,
      password,
      createdBy: req.user.id
    });

    // Save agent to database
    await agent.save();

    // Return the agent without the password
    const agentResponse = {
      _id: agent._id,
      name: agent.name,
      email: agent.email,
      mobileNumber: agent.mobileNumber,
      createdBy: agent.createdBy,
      createdAt: agent.createdAt
    };

    res.status(201).json({ message: 'Agent created successfully', agent: agentResponse });
  } catch (err) {
    console.error('Add agent error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/agents/:id
// @desc    Delete an agent
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    // Make sure user owns this agent
    if (agent.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Agent.findByIdAndRemove(req.params.id);

    res.json({ message: 'Agent removed' });
  } catch (err) {
    console.error('Delete agent error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
