import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
    registrationForm: FormGroup;
    user: User | undefined;

    constructor(private fb: FormBuilder, private authService: AuthService) {
        this.registrationForm = this.fb.group({
            nickname: [''],
            username: [''],
            email: [''],
            password: [''],
            confirmPassword: [''],
        });
    }

    onSubmit() {
        console.log(this.registrationForm?.value);
        if (this.registrationForm.valid) {
            const registrationFormData = this.registrationForm.value;
            this.user = {
                id: '',
                nickname: registrationFormData.nickname,
                username: registrationFormData.username,
                email: registrationFormData.email,
                password: registrationFormData.password,
                confirmPassword: registrationFormData.confirmPassword,
                profilePicture: '',
            };

            this.authService.register(this.user).subscribe(
                (response: any) => {
                    console.log(response);
                },
                (error: any) => {
                    console.log(error);
                }
            );
        }
    }
}
