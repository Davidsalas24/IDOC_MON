sap.ui.define(["com/inetum/idocmonitor/utils/Constants"], function(e) {
	"use strict";
	return {
		getModeloDatosInicial: function(e, t) {
			return {
				DataCab: null,
				IdocPro: [],
				IdocPen: [],
				IdocNoConta: [],
				IdocAn:[],
				IdocProCont: 0,
				IdocPenCont: 0,
				IdocNoContaCont: 0,
				IdocAnCont:0,
				EstSelected: ["51","64"],
				Estados:[
					{
						Text: e.getText("idocPro"),
						Key: '51',
						select: true
					},
					{
						Text: e.getText("idocPen"),
						Key: '64',
						select: true
					},
					{
						Text: e.getText("idocConta"),
						Key: '53',
						select: false
					},
					{
						Text: e.getText("idocAn"),
						Key: '68',
						select: false
					}
				],
				DataDetailTable: [],
				DateFilt:{
					Desde: new Date(),
					Hasta: new Date()
				}
			}
		}
	}
});
//# sourceMappingURL=DataManager.js.map