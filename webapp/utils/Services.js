sap.ui.define(
  [
    "com/inetum/idocmonitor/utils/Constants",
    "com/inetum/idocmonitor/utils/DataManager",
  ],
  function (e, n) {
    "use strict";
    return {
      getReadData: function (path, aFilt) {
        return new Promise((res, rej) => {
          this.getModel().read(path, {
            filters: aFilt,
            success: function (oData) {
              res(oData);
            },
            error: function (oError) {
              rej(oError);
            }
          });
  
        });
      }
    };
  }
);
