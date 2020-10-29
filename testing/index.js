const booste = require('booste');


const string = "short test sentences are best"

let syncTest = async () => {
    const string = "short test sentences are best"
    // Sync test:
    try{
        // console.log("Sync test")
        const out = await booste.gpt2(apiKey = "f1f22e45-8ae6-4658-911c-cb015014cc03", inString = string, length=10, temperature=0.8, windowMax=10)
        console.log("sync out", out)
    }catch(e){
        // console.log("Error", e)
    }
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let asyncTest = async () => {
    const string = "short test sentences are best"
    // Async test:
    try{
        // console.log("Async test")
        var taskID = await booste.gpt2XLAsyncStart(apiKey = "f1f22e45-8ae6-4658-911c-cb015014cc03", inString = string, length=10, temperature=0.8, windowMax=10)
        // console.log("Async TaskID returned from Start API:", taskID)
        out = await booste.gpt2XLAsyncCheck(apiKey = "f1f22e45-8ae6-4658-911c-cb015014cc03", taskID = taskID)
        console.log("async out", out)

        while (true){
            await timeout(3000)
            out = await booste.gpt2XLAsyncCheck(apiKey = "f1f22e45-8ae6-4658-911c-cb015014cc03", taskID = taskID)
            console.log("async out", out)
            if (out.Status === "Finished" || out.Status === "Failed") {
                break
            }
        }
    }catch(e){
        // console.log("Error", e)
    }
}

syncTest()
asyncTest()
