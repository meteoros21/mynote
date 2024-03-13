// user.ts
import { Note } from "src/note.entity";
import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm"

@Entity({ name: 'tbl_user' })
export class User {
    @PrimaryColumn()
    username: string;

    @Column()
    password: string;
    
    @Column()
    fullName: string;

    @Column()
    mobile: string;

    @OneToMany((type) => Note, (note) => note.user)
    notes: Note[];
}