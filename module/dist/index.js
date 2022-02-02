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
Object.defineProperty(exports, "__esModule", { value: true });
exports.check = exports.feedback = exports.start = exports.run = void 0;
const genericsUtils = require("./genericsUtils");
function run(apiKey, modelKey, modelInputs = {}, strategy = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const out = yield genericsUtils.runMain(apiKey = apiKey, modelKey = modelKey, modelInputs = modelInputs, strategy = strategy);
        return out;
    });
}
exports.run = run;
function start(apiKey, modelKey, modelInputs = {}, strategy = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const callID = yield genericsUtils.startMain(apiKey = apiKey, modelKey = modelKey, modelInputs = modelInputs, strategy = strategy);
        return callID;
    });
}
exports.start = start;
function feedback(apiKey, callID, feedback = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const jsonOut = yield genericsUtils.feedback(apiKey, callID, feedback);
        return jsonOut;
    });
}
exports.feedback = feedback;
function check(apiKey, callID) {
    return __awaiter(this, void 0, void 0, function* () {
        const jsonOut = yield genericsUtils.checkMain(apiKey, callID);
        return jsonOut;
    });
}
exports.check = check;
