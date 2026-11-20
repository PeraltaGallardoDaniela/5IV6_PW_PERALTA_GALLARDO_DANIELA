function crearModeloToken(pool) { 
    async function crearToken(usuarioId, token, expiracion) {
        await pool.query(
            'INSERT INTO tokens (usuario_id, token, expira) VALUES (?, ?, ?)',
            [usuarioId, token, expiracion]
        );
    }
    return { crearToken };
}
 