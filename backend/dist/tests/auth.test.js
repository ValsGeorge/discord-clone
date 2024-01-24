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
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import request from "supertest";
import App from "@/app";
import AuthRoute from "@routes/auth.route";
afterAll(/*#__PURE__*/ _asyncToGenerator(function() {
    return __generator(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4,
                    new Promise(function(resolve) {
                        return setTimeout(function() {
                            return resolve();
                        }, 500);
                    })
                ];
            case 1:
                _state.sent();
                return [
                    2
                ];
        }
    });
}));
describe("Testing Auth", function() {
    describe("[POST] /signup", function() {
        it("response should have the Create userData", /*#__PURE__*/ _asyncToGenerator(function() {
            var userData, authRoute, users, _, _1, _tmp, app;
            return __generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        userData = {
                            email: "test@email.com",
                            password: "q1w2e3r4!"
                        };
                        authRoute = new AuthRoute();
                        users = authRoute.authController.authService.users;
                        users.findOne = jest.fn().mockReturnValue(null);
                        _1 = (_ = jest.fn()).mockReturnValue;
                        _tmp = {
                            _id: "60706478aad6c9ad19a31c84",
                            email: userData.email
                        };
                        return [
                            4,
                            bcrypt.hash(userData.password, 10)
                        ];
                    case 1:
                        users.create = _1.apply(_, [
                            (_tmp.password = _state.sent(), _tmp)
                        ]);
                        mongoose.connect = jest.fn();
                        app = new App([
                            authRoute
                        ]);
                        return [
                            2,
                            request(app.getServer()).post("".concat(authRoute.path, "signup")).send(userData)
                        ];
                }
            });
        }));
    });
    describe("[POST] /login", function() {
        it("response should have the Set-Cookie header with the Authorization token", /*#__PURE__*/ _asyncToGenerator(function() {
            var userData, authRoute, users, _, _1, _tmp, app;
            return __generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        userData = {
                            email: "test@email.com",
                            password: "q1w2e3r4!"
                        };
                        authRoute = new AuthRoute();
                        users = authRoute.authController.authService.users;
                        _1 = (_ = jest.fn()).mockReturnValue;
                        _tmp = {
                            _id: "60706478aad6c9ad19a31c84",
                            email: userData.email
                        };
                        return [
                            4,
                            bcrypt.hash(userData.password, 10)
                        ];
                    case 1:
                        users.findOne = _1.apply(_, [
                            (_tmp.password = _state.sent(), _tmp)
                        ]);
                        mongoose.connect = jest.fn();
                        app = new App([
                            authRoute
                        ]);
                        return [
                            2,
                            request(app.getServer()).post("".concat(authRoute.path, "login")).send(userData).expect("Set-Cookie", /^Authorization=.+/)
                        ];
                }
            });
        }));
    });
// describe('[POST] /logout', () => {
//   it('logout Set-Cookie Authorization=; Max-age=0', async () => {
//     const userData: User = {
//       _id: '60706478aad6c9ad19a31c84',
//       email: 'test@email.com',
//       password: await bcrypt.hash('q1w2e3r4!', 10),
//     };
//     const authRoute = new AuthRoute();
//     const users = authRoute.authController.authService.users;
//     users.findOne = jest.fn().mockReturnValue(userData);
//     (mongoose as any).connect = jest.fn();
//     const app = new App([authRoute]);
//     return request(app.getServer())
//       .post(`${authRoute.path}logout`)
//       .send(userData)
//       .set('Set-Cookie', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ')
//       .expect('Set-Cookie', /^Authorization=\; Max-age=0/);
//   });
// });
});

//# sourceMappingURL=auth.test.js.map