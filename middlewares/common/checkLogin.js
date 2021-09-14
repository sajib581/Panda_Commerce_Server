const jwt = require("jsonwebtoken");

const checkLogin = (req, res, next) => {
  let cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

  if (cookies) {
    try {
      token = cookies["panda-commerce"];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(403).json({
        error: "Authetication failure!",
      });
    }
  } else {
    res.status(401).json({
      error: "Authetication failure!",
    });
  }
};

// guard to protect routes that need role based authorization
function requireRole(role) {
  return function (req, res, next) {
    if (req.user.role && role.includes(req.user.role)) {
      next();
    } else {
      console.log("Here Hited");
      res.status(403).json({
        errors: {
          common: {
            msg: "You are not authorized!",
          },
        },
      });
    }
  };
}

module.exports = {
  checkLogin,
  requireRole
};
