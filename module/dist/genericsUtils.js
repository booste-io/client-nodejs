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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkMain = exports.feedback = exports.startMain = exports.runMain = void 0;
const axios_1 = __importDefault(require("axios"));
const { v4: uuidv4 } = require('uuid');
let endpoint = 'https://api.banana.dev/';
if ("BANANA_URL" in process.env) {
    endpoint = process.env.BANANA_URL;
    console.log("Running from", endpoint);
    if (process.env.BANANA_URL === "local") {
        // console.log("Running from local")
        endpoint = "http://localhost/";
    }
}
function runMain(apiKey, modelKey, modelInputs = {}, strategy = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const callID = yield startAPI(apiKey, modelKey, modelInputs, strategy);
        while (true) {
            const jsonOut = yield checkAPI(apiKey, callID);
            if (jsonOut !== undefined) {
                if (jsonOut.message.toLowerCase() === "success") {
                    jsonOut['callID'] = callID;
                    return jsonOut;
                }
            }
        }
    });
}
exports.runMain = runMain;
function startMain(apiKey, modelKey, modelInputs = {}, strategy = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const callID = yield startAPI(apiKey, modelKey, modelInputs, strategy);
        return callID;
    });
}
exports.startMain = startMain;
function feedback(apiKey, callID, feedback = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const jsonOut = yield feedbackAPI(apiKey, callID, feedback);
        return jsonOut;
    });
}
exports.feedback = feedback;
function checkMain(apiKey, callID) {
    return __awaiter(this, void 0, void 0, function* () {
        const jsonOut = yield checkAPI(apiKey, callID);
        return jsonOut;
    });
}
exports.checkMain = checkMain;
const startAPI = (apiKey, modelKey, modelInputs, strategy) => __awaiter(void 0, void 0, void 0, function* () {
    const urlStart = endpoint.concat("start/v2/");
    const payload = {
        "id": uuidv4(),
        "created": Math.floor(new Date().getTime() / 1000),
        "apiKey": apiKey,
        "modelKey": modelKey,
        "modelInputs": modelInputs,
        "strategy": strategy
    };
    const response = yield axios_1.default.post(urlStart, payload).catch(err => {
        if (err.response) {
            throw `server error: status code ${err.response.status}`;
        }
        else if (err.request) {
            throw 'server error: endpoint busy or not available.';
        }
        else {
            console.log(err);
            throw "Misc axios error. Please email erik@banana.dev with above error";
        }
    });
    const jsonOut = response.data;
    if (jsonOut.message.toLowerCase().includes("error")) {
        throw jsonOut.message;
    }
    const callID = jsonOut.callID;
    if (callID === undefined) {
        throw `server error: start call failed without a message or callID`;
    }
    return callID;
});
const feedbackAPI = (apiKey, callID, feedback) => __awaiter(void 0, void 0, void 0, function* () {
    const url = endpoint.concat("feedback/v2/");
    const payload = {
        "id": uuidv4(),
        "created": Math.floor(new Date().getTime() / 1000),
        "apiKey": apiKey,
        "callID": callID,
        "feedback": feedback
    };
    const response = yield axios_1.default.post(url, payload).catch(err => {
        if (err.response) {
            throw `server error: status code ${err.response.status}`;
        }
        else if (err.request) {
            throw 'server error: endpoint busy or not available.';
        }
        else {
            console.log(err);
            throw "Misc axios error. Please email erik@banana.dev with above error";
        }
    });
    const jsonOut = response.data;
    if (jsonOut.message.toLowerCase().includes("error")) {
        throw jsonOut.message;
    }
    return jsonOut;
});
const checkAPI = (apiKey, callID) => __awaiter(void 0, void 0, void 0, function* () {
    const urlCheck = endpoint.concat("check/v2/");
    const payload = {
        "id": uuidv4(),
        "created": Math.floor(new Date().getTime() / 1000),
        "longPoll": true,
        "apiKey": apiKey,
        "callID": callID
    };
    const response = yield axios_1.default.post(urlCheck, payload).catch(err => {
        if (err.response) {
            throw `server error: status code ${err.response.status}`;
        }
        else if (err.request) {
            throw 'server error: endpoint busy or not available.';
        }
        else {
            console.log(err);
            throw "Misc axios error. Please email erik@banana.dev with above error";
        }
    });
    const jsonOut = response.data;
    if (jsonOut.message.toLowerCase().includes("error")) {
        throw jsonOut.message;
    }
    return jsonOut;
});
