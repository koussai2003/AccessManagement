import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faSyncAlt, faCubes, faPlusCircle, faEdit, faTable, 
  faPuzzlePiece, faTimes, faPlus, faSave, faTrashAlt,
  faCloudUploadAlt, faSearch
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-manage-applications',
  templateUrl: './manage-applications.component.html',
  styleUrls: ['./manage-applications.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule]
})
export class ManageApplicationsComponent {
  // Font Awesome Icons
  faSyncAlt = faSyncAlt;
  faCubes = faCubes;
  faPlusCircle = faPlusCircle;
  faEdit = faEdit;
  faTable = faTable;
  faPuzzlePiece = faPuzzlePiece;
  faTimes = faTimes;
  faPlus = faPlus;
  faSave = faSave;
  faTrashAlt = faTrashAlt;
  faCloudUploadAlt = faCloudUploadAlt;
  faSearch = faSearch;

  applications: any[] = [];
  filteredApplications: any[] = [];
  newApplication = { name: '', logoUrl: '' };
  editingApplication: any = null;
  selectedFile: File | null = null;
  editingSelectedFile: File | null = null;
  searchTerm: string = '';
  showModuleModal = false;
  selectedAppForModules: any = null;
  modules: any[] = [];

  constructor(private http: HttpClient) {
    this.loadApplications();
  }

  loadApplications() {
    this.http.get('http://localhost:5235/api/applications')
      .subscribe({
        next: (data: any) => { 
          this.applications = data;
          this.filteredApplications = [...this.applications];
        },
        error: (error) => { 
          console.error('Error loading applications:', error);
          // Add error notification here
        }
      });
  }

  filterApplications() {
    if (!this.searchTerm) {
      this.filteredApplications = [...this.applications];
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredApplications = this.applications.filter(app => 
      app.name.toLowerCase().includes(term) ||
      app.id.toString().includes(term)
    );
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onEditFileSelected(event: any) {
    this.editingSelectedFile = event.target.files[0];
  }

  addApplication() {
    if (!this.newApplication.name || !this.selectedFile) {
      // Add form validation notification
      return;
    }

    const formData = new FormData();
    formData.append('name', this.newApplication.name);

    if (this.selectedFile) {
      formData.append('logo', this.selectedFile, this.selectedFile.name);
    }

    this.http.post('http://localhost:5235/api/applications/upload', formData)
      .subscribe({
        next: () => {
          // Add success notification
          this.loadApplications();
          this.newApplication = { name: '', logoUrl: '' };
          this.selectedFile = null;
        },
        error: (error) => { 
          console.error('Error adding application:', error);
          // Add error notification
        }
      });
  }

  editApplication(app: any) {
    this.editingApplication = { ...app };
  }

  cancelEdit() {
    this.editingApplication = null;
    this.editingSelectedFile = null;
  }

  updateApplication() {
    if (!this.editingApplication.name) {
      // Add form validation notification
      return;
    }

    const formData = new FormData();
    formData.append('name', this.editingApplication.name);

    if (this.editingSelectedFile) {
      formData.append('logo', this.editingSelectedFile, this.editingSelectedFile.name);
    } else {
      formData.append('logoUrl', this.editingApplication.logoUrl);
    }

    this.http.put(`http://localhost:5235/api/applications/${this.editingApplication.id}`, formData)
      .subscribe({
        next: () => {
          // Add success notification
          this.loadApplications();
          this.cancelEdit();
        },
        error: (error) => { 
          console.error('Error updating application:', error);
          // Add error notification
        }
      });
  }

  deleteApplication(id: number) {
    if (confirm('Are you sure you want to delete this application?')) {
      this.http.delete(`http://localhost:5235/api/applications/${id}`)
        .subscribe({
          next: () => {
            // Add success notification
            this.loadApplications();
          },
          error: (error) => { 
            console.error('Error deleting application:', error);
            // Add error notification
          }
        });
    }
  }

  getImageUrl(url: string): string {
    if (!url) return '';
    if (!url.startsWith('http')) {
      return `http://localhost:5235${url}`;
    }
    return url;
  }

  openModulesModal(app: any) {
    this.selectedAppForModules = app;
    this.showModuleModal = true;
    this.http.get(`http://localhost:5235/api/modules/${app.id}`)
      .subscribe({
        next: (data: any) => {
          this.modules = data;
        },
        error: (err) => {
          console.error("Error loading modules", err);
          this.modules = [];
        }
      });
  }

  closeModuleModal() {
    this.selectedAppForModules = null;
    this.showModuleModal = false;
    this.modules = [];
  }

  addModule() {
    this.modules.push({
      name: '',
      functions: []
    });
  }

  deleteModule(index: number) {
    this.modules.splice(index, 1);
  }

  addFunction(moduleIndex: number) {
    this.modules[moduleIndex].functions.push({
      name: '',
      comment: '',
      options: {
        consultation: false,
        creation: false,
        modification: false,
        suppression: false,
        validation: false
      }
    });
  }

  deleteFunction(moduleIndex: number, functionIndex: number) {
    this.modules[moduleIndex].functions.splice(functionIndex, 1);
  }

  saveModules() {
    if (!this.selectedAppForModules?.id) return;

    this.http.post(`http://localhost:5235/api/modules/${this.selectedAppForModules.id}`, this.modules)
      .subscribe({
        next: () => {
          // Add success notification
          this.closeModuleModal();
        },
        error: (err) => {
          console.error("Error saving modules", err);
          // Add error notification
        }
      });
  }
}