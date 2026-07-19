import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { LoginComponent  } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { StackComponent } from './pages/stack/stack.component';
import { QueueComponent } from './pages/queue/queue.component';
import { ArrayCrudComponent } from './pages/array-crud/array-crud.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },  // Default route (Home Page)
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'stack', component: StackComponent },
  { path: 'queue', component: QueueComponent },
  { path: 'array-crud', component: ArrayCrudComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }  // Redirect invalid routes to Home
];
