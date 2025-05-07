// import { DataSource } from 'typeorm';
// import TaskSeeder from './seeders/task.seeder';

// // Create a new data source with hardcoded database configuration
// const dataSource = new DataSource({
//   type: "postgres", // Change this to your database type if different
//   host: "localhost",
//   port: 5432,
//   username: "postgres", // Change to your database username
//   password: "postgres", // Change to your database password
//   database: "tasktrackr", // Change to your database name
//   entities: [__dirname + '/**/*.entity{.ts,.js}'],
//   synchronize: false,
// });

// async function runSeed() {
//   try {
//     // Initialize connection
//     await dataSource.initialize();
//     console.log("Database connection established");

//     // Run task seeder
//     const count = process.argv.length > 2 ? parseInt(process.argv[2], 10) : 10;
//     await TaskSeeder.seed(dataSource, count);

//     // Close connection
//     await dataSource.destroy();
//     console.log("Database connection closed");
//   } catch (error) {
//     console.error("Error during seeding:", error);
//     process.exit(1);
//   }
// }

// // Run the seed function
// runSeed();