/* eslint consistent-return:0 */

const express = require('express');
const bodyParser = require('body-parser');

const argv = require('minimist')(process.argv.slice(2));
const setup = require('./middlewares/frontendMiddleware');
const isDev = process.env.NODE_ENV !== 'production';
const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel ? require('ngrok') : false;
const resolve = require('path').resolve;

const passport = require('passport');
const passportJWT = require('passport-jwt');
const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;

const jwt = require('jwt-simple');

const morgan = require('morgan');
const logger = require('./logger');

const users = require('./users');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

if (isDev) {
  const format = ':method :url :status :response-time ms - :res[content-length]';
  app.use(morgan(format));
}

const crypto = require('crypto');
const config = { jwtSecret: crypto.randomBytes(32).toString('hex')};

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  secretOrKey: config.jwtSecret,
  algorithms: ['HS256']
};

const strategy =  new Strategy(opts, (payload, done) => {
  const user = users.find((u) =>
    { return u.username === payload.username }) || null;
  if (user) {
    return done(null, payload);
  } else {
    return done(new Error("User not found"), null);
  }
});

passport.use(strategy);
authCheck = () => passport.authenticate("jwt", { session: false } );
app.post("/api/check", authCheck(), (req, res) => {
  res.json(req.user);
});

app.post("/api/token", (req, res) => {
  if (req.body.username && req.body.password) {
    const username = req.body.username;
    const password = req.body.password;
    const user = users.find((u) => {
      return u.username === username &&
      u.password === password;
    });

    if (user) {
      const payload = { username: username };
      const token = jwt.encode(payload, config.jwtSecret);
      res.json({ token: token });
    } else {
      res.sendStatus(401);
    }
  } else {
    res.sendStatus(401);
  }
});

if (isDev) {
  const jsonServer = require('json-server');
  const mockServer = jsonServer.create();
  mockServer.use(jsonServer.defaults());
  mockServer.use((req, res, next) => {
    if (req.method === 'POST') {
      req.body.createdAt = new Date().toISOString();
    } else if(req.method === 'PUT') {
      req.body.editedAt = new Date().toISOString();
    }
    next()
  });
  mockServer.use(jsonServer.router('server/mock.json'));
  app.use('/api', mockServer);
} else {
  const prodServer = require('./endpoints');
  app.use('/api', authCheck(), prodServer);
}


// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

const port = argv.port || process.env.PORT || 3000;

// Start your app.
app.listen(port, host, (err) => {
  if (err) {
    return logger.error(err.message);
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    ngrok.connect(port, (innerErr, url) => {
      if (innerErr) {
        return logger.error(innerErr);
      }

      logger.appStarted(port, prettyHost, url);
    });
  } else {
    logger.appStarted(port, prettyHost);
  }
});
