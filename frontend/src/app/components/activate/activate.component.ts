import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-activate',
    template: '<div></div>',
})
export class ActivateComponent {
    constructor(
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.activateAccount();
    }

    activateAccount(): void {
        const uidb64 = this.route.snapshot.paramMap.get('uidb64');
        const token = this.route.snapshot.paramMap.get('token');

        // Check if both uidb64 and token are not null
        if (uidb64 !== null && token !== null) {
            this.authService.activateAccount(uidb64, token).subscribe(
                (response) => {},
                (error) => {
                    console.log(error);
                }
            );
        } else {
            console.error('Invalid activation link: uidb64 or token is null');
        }
    }
}
