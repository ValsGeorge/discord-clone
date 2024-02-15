import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';

import authMiddleware from '@/middlewares/auth.middleware';
import CategoryController from '@controllers/categories.controller';
import { CreateCategoryDto } from '@/dtos/categories.dto';
import validationMiddleware from '@/middlewares/validation.middleware';

class CategoryRoute implements Routes {
    public path = '/categories';
    public router = Router();
    public categoryController = new CategoryController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(
            `${this.path}/:serverId`,
            authMiddleware,
            this.categoryController.getCategories
        );
        this.router.get(
            `${this.path}/:id`,
            authMiddleware,
            this.categoryController.getCategoryById
        );
        this.router.post(
            `${this.path}/`,
            authMiddleware,
            validationMiddleware(CreateCategoryDto, 'body'),
            this.categoryController.createCategory
        );
        this.router.post(
            `${this.path}/update-order`,
            authMiddleware,
            this.categoryController.updateCategoriesOrder
        );
        this.router.put(
            `${this.path}/:id`,
            authMiddleware,
            validationMiddleware(CreateCategoryDto, 'body', true),
            this.categoryController.updateCategory
        );
        this.router.delete(
            `${this.path}/:id`,
            authMiddleware,
            this.categoryController.deleteCategory
        );
    }
}

export default CategoryRoute;
