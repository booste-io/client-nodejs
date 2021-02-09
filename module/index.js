const gpt2Utils = require("./gpt2Utils")
const genericsUtils = require("./genericsUtils")
const clipUtils = require("./clipUtils")

exports.gpt2 = async (apiKey, inString, length = 5, temperature = 0.8, windowMax = 100) => {
  const out_list = await gpt2Utils.gpt2SyncMain(
    apiKey = apiKey, 
    modelSize = "gpt2", 
    inString = inString, 
    length = length, 
    temperature = temperature,  
    windowMax = windowMax)
  return out_list
}

exports.gpt2Start = async (apiKey, inString, length = 5, temperature = 0.8, windowMax = 100) => {
  const taskID = await gpt2Utils.gpt2AsyncStartMain(
    apiKey = apiKey, 
    modelSize = "gpt2", 
    inString = inString, 
    length = length, 
    temperature = temperature,  
    windowMax = windowMax)
  return taskID
}

exports.gpt2Check = async (apiKey, taskID) => {
  const jsonOut = await gpt2Utils.gpt2AsyncCheckMain(apiKey, taskID)
  return jsonOut
}

exports.gpt2XL = async (apiKey, inString, length = 5, temperature = 0.8, windowMax = 100) => {
  const out_list = await gpt2Utils.gpt2SyncMain(
    apiKey = apiKey, 
    modelSize = "gpt2-xl", 
    inString = inString, 
    length = length, 
    temperature = temperature,  
    windowMax = windowMax)
  return out_list
}

exports.gpt2XLStart = async (apiKey, inString, length = 5, temperature = 0.8, windowMax = 100) => {
  const taskID = await gpt2Utils.gpt2AsyncStartMain(
    apiKey = apiKey, 
    modelSize = "gpt2-xl", 
    inString = inString, 
    length = length, 
    temperature = temperature,  
    windowMax = windowMax)
  return taskID
}

exports.gpt2XLCheck = async (apiKey, taskID) => {
  const jsonOut = await gpt2Utils.gpt2AsyncCheckMain(apiKey, taskID)
  return jsonOut
}

// CLIP
exports.clip = async (apiKey, prompts, images, prettyPrint) => {
  const jsonOut = await clipUtils.clipMain(apiKey, prompts, images, prettyPrint=false)
  return jsonOut
}


// Generics (calling models by modelKey argument rather than by function name)
exports.run = async (apiKey, modelKey, modelParameters) => {
  const out = await genericsUtils.runMain(
    apiKey = apiKey, 
    modelKey = modelKey,
    modelParameters=modelParameters)
  return out
}

exports.start = async (apiKey, modelKey, modelParameters) => {
  const taskID = await genericsUtils.startMain(
    apiKey = apiKey, 
    modelKey = modelKey,
    modelParameters=modelParameters)
  return taskID
}

exports.check = async (apiKey, taskID) => {
  const jsonOut = await genericsUtils.checkMain(apiKey, taskID)
  return jsonOut
}