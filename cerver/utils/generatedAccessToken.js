import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generatedAccessToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_KEY_ACCESS_TOKEN, {
        expiresIn: '1d', // 1 day
    });
};

export default generatedAccessToken;
