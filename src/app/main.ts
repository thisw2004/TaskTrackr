import { TaskHeader } from './components/task-tabs/task-header';
import { filterTasksBySearchTerm } from '../utils/searchUtils';

// Task data
let allTasks = [
  { id: 1, title: 'Complete project', description: 'Finish the TaskTrackr project', completed: false },
  { id: 2, title: 'Study for exam', description: 'Review Advanced Programming materials', completed: true },
  // ... more tasks
];

let currentFilter: 'all' | 'active' | 'completed' = 'all';
let currentSearchTerm = '';

// Function to filter and render tasks
function filterAndRenderTasks() {
  // First apply search filter
  let filteredTasks = filterTasksBySearchTerm(allTasks, currentSearchTerm);
  
  // Then apply tab filter
  if (currentFilter !== 'all') {
    filteredTasks = filteredTasks.filter(task => 
      currentFilter === 'completed' ? task.completed : !task.completed
    );
  }
  
  renderTasks(filteredTasks);
}

// Function to render tasks
function renderTasks(tasks: any[]) {
  const taskListElement = document.getElementById('task-list');
  if (!taskListElement) return;
  
  taskListElement.innerHTML = '';
  
  if (tasks.length === 0) {
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'text-center py-4 text-gray-500';
    emptyMessage.textContent = 'No tasks found';
    taskListElement.appendChild(emptyMessage);
    return;
  }
  
  tasks.forEach(task => {
    // Create task element and append to task list
    const taskElement = createTaskElement(task);
    taskListElement.appendChild(taskElement);
  });
}

// Function to create a task element
function createTaskElement(task: any): HTMLElement {
  // Implementation of task rendering...
  const taskElement = document.createElement('div');
  // Set task element content
  taskElement.className = 'task-item p-3 border-b';
  taskElement.innerHTML = `
    <div class="flex items-center">
      <input type="checkbox" ${task.completed ? 'checked' : ''} class="mr-3">
      <div class="${task.completed ? 'line-through text-gray-500' : ''}">
        <h3 class="font-medium">${task.title}</h3>
        <p class="text-sm">${task.description}</p>
      </div>
    </div>
  `;
  return taskElement;
}

// Initialize the TaskHeader component
document.addEventListener('DOMContentLoaded', () => {
  new TaskHeader(
    '#app-container', // Replace with your app's container selector
    (searchTerm) => {
      // Search callback
      currentSearchTerm = searchTerm;
      filterAndRenderTasks();
    },
    (tabType) => {
      // Tab change callback
      currentFilter = tabType;
      filterAndRenderTasks();
    }
  );
  
  // Initial rendering
  fetchTasks(); // Fetch tasks on page load
});

// For applications using data fetching
async function fetchTasks() {
  try {
    const response = await fetch('/api/tasks');
    allTasks = await response.json();
    filterAndRenderTasks();
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
  }
}
