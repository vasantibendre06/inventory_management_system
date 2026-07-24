const isProduction = process.env.NODE_ENV === "production";

const baseCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    path: "/",
};

export const loginCookieOptions = {
    ...baseCookieOptions,
    maxAge: 2 * 60 * 60 * 1000, //2 hr
};

export const resetCookieOptions = {
    ...baseCookieOptions,
    maxAge: 15 * 60 * 1000,  //15 min
};