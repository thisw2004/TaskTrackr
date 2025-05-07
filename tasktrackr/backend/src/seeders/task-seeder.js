const { MongoClient } = require('mongodb');

// MongoDB connection settings
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "tasktrackr";
const collectionName = "tasks";

// Task components for random generation
const taskComponents = {
  actions: [
    'Implement', 'Develop', 'Design', 'Test', 'Fix', 'Optimize', 'Refactor',
    'Document', 'Review', 'Deploy', 'Update', 'Create', 'Migrate', 'Integrate'
  ],
  subjects: [
    'user authentication', 'dashboard layout', 'database queries', 'API endpoints',
    'notification system', 'search functionality', 'file upload module', 'user settings',
    'admin panel', 'error handling', 'logging system', 'unit tests', 'payment processing'
  ],
  descriptions: [
    'Ensure it follows best practices and security guidelines',
    'Make it intuitive and user-friendly with proper feedback',
    'Optimize for both desktop and mobile devices',
    'Implement proper error handling and logging',
    'Include comprehensive documentation for future maintenance'
  ],
  statuses: ['TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED'],
  priorities: ['LOW', 'MEDIUM', 'HIGH', 'URGENT']
};

// Generate a random date between now and maxDaysAhead
function generateRandomDate(maxDaysAhead = 180) {
  const today = new Date();
  const future = new Date();
  future.setDate(today.getDate() + Math.floor(Math.random() * maxDaysAhead));
  return future;
}

// Generate a unique random task
function generateRandomTask(existingTitles) {
  const { actions, subjects, descriptions, statuses, priorities } = taskComponents;
  
  let title;
  let attempts = 0;
  
  // Try to generate a unique title, with a limit on attempts
  do {
    const action = actions[Math.floor(Math.random() * actions.length)];
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    title = `${action} ${subject}`;
    attempts++;
    
    // Break after too many attempts to avoid infinite loop
    if (attempts > 100) {
      throw new Error('Could not generate enough unique task titles');
    }
  } while (existingTitles.has(title));
  
  // Add to existing titles set
  existingTitles.add(title);
  
  return {
    title,
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    dueDate: generateRandomDate(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

// Seeder function
async function seedTasks(count = 10) {
  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log("Connected to MongoDB server");
    
    // Get database and collection
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    
    // Get existing task titles to avoid duplicates
    const existingTasks = await collection.find({}, { projection: { title: 1 } }).toArray();
    const existingTitles = new Set(existingTasks.map(task => task.title));
    
    console.log(`Found ${existingTasks.length} existing tasks`);
    
    console.log(`Generating ${count} unique random tasks...`);
    
    // Generate random tasks
    const tasksToCreate = [];
    
    for (let i = 0; i < count; i++) {
      try {
        const randomTask = generateRandomTask(existingTitles);
        tasksToCreate.push(randomTask);
      } catch (error) {
        console.error(error.message);
        break;
      }
    }
    
    console.log(`Created ${tasksToCreate.length} unique task definitions`);
    
    if (tasksToCreate.length > 0) {
      // Insert all tasks
      const result = await collection.insertMany(tasksToCreate);
      console.log(`${result.insertedCount} tasks inserted into the database`);
    }
    
    console.log("Task seeding completed successfully");
    
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  } finally {
    // Close the connection
    await client.close();
    console.log("MongoDB connection closed");
  }
}

// Get command line arguments for task count
const args = process.argv.slice(2);
const count = args.length > 0 ? parseInt(args[0], 10) : 10;

// Run the seeder
seedTasks(count)
  .then(() => {
    console.log("Seeding process completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });