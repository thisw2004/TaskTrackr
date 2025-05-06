/**
 * Filters tasks based on a search term matching against title or description
 * @param tasks The array of tasks to filter
 * @param searchTerm The term to search for
 * @returns Filtered array of tasks
 */
export function filterTasksBySearchTerm<T extends { title: string; description?: string }>(
  tasks: T[],
  searchTerm: string
): T[] {
  if (!searchTerm.trim()) {
    return tasks;
  }
  
  const term = searchTerm.toLowerCase();
  
  return tasks.filter(task => 
    task.title.toLowerCase().includes(term) || 
    (task.description && task.description.toLowerCase().includes(term))
  );
}
