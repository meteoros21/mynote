import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Category } from "./category.entity";

@Entity({ name: 'tbl_note' })
export class Note {
    @PrimaryGeneratedColumn()
    noteNo : number;

    @Column()
    username: string;

    @Column()
    title: string;

    @Column()
    body: string;

    @Column()
    categoryNo: number

    @Column()
    isPublic: number

    @Column({insert: false, update: false})
    createdAt: string;

    @Column({insert: false, update: false})
    updatedAt: string

    @ManyToOne((type) => User, (user) => user.notes)
    @JoinColumn([{ name: 'username', referencedColumnName: 'username'}])
    user: User;

    @ManyToOne((type) => Category, (category) => category.notes)
    @JoinColumn([{ name: 'categoryNo', referencedColumnName: 'categoryNo'}])
    category: Category
}