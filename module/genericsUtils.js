"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.checkMain = exports.feedback = exports.startMain = exports.runMain = void 0;
var axios_1 = require("axios");
var uuidv4 = require('uuid').v4;
var endpoint = 'https://api.banana.dev/';
if ("BANANA_URL" in process.env) {
    endpoint = process.env.BANANA_URL;
    console.log("Running from", endpoint);
    if (process.env.BANANA_URL === "local") {
        // console.log("Running from local")
        endpoint = "http://localhost/";
    }
}
function runMain(apiKey, modelKey, modelInputs, strategy) {
    if (modelInputs === void 0) { modelInputs = {}; }
    if (strategy === void 0) { strategy = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var callID, jsonOut;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, startAPI(apiKey, modelKey, modelInputs, strategy)];
                case 1:
                    callID = _a.sent();
                    _a.label = 2;
                case 2:
                    if (!true) return [3 /*break*/, 4];
                    return [4 /*yield*/, checkAPI(apiKey, callID)];
                case 3:
                    jsonOut = _a.sent();
                    if (jsonOut !== undefined) {
                        if (jsonOut.message.toLowerCase() === "success") {
                            return [2 /*return*/, jsonOut];
                        }
                    }
                    return [3 /*break*/, 2];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.runMain = runMain;
function startMain(apiKey, modelKey, modelInputs, strategy) {
    if (modelInputs === void 0) { modelInputs = {}; }
    if (strategy === void 0) { strategy = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var callID;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, startAPI(apiKey, modelKey, modelInputs, strategy)];
                case 1:
                    callID = _a.sent();
                    return [2 /*return*/, callID];
            }
        });
    });
}
exports.startMain = startMain;
function feedback(apiKey, callID, feedback) {
    if (feedback === void 0) { feedback = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var jsonOut;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, feedbackAPI(apiKey, callID, feedback)];
                case 1:
                    jsonOut = _a.sent();
                    return [2 /*return*/, jsonOut];
            }
        });
    });
}
exports.feedback = feedback;
function checkMain(apiKey, callID) {
    return __awaiter(this, void 0, void 0, function () {
        var jsonOut;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, checkAPI(apiKey, callID)];
                case 1:
                    jsonOut = _a.sent();
                    return [2 /*return*/, jsonOut];
            }
        });
    });
}
exports.checkMain = checkMain;
var startAPI = function (apiKey, modelKey, modelInputs, strategy) { return __awaiter(void 0, void 0, void 0, function () {
    var urlStart, payload, response, jsonOut, callID;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                urlStart = endpoint.concat("start/v2/");
                payload = {
                    "id": uuidv4(),
                    "created": Math.floor(new Date().getTime() / 1000),
                    "apiKey": apiKey,
                    "modelKey": modelKey,
                    "modelInputs": modelInputs,
                    "strategy": strategy
                };
                return [4 /*yield*/, axios_1["default"].post(urlStart, payload)["catch"](function (err) {
                        if (err.response) {
                            throw "server error: status code ".concat(err.response.status);
                        }
                        else if (err.request) {
                            throw 'server error: endpoint busy or not available.';
                        }
                        else {
                            console.log(err);
                            throw "Misc axios error. Please email erik@banana.dev with above error";
                        }
                    })];
            case 1:
                response = _a.sent();
                jsonOut = response.data;
                if (jsonOut.message.toLowerCase().includes("error")) {
                    throw jsonOut.message;
                }
                callID = jsonOut.callID;
                if (callID === undefined) {
                    throw "server error: start call failed without a message or callID";
                }
                return [2 /*return*/, callID];
        }
    });
}); };
var feedbackAPI = function (apiKey, callID, feedback) { return __awaiter(void 0, void 0, void 0, function () {
    var url, payload, response, jsonOut;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = endpoint.concat("feedback/");
                payload = {
                    "id": uuidv4(),
                    "created": Math.floor(new Date().getTime() / 1000),
                    "apiKey": apiKey,
                    "callID": callID,
                    "feedback": feedback
                };
                return [4 /*yield*/, axios_1["default"].post(url, payload)["catch"](function (err) {
                        if (err.response) {
                            throw "server error: status code ".concat(err.response.status);
                        }
                        else if (err.request) {
                            throw 'server error: endpoint busy or not available.';
                        }
                        else {
                            console.log(err);
                            throw "Misc axios error. Please email erik@banana.dev with above error";
                        }
                    })];
            case 1:
                response = _a.sent();
                jsonOut = response.data;
                if (jsonOut.message.toLowerCase().includes("error")) {
                    throw jsonOut.message;
                }
                return [2 /*return*/, jsonOut];
        }
    });
}); };
var checkAPI = function (apiKey, callID) { return __awaiter(void 0, void 0, void 0, function () {
    var urlCheck, payload, response, jsonOut;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                urlCheck = endpoint.concat("check/v2/");
                payload = {
                    "id": uuidv4(),
                    "created": Math.floor(new Date().getTime() / 1000),
                    "longPoll": true,
                    "apiKey": apiKey,
                    "callID": callID
                };
                return [4 /*yield*/, axios_1["default"].post(urlCheck, payload)["catch"](function (err) {
                        if (err.response) {
                            throw "server error: status code ".concat(err.response.status);
                        }
                        else if (err.request) {
                            throw 'server error: endpoint busy or not available.';
                        }
                        else {
                            console.log(err);
                            throw "Misc axios error. Please email erik@banana.dev with above error";
                        }
                    })];
            case 1:
                response = _a.sent();
                jsonOut = response.data;
                if (jsonOut.message.toLowerCase().includes("error")) {
                    throw jsonOut.message;
                }
                return [2 /*return*/, jsonOut];
        }
    });
}); };
