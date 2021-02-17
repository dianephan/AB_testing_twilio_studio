exports.handler = function(context, event, callback) {
  // import libraries
  const crypto = require('crypto');
  const md5sum = crypto.createHash('md5');
  const optimizelySDK = require('@optimizely/optimizely-sdk');
  const axios = require('axios');

  // datafile URL
  const url = `https://cdn.optimizely.com/datafiles/${context.OPTIMIZELY_KEY}.json`;
  let optimizely;
  
  // Optimizely logger for debugging NOTE: this section can be commented out 
  optimizelySDK.setLogLevel('debug'); 
  optimizelySDK.setLogger(optimizelySDK.logging.createLogger());
  
  // Function parameters from Studio Flow
  const number = event.From;
  const event_name = event.event_name;
  let attributes = {};
  let tags = { value: Number(event.score) }


  // anonymizing user id
  const userId = md5sum.update(number).digest('hex');  

  // initialize the Optimizely SDK
  (async () => {
    try {
      const response = await axios.get(url)
      optimizely = optimizelySDK.createInstance({
        datafile: response.data,
        eventBatchSize: 1,
        eventFlushInterval: 3000,
      });
      optimizely.track(event_name, userId, attributes, tags);
      return callback(null, "event_tracked");
    } catch (error) {
      console.log(error.response.body);
    }
  })();
};
