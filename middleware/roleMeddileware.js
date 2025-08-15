const role = (roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "Access denied,no role found" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied,not authorized" });
    }
    next();
  };
};

module.exports = role;
