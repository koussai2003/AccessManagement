import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash, faEdit, faTrashAlt, faPlus, faSave, faTimes, faSyncAlt, faSearch, faUsers, faUserPlus, faUsersCog, faUserEdit } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule]
})
export class ManageUsersComponent implements OnInit {
  // Font Awesome Icons
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;
  faSave = faSave;
  faTimes = faTimes;
  faSyncAlt = faSyncAlt;
  faSearch = faSearch;
  faUsers = faUsers;
  faUserPlus = faUserPlus;
  faUsersCog = faUsersCog;
  faUserEdit = faUserEdit;

  users: any[] = [];
  filteredUsers: any[] = [];
  loggedInUserId: number | null = null;
  allUserEmails: string[] = [];
  searchTerm: string = '';
  
  societes: string[] = [
    'ADWYA',
    'NEROLIA',
    'IKONIA',
    'IKEL',
    'AGORA DJERBA',
    'PROTIS',
    'L ATELIER INNOVATION',
    'CIPHARM',
    'CINPHARM',
    'L ATELIER',
    'LA BOÎTE',
    'FATALES',
    'MEDICIS',
    'PROCHIDIA',
    'TERIAK',
    'ARGANIA',
    'KIPROPHA',
    'EKTP'
  ];
  
  newUser = {
    name: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user',
    fonction: '',
    societe: '',
    direction: '',
    statut: 'actif',
    validateur1: '',
    validateur2: '',
    validateur3: ''
  };
  
  editingUser: any = null;
  passwordFieldTypes: { [key: string]: string } = {
    newPassword: 'password',
    editPassword: 'password'
  };

  constructor(private http: HttpClient) {
    this.loggedInUserId = Number(localStorage.getItem('userId'));
  }

  ngOnInit() {
    this.loadUsers();
    this.fetchAllUserEmails();
  }

  loadUsers() {
    this.http.get('http://localhost:5235/api/admin/users').subscribe({
      next: (data: any) => { 
        this.users = data;
        this.filteredUsers = [...this.users];
      },
      error: (error) => { 
        console.error("Error loading users:", error);
        // Add error notification here
      }
    });
  }

  fetchAllUserEmails() {
    this.http.get<any[]>('http://localhost:5235/api/admin/users').subscribe({
      next: (users) => {
        this.allUserEmails = users.map(u => u.email.toLowerCase());
      },
      error: (err) => {
        console.error('Error fetching user emails:', err);
        // Add error notification here
      }
    });
  }

  filterUsers() {
    if (!this.searchTerm) {
      this.filteredUsers = [...this.users];
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user => 
      user.name.toLowerCase().includes(term) ||
      user.lastName.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.societe.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term)
    );
  }

  isValidNewUser(): boolean {
    return (
      !!this.newUser.name &&
      !!this.newUser.lastName &&
      !!this.newUser.email &&
      !!this.newUser.password &&
      !!this.newUser.fonction &&
      !!this.newUser.societe &&
      !!this.newUser.direction &&
      !!this.newUser.validateur1 &&
      this.isValidNewValidateur1()
    );
  }

  isValidNewValidateur1(): boolean {
    if (!this.newUser.validateur1) return false;
    return this.allUserEmails.includes(this.newUser.validateur1.toLowerCase());
  }

  isValidEditValidateur1(): boolean {
    if (!this.editingUser?.validateur1) return false;
    return this.allUserEmails.includes(this.editingUser.validateur1.toLowerCase());
  }

  isValidEditUser(): boolean {
    return (
      !!this.editingUser?.name &&
      !!this.editingUser?.lastName &&
      !!this.editingUser?.email &&
      !!this.editingUser?.fonction &&
      !!this.editingUser?.societe &&
      !!this.editingUser?.direction &&
      !!this.editingUser?.validateur1 &&
      this.isValidEditValidateur1()
    );
  }

  togglePasswordVisibility(field: string) {
    this.passwordFieldTypes[field] = this.passwordFieldTypes[field] === 'password' ? 'text' : 'password';
  }

  addUser() {
    if (!this.isValidNewUser()) {
      // Add form validation notification
      return;
    }

    this.http.post('http://localhost:5235/api/admin/add-user', this.newUser).subscribe({
      next: () => {
        // Add success notification
        this.loadUsers();
        this.resetNewUserForm();
      },
      error: (error) => {
        console.error("Error adding user:", error);
        // Add error notification
      }
    });
  }

  resetNewUserForm() {
    this.newUser = {
      name: '',
      lastName: '',
      email: '',
      password: '',
      role: 'user',
      fonction: '',
      societe: '',
      direction: '',
      statut: 'actif',
      validateur1: '',
      validateur2: '',
      validateur3: ''
    };
    this.passwordFieldTypes['newPassword'] = 'password';
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.http.delete(`http://localhost:5235/api/admin/delete/${userId}`).subscribe({
        next: () => {
          // Add success notification
          this.loadUsers();
        },
        error: (error) => {
          console.error("Error deleting user:", error);
          // Add error notification
        }
      });
    }
  }

  editUser(user: any) {
    this.editingUser = { ...user, password: '' };
  }

  cancelEdit() {
    this.editingUser = null;
    this.passwordFieldTypes['editPassword'] = 'password';
  }

  updateUser() {
    if (!this.isValidEditUser()) {
      // Add form validation notification
      return;
    }

    this.http.put(`http://localhost:5235/api/admin/update-user/${this.editingUser.id}`, this.editingUser).subscribe({
      next: () => {
        // Add success notification
        this.loadUsers();
        this.cancelEdit();
      },
      error: (error) => {
        console.error("Error updating user:", error);
        // Add error notification
      }
    });
  }
}