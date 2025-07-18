import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class SpinnerService {
    readonly _showLoadingBar = signal<boolean>(false);

    showLoadingBar() {
        this._showLoadingBar.set(true);
    }

    hideLoadingBar() {
        this._showLoadingBar.set(false);
    }

}