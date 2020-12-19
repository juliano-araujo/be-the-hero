const db = require('../database');

module.exports = {
  async index(req, res) {
    const { page = 1 } = req.query;

    const incidentsCountPromise = db('incidents').count();
    const incidentsPromise = db('incidents')
    .select([
      'incidents.*',
      'ongs.name',
      'ongs.whatsapp',
      'ongs.email',
      'ongs.city',
      'ongs.uf'
    ])
    .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
    .limit(5)
    .offset((page - 1) * 5);

    const promisesResults = await Promise.all([incidentsCountPromise, incidentsPromise]);

    const [count] = promisesResults[0];
    const incidents = promisesResults[1];

    res.header('X-Total-Count', count['count(*)']);

    return res.json(incidents);
  },

  async create(req, res) {
    const { title, description, value } = req.body;
    const ong_id = req.headers.authorization;

    const [id] = await db('incidents').insert({
      title,
      description,
      value,
      ong_id
    });

    return res.json({ id });
  },

  async delete(req, res) {
    const { id } = req.params;
    const ong_id = req.headers.authorization;

    const incident = await db('incidents')
      .select('ong_id')
      .where('id', id)
      .first();

    if (!incident) {
      return res.status(400).json({ error: 'No incident found with this id' });
    }

    if (incident.ong_id !== ong_id) {
      return res.status(401).json({ error: 'Operation not permitted' });
    }

    await db('incidents')
      .delete()
      .where('id', id);

    return res.status(204).send();
  }
};
