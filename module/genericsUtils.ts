import axios, {AxiosError} from 'axios'
const { v4: uuidv4 } = require('uuid')

let endpoint: string = 'https://api.banana.dev/'
if ("BANANA_URL" in process.env){
    endpoint = process.env.BANANA_URL!
    console.log("Running from", endpoint)
    if (process.env.BANANA_URL === "local"){
        // console.log("Running from local")
        endpoint = "http://localhost/"
    }
}


export async function runMain(apiKey: string, modelKey: string, modelInputs: object = {}, strategy: object = {}): Promise<object>{
    const callID = await startAPI(apiKey, modelKey, modelInputs, strategy)
    while (true) {
        const jsonOut = await checkAPI(apiKey, callID)
        if (jsonOut !== undefined){
            if (jsonOut.message.toLowerCase() === "success"){
                jsonOut['CallID'] = callID
                return jsonOut
            }
        }
    }

}

export async function startMain(apiKey: string, modelKey: string, modelInputs: object = {}, strategy: object = {}): Promise<string>{
    const callID = await startAPI(apiKey, modelKey, modelInputs, strategy)
    return callID
}

export async function feedback(apiKey: string, callID: string, feedback: object = {}): Promise<object>{
    const jsonOut = await feedbackAPI(apiKey, callID, feedback)
    return jsonOut
}

export async function checkMain(apiKey: string, callID: string): Promise<object>{
    const jsonOut = await checkAPI(apiKey, callID)
    return jsonOut
}

const startAPI = async (apiKey: string, modelKey: string, modelInputs: object, strategy: object): Promise<string> => {
    const urlStart = endpoint.concat("start/v2/")
    const payload = {
        "id": uuidv4(),
        "created": Math.floor(new Date().getTime() / 1000),
        "apiKey" : apiKey,
        "modelKey" : modelKey,
        "modelInputs" : modelInputs,
        "strategy" : strategy
    }
    
    const response = await axios.post(urlStart, payload).catch(err => {
        if (err.response) {
            throw `server error: status code ${err.response.status}`
        } else if (err.request) {
            throw 'server error: endpoint busy or not available.'
        } else {
            console.log(err)
            throw "Misc axios error. Please email erik@banana.dev with above error"
        }
    })
    const jsonOut = response.data
    
    if (jsonOut.message.toLowerCase().includes("error")){
        throw jsonOut.message
    }

    const callID = jsonOut.callID
    if (callID === undefined){
        throw  `server error: start call failed without a message or callID`
    }

    return callID
}

const feedbackAPI = async (apiKey: string, callID: string, feedback: object): Promise<any> => {
    const url = endpoint.concat("feedback/")

    const payload = {
        "id": uuidv4(),
        "created": Math.floor(new Date().getTime() / 1000),
        "apiKey" : apiKey,
        "callID" : callID,
        "feedback": feedback
    }
    
    const response = await axios.post(url, payload).catch(err => {
        if (err.response) {
            throw `server error: status code ${err.response.status}`
        } else if (err.request) {
            throw 'server error: endpoint busy or not available.'
        } else {
            console.log(err)
            throw "Misc axios error. Please email erik@banana.dev with above error"
        }
    })
    const jsonOut = response.data
    
    if (jsonOut.message.toLowerCase().includes("error")){
        throw jsonOut.message
    }
    return jsonOut
}
const checkAPI = async (apiKey: string, callID: string): Promise<any> => {
    const urlCheck = endpoint.concat("check/v2/")

    const payload = {
        "id": uuidv4(),
        "created": Math.floor(new Date().getTime() / 1000),
        "longPoll": true,
        "apiKey" : apiKey,
         "callID" : callID
    }
    
    const response = await axios.post(urlCheck, payload).catch(err => {
        if (err.response) {
            throw `server error: status code ${err.response.status}`
        } else if (err.request) {
            throw 'server error: endpoint busy or not available.'
        } else {
            console.log(err)
            throw "Misc axios error. Please email erik@banana.dev with above error"
        }
    })
    const jsonOut = response.data
    
    if (jsonOut.message.toLowerCase().includes("error")){
        throw jsonOut.message
    }
    return jsonOut
}
