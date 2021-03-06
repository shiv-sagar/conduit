var jwt = require("jsonwebtoken");

exports.generateToken = async (user) => {
  return await jwt.sign({ userId: user.id }, "Shiv");
};
exports.verifyToken = async (req, res, next) => {
  token = req.headers.authorization || "";
  try {
    if (token) {
      let payload = await jwt.verify(token, "Shiv");
      req.user = {
        userId: payload.userId,
        token,
      };

      return next();
    }
  } catch (error) {
    res.json({ error: "Not authorized" });
  }
};


