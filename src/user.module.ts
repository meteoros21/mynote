import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { JwtService } from "./jwt.service";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UserService, JwtService],
    controllers: [UserController],
    exports: [TypeOrmModule]
})

export class UserModule {}