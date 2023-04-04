function isAuthorized(req, res, next) {
  if (!req.user) {
    // return res.sendFile('login.html', { root: 'src/public' });
    return res.redirect('/login');
  }
  next();
}

module.exports = isAuthorized;
