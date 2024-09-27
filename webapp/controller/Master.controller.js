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
    "com/inetum/idocmonitor/utils/Formatter",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (appController, MessageToast, Fragment, JSONModel, Dialog,
        Button, mobileLibrary, Text, coreLibrary, Constants, DataManager,
        Services, Formatter, MessageBox) {
        "use strict";

        // shortcut for sap.m.ButtonType
	var ButtonType = mobileLibrary.ButtonType;

	// shortcut for sap.m.DialogType
	var DialogType = mobileLibrary.DialogType;

	// shortcut for sap.ui.core.ValueState
	var ValueState = coreLibrary.ValueState;

        return appController.extend("com.inetum.idocmonitor.controller.Master", {
            Formatter: Formatter,
            onInit: function () {

            },

            /**
             * Navegacion al detalle
             * @param {*} oEvent 
             */
            onDetailPress: function (oEvent) {
                //Antes de navegar, guardamos los datos de cabecera que tiene la linea para mostrarlo en los formularios del detalle
                this.setDataCabecera(oEvent.getSource().getBindingContext("dataModel").getObject());
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteDetail");
            },

            /**
             * 
             * @param {*} oDataSelect 
             */
            setDataCabecera: function (oDataSelect) {
                let Cab = {
                    Docnum: oDataSelect.Docnum,
                    Vtrnr: oDataSelect.Vtrnr, //Número de pedido
                    Vbeln: oDataSelect.Vbeln, //Documento de compras
                    Idnkd: oDataSelect.Idnkd, //Material de cliente.
                    Abrvw: oDataSelect.Abrvw, //Indicador de utilización
                    Zeich: oDataSelect.Zeich, //Su referencia
                    PartnAg: oDataSelect.PartnAg, //Solicitante
                    PartnLf: oDataSelect.PartnLf, //Nuestro número de proveedor
                    Kwerk: oDataSelect.Kwerk, //Centro de cliente
                    Dfabl: oDataSelect.Dfabl, // Puesto de descarga
                    Vbrst: oDataSelect.Vbrst, //Punto de consumo
                    Lf: oDataSelect.Lf, //Clase de llamada
                    Bstdk: oDataSelect.Bstdk, //Fecha llamada nueva
                    Dabnrd: oDataSelect.Dabnrd, //Fecha llamada anterior
                    Labnk: oDataSelect.Labnk, //Número de llamada nuevo
                    Abnra: oDataSelect.Abnra, //Número de llamada antiguo
                    Dabrab: oDataSelect.Dabrab, //Llamada válida de
                    Dabrbi: oDataSelect.Dabrbi, //Llamada válida a
                    Dabhor: oDataSelect.Dabhor, //Horizonte LFH
                    Belnr: oDataSelect.Belnr, //Último núm.nota entrega
                    Dlidtl: oDataSelect.Dlidtl, //Fecha último núm.nota entrega
                    Dcydat: oDataSelect.Dcydat, //Fecha puesta a cero CAR
                    Cyefz: oDataSelect.Cyefz, //Ctd.acumulada puesta a cero
                    Akuem: oDataSelect.Akuem, //Ctd.acumulada recibida
                }

                const oModel = this.getView().getModel(Constants.models.DATAMODEL);

                oModel.setProperty("/DataCab", Cab);
            },

             /**
             * Función encargada de aplicar los filtro introducidos por el usuario para filtrar la tabla
             */
             applyFilters: function () {
                const oKeys = this.getFiltersFromFilterBar(Constants.ids.MAINFILTERBAR);
                const sPath = Constants.entities.IDOC;
                
                let oDataRes;

                sap.ui.core.BusyIndicator.show();
                Services.getReadData.call(this, sPath, oKeys)
                    .then((oData) => {
                        sap.ui.core.BusyIndicator.hide();
                        oDataRes = oData.results

                        this.onFiltDataTable(oDataRes);
                    })
                    //TODO MEnsaje Error
                    .catch((oError) => {
                        //oTable.setBusy(false);
                        sap.ui.core.BusyIndicator.hide();
                        console.log(oError);
                        if(oError.responseText.search("SQL_CAUGHT_RABAX") >= 0){
                            MessageBox.information(this.getView().getModel("i18n").getProperty("mgsNoData"));
                            this.onResetTables();
                        }else{
                            MessageBox.error(this.getView().getModel("i18n").getProperty("mgsError"));
                        }
                    });
            },
            
            /**
             * Función encargada de filtrar los datos de la tabla
             * @param {*} oDataRes 
             */
            onFiltDataTable: function (oDataRes) {

                const oModel = this.getView().getModel(Constants.models.DATAMODEL);

                let aIdocPro = oDataRes.filter(oItem => oItem.Status === "51");
                let IdocPen = oDataRes.filter(oItem => oItem.Status === "64");
                let IdocNoConta = oDataRes.filter(oItem => oItem.Status === "53");
                let IdocAn = oDataRes.filter(oItem => oItem.Status === "20");

                oModel.setProperty("/IdocProCont", aIdocPro.length);
                oModel.setProperty("/IdocPenCont", IdocPen.length);
                oModel.setProperty("/IdocNoContaCont", IdocNoConta.length);
                oModel.setProperty("/IdocAnCont", IdocAn.length);

                oModel.setProperty("/IdocPro", aIdocPro);
                oModel.setProperty("/IdocPen", IdocPen);
                oModel.setProperty("/IdocNoConta", IdocNoConta);
                oModel.setProperty("/IdocAn", IdocAn);
            },

            /**
             * Función encargada de limpiar los datos de la tabla
             */
            onResetTables: function () {
                const oModel = this.getView().getModel(Constants.models.DATAMODEL);

                oModel.setProperty("/DataCab", null);
                oModel.setProperty("/IdocProCont", "0");
                oModel.setProperty("/IdocPenCont", "0");
                oModel.setProperty("/IdocNoContaCont", "0");
                oModel.setProperty("/IdocAnCont", "0");

                oModel.setProperty("/IdocPro", []);
                oModel.setProperty("/IdocPen", []);
                oModel.setProperty("/IdocNoConta", []);
                oModel.setProperty("/IdocAn", []);
            },

            /**
             * 
             * @param {*} oEvent 
             */
            handlePopoverPress: function (oEvent) {
                
                    this.oInfoMessageDialog = new Dialog({
                        type: DialogType.Message,
                        title: "Information",
                        state: ValueState.Information,
                        content: new Text({ text: oEvent.getSource().getProperty("text") }),
                        beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "OK",
                            press: function () {
                                this.oInfoMessageDialog.close();
                            }.bind(this)
                        })
                    });
                
    
                this.oInfoMessageDialog.open();
               
            },
        });
    });
