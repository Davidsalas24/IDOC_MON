sap.ui.define(["com/inetum/idocmonitor/utils/Constants", "com/inetum/idocmonitor/utils/DataManager"], function(t, e) {
	"use strict";
	return {
		iconKey: function(sKey){
			let sIcon = "";

			if(sKey === "51"){
				sIcon = "sap-icon://accept"
			}else if(sKey === "64"){
				sIcon = "sap-icon://message-warning"
			}else if(sKey === "53"){
				sIcon = "sap-icon://status-error"
			}else if(sKey === "20"){
				sIcon = "sap-icon://cancel"
			}
			return sIcon;
		}
	}
}, true);
//# sourceMappingURL=Formatter.js.map