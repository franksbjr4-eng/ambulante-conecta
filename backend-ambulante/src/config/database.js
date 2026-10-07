const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ambulante_conecta',
    password: 'AmbulanteConecta2026',
    port: 5432,
});

module.exports = pool;