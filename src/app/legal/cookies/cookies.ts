import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cookies',
  imports: [RouterLink],
  templateUrl: './cookies.html',
  styleUrl: './cookies.css'
})
export class Cookies {
  lastUpdated = 'June 14, 2025';
}
