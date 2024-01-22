import { NextFunction, Request, Response } from 'express';
import { CreateCategoryDto } from '@dtos/categories.dto';
import { Category } from '@/interfaces/categories.interface';
import CategoryService from '@/services/categories.service';

class CategoryController {
    public categoryService = new CategoryService();

    public getCategories = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            console.log('getCategories', req.params);
            const serverId: string = req.params.serverId;

            console.log('serverIddd', serverId);
            const findAllCategoriesData: Category[] =
                await this.categoryService.findAllCategories(serverId);

            console.log('findAllCategoriesData', findAllCategoriesData);

            res.status(200).json(findAllCategoriesData);
        } catch (error) {
            next(error);
        }
    };

    public getCategoryById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const categoryId: string = req.params.id;
            const findOneCategoryData: Category =
                await this.categoryService.findCategoryById(categoryId);

            res.status(200).json(findOneCategoryData);
        } catch (error) {
            next(error);
        }
    };

    public createCategory = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const categoryData: CreateCategoryDto = req.body;

            const createCategoryData: Category =
                await this.categoryService.createCategory(categoryData);

            res.status(201).json(createCategoryData);
        } catch (error) {
            next(error);
        }
    };

    public updateCategory = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const categoryId: string = req.params.id;
            const categoryData: CreateCategoryDto = req.body;
            const updateCategoryData: Category =
                await this.categoryService.updateCategory(
                    categoryId,
                    categoryData
                );

            res.status(200).json(updateCategoryData);
        } catch (error) {
            next(error);
        }
    };

    public deleteCategory = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const categoryId: string = req.params.id;
            const deleteCategoryData: Category =
                await this.categoryService.deleteCategory(categoryId);

            res.status(200).json(deleteCategoryData);
        } catch (error) {
            next(error);
        }
    };
}

export default CategoryController;
