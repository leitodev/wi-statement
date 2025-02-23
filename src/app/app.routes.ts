import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {AuthComponent} from "./auth/auth.component";
import {DashboardComponent} from "./statements/dashboard/dashboard.component";
import {AuthGuard} from "./auth/auth.guard";
import {SuppliersComponent} from "./statements/suppliers/suppliers.component";

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
    canActivate: [AuthGuard],
    children: [
      { path: '',   redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'list', loadComponent: () => import("./statements/part-management/part-management.component")
          .then((m) => m.PartManagementComponent)
      },
      {
        path: 'suppliers', loadComponent: () => import("./statements/suppliers/suppliers.component").then((m) => m.SuppliersComponent)
      },
      { path: 'users',
        loadComponent: () => import("./users/users.component")
            .then((m) => m.UsersComponent)
      },
      { path: 'roles',
        loadComponent: () => import("./roles/roles.component")
            .then((m) => m.RolesComponent)
      },
    ]
  },
  { path: 'ui-kit',
    loadComponent: () => import("./ui-kit/ui-kit.component")
        .then((m) => m.UiKitComponent)
  },
];

