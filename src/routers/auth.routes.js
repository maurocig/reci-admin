const express = require('express');
const passport = require('../middleware/passport');

const router = express.Router();

router.post(
  '/register',
  passport.authenticate('signup', {
    failureRedirect: '/signup-error',
    successRedirect: '/',
  })
);

router.post(
  '/login',
  passport.authenticate('signin', {
    failureRedirect: '/signin-error',
    successRedirect: '/',
  })
);

router.get('/logout', async (req, res) => {
  try {
    await req.session.destroy((err) => {
      if (err) {
        console.log(err);
        res.clearCookie('my-session');
      } else {
        res.clearCookie('my-session');
        res.redirect('/login');
      }
    });
  } catch (err) {
    logger.error(err);
  }
});

module.exports = router;
