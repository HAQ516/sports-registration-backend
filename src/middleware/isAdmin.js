const isAdmin = (roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  const allowedRoles = roles.split(',').map((role) => role.trim());

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Admin access required' });
  }

  next();
};

module.exports = isAdmin;
