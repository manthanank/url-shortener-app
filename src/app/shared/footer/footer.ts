import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  currentYear = new Date().getFullYear();

  @Input() visitorCount: number = 0;
  @Input() isVisitorCountLoading: boolean = false;
  @Input() visitorCountError: string | null = null;
}
