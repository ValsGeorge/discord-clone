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
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
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
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
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
import serverModel from "../models/servers.model";
import { HttpException } from "@exceptions/HttpException";
import { isEmpty } from "@utils/util";
var Serverservice = /*#__PURE__*/ function() {
    "use strict";
    function Serverservice() {
        _classCallCheck(this, Serverservice);
        this.servers = serverModel;
    }
    var _proto = Serverservice.prototype;
    _proto.findAllServer = function findAllServer() {
        var _this = this;
        return _asyncToGenerator(function() {
            var servers;
            return __generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            _this.servers.findAll()
                        ];
                    case 1:
                        servers = _state.sent();
                        return [
                            2,
                            servers
                        ];
                }
            });
        })();
    };
    _proto.findServerById = function findServerById(serverId) {
        var _this = this;
        return _asyncToGenerator(function() {
            var findServer;
            return __generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            _this.servers.findOne({
                                where: {
                                    id: serverId
                                }
                            })
                        ];
                    case 1:
                        findServer = _state.sent();
                        if (!findServer) throw new HttpException(409, "Server doesn't exist");
                        return [
                            2,
                            findServer
                        ];
                }
            });
        })();
    };
    _proto.createServer = function createServer(serverData) {
        var _this = this;
        return _asyncToGenerator(function() {
            var createServerData;
            return __generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        if (isEmpty(serverData)) throw new HttpException(400, "You're not serverData");
                        return [
                            4,
                            _this.servers.create(_objectSpread({}, serverData))
                        ];
                    case 1:
                        createServerData = _state.sent();
                        return [
                            2,
                            createServerData
                        ];
                }
            });
        })();
    };
    _proto.updateServer = function updateServer(serverId, serverData) {
        var _this = this;
        return _asyncToGenerator(function() {
            var findServer, updateServer;
            return __generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        if (isEmpty(serverData)) throw new HttpException(400, "You're not serverData");
                        if (!serverData.name) return [
                            3,
                            2
                        ];
                        return [
                            4,
                            _this.servers.findOne({
                                where: {
                                    name: serverData.name
                                }
                            })
                        ];
                    case 1:
                        findServer = _state.sent();
                        if (findServer && findServer.id != serverId) throw new HttpException(409, "This name ".concat(serverData.name, " already exists"));
                        _state.label = 2;
                    case 2:
                        return [
                            4,
                            _this.servers.update(serverData, {
                                where: {
                                    id: serverId
                                }
                            })
                        ];
                    case 3:
                        _state.sent();
                        return [
                            4,
                            _this.servers.findOne({
                                where: {
                                    id: serverId
                                }
                            })
                        ];
                    case 4:
                        updateServer = _state.sent();
                        return [
                            2,
                            updateServer
                        ];
                }
            });
        })();
    };
    _proto.deleteServer = function deleteServer(serverId) {
        var _this = this;
        return _asyncToGenerator(function() {
            var findServer;
            return __generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            _this.servers.findOne({
                                where: {
                                    id: serverId
                                }
                            })
                        ];
                    case 1:
                        findServer = _state.sent();
                        if (!findServer) throw new HttpException(409, "Server doesn't exist");
                        return [
                            4,
                            _this.servers.destroy({
                                where: {
                                    id: serverId
                                }
                            })
                        ];
                    case 2:
                        _state.sent();
                        return [
                            2,
                            findServer
                        ];
                }
            });
        })();
    };
    return Serverservice;
}();
export default Serverservice;

//# sourceMappingURL=server.service.js.map