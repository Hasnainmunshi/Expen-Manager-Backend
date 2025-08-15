const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const validatePassword = (password) => {
  if (!password || typeof password !== "string") {
    return {
      isValid: false,
      message: "Password is required and must be a string",
    };
  }

  if (!passwordRegex.test(password)) {
    return {
      isValid: false,
      message:
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
    };
  }

  return {
    isValid: true,
    message: "Password is valid",
  };
};

module.exports = { validatePassword };
