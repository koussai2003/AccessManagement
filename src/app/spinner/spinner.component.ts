import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'],
  standalone: true, // Ensure this is set to true for standalone components
  imports: [CommonModule] // Include CommonModule in imports
})
export class SpinnerComponent { }
