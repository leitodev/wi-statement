import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {AuthComponent} from "./auth/auth.component";
import {DashboardComponent} from "./statements/dashboard/dashboard.component";

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth', component: AuthComponent },
  //{ path: 'contacts', component: ContactsComponent },

  // lazy load standalone components
  { path: 'contacts',
    loadComponent: () => import("./contacts/contacts.component")
      .then((m) => m.ContactsComponent)
  },
  { path: 'statements',
    loadComponent: () => import("./statements/statements.component")
      .then((m) => m.StatementsComponent),
    children: [
      { path: '',   redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'list', loadComponent: () => import("./statements/part-management/part-management.component")
          .then((m) => m.PartManagementComponent)
      }
    ]
  }
];

