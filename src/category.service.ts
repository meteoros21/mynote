import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./category.entity";
import { Repository } from "typeorm";
import { CategoryDto } from "./dto/category.dto";

@Injectable()
export class CategoryService {
    
    constructor(@InjectRepository(Category) private categoryRepository : Repository<Category>) {
        
    }

    async getAllCategories() : Promise<Category[]> {
        return this.categoryRepository.find()
    }

    async getCategoriesByOwner(ownder: string) : Promise<Category[]> {
        try {
            return this.categoryRepository.findBy({owner: ownder})
        } catch(err) {
            console.dir (err)
        }
    }

    async getCategoryByNo(categoryNo : number) : Promise<Category> {
        return this.categoryRepository.findOneBy({categoryNo: categoryNo})
    }

    async insertCategory(categoryDto: CategoryDto): Promise<Category> {
        categoryDto.categoryNo = 0;
        return this.categoryRepository.save(categoryDto);
    }

    async updateCategory(categoryDto: CategoryDto): Promise<Category> {
        const category = await this.categoryRepository.findOneBy({categoryNo: categoryDto.categoryNo})
        category.categoryName = categoryDto.categoryName

        return this.categoryRepository.save(category);
    }
}