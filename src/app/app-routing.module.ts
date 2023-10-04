import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UrlInputComponent } from './url-input/url-input.component';
import { UrlOutputComponent } from './url-output/url-output.component';

const routes: Routes = [
  { path: '', component: UrlInputComponent },
  { path: 'shortened', component: UrlOutputComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
