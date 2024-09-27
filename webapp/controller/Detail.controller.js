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
    "com/inetum/idocmonitor/utils/Services",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (appController, MessageToast, Fragment, JSONModel, Dialog, Button, mobileLibrary, Text, coreLibrary,
        Constants, DataManager,Services, Filter, FilterOperator
    ) {
        "use strict";

        return appController.extend("com.inetum.idocmonitor.controller.Master", {
            onInit: function () {
                this.getRouter().getRoute(Constants.routes.DETAIL).attachPatternMatched(this.onMatchedRoute, this);
            },

            /**
             * Bindea con los argumentos recibidos al navegar para mostrarle al usuario los datos del detalle
             * @param {sap.ui.base.Event} oEvent Evento de la navegación el cual contiene los argumentos pasados por la
             * url
             */
            onMatchedRoute: function (oEvent) {

                const oModelData = this.getView().getModel("dataModel")
                const sDocNum = oModelData.getProperty("/DataCab").Docnum;
                const oKeys = new Filter("Wmeng",FilterOperator.EQ, sDocNum);
                const sPath = Constants.entities.IDOCDETAIL;
                
                let oDataRes;

                sap.ui.core.BusyIndicator.show();
                Services.getReadData.call(this, sPath, [oKeys])
                    .then((oData) => {
                        sap.ui.core.BusyIndicator.hide();
                        oDataRes = oData.results
                        oModelData.setProperty("/DataDetailTable", oDataRes);
                    })
                    //TODO MEnsaje Error
                    .catch((oError) => {
                        //oTable.setBusy(false);
                        sap.ui.core.BusyIndicator.hide();
                        console.log(oError);
                       
                    });
            
            },

        });
    });
