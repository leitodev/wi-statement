import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {inject} from "@angular/core";
import {catchError, map, of} from "rxjs";
import {ToastrService} from "ngx-toastr";

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  return authService.checkToken().pipe(
    map(res => {
      authService.currentUser.set(res.data)
      return true
    }),
    catchError((error) => {
      toastr.error(error.error.message)
      router.navigate(['/auth']);
      return of(false);
    })
  );
};
