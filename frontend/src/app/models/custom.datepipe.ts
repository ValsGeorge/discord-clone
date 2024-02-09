import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'customDate',
})
export class CustomDatePipe extends DatePipe implements PipeTransform {
    override transform(value: any, args?: any): any {
        const dateValue = value instanceof Date ? value : new Date(value);

        if (args === 'onlyDate') {
            // dd MMMM, yyyy
            return super.transform(dateValue, 'dd MMMM, yyyy');
        } else {
            if (this.isDateFromYesterday(dateValue)) {
                const timePart = super.transform(dateValue, 'hh:mm a');
                return `Yesterday, ${timePart}`;
            }
            if (this.isDateFromToday(dateValue)) {
                const timePart = super.transform(dateValue, 'hh:mm a');
                return `Today, ${timePart}`;
            } else {
                return super.transform(dateValue, 'dd/MM/yyyy hh:mm a');
            }
        }
    }

    private isDateFromYesterday(date: Date): boolean {
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);

        return (
            date.getDate() === yesterday.getDate() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getFullYear() === yesterday.getFullYear()
        );
    }

    private isDateFromToday(date: Date): boolean {
        const now = new Date();

        return (
            date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()
        );
    }
}
