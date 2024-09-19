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
    "com/inetum/idocmonitor/utils/Services"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (appController, MessageToast, Fragment, JSONModel, Dialog,
        Button, mobileLibrary, Text, coreLibrary, Constants, DataManager, Services) {
        "use strict";

        // shortcut for sap.m.ButtonType
	var ButtonType = mobileLibrary.ButtonType;

	// shortcut for sap.m.DialogType
	var DialogType = mobileLibrary.DialogType;

	// shortcut for sap.ui.core.ValueState
	var ValueState = coreLibrary.ValueState;

        return appController.extend("com.inetum.idocmonitor.controller.Master", {
            onInit: function () {

            },

            /**
             * Navegacion al detalle
             * @param {*} oEvent 
             */
            onDetailPress: function (oEvent) {
                //Antes de navegar, guardamos los datos de cabecera que tiene la linea para mostrarlo en los formularios del detalle
                //this.setDataCabecera();
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteDetail");
            },

            /**
             * 
             * @param {*} oDataSelect 
             */
            setDataCabecera: function (oDataSelect) {
                let Cab = {
                    Vtrn: oDataSelect.Vtrn, //Número de pedido
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
                //const oTable = this.byId(Constants.ids.MAINTABLE);

                sap.ui.core.BusyIndicator.show();
                Services.getReadData.call(this, sPath, oKeys)
                    .then((oData) => {
                        sap.ui.core.BusyIndicator.hide();
                        //oTable.setBusy(false);
                        //this.setModelData(oData)
                    })
                    //TODO MEnsaje Error
                    .catch(oError => {
                        //oTable.setBusy(false);
                        sap.ui.core.BusyIndicator.hide();
                        console.log(oError);
                    });
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
                        content: new Text({ text: "Prueba de texto largo." }),
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
