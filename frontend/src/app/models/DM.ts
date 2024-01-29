export interface DM {
    id: string;
    content: string;
    sender: string;
    receiver: string;
    createdAt: Date;
    updatedAt: Date;
    isEditing?: boolean;
    userProfilePicture: string;
    senderUsername: string;
    receiverUsername: string;
}
