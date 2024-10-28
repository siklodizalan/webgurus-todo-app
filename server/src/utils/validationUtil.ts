export function validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function validatePassword(password: string) {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
}

export function validateUser(email: string, password: string) {
    if (!validateEmail(email)) {
    throw { valid: false, message: "Invalid email format" };
    }
    
    if (!validatePassword(password)) {
    throw { valid: false, message: "Password must be at least 8 characters long, include a number, a lowercase, and an uppercase letter." };
    }
    
    return { valid: true, message: "Email and password are valid!" };
}