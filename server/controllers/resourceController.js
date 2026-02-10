const Resource = require('../models/Resource');
const GoogleSheetsService = require('../services/googleSheetsService');
const { mockResources } = require('../mockData');

let sheetsService;

// Initialize Google Sheets service if credentials are available
const initSheetsService = () => {
  if (!sheetsService && process.env.GOOGLE_SHEET_ID && process.env.GOOGLE_API_KEY) {
    sheetsService = new GoogleSheetsService();
  }
  return sheetsService;
};

// Get all resources
exports.getAllResources = async (req, res) => {
  try {
    const sheets = initSheetsService();

    // Use Google Sheets if configured
    if (sheets) {
      const resources = await sheets.getAllResources(req.query);
      return res.json(resources);
    }

    // Use mock data if database is not available
    if (process.env.USE_MOCK_DATA === 'true') {
      const { category, type, status } = req.query;
      let resources = [...mockResources];

      if (category) resources = resources.filter(r => r.category === category);
      if (type) resources = resources.filter(r => r.type === type);
      if (status) resources = resources.filter(r => r.status === status);

      resources.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json(resources);
    }

    const { category, type, status } = req.query;
    let query = {};

    if (category) query.category = category;
    if (type) query.type = type;
    if (status) query.status = status;

    const resources = await Resource.find(query).sort({ createdAt: -1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get resource by ID
exports.getResourceById = async (req, res) => {
  try {
    const sheets = initSheetsService();

    // Use Google Sheets if configured
    if (sheets) {
      const resource = await sheets.getResourceById(req.params.id);
      if (!resource) return res.status(404).json({ message: 'Resource not found' });
      return res.json(resource);
    }

    // Use mock data if database is not available
    if (process.env.USE_MOCK_DATA === 'true') {
      const resource = mockResources.find(r => r._id === req.params.id);
      if (!resource) return res.status(404).json({ message: 'Resource not found' });
      return res.json(resource);
    }

    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create resource
exports.createResource = async (req, res) => {
  try {
    const sheets = initSheetsService();

    // Use Google Sheets if configured
    if (sheets) {
      const newResource = await sheets.createResource(req.body);
      return res.status(201).json(newResource);
    }

    // Use mock data if database is not available
    if (process.env.USE_MOCK_DATA === 'true') {
      const newResource = {
        _id: String(Math.random()).slice(2),
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockResources.push(newResource);
      return res.status(201).json(newResource);
    }

    const resource = new Resource(req.body);
    const newResource = await resource.save();
    res.status(201).json(newResource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update resource
exports.updateResource = async (req, res) => {
  try {
    // Use mock data if database is not available
    if (process.env.USE_MOCK_DATA === 'true') {
      const index = mockResources.findIndex(r => r._id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Resource not found' });
      
      mockResources[index] = {
        ...mockResources[index],
        ...req.body,
        updatedAt: new Date(),
      };
      return res.json(mockResources[index]);
    }

    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    Object.assign(resource, req.body);
    resource.updatedAt = Date.now();

    const updatedResource = await resource.save();
    res.json(updatedResource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete resource
exports.deleteResource = async (req, res) => {
  try {
    // Use mock data if database is not available
    if (process.env.USE_MOCK_DATA === 'true') {
      const index = mockResources.findIndex(r => r._id === req.params.id);
      if (index === -1) return res.status(404).json({ message: 'Resource not found' });
      
      mockResources.splice(index, 1);
      return res.json({ message: 'Resource deleted' });
    }

    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.json({ message: 'Resource deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
