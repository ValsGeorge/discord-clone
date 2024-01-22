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
    return function () {
        var self = this,
            args = arguments;
        return new Promise(function (resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(
                    gen,
                    resolve,
                    reject,
                    _next,
                    _throw,
                    "next",
                    value
                );
            }
            function _throw(err) {
                asyncGeneratorStep(
                    gen,
                    resolve,
                    reject,
                    _next,
                    _throw,
                    "throw",
                    err
                );
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
var __generator =
    (this && this.__generator) ||
    function (thisArg, body) {
        var f,
            y,
            t,
            g,
            _ = {
                label: 0,
                sent: function () {
                    if (t[0] & 1) throw t[1];
                    return t[1];
                },
                trys: [],
                ops: [],
            };
        return (
            (g = {
                next: verb(0),
                throw: verb(1),
                return: verb(2),
            }),
            typeof Symbol === "function" &&
                (g[Symbol.iterator] = function () {
                    return this;
                }),
            g
        );
        function verb(n) {
            return function (v) {
                return step([n, v]);
            };
        }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (
                        ((f = 1),
                        y &&
                            (t =
                                op[0] & 2
                                    ? y["return"]
                                    : op[0]
                                    ? y["throw"] ||
                                      ((t = y["return"]) && t.call(y), 0)
                                    : y.next) &&
                            !(t = t.call(y, op[1])).done)
                    )
                        return t;
                    if (((y = 0), t)) op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return {
                                value: op[1],
                                done: false,
                            };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (
                                !((t = _.trys),
                                (t = t.length > 0 && t[t.length - 1])) &&
                                (op[0] === 6 || op[0] === 2)
                            ) {
                                _ = 0;
                                continue;
                            }
                            if (
                                op[0] === 3 &&
                                (!t || (op[1] > t[0] && op[1] < t[3]))
                            ) {
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
                    op = [6, e];
                    y = 0;
                } finally {
                    f = t = 0;
                }
            if (op[0] & 5) throw op[1];
            return {
                value: op[0] ? op[1] : void 0,
                done: true,
            };
        }
    };
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS } from "@config";
import sequelize from "databases/index";
import errorMiddleware from "@middlewares/error.middleware";
import { logger, stream } from "@utils/logger";
var App = /*#__PURE__*/ (function () {
    "use strict";
    function App() {
        _classCallCheck(this, App);
        this.app = express();
        this.env = NODE_ENV || "development";
        this.port = PORT || 3000;
    }
    var _proto = App.prototype;
    _proto.initialize = function initialize(routes) {
        var _this = this;
        return _asyncToGenerator(function () {
            return __generator(this, function (_state) {
                switch (_state.label) {
                    case 0:
                        return [4, _this.connectToDatabase()];
                    case 1:
                        _state.sent();
                        _this.initializeMiddleware();
                        _this.initializeRoutes(routes);
                        if (_this.env !== "production") {
                            _this.initializeSwagger();
                        }
                        _this.initializeErrorHandling();
                        return [2];
                }
            });
        })();
    };
    _proto.listen = function listen() {
        var _this = this;
        this.app.listen(this.port, function () {
            logger.info("======= ENV: ".concat(_this.env, " ========"));
            logger.info(
                "\uD83D\uDE80 App listening on the port ".concat(_this.port)
            );
            logger.info("=================================");
        });
    };
    _proto.getServer = function getServer() {
        return this.app;
    };
    _proto.connectToDatabase = function connectToDatabase() {
        return _asyncToGenerator(function () {
            var db, error;
            return __generator(this, function (_state) {
                switch (_state.label) {
                    case 0:
                        _state.trys.push([0, 4, , 5]);
                        return [4, sequelize];
                    case 1:
                        db = _state.sent();
                        console.log(db);
                        return [
                            4,
                            db
                                .authenticate()
                                .then(function () {
                                    return console.log("Database connected...");
                                })
                                .catch(function (err) {
                                    return console.log("Error: " + err);
                                }),
                        ];
                    case 2:
                        _state.sent();
                        return [
                            4,
                            db
                                .sync()
                                .then(function () {
                                    return console.log("Database synced...");
                                })
                                .catch(function (err) {
                                    return console.log("Error: " + err);
                                }),
                        ];
                    case 3:
                        _state.sent();
                        logger.info("=================================");
                        logger.info(
                            "\uD83D\uDCDA App connected to the database"
                        );
                        return [3, 5];
                    case 4:
                        error = _state.sent();
                        logger.error("=================================");
                        logger.error(
                            "\uD83D\uDC94 App failed to connect to the database"
                        );
                        logger.error(error);
                        return [3, 5];
                    case 5:
                        return [2];
                }
            });
        })();
    };
    _proto.initializeMiddleware = function initializeMiddleware() {
        this.app.use(
            morgan(LOG_FORMAT, {
                stream: stream,
            })
        );
        this.app.use(
            cors({
                origin: ORIGIN,
                credentials: CREDENTIALS,
            })
        );
        this.app.use(hpp());
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(express.json());
        this.app.use(
            express.urlencoded({
                extended: true,
            })
        );
        this.app.use(cookieParser());
    };
    _proto.initializeRoutes = function initializeRoutes(routes) {
        var _this = this;
        routes.forEach(function (route) {
            _this.app.use("/", route.router);
        });
    };
    _proto.initializeSwagger = function initializeSwagger() {
        var options = {
            swaggerDefinition: {
                info: {
                    title: "REST API",
                    version: "1.0.0",
                    description: "Example docs",
                },
            },
            apis: ["swagger.yaml"],
        };
        var specs = swaggerJSDoc(options);
        this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
    };
    _proto.initializeErrorHandling = function initializeErrorHandling() {
        this.app.use(errorMiddleware);
    };
    return App;
})();
export default App;

//# sourceMappingURL=app.js.map
