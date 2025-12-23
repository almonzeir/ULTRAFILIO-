/**
 * Input Validation Utilities
 * Protects against XSS, script injection, SQL injection, and other attacks
 */

// Dangerous patterns to detect
const DANGEROUS_PATTERNS = [
    // Script tags and events
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,

    // SQL injection patterns
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|TRUNCATE|EXEC|UNION|DECLARE)\b)/gi,
    /--/g,
    /;.*$/g,

    // HTML injection
    /<[^>]*>/g,

    // Other dangerous patterns
    /\${.*}/g,  // Template literals
    /\{\{.*\}\}/g,  // Template engines
];

// Characters that should be escaped
const HTML_ENTITIES: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
};

/**
 * Escapes HTML special characters to prevent XSS
 */
export function escapeHtml(str: string): string {
    return String(str).replace(/[&<>"'`=/]/g, (char) => HTML_ENTITIES[char] || char);
}

/**
 * Checks if a string contains dangerous patterns
 */
export function containsDangerousPattern(str: string): boolean {
    return DANGEROUS_PATTERNS.some(pattern => pattern.test(str));
}

/**
 * Sanitizes input by removing dangerous patterns
 */
export function sanitizeInput(input: string): string {
    let sanitized = input.trim();

    // Remove null bytes
    sanitized = sanitized.replace(/\0/g, '');

    // Remove control characters except newlines and tabs
    sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

    // Escape HTML entities
    sanitized = escapeHtml(sanitized);

    return sanitized;
}

/**
 * Email validation with strict patterns
 */
export interface ValidationResult {
    isValid: boolean;
    error?: string;
    sanitizedValue?: string;
}

export function validateEmail(email: string): ValidationResult {
    const trimmedEmail = email.trim().toLowerCase();

    // Check for empty
    if (!trimmedEmail) {
        return { isValid: false, error: 'Email is required' };
    }

    // Check maximum length
    if (trimmedEmail.length > 254) {
        return { isValid: false, error: 'Email is too long' };
    }

    // Check for dangerous patterns
    if (containsDangerousPattern(trimmedEmail)) {
        return { isValid: false, error: 'Invalid characters in email' };
    }

    // Strict email regex pattern
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!emailRegex.test(trimmedEmail)) {
        return { isValid: false, error: 'Please enter a valid email address' };
    }

    // Check for consecutive dots
    if (trimmedEmail.includes('..')) {
        return { isValid: false, error: 'Invalid email format' };
    }

    // Check domain has at least one dot
    const parts = trimmedEmail.split('@');
    if (parts.length !== 2 || !parts[1].includes('.')) {
        return { isValid: false, error: 'Please enter a valid email address' };
    }

    return { isValid: true, sanitizedValue: trimmedEmail };
}

/**
 * Password validation with strong security requirements
 */
export function validatePassword(password: string): ValidationResult {
    // Check for empty
    if (!password) {
        return { isValid: false, error: 'Password is required' };
    }

    // Check minimum length (8 characters for strong password)
    if (password.length < 8) {
        return { isValid: false, error: 'Password must be at least 8 characters' };
    }

    // Check maximum length (prevent DoS)
    if (password.length > 128) {
        return { isValid: false, error: 'Password is too long (max 128 characters)' };
    }

    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
        return { isValid: false, error: 'Password must contain at least one uppercase letter (A-Z)' };
    }

    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
        return { isValid: false, error: 'Password must contain at least one lowercase letter (a-z)' };
    }

    // Check for number
    if (!/[0-9]/.test(password)) {
        return { isValid: false, error: 'Password must contain at least one number (0-9)' };
    }

    // Check for special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) {
        return { isValid: false, error: 'Password must contain at least one special character (!@#$%^&*...)' };
    }

    // Check for common weak passwords
    const weakPasswords = [
        '123456', 'password', '12345678', 'qwerty', '123456789',
        '12345', '1234', '111111', '1234567', 'dragon', 'master',
        'abc123', 'letmein', 'welcome', 'monkey', 'passw0rd',
        'Password1!', 'Qwerty123!', 'Admin123!', 'Welcome1!',
        'Password123!', 'Abcd1234!', 'Test1234!', 'Hello123!'
    ];

    if (weakPasswords.some(weak => password.toLowerCase().includes(weak.toLowerCase()))) {
        return { isValid: false, error: 'This password is too common. Please choose a stronger password.' };
    }

    // Check for repeated characters (e.g., aaaa, 1111)
    if (/(.)\1{3,}/.test(password)) {
        return { isValid: false, error: 'Password cannot contain 4 or more repeated characters' };
    }

    // Check for sequential characters (e.g., abcd, 1234)
    const sequentialPatterns = ['abcd', 'bcde', 'cdef', 'defg', 'efgh', 'fghi', 'ghij', 'hijk', 'ijkl', 'jklm', 'klmn', 'lmno', 'mnop', 'nopq', 'opqr', 'pqrs', 'qrst', 'rstu', 'stuv', 'tuvw', 'uvwx', 'vwxy', 'wxyz', '0123', '1234', '2345', '3456', '4567', '5678', '6789'];
    const lowerPassword = password.toLowerCase();
    if (sequentialPatterns.some(seq => lowerPassword.includes(seq))) {
        return { isValid: false, error: 'Password cannot contain sequential characters (abcd, 1234, etc.)' };
    }

    return { isValid: true };
}

/**
 * Get password strength for UI display
 */
export function getPasswordStrength(password: string): {
    score: number; // 0-5
    label: string;
    color: string;
} {
    if (!password) {
        return { score: 0, label: 'Enter password', color: 'gray' };
    }

    let score = 0;

    // Length checks
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    // Character type checks
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) score++;

    // Cap at 5
    score = Math.min(score, 5);

    const levels = [
        { label: 'Very Weak', color: 'red' },
        { label: 'Weak', color: 'orange' },
        { label: 'Fair', color: 'yellow' },
        { label: 'Good', color: 'blue' },
        { label: 'Strong', color: 'green' },
        { label: 'Very Strong', color: 'emerald' },
    ];

    return { score, ...levels[score] };
}

/**
 * Display name validation
 */
export function validateDisplayName(name: string): ValidationResult {
    const trimmedName = name.trim();

    // Check for empty
    if (!trimmedName) {
        return { isValid: false, error: 'Name is required' };
    }

    // Check minimum length
    if (trimmedName.length < 2) {
        return { isValid: false, error: 'Name must be at least 2 characters' };
    }

    // Check maximum length
    if (trimmedName.length > 50) {
        return { isValid: false, error: 'Name is too long (max 50 characters)' };
    }

    // Check for dangerous patterns
    if (containsDangerousPattern(trimmedName)) {
        return { isValid: false, error: 'Name contains invalid characters' };
    }

    // Only allow letters, spaces, hyphens, and apostrophes
    const nameRegex = /^[a-zA-Z\s\-'\.]+$/;
    if (!nameRegex.test(trimmedName)) {
        return { isValid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
    }

    // Sanitize the name
    const sanitizedName = sanitizeInput(trimmedName);

    return { isValid: true, sanitizedValue: sanitizedName };
}

/**
 * Generic text input validation
 */
export function validateTextInput(
    input: string,
    fieldName: string,
    options: {
        required?: boolean;
        minLength?: number;
        maxLength?: number;
        allowHtml?: boolean;
    } = {}
): ValidationResult {
    const {
        required = true,
        minLength = 1,
        maxLength = 1000,
        allowHtml = false,
    } = options;

    const trimmedInput = input.trim();

    // Check for required
    if (required && !trimmedInput) {
        return { isValid: false, error: `${fieldName} is required` };
    }

    // Check minimum length
    if (trimmedInput.length < minLength) {
        return { isValid: false, error: `${fieldName} must be at least ${minLength} characters` };
    }

    // Check maximum length
    if (trimmedInput.length > maxLength) {
        return { isValid: false, error: `${fieldName} is too long (max ${maxLength} characters)` };
    }

    // Check for dangerous patterns
    if (!allowHtml && containsDangerousPattern(trimmedInput)) {
        return { isValid: false, error: `${fieldName} contains invalid characters` };
    }

    // Sanitize the input
    const sanitizedValue = allowHtml ? trimmedInput : sanitizeInput(trimmedInput);

    return { isValid: true, sanitizedValue };
}

/**
 * Rate limiting check (client-side)
 */
const rateLimitStore: Map<string, { count: number; resetTime: number }> = new Map();

export function checkRateLimit(
    key: string,
    maxAttempts: number = 5,
    windowMs: number = 60000
): boolean {
    const now = Date.now();
    const record = rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
        rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
        return true;
    }

    if (record.count >= maxAttempts) {
        return false;
    }

    record.count += 1;
    return true;
}
