sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "com/inetum/idocmonitor/utils/Constants",
        "com/inetum/idocmonitor/utils/DataManager",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
    ],
    function(BaseController, Constants, DataManager, Filter, FilterOperator) {
      "use strict";
      //const _oFormatDate = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "YYYY-MM-dd", strictParsing: true });
      return BaseController.extend("com.inetum.idocmonitor.controller.App", {
        onInit: function () {
          this.handleInitRequest();
        },
  
        /* Aumenta el limite del modelo servicesModel para poder mostar todas las organizaciones de venta
       * Inicia el modelo datamodel con los datos iniciales de la app e inicializamos el router para navegar
       * a la primera vista
       **/
        handleInitRequest: function () {
  
          /*this.getModel(Constants.models.SERVICESMODEL).setSizeLimit(300);*/
  
          //this.getModel(Constants.models.SERVICESMODEL).attachMetadataLoaded(() => this.getRouter().initialize());
          //this.getModel(Constants.models.SERVICESMODEL).metadataLoaded().then(function(){that.getRouter().initialize()});
          //###bueno
          this.getModel(Constants.models.DATAMODEL).setProperty("/", DataManager.getModeloDatosInicial(this.geti18nBundle()));
          //this.getRouter().initialize()
        },
        /**
       * Función común presente en todos los controller que simplifica la obtencion de un modelo
       * @param {String} Nombre del modelo
       * */
        getModel: function (sModel) {
          return this.getView().getModel(sModel);
        },
  
        /**
       * Devuelve el router para las opciones de navegación
       * */
        getRouter: function () {
          return sap.ui.core.UIComponent.getRouterFor(this);
        },
        /**
         * Función común presente en todos los controller que simplifica la obtención del i18n.
         * */
        geti18nBundle: function () {
          return this.getView().getModel(Constants.models.I18N).getResourceBundle();
        },

         /**
       * Función común presente en todos los controller para realizar la navegación hacia atrás
       * En caso de que no exista hash previo navega a la vista principal (Main)
       */
      onNavBack: function () {
        var oHistory = History.getInstance();
        var sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) {
          if(this.getView().getModel("paramGastosApp") && this.getView().getModel("paramGastosApp").getData()){
            this.getView().getModel("paramGastosApp").setData(null)
            window.history.go(-2);
          }else{
            window.history.go(-1);
          }
          
        } else {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo(Constants.routes.MAIN, true);
        }
      },

      /**
       * Extrae los filtros del filterbar recibido por parámetro, devolviendo un array de filtros (sap.ui.model.Filter) el cual
       * puede usuarse tanto en un bindeo a un componenete como una llamada a servicio odata
       * @param {String} sIdFilterBar Id del filterbar del cual extraerá los filtros
       * @returns {Array<sap.ui.model.Filter>}
       */
      getFiltersFromFilterBar: function (sIdFilterBar) {
        const oFilterBar = this.byId(sIdFilterBar);
        if (!oFilterBar) return;
        let aFiltersItems = oFilterBar.getFilterItems();

        if (!aFiltersItems || !aFiltersItems.length) aFiltersItems = oFilterBar.getFilterGroupItems();

        //const oKeys = {};
        const oKeys = [];
        for (let oFilterItem of aFiltersItems) {
          let oControl = oFilterBar.determineControlByFilterItem(oFilterItem);

          if (oControl instanceof sap.m.Select) {
            let sValue = oControl.getSelectedKey();
            let oFilt = FilterOperator.EQ;
            //oKeys[oFilterItem.getProperty("name")] = sValue || "";
            if (oFilterItem.getProperty("name") === "Orges" && sValue.length === 2) oFilt = FilterOperator.Contains;
            if (sValue) {
              oKeys.push(new Filter(oFilterItem.getProperty("name"), oFilt, sValue || ""));
            }

            continue;
          }

          if (oControl instanceof sap.m.MultiComboBox) {
            let sValue = oControl.getSelectedKeys();
            // if (sValue.length > 1) {
            // 	sValue.shift();
            // }
            oKeys[oFilterItem.getProperty("name")] = sValue.join("-") || "";
            continue;
          }


          if (oControl instanceof sap.m.DateRangeSelection) {
              const oFrom = oControl.getDateValue() || "",
              oTo = oControl.getSecondDateValue() || "";
            /*if (!oTo && !oFrom) continue;
            const sProperty = oFilterItem.getProperty("name");
            oKeys["IvFechaFin"] = oTo;
            oKeys["IvFechaInicio"] = oFrom; */
            //oKeys[oFilterItem.getProperty("name")] = oControl.getValue() || "";
             
             let oFilt = FilterOperator.BT;
            oKeys.push(new Filter(oFilterItem.getProperty("name"), oFilt, oFrom, oTo || ""));
          
            continue;
          }


          let sValue = oControl.getValue();
          //oKeys[oFilterItem.getProperty("name")] = sValue || "";

          let oFilt = FilterOperator.EQ;
          if (sValue) {
            if (oFilterItem.getProperty("name") === "Title") oFilt = FilterOperator.Contains;
            oKeys.push(new Filter(oFilterItem.getProperty("name"), oFilt, sValue || ""));
          }

        }

        return oKeys;
      }

      });
    }
  );
  