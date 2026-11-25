function crearModeloTokens(pool) {
    // La funcion revocar un token

    async function revocarToken(jti, usuario, exp) {
        await pool.query(
            'INSERT INTO tokens_revocados (jti, usuario, exp) VALUES (?, ?, FROM_UNIXTIME(?))',
            [jti, usuario, exp]
        );
    }

    //VAMOS A consultar los tokens revocados
    async function estaReovado(jti) {
        const [filas] = await pool.query('SELECT * FROM tokens_revocados WHERE jti = ?', [String(jti || '')]);
        return filas.length > 0;
    }

    // necesitamos consultar el estado del diagnostico de los tokens

    async function listar() { 
        const [filas] = await pool.query('SELECT jti, usuario, expira, revocado_en FROM tokens_revocados ORDER BY revocado_en DESC, jti');
        return filas;
    }
}