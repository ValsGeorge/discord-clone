import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
    test_variable = '';
    test_url = `${environment.baseUrl}`;
    test_url2 = `${environment.production}`;
    constructor(private httpClient: HttpClient) {}
    ngOnInit(): void {}
}
