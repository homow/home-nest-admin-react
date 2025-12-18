interface UserResponse {
    display_name: string;
    email: string;
    id: string;
    role: "admin" | "user";
}

interface UserLogin {
    email: string;
    password: string;
    rememberMe: boolean;
}

export type {
    UserResponse,
    UserLogin,
};