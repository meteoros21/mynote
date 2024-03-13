import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Note } from "./note.entity";

@Entity({ name: 'tbl_category' })
export class Category
{
    @PrimaryGeneratedColumn()
    categoryNo : number

    @Column()
    owner: string;

    @Column()
    categoryName: string;

    @OneToMany((type) => Note, (note) => note.category)
    notes: Note[];
}