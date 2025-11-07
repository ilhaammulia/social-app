export interface Post {
    id: string;
    body: string;
    userId: string;
    reactions: {
        likes: number;
        comments?: number;
    }
    mediaUrl?: string;
    isLiked?: boolean;
    createdAt?: Date;
}

export interface PostWithUser extends Post {
    author: User;
}

export interface User {
    id: string;
    username: string;
    email: string;
    image: string;
    bio?: string;
    posts?: number;
    followings?: number;
    followers?: number;
    createdAt?: Date;
}

export interface LoginFormData {
    username: string;
    password: string;
}

export interface UserResponse {
    limit: number;
    skip: number;
    total: number;
    users: User[];
}

export interface SingleUserResponse extends User {
}



export interface PostResponse {
    limit: number;
    skip: number;
    total: number;
    posts: Post[];
}

export interface LoginResponse {
    id: string;
    username: string;
    email: string;
    image: string;
    accessToken: string;
    refreshToken: string;
}

export interface CreateUserRequest {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    email: string;
    gender: 'male' | 'female';
}

export interface ApiError {
    message: string;
}