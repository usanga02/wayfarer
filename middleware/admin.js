module.exports = function (req, res, next) {
  if (!req.user.is_admin) {
    res.status(403).send({
      status: 'Access Denied',
      error: 'Not an admin',
    });
  }
  next();
};
