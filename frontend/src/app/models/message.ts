export interface Message {
    id: string;
    content: string;
    user: string;
    username: string;
    userProfilePicture: string;
    channelId: string;
    createdAt: Date;
    updatedAt: Date;
    isEditing?: boolean;
}
