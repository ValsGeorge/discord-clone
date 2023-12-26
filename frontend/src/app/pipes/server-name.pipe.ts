import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'serverName',
})
export class ServerNamePipe implements PipeTransform {
    transform(serverName: string): string {
        const words = serverName.split(/[ ]/);

        const initials = words
            .filter((word) => word.length > 0)
            .map((word) => word[0].toUpperCase())
            .join('');

        return initials.slice(0, 3);
    }
}
