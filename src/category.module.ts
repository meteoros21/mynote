import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "./category.entity";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";
import { JwtService } from "./jwt.service";

@Module({
    imports: [TypeOrmModule.forFeature([Category])],
    providers: [CategoryService, JwtService],
    controllers: [CategoryController],
    exports: [TypeOrmModule]
})

export class CategoryModule {}