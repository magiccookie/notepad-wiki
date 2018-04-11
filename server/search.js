const { Client } = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/notepad_wiki';
const client = new Client(connectionString);
client.connect()

const search = async (req, res) => {
  if (!!req.body.query && typeof req.body.query === "string") {
    const owner = req.user;
    const raw_query = req.body.query;
    const query = raw_query.trim()
                           .toLowerCase()
                           .split(" ")
                           .join(" & ")
                           .concat(":*");

    try {
      const { rows } = await client.query(
        `SELECT *
         FROM notes
         WHERE (to_tsvector(content) @@ to_tsquery($1))
         ORDER BY editedAt ASC
         LIMIT 10`,
        [query]);

      return res.status(200).json(rows);
    } catch(err) {
      console.error(err);
      return res.status(500).json({ errors: { status: 500 }});
    }
  } else {
    return res.status(500).json({ errors: { status: 500 }});
  }
}

exports.search = search;
