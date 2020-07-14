import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NgCoreModule } from 'projects/solcre-org/ng-core/src/public-api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
	BrowserModule,
	ReactiveFormsModule,
	NgCoreModule,
	RouterModule.forRoot([]),
	HttpClientModule,
	TranslateModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
