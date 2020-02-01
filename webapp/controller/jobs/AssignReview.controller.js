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

	var appModelName = "appModel";

	return BaseController.extend("com.limscloud.app.controller.jobs.AssignReview", {
		formatter: formatter,
		onInit: function () {
			this.router = this.getOwnerComponent().getRouter();
			var route = sap.ui.core.UIComponent.getRouterFor(this).getRoute("AD01");
			route.attachPatternMatched(this.onPatternMatched, this);

		},
		onPatternMatched: function (oEvent) {
			console.log("I'm at AD01 - assign review document")
			var that = this;

			this.initLocalModel();
			var initDate = this.initDate();

			this.initUsers(appModelName);
			this.initLabs(appModelName);

			var payload = {
				labId: null,
				jobId: null,
				fromDate: initDate.fromDate,
				toDate: initDate.toDate,
				status: null
			};
			// console.log(payload);
			this.getDocuments(appModelName, payload);
		},
		initLocalModel: function () {
			// Init Model data
			var oModel = new JSONModel(jQuery.sap.getModulePath("com.limscloud.app.jsonstore", "/AssignReview.json"));
			oModel.setSizeLimit(1000000);
			this.getView().setModel(oModel, appModelName);
		},
		initDate: function () {
			var oView = this.getView();
			var todayDate = moment().toDate();
			var minusMonthDate = moment().subtract(1, 'month').toDate();
			var toDate = moment().format('YYYY/MM/DD HH:mm:ss');
			var fromDate = moment().subtract(1, 'month').format('YYYY/MM/DD HH:mm:ss');

			oView.getModel(appModelName).setProperty("/header/fromDateValue", minusMonthDate);
			oView.getModel(appModelName).setProperty("/header/toDateValue", todayDate);

			// oView.byId("fl_createdDat").setSecondDateValue(todayDate);
			// oView.byId("fl_createdDat").setDateValue(minusMonthDate);

			return { fromDate: fromDate, toDate: toDate };
		},
		initUsers: function (modelName) {
			var that = this;
			var URL = "";
			var weHaveSuccess = false;

			URL = "http://localhost:3000/api/commons/users"
			$.ajax({
				type: "GET",
				url: URL,
				dataType: "json",
				crossDomain: true,

				success: function (results) {
					weHaveSuccess = true;
					that.getView().getModel(modelName).setProperty("/lookups/users", results);
				},
				error: function (response) {
					MessageToast.show("Error!  " + response.status);
				},
				complete: function () {
					if (!weHaveSuccess) {
						MessageToast.show("Unable to fetch users");
					}
				}
			});
		},
		initLabs: function (modelName) {
			var that = this;
			var URL = "";
			var weHaveSuccess = false;

			URL = "http://localhost:3000/api/commons/labs"
			$.ajax({
				type: "GET",
				url: URL,
				dataType: "json",
				crossDomain: true,

				success: function (results) {
					weHaveSuccess = true;
					that.getView().getModel(modelName).setProperty("/lookups/labs", results);
				},
				error: function (response) {
					MessageToast.show("Error!  " + response.status);
				},
				complete: function () {
					if (!weHaveSuccess) {
						MessageToast.show("Unable to fetch labs");
					}
				}
			});
		},

		getDocuments: function (modelName, payload) {
			var that = this;
			var URL = "";
			var weHaveSuccess = false;

			URL = "http://localhost:3000/api/review/RD03/headers"
			$.ajax({
				type: "POST",
				data: payload,
				url: URL,
				dataType: "json",
				crossDomain: true,

				success: function (results) {
					weHaveSuccess = true;
					that.getView().getModel(modelName).setProperty("/documents", results.results);
					that.getView().getModel(modelName).setProperty("/documentsCount", results.count);
				},
				error: function (response) {
					MessageToast.show("Error!  " + response.status);
				},
				complete: function () {
					if (!weHaveSuccess) {
						MessageToast.show("Unable to fetch documents");
					}
				}
			});
		},

		handleFilterPress: function (oEvent) {
			var payload = {
				labId: this.getView().getModel(appModelName).getProperty("/header/labId"),
				jobId: null,
				fromDate: moment(this.getView().getModel(appModelName).getProperty("/header/fromDate")).format('YYYY/MM/DD HH:mm:ss'),
				toDate: moment(this.getView().getModel(appModelName).getProperty("/header/toDate")).format('YYYY/MM/DD HH:mm:ss'),
				status: null
			};

			console.log(payload);
		}

	});

});
