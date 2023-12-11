export interface DM {
    id: string;
    content: string;
    senderId: string;
    receiverId: string;
    createdAt: Date;
    updatedAt: Date;
    isEditing?: boolean;
    userProfilePicture: string;
    senderUsername: string;
    receiverUsername: string;
}
