sap.ui.define([
    "com/inetum/idocmonitor/controller/App.controller",
    'sap/m/MessageToast',
	'sap/ui/core/Fragment',
    'sap/ui/model/json/JSONModel',
    "sap/m/Dialog",
	"sap/m/Button",
	"sap/m/library",
	"sap/m/Text",
    "sap/ui/core/library",
    "com/inetum/idocmonitor/utils/Constants",
        "com/inetum/idocmonitor/utils/DataManager",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (appController, MessageToast, Fragment, JSONModel, Dialog, Button, mobileLibrary, Text, coreLibrary,
        Constants, DataManager
    ) {
        "use strict";

        return appController.extend("com.inetum.idocmonitor.controller.Master", {
            onInit: function () {

            },


        });
    });
