const booste = require('booste');

var string = "My favorite part about Lily is"
var apiKey = process.env.apiKey

apiKey = "f1f22e45-8ae6-4658-911c-cb015014cc03"

let run = async () => {
    console.log("Input:", string)
    var out = await booste.gpt2(apiKey, string, 20)
    console.log("Output:", out.join(' '))
}
    
run()    