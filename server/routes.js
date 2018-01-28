const express = require('express');
const router = express.Router();

const { Client } = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/notepad_wiki';
const client = new Client(connectionString);
client.connect()

const passportJWT = require('passport-jwt');
const ExtractJwt = passportJWT.ExtractJwt;

const jwt = require('jwt-simple');
const crypto = require('crypto');

const secret = process.env.NOTEPAD_WIKI_KEY || 'notepad-wiki';
const encSHA512 = value => crypto.createHmac('sha512', secret)
                                 .update(value)
                                 .digest('hex');

const postToken = opts => async (req, res) => {
  if (req.body.username && req.body.password) {
    const username = req.body.username.trim().toLowerCase();
    const password = req.body.password.trim();
    const hash = encSHA512(password);

    try {
      const { rows } = await client.query(`SELECT 1
                                           FROM users
                                           WHERE username=$1
                                           AND hash=$2`,
                                          [username, hash]);
      if (rows.length) {
        const payload = { username: username };
        const token = jwt.encode(payload, opts.secretOrKey, opts.algorithms[0]);
        return res.status(200).json({ token: token });
      } else {
        return res.status(401).json({ errors: { status: 401 }});
      }
    } catch(err) {
      console.error(err);
      return res.status(401).json({ errors: { status: 401 }});
    }
  }
}


const validateChallenge = challenge => true;


const validateUser = async username => {
  const { rows } = await client.query(`SELECT EXISTS (SELECT 1
                                       FROM users
                                       WHERE username=$1)`,
                                      [username]);
  return !rows[0].exists;
}


const validateNote = async note => {
  const isMatched = note.name.match(/^\S*$/);
  if (!!isMatched) {
    const { rows } = await client.query(`SELECT EXISTS (SELECT 1
                                         FROM notes
                                         WHERE name=$1)`,
                                        [note.name]);
    return !rows[0].exists;
  } else {
    return false;
  }
}


const validateNoteUpdate = async note => {
  const isMatched = note.name.match(/^\S*$/);
  if (!!isMatched) {
    const { rows } = await client.query(`SELECT EXISTS (SELECT 1
                                         FROM notes
                                         WHERE name=$1
                                         AND id != $2)`,
                                        [note.name, note.id]);
    return !rows[0].exists;
  } else {
    return false;
  }
}


const postSignup = async (req, res) => {
  if (req.body.username && req.body.password) {
    const username = req.body.username.trim().toLowerCase();
    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password.trim();
    const challenge = req.body.challenge || '';

    if (username && password && challenge) {

      if (!validateChallenge(challenge)) {
        console.error("Invalid challenge");
        return res.status(500).json({ errors: { status: 500, title: "Invalid challenge" }});
      }

      const isValidUser = await validateUser(username);
      if (!isValidUser) {
        console.error("Invalid username");
        return res.status(500).json({ errors: { status: 500, title: "Invalid username" }});
      }

      const hash = encSHA512(password);
      client.query(`INSERT
                    INTO users(username, hash, email)
                    values($1, $2, $3)`,
                   [username, hash, email])
            .then((data) => {
              return res.status(200).json(data);
            })
            .catch((err) => {
              console.error(err);
              return res.status(401).json({ errors: { status: 401 }});
            });
    }
  }
}

router.route("/posts/:note_id?")
      .get(async (req, res, next) => {
        const owner = req.user;
        if (req.query.name) {
          const name = req.query.name;

          try {
            const { rows } = await client.query(`SELECT *
                                                 FROM notes
                                                 WHERE (owner IS NULL OR owner=$1)
                                                 AND name=$2`,
                                                [owner, name]);

            return res.status(200).json(rows)
          } catch(err) {
            console.error(err.stack);
            return res.status(500).json({ errors: { status: 500 }});
          }

        } else {

          try {
            const { rows } = await client.query(`SELECT *
                                                 FROM notes
                                                 WHERE (owner IS NULL OR owner=$1)
                                                 ORDER BY editedAt ASC`,
                                                [owner]);
            return res.status(200).json(rows)
          } catch(err) {
            console.error(err.stack);
            return res.status(500).json({ errors: { status: 500 }});
          }

        }
      })
      .post(async (req, res, next) => {
        const note = {
          owner:     req.user,
          name:      req.body.name.trim().toLowerCase(),
          header:    req.body.header,
          content:   req.body.content,
          createdAt: new Date().toISOString(),
          editedAt:  new Date().toISOString(),
        };

        const isValidNote = await validateNote(note)
        if (!isValidNote) {
          console.error("Invalid note name");
          return res.status(500).json({ errors: { status: 500, title: "Invalid note name" }});
        }

        try {
          const data = await client.query(`INSERT
                                           INTO notes(owner, name, header, content, createdAt, editedAt)
                                           values($1, $2, $3, $4, $5, $6)`,
                                          [note.owner, note.name, note.header, note.content, note.createdAt, note.editedAt]);
          return res.status(200).json(data);
        } catch(err) {
          console.error(err.stack);
          return res.status(500).json({ errors: { status: 500 }});
        }
      })
      .put(async (req, res) => {
        const note = {
          id:       req.params.note_id,
          owner:    req.user,
          name:     req.body.name.trim().toLowerCase(),
          header:   req.body.header,
          content:  req.body.content,
          editedAt: new Date().toISOString(),
        };

        const isValidNote = await validateNoteUpdate(note)
        if (!isValidNote) {
          console.error("Invalid note name");
          return res.status(500).json({ errors: { status: 500, title: "Invalid note name" }});
        }

        try {
          const data = await client.query(`UPDATE notes
                                           SET name=($1), header=($2), content=($3), editedAt=($4)
                                           WHERE id=($5)
                                           AND (owner IS NULL OR owner=($6))`,
                                          [note.name, note.header, note.content, note.editedAt, note.id, note.owner]);
          return res.status(200).json(data);
        } catch(err) {
          console.error(err.stack);
          return res.status(500).json({ errors: { status: 500 }});
        }
      })
      .delete(async (req, res, next) => {
        const note = {
          id:    req.params.note_id,
          owner: req.user
        }
        try {
          const data = await client.query(`DELETE
                                           FROM notes
                                           WHERE id=($1)
                                           AND (owner IS NULL OR owner=($2))`,
                                          [note.id, note.owner])
          return res.status(200).json(data);
        } catch(err) {
          console.error(err.stack);
          return res.status(500).json({ errors: { status: 500 }});
        }
      });

exports.router = router;
exports.token  = postToken;
exports.signup = postSignup;
