import { Channels } from './channel';

export interface Category {
    id: string;
    name: string;
    channels: Channels[];
    created_at: string;
    updated_at: string;
}
