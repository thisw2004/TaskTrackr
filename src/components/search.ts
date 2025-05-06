/**
 * Vanilla TypeScript search component
 */
export class TaskSearch {
  private searchInput: HTMLInputElement;
  private clearButton: HTMLButtonElement | null = null;
  private searchCallback: (term: string) => void;
  
  /**
   * Creates a search component
   * @param containerId The ID of the container element where the search will be inserted
   * @param onSearch Callback that receives the search term when it changes
   */
  constructor(containerId: string, onSearch: (term: string) => void) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container element with ID ${containerId} not found`);
    }
    
    this.searchCallback = onSearch;
    
    // Create the search wrapper
    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'search-wrapper mb-4';
    searchWrapper.innerHTML = `
      <div class="flex items-center border rounded-md px-3 py-2 bg-white">
        <svg
          class="h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search tasks by title or description..."
          class="ml-2 outline-none w-full search-input"
        />
        <button class="text-gray-400 hover:text-gray-600 clear-button" style="display: none;">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    `;
    
    container.prepend(searchWrapper);
    
    // Initialize input and button references
    this.searchInput = searchWrapper.querySelector('.search-input') as HTMLInputElement;
    this.clearButton = searchWrapper.querySelector('.clear-button');
    
    // Add event listeners
    this.setupEventListeners();
  }
  
  private setupEventListeners(): void {
    this.searchInput.addEventListener('input', () => {
      const value = this.searchInput.value;
      this.toggleClearButton(value);
      this.searchCallback(value);
    });
    
    if (this.clearButton) {
      this.clearButton.addEventListener('click', () => {
        this.searchInput.value = '';
        this.toggleClearButton('');
        this.searchCallback('');
        this.searchInput.focus();
      });
    }
  }
  
  private toggleClearButton(value: string): void {
    if (this.clearButton) {
      this.clearButton.style.display = value ? 'block' : 'none';
    }
  }
  
  public getValue(): string {
    return this.searchInput.value;
  }
  
  public setValue(value: string): void {
    this.searchInput.value = value;
    this.toggleClearButton(value);
  }
  
  public clear(): void {
    this.setValue('');
    this.searchCallback('');
  }
}
