export default {
  //autoReferenceEmailTime: 3 days,  refreshMinWaitTime: 5min
  default: {
    autoReferenceEmailTime: 3 * 24 * 60 * 60,
    refreshMinWaitTime: 5 * 60,
  },
  validator: (config) => {
    if (typeof config.autoReferenceEmailTime !== "number") {
      throw new Error("autoReferenceEmailTime has to be a time in seconds");
    }
    if (typeof config.refreshMinWaitTime !== "number") {
      throw new Error("refreshMinWaitTime has to be a time in seconds");
    }
    if (config.refreshMinWaitTime < 0) {
      throw new Error("refreshMinWaitTime has to be positive number");
    }
    if (config.autoReferenceEmailTime < 0) {
      throw new Error("autoReferenceEmailTime has to be positive number");
    }
  },
};
