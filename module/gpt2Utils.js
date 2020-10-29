const axios = require('axios');

exports.gpt2SyncMain = async (apiKey, modelSize, inString, length, temperature, windowMax) => {
    const syncMode = "synchronous"
    validateInput(temperature, windowMax)
    taskID = await callStartAPI(apiKey, syncMode, modelSize, inString, length, temperature, windowMax)
    const delayParams = chooseDelayParams(modelSize, length, windowMax)
    const interval = delayParams['interval']
    const initialWait = delayParams['initialWait']
    await timeout(initialWait)
    while (true) {
        jsonOut = await callCheckAPI(apiKey, syncMode, taskID)
        if (jsonOut['Status'] === "Finished"){
            return jsonOut["Output"]
        }
        if (jsonOut["Status"] === "Failed"){
            throw "- Server error: Booste inference job returned status 'Failed'"
        }
        await timeout(interval)
    }

}

exports.gpt2AsyncStartMain = async (apiKey, modelSize, inString, length, temperature, windowMax) => {
    const syncMode = "asynchronous"
    validateInput(temperature, windowMax)
    taskID = await callStartAPI(apiKey, syncMode, modelSize, inString, length, temperature, windowMax)
    return taskID
}

exports.gpt2AsyncCheckMain = async (apiKey, taskID) => {
    const syncMode = "asynchronous"
    jsonOut = await callCheckAPI(apiKey, syncMode, taskID)
    return jsonOut
}


const validateInput = (temperature, windowMax) => {
    // Make sure the request is valid
    if (temperature < 0.1 || temperature > 1) {
        throw `Client error: temperature=${temperature} is out of bounds.\n\tmin = 0.1\n\tmax = 1`
    };
    if (windowMax < 1 || windowMax > 1023) {
        throw `Client error: temperature=${windowMax} is out of bounds.\n\tmin = 1\n\tmax = 1023`
    };

}

const callStartAPI = async (apiKey, syncMode, modelSize, inString, length, temperature, windowMax) => {
    // const endpoint = "http://localhost/"
    // const route_start = 'inference/pretrained/gpt2/async/start/v2'
    const urlStart = "https://booste-corporation-v3-flask.zeet.app/inference/pretrained/gpt2/async/start"
    const payload = {
        "string" : inString,
        "length" : length,
        "temperature" : temperature,
        "apiKey" : apiKey,
        "modelSize" : modelSize,
        "windowMax" : windowMax, 
        "syncMode": syncMode
    }
    
    const response = await axios.post(urlStart, payload).catch(err => {
        if (err.response) {
            const format = {
                "code" : response.status_code,
                "message" : response.data['message']
            }
            throw `- Server error: Booste inference server returned status code ${format.code}\n${format.message}`
        } else if (err.request) {
            throw '- Server error: Endpoint not available.'
        } else {
            throw "Misc axios error. Please email erik@booste.io"
        }
    })
    const jsonOut = response.data
    const taskID = jsonOut.TaskID

    return taskID
}

const callCheckAPI = async (apiKey, syncMode, taskID) => {
    const urlCheck= "https://booste-corporation-v3-flask.zeet.app/inference/pretrained/gpt2/async/check/v2"
    const payload = {
        "apiKey" : apiKey,
        "syncMode" : syncMode,
        "taskID" : taskID
    }
    
    const response = await axios.post(urlCheck, payload).catch(err => {
        if (err.response) {
            const format = {
                "code" : response.status_code,
                "message" : response.data['message']
            }
            throw `- Server error: Booste inference server returned status code ${format.code}\n${format.message}`
        } else if (err.request) {
            throw '- Server error: Endpoint not available.'
        } else {
            throw "Misc axios error. Please email erik@booste.io"
        }
    })
    const jsonOut = response.data
    return jsonOut
}

const chooseDelayParams = (modelSize, length, windowMax) => {
    // choose a delay appropriate to the call
    if (modelSize === 'gpt2'){
        var delayParams = {'interval': length*100, "initialWait": length*200}
    }else if (modelSize === 'gpt2-xl'){
        var delayParams = {'interval': length*200, "initialWait": length*400}
    }else{
        var delayParams = {'interval': 3000, "initialWait": length*300}
    }
    // Correct for small calls so it's not very rapid
    if (delayParams.interval < 3000){
        delayParams.interval = 3000
    }
    return delayParams
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}