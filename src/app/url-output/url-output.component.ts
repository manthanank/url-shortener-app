import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-url-output',
  templateUrl: './url-output.component.html',
  styleUrls: ['./url-output.component.scss']
})
export class UrlOutputComponent {
  @Input() shortUrl: string = '';
}
