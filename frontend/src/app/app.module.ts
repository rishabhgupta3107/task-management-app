import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LogoutComponent } from './logout/logout.component';
import { ConfirmationDialogueComponent } from './confirmation-dialogue/confirmation-dialogue.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TaskCreateDialogComponent } from './task-create-dialog/task-create-dialog.component';
import { RegisterComponent } from './register/register.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ThemeToggleComponent } from './shared/theme-toggle.component';
import { AvatarComponent } from './shared/avatar.component';
import { CommandPaletteComponent } from './command-palette/command-palette.component';
import { ShellComponent } from './shell/shell.component';
import { FocusComponent } from './focus/focus.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { ProfileComponent } from './profile/profile.component';
import { TeamComponent } from './team/team.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { TitleStrategy } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { TemplatePageTitleStrategy } from './services/title-strategy.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    ConfirmationDialogueComponent,
    TaskDetailComponent,
    TaskListComponent,
    TaskCreateDialogComponent,
    WelcomeComponent,
    ThemeToggleComponent,
    AvatarComponent,
    CommandPaletteComponent,
    ShellComponent,
    FocusComponent,
    AnalyticsComponent,
    ProfileComponent,
    TeamComponent,
    NotFoundComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    DragDropModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true },
    // en-GB gives a DD/MM/YYYY datepicker input format.
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: TitleStrategy, useClass: TemplatePageTitleStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
