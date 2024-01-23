import { AuthService } from 'src/app/services/auth.service';
import {
    Component,
    ElementRef,
    HostListener,
    OnInit,
    Renderer2,
    ViewChild,
} from '@angular/core';
import {
    trigger,
    transition,
    style,
    animate,
    state,
    keyframes,
} from '@angular/animations';
import { User } from '../../models/user';
import { OpenUserInfoDetailsComponent } from '../popups/open-user-info-details/open-user-info-details.component';

@Component({
    selector: 'app-user-info',
    templateUrl: './user-info.component.html',
    styleUrls: ['./user-info.component.css'],
    animations: [
        trigger('rollText', [
            state('initial', style({ transform: 'translateY(0)' })),
            state('rolled', style({ transform: 'translateY(-100%)' })),
            transition('initial => rolled', animate('150ms ease-in')),
            transition('rolled => initial', animate('150ms ease-out')),
        ]),
    ],
})
export class UserInfoComponent implements OnInit {
    @ViewChild(OpenUserInfoDetailsComponent)
    openUserInfoDetails!: OpenUserInfoDetailsComponent;
    position: any = { top: 0, left: 0 };
    bottomOffset: number = 50;

    @HostListener('document:click', ['$event'])
    onClickOutside(event: Event) {
        if (
            this.showDetails &&
            !this.elementRef.nativeElement.contains(event.target)
        ) {
            this.closeDetails();
        }
    }
    constructor(
        private authService: AuthService,
        private elementRef: ElementRef,
        private renderer: Renderer2
    ) {}

    user: User = {
        id: '0',
        nickname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        profilePicture: '',
    };
    ngOnInit(): void {
        this.getUserInfo();
    }

    getUserInfo() {
        this.authService.getUser().subscribe(
            (response: User) => {
                this.user = response;
                this.user.profilePicture =
                    this.authService.getProfilePictureUrl(this.user.id);
            },
            (error: any) => {
                console.log(error);
            }
        );
    }

    rollTextState = 'initial';

    onMouseEnter() {
        this.rollTextState = 'rolled';
    }

    onMouseLeave() {
        this.rollTextState = 'initial';
    }

    showDetails = false;

    openDetails(event: MouseEvent) {
        console.log('open details');
        this.showDetails = !this.showDetails;

        const clickedElement = event.currentTarget as HTMLElement;
        const rect = clickedElement.getBoundingClientRect();

        const scrollY = window.scrollY - 450 || window.pageYOffset;
        const scrollX = window.scrollX - 30 || window.pageXOffset;
        this.position = {
            top: rect.top + scrollY - 0, // Adjust as needed
            left: rect.left + scrollX + 0, // Adjust as needed
        };
    }

    closeDetails() {
        this.showDetails = false;
    }
}
