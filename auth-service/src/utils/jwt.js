import jwt from 'jsonwebtoken';
async function generateToken(payload){
    let jwtSecretKey=process.env.SECRET_KEY;
    let token=await jwt.sign(payload,jwtSecretKey);
    return token;

}
export default generateToken;