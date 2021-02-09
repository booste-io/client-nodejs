const booste = require('booste');

var prompts = ["A basketball", "A man", "A woman"] // alist of prompts, as strings
var images = ["https://upload.wikimedia.org/wikipedia/commons/7/7a/Basketball.png", "./erik.jpg", "./logo.png"] // list of images, as URLs, as strings

const apiKey = process.env.apiKey

let run = async () => {
    try{
        var out = await booste.clip(apiKey, prompts, images)
        console.log(out)
    }catch (err){
        console.log(err)
    }
}
    
run()    