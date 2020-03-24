const db = require('../database');

module.exports = {
  async create(req, res){
    const { id } = req.body;

    const ong = await db('ongs')
      .select('name')
      .where('id', id)
      .first()
    
    if(!ong){
      return res.status(400).json({ error: 'No ong found with this id'})
    }

    return res.json(ong);
  }
}
