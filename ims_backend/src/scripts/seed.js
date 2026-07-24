import bcrypt from "bcrypt";
import pool from "../config/db.js";
 
const TEMP_PASSWORD = "createNewPassword@123";
const SALT_ROUNDS = 12;
 
const dummyUsers = [
    { emp_id: "A01", name: "Ashwin Bendre",  email: "ashwin.bendre@winrender.com",  role_code: "ADM" },
    { emp_id: "E01", name: "Vasanti Bendre",  email: "vasanti.bendre@winrender.com",  role_code: "EMP" },
    { emp_id: "S01", name: "Lata Bendre", email: "lata.bendre@winrender.com", role_code: "STF" },
];
 
async function seed() {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
 
        const passwordHash = await bcrypt.hash(TEMP_PASSWORD, SALT_ROUNDS);
 
        for (const u of dummyUsers) {
            // enforce the domain rule even at seed time
            if (!u.email.endsWith("@winrender.com")) {
                throw new Error(`Rejected non-company email: ${u.email}`);
            }
 
            await client.query(
                `INSERT INTO credentials (email, password, must_reset_password)
                 VALUES ($1, $2, TRUE)
                 ON CONFLICT (email) DO NOTHING`,
                [u.email, passwordHash]
            );
 
            await client.query(
                `INSERT INTO user_master (emp_id, name, email, role_code)
                 VALUES ($1, $2, $3, $4)
                 ON CONFLICT (email) DO NOTHING`,
                [u.emp_id, u.name, u.email, u.role_code]
            );
 
            console.log(`Seeded: ${u.email}`);
        }
 
        await client.query("COMMIT");
        console.log(`\nDone. Temp password for all seeded users: ${TEMP_PASSWORD}`);
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Seed failed, rolled back:", err.message);
    } finally {
        client.release();
        await pool.end();
    }
}
 
seed();