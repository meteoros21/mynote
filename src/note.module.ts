import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Note } from "./note.entity";
import { NoteService } from "./note.service";
import { NoteController } from "./note.controller";
import { UserService } from "./user.service";
import { User } from "./user.entity";
import { JwtService } from "./jwt.service";

@Module({
    imports: [TypeOrmModule.forFeature([Note, User])],
    providers: [NoteService, UserService, JwtService],
    controllers: [NoteController],
    exports: [TypeOrmModule]
})

export class NoteModule {}