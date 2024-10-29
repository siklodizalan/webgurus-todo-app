"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = validateEmail;
exports.validatePassword = validatePassword;
exports.validateUser = validateUser;
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function validatePassword(password) {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
}
function validateUser(email, password) {
    if (!validateEmail(email)) {
        throw { valid: false, message: "Invalid email format" };
    }
    if (!validatePassword(password)) {
        throw {
            valid: false,
            message: "Password must be at least 8 characters long, include a number, a lowercase, and an uppercase letter.",
        };
    }
    return { valid: true, message: "Email and password are valid!" };
}
