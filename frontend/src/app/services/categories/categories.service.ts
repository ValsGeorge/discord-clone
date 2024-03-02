import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { Category } from 'src/app/models/category';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CategoriesService {
    baseUrl = `${environment.baseUrl}/categories`;
    constructor(private http: HttpClient) {}

    categories: Category[] = [];

    getCategories(serverId: string): Observable<any> {
        const url = `${this.baseUrl}/${serverId}`;

        // check if the categories already has the serverId
        const index = this.categories.findIndex(
            (category) => category.id === serverId
        );
        if (index !== -1) {
            return new Observable((observer) => {
                observer.next(this.categories[index]);
                observer.complete();
            });
        }
        return this.http.get<Category[]>(url, { withCredentials: true }).pipe(
            tap((response: Category[]) => {
                // check if the categories already has the serverId
                const index = this.categories.findIndex(
                    (category) => category.server === serverId
                );
                if (index === -1) {
                    response.forEach((category) => {
                        this.categories.push(category);
                    });
                }
                return response;
            }),
            catchError((error) => {
                throw error;
            })
        );
    }

    updateCategoriesOrder(categories: Category[]): Observable<any> {
        const url = `${this.baseUrl}/update-order`;

        return this.http.post(url, categories, { withCredentials: true });
    }

    editCategory(categoryId: string, category: Category): Observable<any> {
        const url = `${this.baseUrl}/${categoryId}`;

        return this.http.put(url, category, { withCredentials: true });
    }
}
