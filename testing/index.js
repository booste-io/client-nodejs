const booste = require('booste');

var string = "This is a test for"
const apiKey = process.env.apiKey
const modelKey = process.env.modelKey

const modelParameters = {
        "string": string,
        "length": 100,
        "temperature" : 0.85,
        "outputQuantity": 1
}


let run = async (modelParameters) => {
    console.log("Starting call with parameters:")
    console.log(modelParameters)
    try{
        var cum = 0
        var runs = 1
        for (var i=0; i<runs; i++){
            var start = new Date()
            try{
                var out = await booste.run(apiKey, modelKey, modelParameters)
            } catch(e){
                console.log(e)
            }
            
            console.log(out)
            var runVal = new Date() - start
            cum = cum + runVal
            console.log(runVal)
        }
        console.log("done")
        console.log(cum/runs)

    }catch(e){
        console.log(e)
    }
    
}
    
run(modelParameters)      
run(modelParameters)    
// run(modelParameters)  
// run(modelParameters)      
// run(modelParameters)    
// run(modelParameters)  
// run(modelParameters)      
// run(modelParameters)    
// run(modelParameters)  
// run(modelParameters)      
// run(modelParameters)    
// run(modelParameters)  
// run(modelParameters)      
// run(modelParameters)    
// run(modelParameters)  