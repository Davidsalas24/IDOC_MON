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

                if(oKeys.length > 0){
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
                }
            },
            
            /**
             * Función encargada de filtrar los datos de la tabla
             * @param {*} oDataRes 
             */
            onFiltDataTable: function (oDataRes) {

                const oModel = this.getView().getModel(Constants.models.DATAMODEL);

                let aIdocPro = oDataRes.filter(oItem => oItem.Status === "53");
                let IdocPen = oDataRes.filter(oItem => oItem.Status === "64");
                let IdocNoConta = oDataRes.filter(oItem => oItem.Status === "51");
                let IdocAn = oDataRes.filter(oItem => oItem.Status === "68");

                oModel.setProperty("/IdocPro", aIdocPro);
                oModel.setProperty("/IdocPen", IdocPen);
                oModel.setProperty("/IdocNoConta", IdocNoConta);
                oModel.setProperty("/IdocAn", IdocAn);

                this.onCountData();
            },

            onCountData() {
                const oModel = this.getView().getModel(Constants.models.DATAMODEL);

                oModel.setProperty("/IdocProCont", oModel.getProperty("/IdocPro").length);
                oModel.setProperty("/IdocPenCont", oModel.getProperty("/IdocPen").length);
                oModel.setProperty("/IdocNoContaCont", oModel.getProperty("/IdocNoConta").length);
                oModel.setProperty("/IdocAnCont", oModel.getProperty("/IdocAn").length);
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

            /**
             * Función que se encarga de integrar los IDoc seleccionados en la pantalla Maestra.
             * @param {sap.ui.base.Event} oEvent Evento que se produce al presionar el botón Integrar.
             * 
             * Esta función crea un proceso batch para integrar los IDoc.
             * Primero, obtiene los registros seleccionados de la tabla y los almacena en un array.
             * Luego, crea un modelo OData y le configura las opciones de batch.
             * Después, itera sobre el array de registros y crea un batch para cada uno de ellos.
             * Finalmente, envía el batch al servidor y espera la respuesta.
             */
            onIntegrar: function (oEvent) {
                sap.ui.core.BusyIndicator.show();
                const aIndices = oEvent.getSource().getParent().getParent().getSelectedIndices();
                const aData = [];
                const oData = oEvent.getSource().getParent().getParent();
                if(aIndices.length > 0){
                    for (var i = 0; i < aIndices.length; i++) {
                        //let oBjet = this.getView().getModel().createEntry("/IdocMonSet").getObject();
                        //oBjet.Docnum = oData.getContextByIndex(i).getObject().Docnum;
                        aData.push(oData.getContextByIndex(aIndices[i]).getObject());
                    }
    
                    // Creación del proceso batch
                    var manifest = this.getOwnerComponent().getMetadata().getManifest();
                    var sServiceUrl = manifest["sap.app"].dataSources.ZIDOC_MONI_SRV.uri;
                    var oModel = new sap.ui.model.odata.v2.ODataModel(sServiceUrl, true);
    
                    //  Preparamos la llamada en batch al servicio
                    oModel.setHeaders({
                        "Pragma": "no-cache",
                        "Cache-Control": "no-cache, no-store",
                        "batch": "si"
                    });
    
                    // var aBatchOps = [];
                    oModel.setUseBatch(true);
                    oModel.setDeferredGroups(["ProIdocs"]);
    
                    // BATCH
                    var path = Constants.entities.IDOC;
    
                    for (var i = 0; i < aData.length; i++) {
                        oModel.create(path, aData[i], {
                            groupId: "ProIdocs",
                            success: function(oData, oResponse) {},
                            error: jQuery.proxy(function(event, oResponse) {
                                sap.ui.core.BusyIndicator.hide();
                                console.log("Error al integrar.");
                            }, this)
                        });
                    }
    
                    oModel.submitChanges({
                        batchGroupId: "ProIdocs",
                        success: jQuery.proxy(function(odata, response) {
                            sap.ui.core.BusyIndicator.hide();
                            if (odata.__batchResponses[0].response !==  undefined) {
                                MessageBox.error(jQuery.parseJSON(odata.__batchResponses[0].response.body).error.message.value);
                            }else{
                                this.applyFilters();
                            }
    
                        }, this),
                        error: jQuery.proxy(function(event, oResponse) {
                            sap.ui.core.BusyIndicator.hide();
                            console.log("Error al integrar.");
                        }, this)
                    });
                }else{
                    MessageBox.information(this.getView().getModel("i18n").getProperty("msgNoSelect"));
                }
            
            },

            /**
             * Evento que se ejecuta al presionar el botón Eliminar de la tabla de la pantalla Maestra.
             * Elimina los registros seleccionados de la tabla y actualiza el estado de los mismos en la base de datos.
             * @param {sap.ui.base.Event} oEvent El evento que se produce al presionar el botón eliminar.
             */
            onEliminar: function (oEvent) {
                
                const aIndices = oEvent.getSource().getParent().getParent().getSelectedIndices();
                const aData = [];
                const oData = oEvent.getSource().getParent().getParent();
                if(aIndices.length > 0){

                    
                    for (var i = 0; i < aIndices.length; i++) {
                        //let oBjet = this.getView().getModel().createEntry("/IdocMonSet").getObject();
                        //oBjet.Docnum = oData.getContextByIndex(i).getObject().Docnum;
                        aData.push(oData.getContextByIndex(aIndices[i]).getObject());
                    }

                    var dialog = new Dialog({
                        type: 'Message',
                        title: "Advertencia",
                        state: ValueState.Warning,
                        content: new Text({
                            text: aData.length + " registros serán eliminados de la base de datos. ¿Desea continuar?"
                        }),
                        beginButton: new Button({
                            text: 'Aceptar',
                            press: () => {
                                dialog.destroy();
                                sap.ui.core.BusyIndicator.show();
                                // Creación del proceso batch
                                var manifest = this.getOwnerComponent().getMetadata().getManifest();
                                var sServiceUrl = manifest["sap.app"].dataSources.ZIDOC_MONI_SRV.uri;
                                var oModel = new sap.ui.model.odata.v2.ODataModel(sServiceUrl, true);
                
                                //  Preparamos la llamada en batch al servicio
                                oModel.setHeaders({
                                    "Pragma": "no-cache",
                                    "Cache-Control": "no-cache, no-store",
                                    "batch": "si"
                                });
                
                                // var aBatchOps = [];
                                oModel.setUseBatch(true);
                                oModel.setDeferredGroups(["ProIdocs"]);
                
                                // BATCH
                                var path = Constants.entities.IDOC;
                
                                for (var i = 0; i < aData.length; i++) {
                                    oModel.remove(path + "('" +aData[i].Docnum + "')", {
                                        groupId: "ProIdocs",
                                        success: function(oData, oResponse) {},
                                        error: jQuery.proxy(function(event, oResponse) {
                                            sap.ui.core.BusyIndicator.hide();
                                            console.log("Error al integrar.");
                                        }, this)
                                    });
                                }
                
                                oModel.submitChanges({
                                    batchGroupId: "ProIdocs",
                                    success: jQuery.proxy(function(odata, response) {
                                        sap.ui.core.BusyIndicator.hide();
                                        if (odata.__batchResponses[0].response !==  undefined) {
                                            MessageBox.error(jQuery.parseJSON(odata.__batchResponses[0].response.body).error.message.value);
                                        }else{
                                            this.onCambiarEstado(aData, oData, aIndices);
                                        }
                                        
                                    }, this),
                                    error: jQuery.proxy(function(event, oResponse) {
                                        sap.ui.core.BusyIndicator.hide();
                                        console.log("Error al integrar.");
                                    }, this)
                                });


                            }
                        }),
                        endButton: new Button({
                            text: 'Cancelar',
                            press: () => {
                                dialog.destroy();
                            }
                        })
                    });
                    dialog.open();

                    //this.onCambiarEstado(aData, oData, aIndices);
                }else{
                    MessageBox.information(this.getView().getModel("i18n").getProperty("msgNoSelect"));
                }
            
            },


            onCambiarEstado: function(aData, oData, aIndices){
                const aDelPro = this.getModel("dataModel").getProperty(oData.getBindingInfo("rows").path);
                
                //Se elimina el registro de la tabla correspondiente
                for (var i = aIndices.length - 1; i >= 0; i--) {
                    aDelPro.splice(aIndices[i], 1)
                }

                const aDelTable = this.getModel("dataModel").getProperty("/IdocAn");
                for (var i = 0; i < aIndices.length; i++) {
                    aData[i].Status = "68";
                    aDelTable.push(aData[i])
                }

                this.onCountData();
                
            }

        });
    });
