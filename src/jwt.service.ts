import { Injectable } from "@nestjs/common";
import * as jwt from 'jsonwebtoken'

@Injectable()
export class JwtService {
    private readonly secretKey = 'sakdlfj';

    genderateToken(payload: any): string {
        return jwt.sign(payload, this.secretKey);
    }

    checkToken(req: any): any {
        let authorization: string = req.get('authorization')

        if (!authorization)
          return null;
    
        if (authorization.startsWith('Bearer'))
          authorization = authorization.substring(7)
    
        const userInfo = this.verifyToken(authorization)
        return userInfo
    }

    verifyToken(token: string): any {
        try {
            return jwt.verify(token, this.secretKey);
        } catch (error) {
            return null;
        }
    }
}