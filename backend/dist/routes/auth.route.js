function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
import { Router } from "express";
import AuthController from "@controllers/auth.controller";
import { CreateUserDto, LoginUserDto } from "@dtos/users.dto";
import authMiddleware from "@middlewares/auth.middleware";
import validationMiddleware from "@middlewares/validation.middleware";
var AuthRoute = /*#__PURE__*/ function() {
    "use strict";
    function AuthRoute() {
        _classCallCheck(this, AuthRoute);
        this.path = "/users";
        this.router = Router();
        this.authController = new AuthController();
        this.initializeRoutes();
    }
    var _proto = AuthRoute.prototype;
    _proto.initializeRoutes = function initializeRoutes() {
        this.router.post("".concat(this.path, "/register"), validationMiddleware(CreateUserDto, "body"), this.authController.signUp);
        this.router.post("".concat(this.path, "/login"), validationMiddleware(LoginUserDto, "body"), this.authController.logIn);
        this.router.post("".concat(this.path, "/logout"), authMiddleware, this.authController.logOut);
    };
    return AuthRoute;
}();
export default AuthRoute;

//# sourceMappingURL=auth.route.js.map