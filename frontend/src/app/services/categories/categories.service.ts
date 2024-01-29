import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from 'src/app/models/category';
import { BASE_URL } from 'src/app/config';

@Injectable({
    providedIn: 'root',
})
export class CategoriesService {
    baseUrl = `${BASE_URL}/categories`;
    constructor(private http: HttpClient) {}

    getCategories(serverId: string): Observable<any> {
        const url = `${this.baseUrl}/${serverId}`;
        const token = localStorage.getItem('token') as string;
        const headers = {
            'Content-Type': 'application/json',
            token: token,
        };
        return this.http.get(url, { withCredentials: true });
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
        return this.http.put(url, body, { withCredentials: true });
    }
}
