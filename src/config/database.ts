import { User } from "../types";

export const users: User[] = [
    {
        id: 1,
        username: "admin",
        password: "admin123",
        role: "admin",
        secret: "admin-secret-123",
    },
    {
        id: 2,
        username: "user",
        password: "user123",
        role: "basic",
        secret: "user-secret-456",
    },
];

export const findUserBySecret = (secret: string ): User | undefined => {
    return users.find(user => user.secret === secret)
}
