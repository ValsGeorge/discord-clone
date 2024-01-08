import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from 'src/app/models/category';

@Injectable({
    providedIn: 'root',
})
export class CategoriesService {
    baseUrl = 'http://localhost:8000/categories';
    constructor(private http: HttpClient) {}

    getCategories(serverId: string): Observable<any> {
        const url = `${this.baseUrl}/${serverId}`;
        const token = localStorage.getItem('token') as string;
        const headers = {
            'Content-Type': 'application/json',
            token: token,
        };
        return this.http.get(url, { headers });
    }

    updateCategoriesOrder(categories: Category[]): Observable<any> {
        const url = `${this.baseUrl}/update-order`;
        const token = localStorage.getItem('token') as string;
        const headers = {
            'Content-Type': 'application/json',
            token: token,
        };

        const body = {
            categories: categories,
        };
        return this.http.put(url, body, { headers });
    }
}
