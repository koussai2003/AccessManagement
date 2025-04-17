import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-applications',
  templateUrl: './manage-applications.component.html',
  styleUrls: ['./manage-applications.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ManageApplicationsComponent {
  applications: any[] = [];
  newApplication = { name: '', logoUrl: '' };
  editingApplication: any = null;
  selectedFile: File | null = null;
  editingSelectedFile: File | null = null;
  selectedApplication: any = null;
  showModuleModal = false;
  selectedAppForModules: any = null;
  modules: any[] = [];
  constructor(private http: HttpClient) {
    this.loadApplications();
  }

  loadApplications() {
    this.http.get('http://localhost:5235/api/applications')
      .subscribe({
        next: (data: any) => { this.applications = data; },
        error: (error) => { console.error('Error loading applications:', error); }
      });
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  addApplication() {
    if (!this.newApplication.name || !this.selectedFile) {
      alert('Please provide both name and logo URL.');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.newApplication.name);

    if (this.selectedFile) { // ✅ Ensure `selectedFile` is not null
      formData.append('logo', this.selectedFile, this.selectedFile.name);
    }

    this.http.post('http://localhost:5235/api/applications/upload', formData).subscribe({
      next: () => {
        alert('Application added successfully!');
        this.loadApplications();
        this.newApplication = { name: '', logoUrl: '' };
        this.selectedFile = null;
      },
      error: (error) => { console.error('Error adding application:', error); }
    });
  }
  onEditFileSelected(event: any) {
    this.editingSelectedFile = event.target.files[0];
  }  
  editApplication(app: any) {
    console.log("Editing application:", app);
    this.editingApplication = { ...app };
  }
  getImageUrl(url: string): string {
    if (!url.startsWith('http')) {
      return `http://localhost:5235${url}`; // ✅ Prepend backend URL if needed
    }
    return url;
  }
  updateApplication() {
    if (!this.editingApplication.name) {
      alert('Please provide an application name.');
      return;
    }
  
    const formData = new FormData();
    formData.append('name', this.editingApplication.name);
  
    // Check if a new file was selected
    if (this.editingSelectedFile) {
      formData.append('logo', this.editingSelectedFile, this.editingSelectedFile.name);
    } else {
      formData.append('logoUrl', this.editingApplication.logoUrl); // Keep old logo if no new file selected
    }
  
    this.http.put(`http://localhost:5235/api/applications/${this.editingApplication.id}`, formData)
      .subscribe({
        next: () => {
          alert('Application updated successfully!');
          this.loadApplications();
          this.editingApplication = null;
          this.editingSelectedFile = null;
        },
        error: (error) => { console.error('Error updating application:', error); }
      });
  }
  openModulesModal(app: any) {
    this.selectedAppForModules = app;
    this.showModuleModal = true;
    this.http.get(`http://localhost:5235/api/modules/${app.id}`).subscribe({
      next: (data: any) => {
        this.modules = data;
      },
      error: (err) => {
        console.error("Error loading modules", err);
        this.modules = []; // fallback
      }
    });
  }
  
  closeModuleModal() {
    this.selectedAppForModules = null;
    this.showModuleModal = false;
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
  saveModules() {
    if (!this.selectedAppForModules?.id) return;
  
    this.http.post(`http://localhost:5235/api/modules/${this.selectedAppForModules.id}`, this.modules)
      .subscribe({
        next: () => {
          alert("Modules saved successfully!");
          this.closeModuleModal();
        },
        error: (err) => {
          console.error("Error saving modules", err);
        }
      });
  }
  
  
  deleteFunction(moduleIndex: number, functionIndex: number) {
    this.modules[moduleIndex].functions.splice(functionIndex, 1);
  }
  deleteApplication(id: number) {
    if (!confirm('Are you sure you want to delete this application?')) return;

    this.http.delete(`http://localhost:5235/api/applications/${id}`)
      .subscribe({
        next: () => {
          alert('Application deleted successfully!');
          this.loadApplications();
        },
        error: (error) => { console.error('Error deleting application:', error); }
      });
  }
}
