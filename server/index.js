/* eslint consistent-return:0 */

const express = require('express');
const bodyParser = require('body-parser');
const jsonServer = require('json-server');

const argv = require('minimist')(process.argv.slice(2));
const setup = require('./middlewares/frontendMiddleware');
const isDev = process.env.NODE_ENV !== 'production';
const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel ? require('ngrok') : false;
const resolve = require('path').resolve;

const jwt = require('jwt-simple');
const logger = require('./logger');
const users = require('./users');
const config = require('./config');
const auth = require('./auth')();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(auth.initialize());

const mockServer = jsonServer.create();
mockServer.use(jsonServer.defaults());
mockServer.use(jsonServer.router('db.json'));

app.get("/myusername", auth.authenticate(), (req, res) => {
  res.json({ message: util.format('hello %s', req.user.username) });
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
      const payload = { username: user.username };
      const token = jwt.encode(payload, config.jwtSecret);
      res.json({ token: token });
    } else {
      res.sendStatus(401);
    }
  } else {
    res.sendStatus(401);
  }
});

app.use('/api', mockServer);

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
