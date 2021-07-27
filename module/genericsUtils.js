const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

if ("BOOSTE_URL" in process.env){
    var endpoint = process.env.BOOSTE_URL
    console.log("Running from", endpoint)
    if (process.env.BOOSTE_URL === "local"){
        // console.log("Running from local")
        endpoint = "http://localhost/"
    }
} else {
    var endpoint = 'https://api.booste.io/'
}

exports.runMain = async (apiKey, modelKey, modelParameters) => {
    const taskID = await callStartAPI(apiKey, modelKey, modelParameters)
    var retries = 0
    while (true) {
        const jsonOut = await callCheckAPI(taskID).catch(err => {
            if (err.includes("busy or not available")){
                retries = retries + 1
                if (retries > 5){
                    throw "Server error: Job check endpoint busy or not available."
                }
            } else {
                throw err
            }
        })
        if (jsonOut !== undefined){
            if (jsonOut.taskStatus === "Done"){
                payloadOut = jsonOut.taskOut
                // Nasty backward compat fix for users on GPT2 servers expecting plaintext output
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
            const format = {
                "code" : err.response.status,
                "message" : err.response.data['message']
            }
            throw `Booste inference start call returned status code ${format.code}\n${format.message}`
        } else if (err.request) {
            throw 'Job start endpoint busy or not available.'
        } else {
            console.log(err)
            throw "Misc axios error. Please email erik@booste.io with above error json"
        }
    })
    const jsonOut = response.data
    
    if (!jsonOut.success){
        throw `Booste inference start call failed with message: ${jsonOut.message}`
    }
    const taskID = jsonOut.data.taskID
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
            const format = {
                "code" : err.response.status,
                "message" : err.response.data['message']
            }
            throw `Server error: Booste inference check call returned status code ${format.code}\n${format.message}`
        } else if (err.request) {
            throw 'Server error: Job check endpoint busy or not available.'
        } else {
            console.log(err)
            throw "Misc axios error. Please email erik@booste.io with above error json"
        }
    })
    const jsonOut = response.data

    if (!jsonOut.success){
        throw `Booste inference check call failed with message: ${jsonOut.message}`
    }
    const data = jsonOut.data

    return data
}