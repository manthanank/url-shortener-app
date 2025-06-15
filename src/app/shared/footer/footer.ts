import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  currentYear = new Date().getFullYear();

  visitorCount = input<number>(0);
  isVisitorCountLoading = input<boolean>(false);
  visitorCountError = input<string | null>(null);
}
