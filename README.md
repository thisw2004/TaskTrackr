# TaskTrackr

A to-do list application to help users manage their daily tasks.

## Team Members
- Thirza Swijnenburg, 2223763
- Kayal Kichari, 2223193

## Project Overview

TaskTrackr is a MEAN stack application that helps users create order and maintain an overview of their daily tasks. The application targets individuals who need assistance organizing their lives.

### Key Features
- User account creation and authentication
- Task creation with titles, descriptions, and deadlines
- Task editing and deletion
- Task completion marking
- Deadline reminders
- Task searching by keyword

### Tech Stack
- **M**ongoDB - Database
- **E**xpress.js - Backend framework
- **A**ngular - Frontend framework
- **N**ode.js - Runtime environment

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB
- Angular CLI

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   ```

2. Install backend dependencies
   ```
   cd TaskTrackr/backend
   npm install
   ```

3. Install frontend dependencies
   ```
   cd ../frontend
   npm install
   ```

4. Set up environment variables
   - Create a `.env` file in the backend directory
   - Add the following variables:
     ```
     PORT=3000
     MONGODB_URI=mongodb://localhost:27017/tasktrackr
     JWT_SECRET=your_jwt_secret
     ```

5. Run the application
   - Backend: `npm run start` (from backend directory)
   - Frontend: `ng serve` (from frontend directory)

6. Open your browser at `http://localhost:4200`

## User Stories

1. As a user, I want to create an account so I can manage my own task list.
2. As a user, I want to log in so I can access my personal task list.
3. As a user, I want to create a new task with a title, description, and deadline.
4. As a user, I want to edit an existing task to correct errors or update information.
5. As a user, I want to delete an existing task to remove completed or unnecessary tasks.
6. As a user, I want to be reminded of deadlines so I don't miss important tasks.
7. As a user, I want to mark a task as "completed" so I can track what I've done.
8. As a user, I want to search for a task by keyword.
