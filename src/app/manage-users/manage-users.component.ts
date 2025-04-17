import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ManageUsersComponent {
  users: any[] = [];
  loggedInUserId: number | null = null;
  allUserEmails: string[] = [];
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

  constructor(private http: HttpClient) {
    this.loggedInUserId = Number(localStorage.getItem('userId'));
    this.loadUsers(); // ✅ Fetch users when component loads
  }
  ngOnInit() {
    this.loadUsers();
    this.fetchAllUserEmails();
  }

  loadUsers() {
    this.http.get('http://localhost:5235/api/admin/users').subscribe({
      next: (data: any) => { this.users = data; },
      error: (error) => { console.error("Error loading users:", error); }
    });
  }

  addUser() {
    if (!this.newUser.name || !this.newUser.email || !this.newUser.password || !this.newUser.lastName || !this.newUser.fonction || !this.newUser.societe || !this.newUser.direction || !this.newUser.validateur1 ) {
      alert("Please fill all fields.");
      return;
    }
    this.http.post('http://localhost:5235/api/admin/add-user', this.newUser).subscribe({
      next: () => {
        alert("User added successfully!");
        this.loadUsers();
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
        
      },
      error: (error) => { console.error("Error adding user:", error); }
    });
  }
  fetchAllUserEmails() {
    this.http.get<any[]>('http://localhost:5235/api/admin/users').subscribe({
      next: (users) => {
        this.allUserEmails = users.map(u => u.email.toLowerCase());
      },
      error: (err) => console.error('Error fetching user emails:', err)
    });
  }
  
  isValidNewValidateur1(): boolean {
    return this.allUserEmails.includes(this.newUser.validateur1.toLowerCase());
  }
  
  isValidEditValidateur1(): boolean {
    if (!this.editingUser || !this.editingUser.validateur1) return false;
    return this.allUserEmails.includes(this.editingUser.validateur1.toLowerCase());
  }
  deleteUser(userId: number) {
    this.http.delete(`http://localhost:5235/api/admin/delete/${userId}`).subscribe(() => {
      this.users = this.users.filter(user => user.id !== userId);
    });
  }

  editUser(user: any) {
    this.editingUser = { ...user, password: '' }; // ✅ Show edit form
  }

  cancelEdit() {
    this.editingUser = null; // ✅ Hide edit form
  }

  updateUser() {
    if (!this.editingUser.name || !this.editingUser.email) {
      alert("Name and Email are required.");
      return;
    }

    this.http.put(`http://localhost:5235/api/admin/update-user/${this.editingUser.id}`, this.editingUser).subscribe({
      next: () => {
        alert("User updated successfully!");
        this.loadUsers();
        this.editingUser = null;
      },
      error: (error) => { console.error("Error updating user:", error); }
    });
  }
}
