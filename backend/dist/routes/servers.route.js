function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
import { Router } from "express";
import validationMiddleware from "@middlewares/validation.middleware";
import authMiddleware from "@/middlewares/auth.middleware";
import ServerController from "@controllers/servers.controller";
import { CreateServerDto } from "@/dtos/servers.dto";
var ServerRoute = /*#__PURE__*/ function() {
    "use strict";
    function ServerRoute() {
        _classCallCheck(this, ServerRoute);
        this.path = "/servers";
        this.router = Router();
        this.serverController = new ServerController();
        this.initializeRoutes();
    }
    var _proto = ServerRoute.prototype;
    _proto.initializeRoutes = function initializeRoutes() {
        this.router.get("".concat(this.path), authMiddleware, this.serverController.getServers);
        this.router.get("".concat(this.path, "/:id"), authMiddleware, this.serverController.getServerById);
        this.router.post("".concat(this.path, "/"), authMiddleware, validationMiddleware(CreateServerDto, "body"), this.serverController.createServer);
        this.router.put("".concat(this.path, "/:id"), authMiddleware, validationMiddleware(CreateServerDto, "body", true), this.serverController.updateServer);
        this.router.delete("".concat(this.path, "/:id"), authMiddleware, this.serverController.deleteServer);
    };
    return ServerRoute;
}();
export default ServerRoute;

//# sourceMappingURL=servers.route.js.map