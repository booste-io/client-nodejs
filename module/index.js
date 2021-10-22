const genericsUtils = require("./genericsUtils")

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