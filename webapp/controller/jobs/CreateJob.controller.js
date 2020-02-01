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

	return BaseController.extend("com.limscloud.app.controller.jobs.CreateJob", {
		formatter: formatter,
		onInit: function () {
			this.router = this.getOwnerComponent().getRouter();
			var route = sap.ui.core.UIComponent.getRouterFor(this).getRoute("JB01");
			route.attachPatternMatched(this.onPatternMatched, this);

		},
		onPatternMatched: function (oEvent) {
			console.log("I'm at JB01 - Create Job")
			var that = this;

			// this.initLocalModel();
			// this.getDocuments(appModelName);
			
		},
		initLocalModel: function () {
			// Init Model data
			var oModel = new JSONModel(jQuery.sap.getModulePath("com.limscloud.app.jsonstore", "/ApproveReview.json"));
			oModel.setSizeLimit(1000000);
			this.getView().setModel(oModel, appModelName);
		},


		getDocuments: function (modelName) {
			var that = this;
			var URL = "";
			var weHaveSuccess = false;

			URL = "http://localhost:3000/api/jobs/ApprovalItems"
			$.ajax({
				type: "GET",
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
					that.getView().byId("oh1").bindElement("appModel>/documents/0");
				}
			});
		},

		getSplitAppObj: function () {
			var result = this.byId("splitApp0");
			if (!result) {
				Log.info("SplitApp object can't be found");
			}
			return result;
		},

		onListItemPress: function (oEvent) {
			// debugger;
			var oContext = oEvent.getParameter("listItem").getBindingContextPath();
			this.getSplitAppObj().toDetail(this.createId("detail"));
			this.getView().byId("oh1").bindElement("appModel>" + oContext);
						
		},

		onPressDetailBack: function () {
			this.getSplitAppObj().backToTopMaster();
		},

		handleApprove: function () {
			var oObject = this.getView().byId("oh1").getBindingContext(appModelName).getObject();
			debugger;
			var payload = {
				jobId : oObject.job_id,
				jobItem : oObject.item_id,
				comment: 'Approved from App',
				approver: 'MALLIKA'
			}

			this.postApprove(payload);
		},

		postApprove: function (payload) {
			var that = this;
			var URL = "";
			var weHaveSuccess = false;

			URL = "http://localhost:3000/api/jobs/ApprovalItems"
			$.ajax({
				type: "POST",
				data: payload,
				url: URL,
				dataType: "json",
				crossDomain: true,

				success: function (results) {
					console.log(results);
					weHaveSuccess = true;
					MessageToast.show("Approved !");
					that.getDocuments(appModelName);
				},
				error: function (response) {
					console.log(response);
					MessageToast.show("Error!  " + response.status);
				},
				complete: function () {
					if (!weHaveSuccess) {
						MessageToast.show("Unable to fetch documents");
					}
				}
			});
		},



	});

});
