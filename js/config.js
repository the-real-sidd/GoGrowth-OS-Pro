// ============================================================================
// CONFIGURATION FILE
// ============================================================================

const CONFIG = {
    GOOGLE_CLIENT_ID: '945814057930-p00uepo2u448u6imgaulsd6ccn3h9nuf.apps.googleusercontent.com',
    GOOGLE_API_KEY: 'AIzaSyCUBY03axjeW_0e8mrq8v5n0xAX_zjciDc',

    SPREADSHEET_ID: '12UKRgjB4jtV6bAZYe16KhoBXgH95AatHHmyE2HA3P-U',
    TASKS_SHEET_NAME: 'All',
    RESOURCES_SHEET_NAME: 'Resources',

    USE_MOCK_DATA: false,

    APP_NAME: 'GoGrowth OS',
    AUTO_REFRESH_INTERVAL: 30000,

    USER_ROLES: {
        'demo@gogrowth.com': 'admin',
    },

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

    STATUS_OPTIONS: [
        'Pending',
        'In progress',
        'Completed',
        'On Hold',
        'Cancelled'
    ],

    CLIENTS: [
        'Swingsaga',
        'Inkup',
        'Craft Delights',
        'Anything Vegan',
        'Mimamsaa',
        'Banter Kitchen',
        'All clients'
    ],

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
    ]
};

console.log('✓ Configuration loaded');
console.log('  Mode:', CONFIG.USE_MOCK_DATA ? 'MOCK DATA' : 'LIVE DATA');
