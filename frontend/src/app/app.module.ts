import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
import { ɵBrowserAnimationBuilder } from "@angular/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { config } from "rxjs";
import { JwtModule } from "@auth0/angular-jwt";
import { TaskListComponent } from "./components/task-list/task-list.component";
import { TaskDetailComponent } from "./components/task-detail/task-detail.component";
import { LoginComponent } from "./components/login/login.component";
import { AppRoutingModule } from "./app-routing.module";
import { AuthService } from "./auth.service";
import { TaskService } from "./services/task.service";
import { AuthGuard } from "./guards/auth.guard";
import { TokenInterceptorService } from "./services/token-interceptor.service";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';


export function jwtTokenGetter() {
    return localStorage.getItem('token');
}

@NgModule({
    declarations: [
        AppComponent,
        TaskListComponent,
        TaskDetailComponent,
        LoginComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatTableModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatIconModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: jwtTokenGetter,
                allowedDomains: ['localhost:8080'],
                disallowedRoutes: []
            }
        })
    ],
    providers: [
        AuthService,
        TaskService,
        AuthGuard,
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true }
    ],
    bootstrap: [AppComponent]
})

export class AppModule {}