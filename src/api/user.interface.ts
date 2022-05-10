export interface CreateUserInterface {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}

export interface LoginUserInterface {
    email: string;
    password: string;
}