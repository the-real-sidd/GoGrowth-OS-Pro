const GoogleSheetsService = require('../services/googleSheetsService');

let sheetsService;

const initSheetsService = () => {
  if (!sheetsService) {
    sheetsService = new GoogleSheetsService();
  }
  return sheetsService;
};

// Get all resources
exports.getAllResources = async (req, res) => {
  try {
    const sheets = initSheetsService();
    const { category, type, status } = req.query;
    let resources = await sheets.getAllResources();

    if (category) resources = resources.filter(r => r.category === category);
    if (type) resources = resources.filter(r => r.type === type);
    if (status) resources = resources.filter(r => r.status === status);

    resources.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get resource by ID
exports.getResourceById = async (req, res) => {
  try {
    const sheets = initSheetsService();
    const resource = await sheets.getResourceById(req.params.id);
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
    const newResource = await sheets.createResource(req.body);
    res.status(201).json(newResource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update resource
exports.updateResource = async (req, res) => {
  try {
    const sheets = initSheetsService();
    const updated = await sheets.updateResource(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Resource not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete resource
exports.deleteResource = async (req, res) => {
  try {
    const sheets = initSheetsService();
    await sheets.deleteResource(req.params.id);
    res.json({ message: 'Resource deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
