import pool from "../config/db.js";

export async function findUserByEmail(email) {
    const result = await pool.query(
        `SELECT u.emp_id, u.name, u.email, u.role_code, r.role_name
         FROM user_master u
         JOIN role_master r ON r.role_code = u.role_code
         WHERE u.email = $1`,
        [email]
    );
    return result.rows[0] || null;
}

export async function touchLastLogin(email) {
    await pool.query(
        `UPDATE user_master SET last_login = NOW() WHERE email = $1`,
        [email]
    );
}