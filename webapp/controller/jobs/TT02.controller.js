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

	return BaseController.extend("com.limscloud.app.controller.jobs.TT02", {
		formatter: formatter,
		onInit: function () {
			this.router = this.getOwnerComponent().getRouter();
			var route = sap.ui.core.UIComponent.getRouterFor(this).getRoute("TT02");
			route.attachPatternMatched(this.onPatternMatched, this);

		},
		onPatternMatched: function (oEvent) {
			console.log("I'm at TT02")
			var that = this;

			var initJobHeader = function () {
				var URL = "";
				var weHaveSuccess = false;

				URL = "http://localhost:3000/api/jobs"
				$.ajax({
					type: "GET",
					url: URL,
					dataType: "json",
					crossDomain: true,

					success: function (results) {
						weHaveSuccess = true;
						that.getView().getModel("jobsModel").setProperty("/lookups/jobHeader", results);
					},
					error: function (response) {
						MessageToast.show("Error!" + response.status);
					},
					complete: function () {
						if (!weHaveSuccess) {
							MessageToast.show("Unable to fetch jobs");
						}
					}
				});
			}

			initJobHeader();

		},
		_navToDetail: function (oEvent) {
			var t = oEvent.getParameter("listItem").getBindingContextPath();
			var c = this.getView().getModel("jobsModel").getProperty(t);
			this.getView().getModel("jobsModel").setProperty("/perform/header", c);
			
			this.router.navTo("TT02-detail");
		},

		onCreateSave: function (oEvent) {
			
		}
	});

});
