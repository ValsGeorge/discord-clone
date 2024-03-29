import { Channels } from './channel';

export interface Category {
    id: string;
    name: string;
    channels: Channels[];
    server: string;
    created_at: string;
    updated_at: string;
    order: number;
}
