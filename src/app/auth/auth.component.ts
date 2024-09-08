import { Component } from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {AuthService} from "../services/auth.service";
import {ConfigStorageService} from "../services/config-storage.service";
import { ToastrService } from 'ngx-toastr';
import {UserInterface} from "./user.interface";

@Component({
    selector: 'app-auth',
    standalone: true,
    imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, FormsModule, CommonModule],
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.scss'
})
export class AuthComponent {

    form = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
    });

    constructor(
      private router: Router,
      private fb: FormBuilder,
      private authService: AuthService,
      private configStorageService: ConfigStorageService,
      private toastr: ToastrService) {
    }

    login() {
        // @ts-ignore
        this.authService.login(this.form.getRawValue()).subscribe({
            next: res =>  this.success(res),
            error: error => this.toastr.error(error.error.message)
        });
    }

    success(res: {status: string, data: UserInterface, code: number}) {
        this.toastr.success('Successful Authorization');
        this.configStorageService.setToken(res.data.token);
        this.authService.currentUser.set(res.data);
        this.router.navigate(['/statements/dashboard']);
    }
}
