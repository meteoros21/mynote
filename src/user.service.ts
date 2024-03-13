import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user.entity";
import { Repository } from "typeorm";
import { UserDto } from "./dto/user.dto";
import { JwtService } from "./jwt.service";

const bcrypt = require('bcrypt')

@Injectable()
export class UserService {
    constructor (
        private readonly jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    // 회원 가입 시에 사용된다.
    async insertUser(user: UserDto) : Promise<User> {
        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(user.password, salt);
    
        const newUser = this.userRepository.create(user)
        return await this.userRepository.save(newUser);
    }

    // 회원 정보 수정에 사용된다.
    async updateUser(user: UserDto) : Promise<User> {

        const userOld = await this.userRepository.findOne({ where: { username: user.username } })
        if (!userOld) {
            throw new Error('User not found')
        }

        userOld.fullName = user.fullName;
        userOld.mobile = user.mobile;

        if (userOld.password !== user.password) {
            const salt = bcrypt.genSaltSync(10);
            userOld.password = bcrypt.hashSync(user.password, salt);
        }

        return await this.userRepository.save(userOld)
    }

    async getAllUsers() : Promise<User[]> {
        return await this.userRepository.find();
    }

    // 로그인에 사용된다
    async getUserByUsername (username: string) : Promise<User> {
        return await this.userRepository.findOne({ where: { username: username }})
    }
}