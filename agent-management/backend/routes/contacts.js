
const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/auth');
const Contact = require('../models/Contact');
const Agent = require('../models/Agent');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.csv', '.xlsx', '.xls'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only CSV, XLSX, and XLS files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// @route   POST api/contacts/upload
// @desc    Upload CSV/Excel file and distribute contacts among agents
// @access  Private
router.post('/upload', [authMiddleware, upload.single('file')], async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded or invalid file type' });
  }

  try {
    // Get all agents for the user
    const agents = await Agent.find({ createdBy: req.user.id });

    if (agents.length === 0) {
      return res.status(400).json({ message: 'You need to add agents before uploading contacts' });
    }

    const results = [];
    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();

    // Parse file based on extension
    if (fileExt === '.csv') {
      // Process CSV file
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          // Validate required fields
          if (!data.FirstName || !data.Phone) {
            throw new Error('CSV must contain FirstName and Phone columns');
          }
          
          results.push({
            firstName: data.FirstName,
            phone: data.Phone,
            notes: data.Notes || ''
          });
        })
        .on('end', async () => {
          await distributeAndSaveContacts(results, agents, req.user.id, res);
          // Delete the file after processing
          fs.unlinkSync(filePath);
        })
        .on('error', (err) => {
          fs.unlinkSync(filePath);
          return res.status(400).json({ message: 'Error parsing CSV: ' + err.message });
        });
    } else {
      // Process Excel file
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(sheet);

      // Validate required fields
      for (const row of jsonData) {
        if (!row.FirstName || !row.Phone) {
          fs.unlinkSync(filePath);
          return res.status(400).json({ message: 'Excel must contain FirstName and Phone columns' });
        }
        
        results.push({
          firstName: row.FirstName,
          phone: row.Phone.toString(),
          notes: row.Notes || ''
        });
      }

      await distributeAndSaveContacts(results, agents, req.user.id, res);
      // Delete the file after processing
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error('Upload error:', err.message);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// Helper function to distribute and save contacts
async function distributeAndSaveContacts(contacts, agents, userId, res) {
  try {
    const totalContacts = contacts.length;
    const totalAgents = agents.length;
    const contactsPerAgent = Math.floor(totalContacts / totalAgents);
    const remainingContacts = totalContacts % totalAgents;

    // Create array to hold all new contacts
    const newContacts = [];
    let contactIndex = 0;

    // Distribute contacts among agents
    for (let i = 0; i < totalAgents; i++) {
      const agentId = agents[i]._id;
      let contactsForAgent = contactsPerAgent;
      
      // Add one more contact for some agents if there are remaining contacts
      if (i < remainingContacts) {
        contactsForAgent++;
      }

      // Assign contacts to this agent
      for (let j = 0; j < contactsForAgent && contactIndex < totalContacts; j++) {
        const contact = contacts[contactIndex++];
        newContacts.push({
          firstName: contact.firstName,
          phone: contact.phone,
          notes: contact.notes,
          assignedTo: agentId,
          createdBy: userId
        });
      }
    }

    // Save all contacts to database
    await Contact.insertMany(newContacts);

    // Get distribution summary by agent
    const distributionSummary = await Contact.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$assignedTo', count: { $sum: 1 } } }
    ]);

    // Fetch agent details for the summary
    const populatedSummary = await Promise.all(
      distributionSummary.map(async (item) => {
        const agent = await Agent.findById(item._id).select('name email');
        return {
          agent: agent,
          count: item.count
        };
      })
    );

    // Return success response
    return res.status(201).json({
      message: `${totalContacts} contacts successfully distributed among ${totalAgents} agents`,
      distributionSummary: populatedSummary
    });
  } catch (err) {
    console.error('Distribution error:', err.message);
    return res.status(500).json({ message: 'Error distributing contacts: ' + err.message });
  }
}

// @route   GET api/contacts/agent/:agentId
// @desc    Get contacts for a specific agent
// @access  Private
router.get('/agent/:agentId', authMiddleware, async (req, res) => {
  try {
    const { agentId } = req.params;
    
    // Verify agent belongs to the user
    const agent = await Agent.findOne({ 
      _id: agentId, 
      createdBy: req.user.id 
    });
    
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    
    const contacts = await Contact.find({ assignedTo: agentId })
      .sort({ createdAt: -1 });
    
    res.json(contacts);
  } catch (err) {
    console.error('Get contacts error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/contacts/distribution
// @desc    Get contact distribution summary
// @access  Private
router.get('/distribution', authMiddleware, async (req, res) => {
  try {
    // Get all agents for the user
    const agents = await Agent.find({ createdBy: req.user.id })
      .select('name email');
    
    if (agents.length === 0) {
      return res.json({ agents: [], distribution: [] });
    }
    
    // Get contact counts for each agent
    const distribution = await Promise.all(
      agents.map(async (agent) => {
        const count = await Contact.countDocuments({
          assignedTo: agent._id,
          createdBy: req.user.id
        });
        
        return {
          agentId: agent._id,
          name: agent.name,
          email: agent.email,
          contactCount: count
        };
      })
    );
    
    res.json({ agents, distribution });
  } catch (err) {
    console.error('Distribution summary error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
