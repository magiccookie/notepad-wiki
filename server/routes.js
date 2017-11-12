const express = require('express');
const router = express.Router();

const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/notepad_wiki';

const client = new pg.Client(connectionString);
client.connect();


const passportJWT = require('passport-jwt');
const ExtractJwt = passportJWT.ExtractJwt;

const jwt = require('jwt-simple');
const crypto = require('crypto');

const secret = process.env.NOTEPAD_WIKI_KEY || 'notepad-wiki';
const encSHA512 = (value) => crypto.createHmac('sha512', secret)
                                   .update(value)
                                   .digest('hex');

const postToken = (opts) => (req, res) => {
  if (req.body.username && req.body.password) {
    const username = req.body.username.trim().toLowerCase();
    const password = req.body.password.trim();

    const hash = encSHA512(password);
    client.query(`SELECT 1
                  FROM users
                  WHERE username=$1
                  AND hash=$2`,
                 [username, hash])
          .then((data) => {
            if (data.rows.length) {
              const payload = { username: username };
              const token = jwt.encode(payload, opts.secretOrKey, opts.algorithms[0]);
              res.status(200).json({ token: token });
            } else {
              return res.status(401)
            }
          })
          .catch((err) => {
            console.log(err);
            return res.status(401).json(err);
          });
  }
}


const verifyChallenge = (challenge) => true;
const verifyUser = (username) => true;

const postSignup = (req, res) => {
  if (req.body.username && req.body.password) {
    const username  = req.body.username.trim().toLowerCase();
    const email     = req.body.email.trim().toLowerCase();
    const password  = req.body.password.trim();
    const challenge = req.body.challenge || '';

    if (username && password && challenge) {
      try {
        verifyChallenge(challenge);
        verifyUser(username);
        const hash = encSHA512(password);
        client.query(`INSERT
                      INTO users(username, hash, email)
                      values($1, $2, $3)`,
                     [username, hash, email])
              .then((data) => {
                return res.status(200).json(data);
              })
              .catch((err) => {
                console.log(err);
                return res.status(401).json(err);
              });
      } catch (err) {
        return res.status(401).json(err);
      }
    }
  }
}

router.route("/posts/:note_id?")
      .get((req, res, next) => {
        const owner = req.user;
        if (req.query.name) {
          const name = req.query.name;
          client.query(`SELECT *
                        FROM notes
                        WHERE (owner IS NULL OR owner=$1)
                        AND name=$2`,
                       [owner, name])
                .then((data) => {
                  return res.status(200).json(data.rows)
                })
                .catch((err) => {
                  return res.status(500).json(err);
                })
        } else {
          client.query(`SELECT *
                        FROM notes
                        WHERE (owner IS NULL OR owner=$1)`,
                       [owner])
                .then((data) => {
                  return res.status(200).json(data.rows)
                })
                .catch((err) => {
                  return res.status(500).json(err);
                })
        }
      })
      .post((req, res, next) => {
        const owner = req.user;
        const note = {
          owner: owner,
          name: req.body.name.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, ''),
          header: req.body.header,
          content: req.body.content,
          createdAt: new Date().toISOString(),
          editedAt: new Date().toISOString(),
        };

        client.query(`INSERT
                      INTO notes(owner, name, header, content, createdAt, editedAt)
                      values($1, $2, $3, $4, $5, $6)`,
                     [note.owner, note.name, note.header, note.content, note.createdAt, note.editedAt])
              .then((data) => {
                return res.status(200).json(data);
              })
              .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
              });
      })
      .put((req, res) => {
        const owner = req.user;
        const note_id = req.params.note_id;
        const note = {
          name: req.body.name,
          header: req.body.header,
          content: req.body.content,
          editedAt: new Date().toISOString(),
        };
        client.query(`UPDATE notes
                      SET name=($1), header=($2), content=($3), editedAt=($4)
                      WHERE id=($5)
                      AND (owner IS NULL OR owner=($6))`,
                     [note.name, note.header, note.content, note.editedAt, note_id, owner])
              .then((data) => {
                return res.status(200).json(data);
              })
              .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
              });
      })
      .delete((req, res, next) => {
        const owner = req.user;
        const note_id = req.params.note_id;
        client.query(`DELETE
                      FROM notes
                      WHERE id=($1)
                      AND (owner IS NULL OR owner=($2))`, [note_id, owner])
              .then((data) => {
                return res.status(200).json(data);
              })
              .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
              })
      });

exports.router = router;
exports.token  = postToken;
exports.signup = postSignup;
