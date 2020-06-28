const authCheck = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: 'unauthorized' });
  } else {
    next();
  }
};

module.exports = authCheck;