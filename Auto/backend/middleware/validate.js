const validator = require("validator");

const validate = (req, res, next) => {
  const { username, email } = req.body;

  try {
    if (!username || username.trim() === "") {
      throw new Error("Enter a valid name");
    }

    if (!email || !validator.isEmail(email)) {
      throw new Error("Kindly enter a valid email");
    }

    next(); 
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = validate;
