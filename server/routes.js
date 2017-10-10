const express = require('express');
const router = express.Router();

const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/notepad_wiki';

const client = new pg.Client(connectionString);
client.connect();

router.route("/posts/:note_id?")
      .get((req, res, next) => {
        if (req.query.name) {
          const name = req.query.name;
          client.query('SELECT * FROM notes WHERE name=$1', [name])
                .then((data) => {
                  return res.status(200).json(data.rows)
                })
                .catch((err) => {
                  return res.status(500).json(err);
                })
        } else {
          client.query('SELECT * FROM notes')
                .then((data) => {
                  return res.status(200).json(data.rows)
                })
                .catch((err) => {
                  return res.status(500).json(err);
                })
        }
      })
      .post((req, res, next) => {
        const note = {
          owner: req.user || 'demo',
          name: req.body.name,
          header: req.body.header,
          content: req.body.content,
          createdAt: new Date().toISOString(),
          editedAt: new Date().toISOString(),
        };

        client.query('INSERT INTO notes(owner, name, header, content, createdAt, editedAt) values($1, $2, $3, $4, $5, $6)',
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
        const note_id = req.params.note_id;
        const note = {
          name: req.body.name,
          header: req.body.header,
          content: req.body.content,
          editedAt: new Date().toISOString(),
        };
        client.query('UPDATE notes SET name=($1), header=($2), content=($3), editedAt=($4) WHERE id=($5)',
                     [note.name, note.header, note.content, note.editedAt, note_id])
              .then((data) => {
                return res.status(200).json(data);
              })
              .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
              });
      })
      .delete((req, res, next) => {
        const note_id = req.params.note_id;
        client.query('DELETE FROM notes WHERE id=($1)', [note_id])
              .then((data) => {
                return res.status(200).json(data);
              })
              .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
              })
      });

exports.router = router;
