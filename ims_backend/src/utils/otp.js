import crypto from "crypto";

export function generateOtp() {
    let otp = '';

    for(let i = 0; i < 6; i++) {
        otp += crypto.randomInt(0,10);
    }

    return otp;
};


export function hashOtp(otp) {
    return crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");
}


export function verifyOtp(otp, hashedOtp) {
    return hashOtp(otp) === hashedOtp;
} 