import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { SolcreAuthModule } from 'ng-solcre-auth';

import { FilterPipe } from './fiter.pipe';
import { ApiService } from './api/api.service';
import { PagerComponent } from './api/pager/pager.component';
import { TableComponent } from './table/table.component';
import { SimplePanelComponent } from './panel/simple-panel/simple-panel.component';
import { DialogComponent } from './panel/dialog/dialog.component';
import { DialogService } from './panel/dialog/dialog.service';
import { LoaderComponent } from './loader/loader.component';
import { LoaderService } from './loader/loader.service';
import { ModalComponent } from './panel/modal/modal.component';
import { InputHolderComponent } from './input-holder/input-holder.component';
import { PlaceholderComponent } from './panel/placeholder/placeholder.component';

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
    ],
    imports: [
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        SolcreAuthModule
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
        PlaceholderComponent
    ],
    providers: [
        ApiService,
        DialogService,
        LoaderService
    ]

})
export class NgCoreModule {

}

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}