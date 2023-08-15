import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { AppRoutingModule } from './app-routing.module';

import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// ANGULAR MATERIAL
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule, MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { MatRadioModule, MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { ManagerComponent } from './components/pages/manager/manager.component';
import { HomeComponent } from './components/pages/home/home.component';
import { CreateObjectiveComponent } from './components/create-objective/create-objective.component';
import { ObjectiveFormComponent } from './components/objective-form/objective-form.component';
import { CycleSelectComponent } from './components/cycle-select/cycle-select.component';
import { UserSingleSelectComponent } from './components/user-single-select/user-single-select.component';
import { UserMultipleSelectComponent } from './components/user-multiple-select/user-multiple-select.component';
import { ObjectiveToAssociateComponent } from './components/objective-to-associate/objective-to-associate.component';
import { MessagesComponent } from './components/messages/messages.component';
import { ObjectiveListComponent } from './components/objective-list/objective-list.component';
import { IconCategoryPipe } from './pipes/icon-category.pipe';
import { ColorProgressPipe } from './pipes/color-progress.pipe';
import { QuarterPipe } from './pipes/quarter.pipe';
import { FiltersComponent } from './components/filters/filters.component';
import { ObjectiveListContentComponent } from './components/objective-list-content/objective-list-content.component';
import { EditObjectiveComponent } from './components/edit-objective/edit-objective.component';

registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PageHeaderComponent,
    ManagerComponent,
    HomeComponent,
    CreateObjectiveComponent,
    ObjectiveFormComponent,
    CycleSelectComponent,
    UserSingleSelectComponent,
    UserMultipleSelectComponent,
    ObjectiveToAssociateComponent,
    MessagesComponent,
    ObjectiveListComponent,
    IconCategoryPipe,
    ColorProgressPipe,
    QuarterPipe,
    FiltersComponent,
    ObjectiveListContentComponent,
    EditObjectiveComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatRadioModule,
    MatChipsModule,
    MatButtonToggleModule,
    MatSnackBarModule,
    MatDividerModule,
    MatTabsModule,
    MatListModule,
    MatTooltipModule,
    MatProgressBarModule
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline', subscriptSizing: 'dynamic' }
    },
    {
      provide: MAT_CHECKBOX_DEFAULT_OPTIONS,
      useValue: { color: 'primary' }
    },
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' }
    },
    {
      provide: LOCALE_ID,
      useValue: 'pt-BR'
    },
    QuarterPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
