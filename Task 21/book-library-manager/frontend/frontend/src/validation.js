export const validateLoginForm = ({ email, password }) => {
  const errors = {}

  const normalizedEmail = email.trim()

  if (!normalizedEmail) {
    errors.email = 'Email is required.'
  } else if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!password) {
    errors.password = 'Password is required.'
  }

  return errors
}

export const validatePassword = (password) => {
  return {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>_\-\\[\]/`~;'+=]/.test(password)
  }
}

export const validateRegisterForm = ({ username, email, password }) => {
  const errors = {}

  const normalizedUsername = username.trim()
  const normalizedEmail = email.trim()

  if (!normalizedUsername) {
    errors.username = 'Username is required.'
  } else if (normalizedUsername.length < 3) {
    errors.username = 'Username must be at least 3 characters.'
  } else if (normalizedUsername.length > 50) {
    errors.username = 'Username cannot exceed 50 characters.'
  }

  if (!normalizedEmail) {
    errors.email = 'Email is required.'
  } else if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!password) {
    errors.password = 'Password is required.'
  } else {
    const checks = validatePassword(password)

    if (!checks.minLength) {
      errors.password = 'Password must be at least 8 characters.'
    } else if (!checks.uppercase) {
      errors.password = 'Password must contain at least one uppercase letter.'
    } else if (!checks.lowercase) {
      errors.password = 'Password must contain at least one lowercase letter.'
    } else if (!checks.number) {
      errors.password = 'Password must contain at least one number.'
    } else if (!checks.special) {
      errors.password = 'Password must contain at least one special character.'
    }
  }

  return errors
}

export const validateBookForm = ({ title, author, genre, year }) => {
  const errors = {}

  if (!title.trim()) {
    errors.title = 'Book title is required.'
  }

  if (!author.trim()) {
    errors.author = 'Author is required.'
  }

  if (!genre.trim()) {
    errors.genre = 'Genre is required.'
  }

  if (!year) {
    errors.year = 'Publication year is required.'
  } else {
    const numericYear = Number(year)

    if (
      !Number.isInteger(numericYear) ||
      numericYear < 1000 ||
      numericYear > 2100
    ) {
      errors.year = 'Publication year must be between 1000 and 2100.'
    }
  }

  return errors
}