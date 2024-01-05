export interface User {
    id: string;
    nickname: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    profilePicture: string;
    serverIds?: string[];
}
