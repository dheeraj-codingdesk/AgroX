import type { User } from '../types';

const MAKE_WEBHOOK_URL = 'https://hook.eu2.make.com/faiuc1q97rat6b4vdcyoaqo1y8h8rif5';
const USERS_STORAGE_KEY = 'agroXUsers';

/**
 * NOTE: This is an insecure method for storing and retrieving user data and is
 * used only to meet the requirements of the prompt. In a real-world application,
 * user data and passwords should never be stored in localStorage.
 */

const getUsers = (): User[] => {
    try {
        const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
        return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
        console.error('Failed to parse users from localStorage', error);
        return [];
    }
};

const saveUsers = (users: User[]) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

/**
 * Authenticates a user by checking credentials against localStorage.
 * @param email The user's email.
 * @param password The user's password.
 * @returns The user object without the password if successful, otherwise null.
 */
export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (user) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    return null;
};

/**
 * Adds a new user. It first sends the data to the Make.com webhook
 * and then saves it to localStorage.
 * @param userData The user data to add (including password).
 */
export const addUser = async (userData: User): Promise<void> => {
    // 1. Send data to the external webhook
    try {
        const response = await fetch(MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            // Log the error but don't block user creation in the local app
            console.error('Webhook request failed:', response.statusText);
            throw new Error('Failed to save user data to the external service.');
        }
    } catch (error) {
        console.error('Error sending data to webhook:', error);
        throw new Error('Could not connect to the registration service.');
    }

    // 2. Save user to local storage
    const users = getUsers();
    const existingUser = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());

    if (existingUser) {
        throw new Error('An account with this email already exists.');
    }

    users.push(userData);
    saveUsers(users);
};