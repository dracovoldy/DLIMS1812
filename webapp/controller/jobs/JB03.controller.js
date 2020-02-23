sap.ui.define([
	'com/limscloud/app/controller/BaseController',
	'jquery.sap.global',
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	'sap/ui/model/Filter',
	'com/limscloud/app/util/formatter'
], function (BaseController, jQuery, JSONModel, MessageToast, MessageBox, Filter, formatter) {
	"use strict";

	var appModelName = "JB03";

	return BaseController.extend("com.limscloud.app.controller.jobs.JB03", {
		formatter: formatter,
		onInit: function () {
			this.router = this.getOwnerComponent().getRouter();
			var route = sap.ui.core.UIComponent.getRouterFor(this).getRoute("JB03");
			route.attachPatternMatched(this.onPatternMatched, this);

		},
		initLocalModel: function () {
			// Init Model data
			var oModel = new JSONModel(jQuery.sap.getModulePath("com.limscloud.app.jsonstore", "/JB03.json"));
			oModel.setSizeLimit(1000000);
			// this.getView().setModel(oModel, appModelName);
			this.getOwnerComponent().setModel(oModel, appModelName);
		},
		onPatternMatched: function (oEvent) {
			console.log("I'm at JB03");
			this.initLocalModel();

			this.getMyJobs(appModelName, 'PANDYAH');

		},
		getMyJobs: function (modelName, labUser) {
			var that = this;
			var URL = "";
			var weHaveSuccess = false;

			URL = "http://localhost:3000/api/testing/JB03?labUser=" + labUser;
			$.ajax({
				type: "GET",
				url: URL,
				dataType: "json",
				crossDomain: true,

				success: function (results) {
					weHaveSuccess = true;
					that.getView().getModel(modelName).setProperty("/documents", results);
					that.getView().getModel(modelName).setProperty("/documentsCount", results.length);
				},
				error: function (response) {
					MessageToast.show("Error!  " + response.status);
				},
				complete: function () {
					if (!weHaveSuccess) {
						MessageToast.show("Unable to fetch JB03");
					}
				}
			});
		},
		_navToDetail: function (oEvent) {
			var sObj = oEvent.getParameter("listItem").getBindingContext(appModelName).getObject();			
			this.getOwnerComponent().getModel(appModelName).setProperty("/selected", sObj);

			this.router.navTo("JB03-detail");
		}

	});

});
