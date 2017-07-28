const passport = require('passport');
const passportJWT = require('passport-jwt');
const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;

const users = require('./users');
const config = require('./config');

const params = {
  secretOrKey: config.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeader()
};

const auth = () => {
  const strategy =  new Strategy(params, (payload, done) => {
    const user = users.find((u) =>
      { return u.username === username }) || null;

    if (user) {
      return done(null, user);
    } else {
      return done(new Error("User not found"), null);
    }
  });

  passport.use(strategy);
  return {
    initialize: () => passport.initialize(),
    authenticate: () => passport.authenticate("jwt", { session: false } )
  }
};

module.exports = auth;
