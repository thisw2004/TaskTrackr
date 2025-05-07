import { DataSource } from 'typeorm';
import TaskSeeder from './task.seeder';

export async function runSeeders(dataSource: DataSource) {
  try {
    console.log('Starting seeders...');
    await TaskSeeder.seed(dataSource);
    console.log('All seeders completed successfully');
  } catch (error) {
    console.error('Error running seeders:', error);
    throw error;
  }
}
