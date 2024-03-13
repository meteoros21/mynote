import { Body, Controller, Get, HttpException, HttpStatus, Post, Put, Query, Req } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { Category } from "./category.entity";
import { CategoryDto } from "./dto/category.dto";
import { JwtService } from "./jwt.service";

@Controller("category")
export class CategoryController {
    constructor(private categoryService: CategoryService,
        private jwtService: JwtService) {

    }

    @Get('list')
    public async getCategoriesByOwner(@Req() req: any) : Promise<Category[]> {
        const userInfo = this.jwtService.checkToken(req)
        if (!userInfo)
            throw new HttpException('Need Login', HttpStatus.FORBIDDEN)

        return await this.categoryService.getCategoriesByOwner(userInfo.username)
    }

    @Get('')
    public getCategory(@Query() query : any) : Promise<Category> {
        return this.categoryService.getCategoryByNo(query.categoryNo)
    }
    @Post('')
    public insertCategory(@Req() req: any, @Body() categoryDto: CategoryDto) : Promise<Category> {
        const userInfo = this.jwtService.checkToken(req)
        if (!userInfo)
            throw new HttpException('Need Login', HttpStatus.FORBIDDEN)

        categoryDto.categoryNo = 0
        categoryDto.owner = userInfo.username

        return this.categoryService.insertCategory(categoryDto)
    }

    @Put('')
    public updateCategory(@Req() req: any, @Body() categoryDto: CategoryDto) : Promise<Category> {
        const userInfo = this.jwtService.checkToken(req)
        if (!userInfo)
            throw new HttpException('Need Login', HttpStatus.FORBIDDEN)

        categoryDto.owner = userInfo.username;

        return this.categoryService.updateCategory(categoryDto)
    }
}