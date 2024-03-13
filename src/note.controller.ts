import { Body, Controller, Get, HttpException, HttpStatus, Post, Put, Query, Req, UseInterceptors } from "@nestjs/common";
import { NoteService } from "./note.service";
import { Note } from "./note.entity";
import { JwtService } from "./jwt.service";
import { NoteDto } from "./dto/note.dto";
import { NoFilesInterceptor } from "@nestjs/platform-express";

@Controller('note')
export class NoteController {
    constructor(private noteService: NoteService,
        private jwtService: JwtService) {

    }
    @Get("list")
    async getNoteList(@Req() req: any, @Query() query : any) {

        const userInfo = this.jwtService.checkToken(req)
        const owner = (!userInfo) ? '' : userInfo.username;

        return this.noteService.getNoteList(owner);
    }

    @Get("my-list")
    async getMyNoteList(@Req() req: any) {
        
        const userInfo = this.jwtService.checkToken(req)
        if (!userInfo) {
            throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
        }

        return this.noteService.getMyNoteList(userInfo.username);
    }

    @Get('detail')
    async getNote(@Req() req: any, @Query() query: any) {
        const userInfo = this.jwtService.checkToken(req)
        const owner = (!userInfo) ? '' :  userInfo.username
        const note = await this.noteService.getNote(query.noteNo, owner)

        if (note == null)
            throw new HttpException('noteNo가 잘못되었거나, 권한이 없는 노트입니다.', HttpStatus.UNAUTHORIZED);

        return note;
    }

    @Post('')
    @UseInterceptors(NoFilesInterceptor())
    async registerNote(@Req() req: any, @Body() noteDto: NoteDto) {
        const userInfo = this.jwtService.checkToken(req)
        if (!userInfo) {
            throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
        }

        return this.noteService.registerNote(noteDto);
    }

    @Put('')
    @UseInterceptors(NoFilesInterceptor())
    async updateNote(@Req() req: any, @Body() noteDto: NoteDto) {
        const userInfo = this.jwtService.checkToken(req)
        if (!userInfo) {
            throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED);
        }

        noteDto.username = userInfo.username

        return this.noteService.updateNote(noteDto);
    }
}