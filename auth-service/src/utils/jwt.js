import jwt from 'jsonwebtoken';
async function generateToken(payload){
    let jwtSecretKey = process.env.SECRET_KEY || process.env.JWT_SECRET || 'HOSPITAL_MAN';
    let token = await jwt.sign(payload, jwtSecretKey);
    return token;
}
export default generateToken;