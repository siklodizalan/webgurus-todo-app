export interface UserData {
    _id: string;
    name: string;
    email: string;
    profileImageUrl: string;
}

export interface LoginResponse {
    userData: UserData,
    token: string,
}
