import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-statements',
  standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive, NgClass],
  templateUrl: './statements.component.html',
  styleUrl: './statements.component.scss'
})
export class StatementsComponent {
  authService = inject(AuthService);
  router = inject(Router);
  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
  isUserMenuOptionsActive: boolean = false;
  isUserMenuOptionsBeingUsed: boolean = false;
  userMenuClicked(){
    this.isUserMenuOptionsActive = !this.isUserMenuOptionsActive;
  }
  userMenuOptionsBeingUsedCheck(){
    const CURRENT_ROUTER_URL = this.router.url;
    if(CURRENT_ROUTER_URL == '/statements/users' || CURRENT_ROUTER_URL == '/statements/roles') {
      this.isUserMenuOptionsActive = true;
      this.isUserMenuOptionsBeingUsed = true;
    }
    this.router.events.subscribe(() => {
      const currentRoute = this.router.url;
      this.isUserMenuOptionsBeingUsed = currentRoute.includes('/users') || currentRoute.includes('/roles');
    });
  }
  ngOnInit(){
    this.userMenuOptionsBeingUsedCheck();
  }
}
