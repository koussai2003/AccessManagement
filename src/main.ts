import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient , withInterceptors } from '@angular/common/http';
import { userValidationInterceptor } from './app/interceptors/user-validation.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Provide your routes
    provideHttpClient(withInterceptors([userValidationInterceptor])) // Provide HttpClient in the main.ts
  ]
});
