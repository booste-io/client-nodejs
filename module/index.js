const genericsUtils = require("./genericsUtils")

// Generics (calling models by modelKey argument rather than by function name)
exports.run = async (apiKey, modelKey, modelInputs = {}, strategy = {}) => {
  const out = await genericsUtils.runMain(
    apiKey = apiKey, 
    modelKey = modelKey,
    modelInputs=modelInputs,
    strategy = strategy)
  return out
}

exports.start = async (apiKey, modelKey, modelInputs = {}, strategy= {}) => {
  const callID = await genericsUtils.startMain(
    apiKey = apiKey, 
    modelKey = modelKey,
    modelInputs=modelInputs,
    strategy = strategy)
  return callID
}

exports.check = async (apiKey, callID) => {
  const jsonOut = await genericsUtils.checkMain(apiKey, callID)
  return jsonOut
}