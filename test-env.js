const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env.development.local') });

// Log the DATABASE_URL
console.log('DATABASE_URL:', process.env.DATABASE_URL);