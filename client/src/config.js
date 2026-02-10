// ============================================================================
// CLIENT-SIDE CONFIGURATION FOR GOGROWTH OS PRO
// ============================================================================
// This matches your original vanilla JS configuration
// Used by React components and API services

const CLIENT_CONFIG = {
  // Google Sheets Credentials
  GOOGLE_CLIENT_ID: '945814057930-p00uepo2u448u6imgaulsd6ccn3h9nuf.apps.googleusercontent.com',
  GOOGLE_API_KEY: 'AIzaSyCUBY03axjeW_0e8mrq8v5n0xAX_zjciDc',

  // Spreadsheet Configuration
  SPREADSHEET_ID: '12UKRgjB4jtV6bAZYe16KhoBXgH95AatHHmyE2HA3P-U',
  TASKS_SHEET_NAME: 'All',
  RESOURCES_SHEET_NAME: 'Resources',

  // API Configuration
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',

  // App Configuration
  USE_MOCK_DATA: false,
  APP_NAME: 'GoGrowth OS',
  AUTO_REFRESH_INTERVAL: 30000, // 30 seconds

  // User Management
  USER_ROLES: {
    'demo@gogrowth.com': 'admin',
  },

  // Role-based Permissions
  PERMISSIONS: {
    admin: {
      viewAll: true,
      addTask: true,
      editOwn: true,
      editAll: true,
      deleteTask: true,
      exportData: true,
      manageResources: true
    },
    manager: {
      viewAll: true,
      addTask: true,
      editOwn: true,
      editAll: true,
      deleteTask: false,
      exportData: true,
      manageResources: true
    },
    member: {
      viewAll: true,
      addTask: true,
      editOwn: true,
      editAll: false,
      deleteTask: false,
      exportData: false,
      manageResources: false
    },
    viewer: {
      viewAll: true,
      addTask: false,
      editOwn: false,
      editAll: false,
      deleteTask: false,
      exportData: false,
      manageResources: false
    }
  },

  // Team Members (from your setup)
  TEAM_MEMBERS: [
    'Sidd',
    'Harsh',
    'Faisal',
    'Piyush',
    'Danish',
    'Armaan',
    'Rishav',
    'Rishabh'
  ],

  // Task Status Options
  STATUS_OPTIONS: [
    'Pending',
    'In progress',
    'Completed',
    'On Hold',
    'Cancelled'
  ],

  // Client List
  CLIENTS: [
    'Swingsaga',
    'Inkup',
    'Craft Delights',
    'Anything Vegan',
    'Mimamsaa',
    'Banter Kitchen',
    'All clients'
  ],

  // Resource Tags
  RESOURCE_TAGS: [
    'SEO',
    'Ads',
    'Website',
    'N8N',
    'Design',
    'Development',
    'Marketing',
    'Analytics',
    'Other'
  ],

  // Client Colors (for UI display)
  CLIENT_COLORS: {
    'Swingsaga': '#EF4444',
    'Inkup': '#3B82F6',
    'Craft Delights': '#FBBF24',
    'Anything Vegan': '#10B981',
    'Mimamsaa': '#A855F7',
    'Banter Kitchen': '#F97316',
    'Go Growth': '#06B6D4',
    'NDNY': '#EC4899'
  },

  // Resource Tag Colors (Pastel colors)
  TAG_COLORS: {
    'SEO': '#FFE5E5',          // Pastel red
    'Ads': '#E5F3FF',          // Pastel blue
    'Website': '#FFF5E5',      // Pastel orange
    'N8N': '#E5FFEF',          // Pastel green
    'Design': '#F5E5FF',       // Pastel purple
    'Development': '#FFE5F5',  // Pastel pink
    'Marketing': '#FFFFE5',    // Pastel yellow
    'Analytics': '#E5FFFF',    // Pastel cyan
    'Other': '#F0F0F0'         // Light gray
  },

  TAG_TEXT_COLORS: {
    'SEO': '#CC0000',          // Darker red
    'Ads': '#0066CC',          // Darker blue
    'Website': '#CC6600',      // Darker orange
    'N8N': '#009933',          // Darker green
    'Design': '#6600CC',       // Darker purple
    'Development': '#CC0066',  // Darker pink
    'Marketing': '#CCAA00',    // Darker yellow
    'Analytics': '#0099CC',    // Darker cyan
    'Other': '#666666'         // Dark gray
  }
};

export default CLIENT_CONFIG;
