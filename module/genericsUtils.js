const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

if ("BANANA_URL" in process.env){
    var endpoint = process.env.BANANA_URL
    console.log("Running from", endpoint)
    if (process.env.BANANA_URL === "local"){
        // console.log("Running from local")
        endpoint = "http://localhost/"
    }
} else {
    var endpoint = 'https://api.banana.dev/'
}

exports.runMain = async (apiKey, modelKey, modelParameters) => {
    const taskID = await callStartAPI(apiKey, modelKey, modelParameters)
    var retries = 0
    while (true) {
        const jsonOut = await callCheckAPI(taskID).catch(err => {
            if (err.includes("busy or not available")){
                retries = retries + 1
                if (retries > 5){
                    throw "job check endpoint busy or not available."
                }
            } else {
                throw err
            }
        })
        if (jsonOut !== undefined){
            if (jsonOut.taskStatus === "Done"){
                payloadOut = jsonOut.taskOut
                // Some servers return an "output" keyword so that it can be non-json datatype
                if('output' in payloadOut){
                    // console.log("workaround")
                    return payloadOut.output
                }
                return jsonOut.taskOut
            }
        }
    }

}

exports.startMain = async (apiKey, modelKey, modelParameters) => {
    const taskID = await callStartAPI(apiKey, modelKey, modelParameters)
    return taskID
}

exports.checkMain = async (apiKey, taskID) => {
    const jsonOut = await callCheckAPI(taskID)
    return jsonOut
}

const callStartAPI = async (apiKey, modelKey, modelParameters) => {
    const urlStart = endpoint.concat("api/task/start/v1/")
    const payload = {
        "id": uuidv4(),
        "created": Math.floor(new Date().getTime() / 1000),
        "data":
        {
            "apiKey" : apiKey,
            "modelKey" : modelKey,
            "modelParameters" : modelParameters
        }
    }
    
    const response = await axios.post(urlStart, payload).catch(err => {
        if (err.response) {
            throw `inference start call returned status code ${err.response.status}`
        } else if (err.request) {
            throw 'job start endpoint busy or not available.'
        } else {
            console.log(err)
            throw "Misc axios error. Please email erik@banana.dev with above error json"
        }
    })
    const jsonOut = response.data
    
    if (!jsonOut.success){
        throw `inference start call failed with message: ${jsonOut.message}`
    }

    const taskID = jsonOut.data.taskID
    if (taskID === undefined){
        throw  `inference start call failed without a message or taskID`
    }

    return taskID
}

const callCheckAPI = async (taskID) => {
    const urlCheck = endpoint.concat("api/task/check/v1/")

    const payload = {
        "id": uuidv4(),
        "created": Math.floor(new Date().getTime() / 1000),
        "longPoll": true,
        "data":
        {
            "taskID" : taskID
        }
    }
    
    const response = await axios.post(urlCheck, payload).catch(err => {
        if (err.response) {
            throw `inference check call returned status code ${format.code}`
        } else if (err.request) {
            throw 'server error: Job check endpoint busy or not available.'
        } else {
            console.log(err)
            throw "Misc axios error. Please email erik@banana.dev with above error json"
        }
    })
    const jsonOut = response.data

    if (!jsonOut.success){
        throw `inference check call failed with message: ${jsonOut.message}`
    }
    const data = jsonOut.data
    return data
}