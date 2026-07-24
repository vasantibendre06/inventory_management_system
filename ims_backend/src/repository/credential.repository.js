import pool from "../config/db.js";

export async function findCredentialByEmail(email) {
    const result = await pool.query(
        `SELECT email, password, must_reset_password FROM credentials WHERE email = $1`,
        [email]
    );
    return result.rows[0] || null;
}

export async function updatePassword(email, hashedPassword) {
    const query = `
        UPDATE credentials
        SET
            password = $1,
            must_reset_password = FALSE
        WHERE email = $2
    `;

    const result = await pool.query(query, [hashedPassword, email]);

    if (result.rowCount === 0) {
        throw new AppError(404, "User not found");
    }

    return result;
}

export async function getPasswordHash(email) {
    const query = `
        SELECT password
        FROM credentials
        WHERE email = $1
    `;

    const result = await pool.query(query, [email]);

    return result.rows[0]?.password;
}

export async function markPasswordResetComplete(email) {
    await pool.query(
        `UPDATE credentials SET must_reset_password = FALSE, updated_at = NOW() WHERE email = $1`,
        [email]
    );
}