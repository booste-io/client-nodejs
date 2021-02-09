const axios = require('axios');

if ("BoosteURL" in process.env){
    var endpoint = process.env.BoosteURL
    if (process.env.BoosteURL === "local"){
        endpoint = "http://localhost/"
    }
} else {
    var endpoint = 'https://booste-corporation-v3-flask.zeet.app/'
}

exports.runMain = async (apiKey, modelKey, modelParameters) => {
    const syncMode = "synchronous"
    const taskID = await callStartAPI(apiKey, modelKey, modelParameters, syncMode)
    const delayParams = chooseDelayParams()
    const interval = delayParams['interval']
    const initialWait = delayParams['initialWait']
    await timeout(initialWait)
    var retries = 0
    while (true) {
        const jsonOut = await callCheckAPI(apiKey, syncMode, taskID).catch(err => {
            if (err.includes("busy or not available")){
                // console.log("Retry")
                retries = retries + 1
                // console.log(retries)
                if (retries > 5){
                    throw "Server error: Job check endpoint busy or not available."
                }
            } else {
                throw err
            }
        })
        if (jsonOut !== undefined){
            if (jsonOut['status'] === "finished"){
                return jsonOut["output"]
            }
            if (jsonOut["status"] === "failed"){
                throw "Server error: Booste inference job returned status 'Failed'"
            }
        }
        await timeout(interval)
    }

}

exports.startMain = async (apiKey, modelKey, modelParameters) => {
    const syncMode = "asynchronous"
    const taskID = await callStartAPI(apiKey, modelKey, modelParameters, syncMode)
    return taskID
}

exports.checkMain = async (apiKey, taskID) => {
    const syncMode = "asynchronous"
    const jsonOut = await callCheckAPI(apiKey, syncMode, taskID)
    return jsonOut
}

const callStartAPI = async (apiKey, modelKey, modelParameters, syncMode) => {
    const urlStart = endpoint.concat("inference/start")
    const payload = {
        "apiKey" : apiKey,
        "modelKey" : modelKey,
        "modelParameters" : modelParameters, 
        "syncMode" : syncMode
    }
    
    const response = await axios.post(urlStart, payload).catch(err => {
        if (err.response) {
            const format = {
                "code" : err.response.status,
                "message" : err.response.data['message']
            }
            throw `Server error: Booste inference start call returned status code ${format.code}\n${format.message}`
        } else if (err.request) {
            throw 'Server error: Job start endpoint busy or not available.'
        } else {
            console.log(err)
            throw "Misc axios error. Please email erik@booste.io with above error json"
        }
    })
    const jsonOut = response.data
    const taskID = jsonOut.taskID
    return taskID
}

const callCheckAPI = async (apiKey, syncMode, taskID) => {
    const urlCheck = endpoint.concat("inference/check")
    const payload = {
        "apiKey" : apiKey,
        "syncMode" : syncMode,
        "taskID" : taskID
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
    return jsonOut
}

const chooseDelayParams = () => {
    // choose a delay appropriate to the call

    // TODO: actually do this dynamically based on model. 
    // Perhaps pass back suggested wait time from start call.

    // Hardcode for now
    var delayParams = {'interval': 1000, "initialWait": 1000}
    return delayParams
}


/// baaaaaad practice bro
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}