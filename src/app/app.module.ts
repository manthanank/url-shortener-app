import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UrlInputComponent } from './url-input/url-input.component';
import { UrlOutputComponent } from './url-output/url-output.component';
import { FormsModule } from '@angular/forms';
import { UrlShortenerService } from './shared/url-shortener.service';

@NgModule({
  declarations: [
    AppComponent,
    UrlInputComponent,
    UrlOutputComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [UrlShortenerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
