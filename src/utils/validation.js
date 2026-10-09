const validator = require('validator')

const validateUserData = ({ firstName, lastName, emailId, password }) => {
    if (typeof firstName !== 'string' || firstName.trim().length < 2) {
        throw new Error('First name must contain at least 2 characters')
    }

    if (typeof lastName !== 'string' || lastName.trim().length < 2) {
        throw new Error('Last name must contain at least 2 characters')
    }

    if (typeof emailId !== 'string' || !validator.isEmail(emailId.trim())) {
        throw new Error('A valid email is required')
    }

    if (typeof password !== 'string' || !validator.isStrongPassword(password)) {
        throw new Error('Password must be at least 8 characters with uppercase, lowercase, number, and symbol')
    }
}

module.exports = validateUserData
