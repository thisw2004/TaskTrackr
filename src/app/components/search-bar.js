document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('task-search');
  const clearButton = document.getElementById('clear-search');

  if (searchInput && clearButton) {
    // Show/hide clear button based on input content
    searchInput.addEventListener('input', () => {
      const hasValue = searchInput.value.trim().length > 0;
      clearButton.classList.toggle('hidden', !hasValue);
      
      // Trigger search function
      searchTasks(searchInput.value);
    });

    // Clear search when button is clicked
    clearButton.addEventListener('click', () => {
      searchInput.value = '';
      clearButton.classList.add('hidden');
      searchInput.focus();
      
      // Reset search
      searchTasks('');
    });
  }
});

function searchTasks(searchTerm) {
  // Get all task elements
  const tasks = document.querySelectorAll('.task-item');
  const term = searchTerm.toLowerCase().trim();
  
  if (!term) {
    // Show all tasks if no search term
    tasks.forEach(task => {
      task.style.display = '';
    });
    return;
  }
  
  // Filter tasks based on search term
  tasks.forEach(task => {
    const title = task.querySelector('.task-title')?.textContent?.toLowerCase() || '';
    const description = task.querySelector('.task-description')?.textContent?.toLowerCase() || '';
    
    if (title.includes(term) || description.includes(term)) {
      task.style.display = '';
    } else {
      task.style.display = 'none';
    }
  });
}
