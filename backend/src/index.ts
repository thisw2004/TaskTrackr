import express from 'express';
import cors from 'cors';
import { DataSource } from 'typeorm';
import { Task } from './entities/task.entity';
import { taskRoutes } from './routes/task.routes';
import { runSeeders } from './seeders';

// Create Express application
const app = express();
app.use(cors());
app.use(express.json());

// Database configuration
const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'tasktrackr.sqlite',
  entities: [Task],
  synchronize: true,
  logging: true
});

// Initialize database connection
AppDataSource.initialize()
  .then(async () => {
    console.log('Database connection initialized');
    
    // Run seeders if needed
    // Uncomment the next line to seed data during startup
    // await runSeeders(AppDataSource);
    
    // Register routes
    app.use('/api/tasks', taskRoutes(AppDataSource));
    
    // Health check endpoint
    app.get('/health', (req, res) => {
      res.status(200).send('Server is running');
    });
    
    // Start server
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error initializing database connection:', error);
  });
