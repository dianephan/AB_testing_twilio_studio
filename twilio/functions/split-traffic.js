exports.handler = function(context, event, callback) {
  
  // import libraries
  const crypto = require('crypto');
  const md5sum = crypto.createHash('md5');
  const optimizelySDK = require('@optimizely/optimizely-sdk');
  const axios = require('axios');

  // Function parameters from Studio Flow
  const number = event.From;
  const experiment_name = event.experiment_name;
    
  // Optimizely datafile URL
  const url = `https://cdn.optimizely.com/datafiles/${context.OPTIMIZELY_KEY}.json`;
  
  // placeholder for Optimizely client
  let optimizely;

  // anonymize user id
  const userId = md5sum.update(number).digest('hex');
  
  // json body to return to studio flow
  let variation = {};

  // initialize the Optimizely SDK
  (async () => {
    try {
      const response = await axios.get(url)
      optimizely = optimizelySDK.createInstance({
        datafile: response.data,
        eventBatchSize: 1,
      });
      let variationKey = optimizely.activate(experiment_name, userId);
      variation.key = variationKey
      return callback(null, variation);
    } catch (error) {
      console.log(error.response.body);
    }
  })();
};
