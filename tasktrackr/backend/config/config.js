const config = {
  development: {
    port: process.env.PORT || 3000,
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/tasktrackr-dev',
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-key',
    jwtExpiration: '24h',
    emailService: {
      host: process.env.EMAIL_HOST || 'smtp.example.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || 'user@example.com',
        pass: process.env.EMAIL_PASS || 'password'
      }
    },
    externalAPIs: {
      holidays: 'https://date.nager.at/api/v3',
      specialDays: 'https://www.daysoftheyear.com/api' // Note: Check if they have an official API
    },
    clientURL: 'http://localhost:4200'
  },
  test: {
    port: process.env.PORT || 3001,
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/tasktrackr-test',
    jwtSecret: 'test-secret-key',
    jwtExpiration: '24h',
    emailService: {
      host: 'smtp.ethereal.email', // Test email service
      port: 587,
      secure: false,
      auth: {
        user: 'test@example.com',
        pass: 'testpass'
      }
    },
    externalAPIs: {
      holidays: 'https://date.nager.at/api/v3',
      specialDays: 'https://www.daysoftheyear.com/api'
    },
    clientURL: 'http://localhost:4200'
  },
  production: {
    port: process.env.PORT || 8080,
    mongoURI: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: '24h',
    emailService: {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    },
    externalAPIs: {
      holidays: 'https://date.nager.at/api/v3',
      specialDays: 'https://www.daysoftheyear.com/api'
    },
    clientURL: process.env.CLIENT_URL
  }
};

const env = process.env.NODE_ENV || 'development';

module.exports = config[env];