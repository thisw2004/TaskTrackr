/**
 * TaskHeader component that contains search functionality and tabs
 */
export class TaskHeader {
  private searchInput: HTMLInputElement;
  private clearButton: HTMLButtonElement | null = null;
  private tabsContainer: HTMLElement;
  private onSearchChange: (searchTerm: string) => void;
  private onTabChange: (tabType: 'all' | 'active' | 'completed') => void;
  
  /**
   * Initialize the TaskHeader component
   * 
   * @param containerSelector CSS selector for the container where the header will be placed
   * @param onSearch Callback function triggered when search term changes
   * @param onTabChange Callback function triggered when tab selection changes
   */
  constructor(
    containerSelector: string,
    onSearch: (searchTerm: string) => void,
    onTabChange: (tabType: 'all' | 'active' | 'completed') => void
  ) {
    const container = document.querySelector(containerSelector);
    if (!container) {
      throw new Error(`Container element with selector ${containerSelector} not found`);
    }
    
    this.onSearchChange = onSearch;
    this.onTabChange = onTabChange;
    
    // Create the main header container
    const headerContainer = document.createElement('div');
    headerContainer.className = 'task-header mb-6';
    
    // Add search bar
    const searchBar = this.createSearchBar();
    headerContainer.appendChild(searchBar);
    
    // Add tabs
    const tabs = this.createTabs();
    this.tabsContainer = tabs;
    headerContainer.appendChild(tabs);
    
    // Add the header to the page
    container.prepend(headerContainer);
    
    // Setup references to DOM elements
    this.searchInput = searchBar.querySelector('.search-input') as HTMLInputElement;
    this.clearButton = searchBar.querySelector('.clear-button');
    
    // Setup event listeners
    this.setupEventListeners();
  }
  
  /**
   * Create the search bar element
   */
  private createSearchBar(): HTMLElement {
    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'search-wrapper mb-4';
    searchWrapper.innerHTML = `
      <div class="flex items-center border rounded-md px-3 py-2 bg-white shadow-sm">
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
    
    return searchWrapper;
  }
  
  /**
   * Create the tabs element
   */
  private createTabs(): HTMLElement {
    const tabsWrapper = document.createElement('div');
    tabsWrapper.className = 'tabs-container';
    tabsWrapper.innerHTML = `
      <div class="flex rounded-md bg-gray-100">
        <button class="tab-button flex-1 py-3 px-4 text-center font-medium rounded-l-md bg-gray-200" data-tab="all">
          All Tasks
        </button>
        <button class="tab-button flex-1 py-3 px-4 text-center font-medium" data-tab="active">
          Active
        </button>
        <button class="tab-button flex-1 py-3 px-4 text-center font-medium rounded-r-md" data-tab="completed">
          Completed
        </button>
      </div>
    `;
    
    return tabsWrapper;
  }
  
  /**
   * Setup all event listeners for search and tabs
   */
  private setupEventListeners(): void {
    // Search input event
    this.searchInput.addEventListener('input', () => {
      const value = this.searchInput.value;
      this.toggleClearButton(value);
      this.onSearchChange(value);
    });
    
    // Clear button event
    if (this.clearButton) {
      this.clearButton.addEventListener('click', () => {
        this.searchInput.value = '';
        this.toggleClearButton('');
        this.onSearchChange('');
        this.searchInput.focus();
      });
    }
    
    // Tab buttons events
    const tabButtons = this.tabsContainer.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const clickedButton = e.currentTarget as HTMLElement;
        const tabType = clickedButton.dataset['tab'] as 'all' | 'active' | 'completed';
        
        // Update active tab styling
        tabButtons.forEach(btn => {
          btn.classList.remove('bg-gray-200');
        });
        clickedButton.classList.add('bg-gray-200');
        
        // Call the tab change callback
        this.onTabChange(tabType);
      });
    });
  }
  
  /**
   * Toggle clear button visibility based on search input value
   */
  private toggleClearButton(value: string): void {
    if (this.clearButton) {
      this.clearButton.style.display = value ? 'block' : 'none';
    }
  }
  
  /**
   * Get the current search term
   */
  public getSearchTerm(): string {
    return this.searchInput.value;
  }
  
  /**
   * Set the search term
   */
  public setSearchTerm(value: string): void {
    this.searchInput.value = value;
    this.toggleClearButton(value);
    this.onSearchChange(value);
  }
  
  /**
   * Set the active tab
   */
  public setActiveTab(tabType: 'all' | 'active' | 'completed'): void {
    const tabButtons = this.tabsContainer.querySelectorAll('.tab-button');
    tabButtons.forEach(btn => {
      const button = btn as HTMLElement;
      if (button.dataset['tab'] === tabType) {
        button.classList.add('bg-gray-200');
      } else {
        button.classList.remove('bg-gray-200');
      }
    });
  }
}
