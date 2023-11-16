import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent {
    loginForm: FormGroup;

    constructor(private fb: FormBuilder, private authService: AuthService) {
        this.loginForm = this.fb.group({
            username: [''],
            password: [''],
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            const loginData = this.loginForm.value;
            this.authService.login(loginData).subscribe(
                (response) => {
                    console.log(response);
                },
                (error) => {
                    console.log(error);
                }
            );
        }
    }
}
