import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faTrash, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-user-columns-management',
  templateUrl: './user-columns-management.component.html',
  styleUrls: ['./user-columns-management.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule]
})
export class UserColumnsManagementComponent implements OnInit {
  // Font Awesome Icons
  faPlus = faPlus;
  faTrash = faTrash;
  faSave = faSave;
  faTimes = faTimes;

  columnTypes = [
    { value: 'fonction', label: 'Function' },
    { value: 'societe', label: 'Company' },
    { value: 'direction', label: 'Department' }
  ];

  selectedColumnType: string = 'fonction';
  newValue: string = '';
  values: string[] = [];
  isLoading: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadValues();
  }

  loadValues() {
    this.isLoading = true;
    this.http.get<string[]>(`http://localhost:5235/api/UserColumns/${this.selectedColumnType}`).subscribe({
      next: (data) => {
        this.values = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading values:', err);
        this.isLoading = false;
      }
    });
  }

  onColumnTypeChange() {
    this.loadValues();
  }

  addValue() {
    if (!this.newValue.trim()) return;

    const input = {
      columnType: this.selectedColumnType,
      value: this.newValue.trim()
    };

    this.http.post('http://localhost:5235/api/UserColumns', input).subscribe({
      next: () => {
        this.newValue = '';
        this.loadValues();
      },
      error: (err) => {
        console.error('Error adding value:', err);
      }
    });
  }

  deleteValue(value: string) {
    if (!confirm(`Are you sure you want to delete "${value}"?`)) return;

    // First find the ID of the value to delete
    this.http.get<any[]>(`http://localhost:5235/api/UserColumns/${this.selectedColumnType}`).subscribe({
      next: (userColumns) => {
        const itemToDelete = userColumns.find(uc => uc.value === value);
        if (itemToDelete) {
          this.http.delete(`http://localhost:5235/api/UserColumns/${itemToDelete.id}`).subscribe({
            next: () => {
              this.loadValues();
            },
            error: (err) => {
              console.error('Error deleting value:', err);
              if (err.status === 400) {
                alert(err.error); // Show the error message from the server
              }
            }
          });
        }
      },
      error: (err) => {
        console.error('Error finding value to delete:', err);
      }
    });
  }
}