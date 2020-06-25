import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule } from '@ngx-translate/core';

import { PagerComponent } from './api/pager/pager.component';
import { TableComponent } from './panel/table/table.component';
import { SimplePanelComponent } from './panel/simple-panel/simple-panel.component';
import { DialogComponent } from './panel/dialog/dialog.component';
import { LoaderComponent } from './structure/loader/loader.component';
import { ModalComponent } from './panel/modal/modal.component';
import { InputHolderComponent } from './forms/input-holder/input-holder.component';
import { PlaceholderComponent } from './panel/placeholder/placeholder.component';
import { HeaderComponent } from './structure/header/header.component';
import { NavbarComponent } from './structure/navbar/navbar.component';
import { CanEnterPipe } from './structure/navbar/can-enter.pipe';
import { ToastsComponent } from './structure/toasts/toasts.component';
import { FilterPipe } from './panel/filter/fiter.pipe';
import { ViewportDirective } from './structure/viewport/viewport.directive';
import { CountriesSelectComponent } from './forms/countries-select/countries-select.component';
import { TimezonesSelectComponent } from './forms/timezones-select/timezones-select.component';
import { SelectComponent } from './forms/select/select.component';
import { CountryNamePipe } from './others/countries/country-name/country-name.pipe';
import { BreadcrumbsComponent } from './panel/breadcrumbs/breadcrumbs.component';
import { TopbarComponent } from './panel/topbar/topbar.component';
import { InputFileComponent } from './forms/input-file/input-file.component';
import { InputUrlComponent } from './forms/input-url/input-url.component';

@NgModule({
    declarations: [
        FilterPipe,
        PagerComponent,
        TableComponent,
        SimplePanelComponent,
        ModalComponent,
        InputHolderComponent,
        LoaderComponent,
        DialogComponent,
		PlaceholderComponent,
		HeaderComponent,
		NavbarComponent,
		CanEnterPipe,
		ToastsComponent,
		ViewportDirective,
		CountriesSelectComponent,
		TimezonesSelectComponent,
		SelectComponent,
		CountryNamePipe,
		BreadcrumbsComponent,
		TopbarComponent,
		InputFileComponent,
		InputUrlComponent
    ],
    imports: [
        TranslateModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
    ],
    exports: [
        FilterPipe,
        PagerComponent,
        TableComponent,
        SimplePanelComponent,
        ModalComponent,
        InputHolderComponent,
        LoaderComponent,
        DialogComponent,
		PlaceholderComponent,
		HeaderComponent,
		NavbarComponent,
		CanEnterPipe,
		ToastsComponent,
		ViewportDirective,
		CountriesSelectComponent,
		TimezonesSelectComponent,
		SelectComponent,
		CountryNamePipe,
		BreadcrumbsComponent,
		TopbarComponent,
		InputFileComponent,
		InputUrlComponent
    ],
    providers: []
})
export class NgCoreModule {

}

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}