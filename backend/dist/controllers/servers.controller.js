function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var __generator = this && this.__generator || function(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return(g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g);
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
};
import ServerService from "services/server.service";
var ServerController = function ServerController() {
    "use strict";
    _classCallCheck(this, ServerController);
    this.serverService = new ServerService();
    var _this = this;
    this.getServers = function() {
        var _ref = _asyncToGenerator(function(req, res, next) {
            var findAllServersData, error;
            return __generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            2,
                            ,
                            3
                        ]);
                        return [
                            4,
                            _this.serverService.findAllServer()
                        ];
                    case 1:
                        findAllServersData = _state.sent();
                        res.status(200).json({
                            data: findAllServersData,
                            message: "findAll"
                        });
                        return [
                            3,
                            3
                        ];
                    case 2:
                        error = _state.sent();
                        next(error);
                        return [
                            3,
                            3
                        ];
                    case 3:
                        return [
                            2
                        ];
                }
            });
        });
        return function(req, res, next) {
            return _ref.apply(this, arguments);
        };
    }();
    var _this1 = this;
    this.getServerById = function() {
        var _ref = _asyncToGenerator(function(req, res, next) {
            var serverId, findOneServerData, error;
            return __generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            2,
                            ,
                            3
                        ]);
                        serverId = req.params.id;
                        return [
                            4,
                            _this1.serverService.findServerById(serverId)
                        ];
                    case 1:
                        findOneServerData = _state.sent();
                        res.status(200).json({
                            data: findOneServerData,
                            message: "findOne"
                        });
                        return [
                            3,
                            3
                        ];
                    case 2:
                        error = _state.sent();
                        next(error);
                        return [
                            3,
                            3
                        ];
                    case 3:
                        return [
                            2
                        ];
                }
            });
        });
        return function(req, res, next) {
            return _ref.apply(this, arguments);
        };
    }();
    var _this2 = this;
    this.createServer = function() {
        var _ref = _asyncToGenerator(function(req, res, next) {
            var serverData, createServerData, error;
            return __generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            2,
                            ,
                            3
                        ]);
                        serverData = req.body;
                        return [
                            4,
                            _this2.serverService.createServer(serverData)
                        ];
                    case 1:
                        createServerData = _state.sent();
                        res.status(201).json({
                            data: createServerData,
                            message: "created"
                        });
                        return [
                            3,
                            3
                        ];
                    case 2:
                        error = _state.sent();
                        next(error);
                        return [
                            3,
                            3
                        ];
                    case 3:
                        return [
                            2
                        ];
                }
            });
        });
        return function(req, res, next) {
            return _ref.apply(this, arguments);
        };
    }();
    var _this3 = this;
    this.updateServer = function() {
        var _ref = _asyncToGenerator(function(req, res, next) {
            var serverId, serverData, updateServerData, error;
            return __generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            2,
                            ,
                            3
                        ]);
                        serverId = req.params.id;
                        serverData = req.body;
                        return [
                            4,
                            _this3.serverService.updateServer(serverId, serverData)
                        ];
                    case 1:
                        updateServerData = _state.sent();
                        res.status(200).json({
                            data: updateServerData,
                            message: "updated"
                        });
                        return [
                            3,
                            3
                        ];
                    case 2:
                        error = _state.sent();
                        next(error);
                        return [
                            3,
                            3
                        ];
                    case 3:
                        return [
                            2
                        ];
                }
            });
        });
        return function(req, res, next) {
            return _ref.apply(this, arguments);
        };
    }();
    var _this4 = this;
    this.deleteServer = function() {
        var _ref = _asyncToGenerator(function(req, res, next) {
            var serverId, deleteServerData, error;
            return __generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            2,
                            ,
                            3
                        ]);
                        serverId = req.params.id;
                        return [
                            4,
                            _this4.serverService.deleteServer(serverId)
                        ];
                    case 1:
                        deleteServerData = _state.sent();
                        res.status(200).json({
                            data: deleteServerData,
                            message: "deleted"
                        });
                        return [
                            3,
                            3
                        ];
                    case 2:
                        error = _state.sent();
                        next(error);
                        return [
                            3,
                            3
                        ];
                    case 3:
                        return [
                            2
                        ];
                }
            });
        });
        return function(req, res, next) {
            return _ref.apply(this, arguments);
        };
    }();
};
export default ServerController;

//# sourceMappingURL=servers.controller.js.map