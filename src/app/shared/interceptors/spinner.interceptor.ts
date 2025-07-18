import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { delay, finalize } from "rxjs";
import { HeroService } from "../../core/hero.service";
import { SpinnerService } from "../services/spinner.service";


export const spinnerInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next:
    HttpHandlerFn) => {
    let spinnerSvc = inject(SpinnerService);
    spinnerSvc.showLoadingBar();
    return next(req).pipe(
        // Simulo un retraso para mostrar el spinner
        delay(1700),
        finalize(() => {
            spinnerSvc.hideLoadingBar();
        })
    );
}