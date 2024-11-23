module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/login');
    }
  },

  ensureRole: (role) => {
    return (req, res, next) => {
      if (req.isAuthenticated() && req.user.role === role) {
        return next();
      } else {
        res.status(403).send('Access Denied');
      }
    };
  },
};