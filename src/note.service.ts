import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Note } from "./note.entity";
import { Repository } from "typeorm/repository/Repository";
import { NoteDto } from "./dto/note.dto";

@Injectable()
export class NoteService {
    constructor(@InjectRepository(Note) private noteRepository: Repository<Note>) {

    }

    async registerNote(noteDto: NoteDto): Promise<Note> {
        
        const note = this.noteRepository.create(noteDto)
        note.noteNo = 0;

        return this.noteRepository.save(note);
    }

    async updateNote(noteDto: NoteDto): Promise<Note> {

        try {
            const note = await this.noteRepository.findOne({where: {noteNo: noteDto.noteNo}});
            note.title = noteDto.title
            note.body = noteDto.body
            note.categoryNo = noteDto.categoryNo
            return this.noteRepository.save(note);
        } catch(error) {
            console.log(error)
        }
    } 

    async getNoteList(owner: string): Promise<Note[]> {
        const notes = await this.noteRepository
            .createQueryBuilder('note')
            .leftJoinAndSelect('note.user', 'user')
            .leftJoinAndSelect('note.category', 'category')
            .select(['note.noteNo', 'note.username', 'user.fullname', 'note.title', 
                'note.categoryNo', 'category.categoryName',
                'note.createdAt', 'note.updatedAt', 'isPublic', 'user.fullName',
                'user.mobile'])
            .where('note.isPublic=1 or note.username=:username', { username: owner })
            .getMany()

        return notes;
    }

    async getMyNoteList(owner: string) {
        const notes = await this.noteRepository
            .createQueryBuilder('note')
            .leftJoinAndSelect('note.user', 'user')
            .leftJoinAndSelect('note.category', 'category')
            .select(['note.noteNo', 'note.username', 'user.fullname', 'note.title', 
                'note.categoryNo', 'category.categoryName',
                'note.createdAt', 'note.updatedAt', 'isPublic', 'user.fullName',
                'user.mobile'])
            .where('note.username=:username', { username: owner })
            .getMany()

        return notes;
    }

    async getNote(noteNo: number, owner: string) {
        console.log('noteNo:' + noteNo)
        const notes = await this.noteRepository
            .createQueryBuilder('note')
            .leftJoinAndSelect('note.user', 'user')
            .leftJoinAndSelect('note.category', 'category')
            .select(['note.noteNo', 'note.username', 'user.fullname', 'note.title', 'note.body',
                'note.categoryNo', 'category.categoryName', 'note.isPublic',
                'note.createdAt', 'note.updatedAt', 'isPublic', 'user.fullName',
                'user.mobile'])
            .where('note.noteNo=:noteNo and (note.isPublic=1 or note.username=:owner) ', { noteNo: noteNo, owner: owner })
            .getOne()

        console.log(notes)
        return notes;
    }
}
/**
 * 'SELECT `note`.`noteNo` AS `note_noteNo`, `note`.`username` AS `note_username`, `note`.`title` AS `note_title`, 
 * `note`.`body` AS `note_body`, `note`.`categoryNo` AS `note_categoryNo`, 
 * `note`.`createdAt` AS `note_createdAt`, `note`.`updatedAt` AS `note_updatedAt`, 
 * `user`.`fullName` AS `user_fullName`, `user`.`mobile` AS `user_mobile`, `user`.`username` AS `user_username`, 
 * `category`.`categoryName` AS `category_categoryName`, `category`.`categoryNo` AS `category_categoryNo`, 
 * user.fullname, isPublic FROM `tbl_note` `note` LEFT JOIN `tbl_user` `user` ON `user`.`username`=`note`.`username`  
 * LEFT JOIN `tbl_category` `category` ON `category`.`categoryNo`=`note`.`categoryNo` WHERE `note`.`username`=:username'
 */