export interface Message {
    id: string;
    content: string;
    userId: string;
    username: string;
    userProfilePicture: string;
    channelId: string;
    createdAt: Date;
    updatedAt: Date;
    isEditing?: boolean;
}
