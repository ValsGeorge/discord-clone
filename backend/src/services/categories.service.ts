import { CreateCategoryDto } from '@/dtos/categories.dto';
import { Category } from '@/interfaces/categories.interface';

import categoryModel from '@/models/categories.model';
import { HttpException } from '@/exceptions/HttpException';
import { isEmpty } from '@/utils/util';
import { Types } from 'mongoose';

class CategoryService {
    public categores = categoryModel;

    public async findAllCategories(serverId: string): Promise<Category[]> {
        const categories: Category[] = await this.categores.find({
            server: new Types.ObjectId(serverId),
        });
        return categories;
    }

    public async findCategoryById(categoryId: string): Promise<Category> {
        const findCategory: Category = await this.categores.findOne({
            _id: categoryId,
        });
        if (!findCategory)
            throw new HttpException(409, "Category doesn't exist");

        return findCategory;
    }

    public async createCategory(
        categoryData: CreateCategoryDto
    ): Promise<Category> {
        if (isEmpty(categoryData))
            throw new HttpException(400, "You're not categoryData");

        const createCategoryData: Category = await this.categores.create({
            ...categoryData,
        });

        return createCategoryData;
    }

    public async updateCategory(
        categoryId: string,
        categoryData: CreateCategoryDto
    ): Promise<Category> {
        if (isEmpty(categoryData))
            throw new HttpException(400, "You're not categoryData");

        if (categoryData.name) {
            const findCategory: Category = await this.categores.findOne({
                id: categoryId,
            });
            if (!findCategory)
                throw new HttpException(409, "Category doesn't exist");

            await this.categores.update(
                { name: categoryData.name },
                { where: { id: categoryId } }
            );
        }

        const updateCategoryData: Category = await this.categores.findOne({
            _id: categoryId,
        });
        return updateCategoryData;
    }

    public async updateCategoriesOrder(
        categories: Category[]
    ): Promise<Category[]> {
        if (isEmpty(categories))
            throw new HttpException(400, "You're not categories");

        categories.forEach(async (category) => {
            const findCategory: Category = await this.categores.findOne({
                _id: category.id,
            });
            if (findCategory) {
                if (findCategory.order !== category.order) {
                    await this.categores.updateMany(
                        { _id: category.id },
                        { $set: { order: category.order } }
                    );
                }
            }
        });

        return categories;
    }

    public async deleteCategory(categoryId: string): Promise<Category> {
        const findCategory: Category = await this.categores.findOne({
            _id: categoryId,
        });
        if (!findCategory)
            throw new HttpException(409, "Category doesn't exist");

        await this.categores.deleteOne({ where: { id: categoryId } });

        return findCategory;
    }
}

export default CategoryService;
