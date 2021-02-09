const axios = require('axios');
var validUrl = require('valid-url');
const fs = require('fs');
const imageToBase64 = require('image-to-base64');
const utf8 = require('utf8');

if ("BoosteURL" in process.env){
    var endpoint = process.env.BoosteURL
    if (process.env.BoosteURL === "local"){
        endpoint = 'http://localhost:8080/2015-03-31/functions/function/invocations'
    }
} else {
    var endpoint = 'https://7rq1vzhvxj.execute-api.us-west-1.amazonaws.com/Prod/infer/'
}


exports.clipMain = async (apiKey, prompts, images, prettyPrint) => {
    if (typeof(prompts) != typeof([])) {
        throw "Error: prompts not of type: array"
    }
    if (typeof(images) != typeof([])) {
        throw "Error: images not of type: array"
    }
    if (prompts == []){
        throw "Error: prompts cannot be length: 0"
    } else {
        prompts.forEach(function(value){
            if (typeof(value) != typeof("")){
                throw "Error: all prompts must be type: string"
            }
          });
    }
    if (images == []){
        throw "Error: images cannot be length: 0"
    } else {
        images.forEach(function(value){
            if (typeof(value) != typeof("")){
                throw "Error: all images must be type: string"
            }
          });
    }

    var tasks = {}
    for (const [i, prompt] of prompts.entries()) {
        tasks[prompt] = {}
        for (const [j, image] of images.entries()) {
            tasks[prompt][image] = callAPI(apiKey, prompt, image)
        }
    }



    var outs = {}
    // var outLogits = new Array(prompts.length).fill(new Array(images.length).fill(0));
    var outLogits = []
    for (const [i, prompt] of prompts.entries()) {
        outs[prompt] = {}
        var imageLogits = []
        for (var [j, image] of images.entries()) {
            const out = await tasks[prompt][image]
            outs[prompt][image] = out
            if (out != null){
                imageLogits.push(out['similarity'])
            }
        }
        outLogits.push(imageLogits)
    }

    // outProbs = await softmaxCaller(outLogits, apiKey)
    // if (outProbs != null){
    //     for (const [i, prompt] of prompts.entries()) {
    //         for (var [j, image] of images.entries()) {
    //             if (outs[prompt][image] != null){
    //                 outs[prompt][image]["probabilityRelativeToPrompts"] = outProbs["relativeToPrompts"][i][j]
    //                 outs[prompt][image]["probabilityRelativeToImages"] = outProbs["relativeToImages"][i][j]
    //             }
    //         }
    //     }
    // }

    return(outs)


}


const callAPI = async (apiKey, prompt, image) => {
    const urlStart = endpoint

    var isPath = false
    var isUrl = false
    var imageSend

    if (validUrl.isUri(image)){
        isUrl = true
        imageSend = image
    } 

    try {
        if (fs.existsSync(image)) {
            const lastthree = image.slice(image.length-3, image.length)
            const lastfour = image.slice(image.length-4, image.length)
            if (lastthree == "jpg" || lastthree == "png" || lastfour == "jpeg"){
                await imageToBase64(image) // Path to the image
                    .then(
                        (response) => {
                            imageSend = utf8.encode(response); // "cGF0aC90by9maWxlLmpwZw=="
                            isPath = true
                        }
                    )
                    .catch(
                        (error) => {
                            throw error; // Logs an error if there was one
                        }
                    )
            }
        }
    } catch(err) {
        throw err
    }

    if (isPath == false && isUrl == false){
        console.log("Warning: image failed. Must be valid URL or path to local image file.")
        return null
    }

    const payload = {
        "apiKey" : apiKey,
        "prompt" : prompt,
        "image" : imageSend, 
        "isUrl": isUrl
    }
    
    const response = await axios.post(urlStart, payload).catch(err => {
        if (err.response) {
            const format = {
                "code" : err.response.status,
                "message" : err.response.data['message']
            }
            throw `- Server error: Booste inference server returned status code ${format.code}\n${format.message}`
        } else if (err.request) {
            throw '- Server error: Endpoint not available.'
        } else {
            throw "Misc axios error. Please email erik@booste.io"
        }
    })

    try{
        const jsonOut = response.data
        return jsonOut
    } catch {
        console.log(`Warning, server failed to process one request:\n\tprompt:  ${prompt}\n\timage:  ${image}\n`)
        return null
    }
    
    // const taskID = jsonOut.TaskID
}


// WORK IN PROGRESS
const softmaxCaller = async (similarities, apiKey) => {
    const urlStart = endpoint

    const payload = {
        "apiKey" : apiKey,
        "softmax" : "True",
        "similarities" : similarities
    }

    
    const response = await axios.post(urlStart, payload).catch(err => {
        if (err.response) {
            const format = {
                "code" : err.response.status,
                "message" : err.response.data['message']
            }
            throw `- Server error: Booste inference server returned status code ${format.code}\n${format.message}`
        } else if (err.request) {
            throw '- Server error: Endpoint not available.'
        } else {
            throw "Misc axios error. Please email erik@booste.io"
        }
    })

    try{
        const jsonOut = response.data
        return jsonOut
    } catch {
        console.log(`Warning, server failed run softmax`)
        return null
    }
    
}
