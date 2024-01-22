function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
import { Router } from "express";
import UsersController from "@controllers/users.controller";
import { CreateUserDto } from "@dtos/users.dto";
import validationMiddleware from "@middlewares/validation.middleware";
var UsersRoute = /*#__PURE__*/ function() {
    "use strict";
    function UsersRoute() {
        _classCallCheck(this, UsersRoute);
        this.path = "/user";
        this.router = Router();
        this.usersController = new UsersController();
        this.initializeRoutes();
    }
    var _proto = UsersRoute.prototype;
    _proto.initializeRoutes = function initializeRoutes() {
        this.router.get("".concat(this.path), this.usersController.getUsers);
        this.router.get("".concat(this.path, "/:id"), this.usersController.getUserById);
        this.router.post("".concat(this.path), validationMiddleware(CreateUserDto, "body"), this.usersController.createUser);
        this.router.put("".concat(this.path, "/:id"), validationMiddleware(CreateUserDto, "body", true), this.usersController.updateUser);
        this.router.delete("".concat(this.path, "/:id"), this.usersController.deleteUser);
    };
    return UsersRoute;
}();
export default UsersRoute;

//# sourceMappingURL=users.route.js.map