function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var IndexController = function IndexController() {
    "use strict";
    _classCallCheck(this, IndexController);
    this.index = function(req, res, next) {
        try {
            res.sendStatus(200);
        } catch (error) {
            next(error);
        }
    };
};
export default IndexController;

//# sourceMappingURL=index.controller.js.map