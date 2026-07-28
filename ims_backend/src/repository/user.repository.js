import pool from "../config/db.js";
import { verifyOtp } from "../utils/otp.js"


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


export async function savePasswordToken(
    email,
    tokenHash,
    expiresAt,
    tokenType
) {
    const query = `
        UPDATE user_master
        SET 
            password_token_hash = $1,
            password_token_expires_at = $2,
            password_token_type = $3
        WHERE email = $4
    `
    ;

    const result = await pool.query(query, [
        tokenHash,
        expiresAt,
        tokenType,
        email,
    ]);

    return result.rowCount;
}   


export async function getPasswordToken(email) {
    const query = `
        SELECT
            password_token_hash,
            password_token_expires_at,
            password_token_type
        FROM user_master
        WHERE email = $1
    `;

    const result = await pool.query(query, [email]);

    return result.rows[0] || null;
    
}


export async function clearPasswordToken(email) {
    const query = `
        UPDATE user_master
        SET
            password_token_hash = NULL,
            password_token_expires_at = NULL,
            password_token_type = NULL
        WHERE email = $1            
    `;
    
    const result = await pool.query(query, [email]);

    return result.rowCount;
}

export async function findCredentialsByEmail(email) {
    const query = `
        SELECT
            email,
            password
        FROM credentials
        WHERE email = $1
    `;

    const result = await pool.query(query, [email]);

    return result.rows[0];
}