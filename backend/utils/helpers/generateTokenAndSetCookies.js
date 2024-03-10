import jwt from 'jsonwebtoken';

const generateTokenAndSetCookies = (userid, res) => {
    const token = jwt.sign({userid}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 15 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
    });

    return token;
}

export default generateTokenAndSetCookies;