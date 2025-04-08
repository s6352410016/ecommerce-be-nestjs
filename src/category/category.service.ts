import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entity/category.entity';
import { Repository } from 'typeorm';
import { CategoryRes } from './utils/category-res';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ){}

    async findById(id: number): Promise<Category | null>{
        return await this.categoryRepository.findOne({
            where: {
                id
            }
        });
    }

    async find(): Promise<CategoryRes[]> {
        const categories = await this.categoryRepository.find();
        return categories.map((category) => ({ label: category.name, value: category.name }));
    }
}
