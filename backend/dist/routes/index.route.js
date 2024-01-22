function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
import { Router } from "express";
import IndexController from "@controllers/index.controller";
var IndexRoute = /*#__PURE__*/ function() {
    "use strict";
    function IndexRoute() {
        _classCallCheck(this, IndexRoute);
        this.path = "/";
        this.router = Router();
        this.indexController = new IndexController();
        this.initializeRoutes();
    }
    var _proto = IndexRoute.prototype;
    _proto.initializeRoutes = function initializeRoutes() {
        this.router.get("".concat(this.path), this.indexController.index);
    };
    return IndexRoute;
}();
export default IndexRoute;

//# sourceMappingURL=index.route.js.map