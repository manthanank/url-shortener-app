import {
  Component,
  OnInit,
  inject,
  OnDestroy,
  signal,
  computed,
  effect,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Contacts } from '../services/contacts';
import { Contact, ContactStatsResponse } from '../models/contact.model';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-admin-contacts',
  imports: [FormsModule],
  template: `
    <div
      class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200"
    >
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Contact Management
          </h1>
          <!-- Stats Cards -->
          @if (stats()) {
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Contacts
              </h3>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ stats()?.data?.total }}
              </p>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                New
              </h3>
              <p class="text-2xl font-bold text-blue-600">
                {{ stats()?.data?.byStatus?.new }}
              </p>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Read
              </h3>
              <p class="text-2xl font-bold text-yellow-600">
                {{ stats()?.data?.byStatus?.read }}
              </p>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Replied
              </h3>
              <p class="text-2xl font-bold text-green-600">
                {{ stats()?.data?.byStatus?.replied }}
              </p>
            </div>
          </div>
          }
          <!-- Filters -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                Filters
              </h3>
              @if (isFiltered()) {
              <button
                (click)="clearFilters()"
                class="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Clear Filters
              </button>
              }
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Status Filter</label
                >
                <select
                  [ngModel]="selectedStatus()"
                  (ngModelChange)="onStatusChange($event)"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Statuses</option>
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                </select>
              </div>
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Search</label
                >
                <input
                  type="text"
                  [ngModel]="searchTerm()"
                  (ngModelChange)="onSearchChange($event)"
                  placeholder="Search contacts..."
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Per Page</label
                >
                <select
                  [ngModel]="limit()"
                  (ngModelChange)="onLimitChange($event)"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <!-- Contacts Table -->
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
        >
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              Contacts ({{ contactsCount() }})
            </h3>
          </div>
          @if (loading()) {
          <div class="flex justify-center items-center p-8">
            <div class="flex items-center space-x-2">
              <div
                class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"
              ></div>
              <span class="text-gray-600 dark:text-gray-400"
                >Loading contacts...</span
              >
            </div>
          </div>
          } @else if (contacts().length === 0) {
          <div class="text-center p-8">
            <p class="text-gray-500 dark:text-gray-400">No contacts found</p>
          </div>
          } @else {
          <div class="overflow-x-auto">
            <table
              class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
            >
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Contact
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Message
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
              >
                @for (contact of contacts(); track trackByContactId($index,
                contact)) {
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div
                        class="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        {{ contact.name }}
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        {{ contact.email }}
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div
                      class="text-sm text-gray-900 dark:text-white max-w-xs truncate"
                    >
                      {{ contact.message }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      [class]="getStatusClass(contact.status)"
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    >
                      {{ contact.status }}
                    </span>
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                  >
                    {{ formatDate(contact.createdAt) }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2"
                  >
                    <button
                      (click)="viewContact(contact)"
                      class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      View
                    </button>
                    <button
                      (click)="deleteContact(contact._id)"
                      class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      [disabled]="deleting()"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                }
              </tbody>
            </table>
          </div>
          <!-- Pagination -->
          @if (pagination()) {
          <div
            class="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6"
          >
            <div class="flex-1 flex justify-between sm:hidden">
              <button
                (click)="previousPage()"
                [disabled]="pagination()?.current === 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                (click)="nextPage()"
                [disabled]="pagination()?.current === pagination()?.pages"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div
              class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
            >
              <div>
                <p class="text-sm text-gray-700 dark:text-gray-300">
                  Showing page
                  <span class="font-medium">{{ pagination()?.current }}</span>
                  of
                  <span class="font-medium">{{ pagination()?.pages }}</span> ({{
                    pagination()?.total
                  }}
                  total contacts)
                </p>
              </div>
              <div>
                <nav
                  class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                >
                  <button
                    (click)="previousPage()"
                    [disabled]="pagination()?.current === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                  >
                    <span class="sr-only">Previous</span>
                    ←
                  </button>
                  <button
                    (click)="nextPage()"
                    [disabled]="pagination()?.current === pagination()?.pages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                  >
                    <span class="sr-only">Next</span>
                    →
                  </button>
                </nav>
              </div>
            </div>
          </div>
          } }
        </div>
        <!-- Contact Detail Modal -->
        @if (selectedContact()) {
        <div
          class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
          (click)="closeModal()"
        >
          <div
            class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800"
            (click)="$event.stopPropagation()"
          >
            <div class="mt-3">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                  Contact Details
                </h3>
                <button
                  (click)="closeModal()"
                  class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <span class="sr-only">Close</span>
                  ✕
                </button>
              </div>

              <div class="space-y-4">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >Name</label
                  >
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ selectedContact()?.name }}
                  </p>
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >Email</label
                  >
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ selectedContact()?.email }}
                  </p>
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >Message</label
                  >
                  <p
                    class="mt-1 text-sm text-gray-900 dark:text-white whitespace-pre-wrap"
                  >
                    {{ selectedContact()?.message }}
                  </p>
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >Status</label
                  >
                  <select
                    [ngModel]="selectedContact()?.status"
                    (ngModelChange)="updateSelectedContactStatus($event)"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                  </select>
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >Admin Notes</label
                  >
                  <textarea
                    [ngModel]="selectedContact()?.adminNotes"
                    (ngModelChange)="updateSelectedContactNotes($event)"
                    rows="3"
                    placeholder="Add notes about this contact..."
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  ></textarea>
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >Submitted</label
                  >
                  <p class="mt-1 text-sm text-gray-900 dark:text-white">
                    {{ formatDate(selectedContact()?.createdAt || '') }}
                  </p>
                </div>
              </div>

              <div class="flex justify-end space-x-3 mt-6">
                <button
                  (click)="closeModal()"
                  class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  (click)="updateContact()"
                  [disabled]="updating()"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {{ updating() ? 'Updating...' : 'Update Contact' }}
                </button>
              </div>
            </div>
          </div>
        </div>
        }
      </div>
    </div>
  `,
  styles: [],
})
export class AdminContactsComponent implements OnInit, OnDestroy {
  private contactsService = inject(Contacts);
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();
  // Signals
  contacts = signal<Contact[]>([]);
  selectedContact = signal<Contact | null>(null);
  stats = signal<ContactStatsResponse | null>(null);
  pagination = signal<any>(null);

  // Filter signals
  selectedStatus = signal('');
  searchTerm = signal('');
  currentPage = signal(1);
  limit = signal(10);
  // Loading state signals
  loading = signal(false);
  updating = signal(false);
  deleting = signal(false);

  // Computed values
  contactsCount = computed(() => this.contacts().length);
  hasContacts = computed(() => this.contactsCount() > 0);
  isFiltered = computed(
    () => this.selectedStatus() !== '' || this.searchTerm() !== ''
  );

  constructor() {
    // Effect to log changes (optional - for debugging)
    effect(() => {
      console.log('Contacts updated:', this.contactsCount());
    });
  }
  ngOnInit() {
    // Setup search debouncing
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.currentPage.set(1); // Reset to first page on search
        this.loadContacts();
      });

    // Load initial data
    this.loadStats();
    this.loadContacts();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange(searchValue: string) {
    this.searchTerm.set(searchValue);
    this.searchSubject.next(searchValue);
  }

  loadStats() {
    this.contactsService.getContactStats().subscribe({
      next: (response) => {
        this.stats.set(response);
      },
      error: (error) => {
        console.error('Error loading contact stats:', error);
      },
    });
  }

  loadContacts() {
    // Prevent multiple simultaneous requests
    if (this.loading()) return;

    this.loading.set(true);
    this.contactsService
      .getAllContacts(
        this.currentPage(),
        this.limit(),
        this.selectedStatus() || undefined,
        this.searchTerm() || undefined
      )
      .subscribe({
        next: (response) => {
          this.contacts.set(response.data.contacts);
          this.pagination.set(response.data.pagination);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading contacts:', error);
          this.loading.set(false);
        },
      });
  }

  onStatusChange(status: string) {
    this.selectedStatus.set(status);
    this.currentPage.set(1); // Reset to first page on filter change
    this.loadContacts();
  }

  onLimitChange(limit: string) {
    this.limit.set(+limit);
    this.currentPage.set(1); // Reset to first page on limit change
    this.loadContacts();
  }
  viewContact(contact: Contact) {
    this.selectedContact.set({ ...contact });
  }

  closeModal() {
    this.selectedContact.set(null);
  }
  updateSelectedContactStatus(status: 'new' | 'read' | 'replied') {
    const current = this.selectedContact();
    if (current) {
      this.selectedContact.set({ ...current, status });
    }
  }
  updateSelectedContactNotes(notes: string) {
    const current = this.selectedContact();
    if (current) {
      this.selectedContact.set({ ...current, adminNotes: notes });
    }
  }

  clearFilters() {
    this.selectedStatus.set('');
    this.searchTerm.set('');
    this.currentPage.set(1);
    this.loadContacts();
  }

  updateContact() {
    const selected = this.selectedContact();
    if (!selected) return;

    this.updating.set(true);
    this.contactsService
      .updateContactStatus(selected._id, selected.status, selected.adminNotes)
      .subscribe({
        next: (response) => {
          // Update the contact in the list
          const currentContacts = this.contacts();
          const index = currentContacts.findIndex(
            (c) => c._id === selected._id
          );
          if (index !== -1) {
            const updatedContacts = [...currentContacts];
            updatedContacts[index] = response.data.contact;
            this.contacts.set(updatedContacts);
          }
          this.updating.set(false);
          this.closeModal();
          // Only refresh stats if status changed
          this.loadStats();
        },
        error: (error) => {
          console.error('Error updating contact:', error);
          this.updating.set(false);
        },
      });
  }

  deleteContact(id: string) {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    this.deleting.set(true);
    this.contactsService.deleteContact(id).subscribe({
      next: () => {
        const currentContacts = this.contacts();
        this.contacts.set(currentContacts.filter((c) => c._id !== id));
        this.deleting.set(false);
        // Only refresh stats after deletion
        this.loadStats();
        // If current page becomes empty and it's not page 1, go to previous page
        if (this.contacts().length === 0 && this.currentPage() > 1) {
          this.currentPage.update((page) => page - 1);
          this.loadContacts();
        }
      },
      error: (error) => {
        console.error('Error deleting contact:', error);
        this.deleting.set(false);
      },
    });
  }

  previousPage() {
    const current = this.currentPage();
    if (current > 1) {
      this.currentPage.set(current - 1);
      this.loadContacts();
    }
  }

  nextPage() {
    const current = this.currentPage();
    const totalPages = this.pagination()?.pages;
    if (current < totalPages) {
      this.currentPage.set(current + 1);
      this.loadContacts();
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'read':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'replied':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  }

  trackByContactId(index: number, contact: Contact): string {
    return contact._id;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
