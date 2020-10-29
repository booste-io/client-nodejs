const gpt2Utils = require("./gpt2Utils")

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