sap.ui.define([
	'com/limscloud/app/controller/BaseController',
	'jquery.sap.global',
	'sap/m/Popover',
	'sap/m/Button',
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageBox'
], function (BaseController, jQuery, Popover, Button, JSONModel, MessageBox) {
	"use strict";
	var appModelName = "ordersModel";

	return BaseController.extend("com.limscloud.app.controller.order.CreateOrder", {

		onInit: function () {
			this.router = this.getOwnerComponent().getRouter();
			var route = sap.ui.core.UIComponent.getRouterFor(this).getRoute("OR01");
			route.attachPatternMatched(this.onPatternMatched, this);
		},
		onPatternMatched: function (oEvent) {
			this.initLocalModel();
		},
		loadInitialData: function () {
			var that = this;
			var weHaveSuccess = false;

			$.ajax({
				type: "GET",
				url: "http://localhost:3000/api/commons/users",
				dataType: "json",
				crossDomain: true,

				success: function (results) {
					weHaveSuccess = true;
					that.getView().getModel(appModelName).setProperty("/lookups/users", results);
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

			var weHaveSuccess2 = false;

			$.ajax({
				type: "GET",
				url: "http://localhost:3000/api/sales/customers/",
				dataType: "json",
				crossDomain: true,

				success: function (results) {
					weHaveSuccess2 = true;
					that.getView().getModel(appModelName).setProperty("/lookups/customers", results);
				},
				error: function (response) {
					MessageToast.show("Error!  " + response.status);
				},
				complete: function () {
					if (!weHaveSuccess2) {
						MessageToast.show("Unable to fetch Customers");
					}
				}
			});
		},
		initLocalModel: function () {
			// Init Model data
			var oModel = new JSONModel();
			oModel.loadData(jQuery.sap.getModulePath("com.limscloud.app.jsonstore", "/OR01.json"));
			// attach event once fires one time when the file is loaded
			oModel.attachEventOnce("requestCompleted", this.loadInitialData.bind(this));
			this.getView().setModel(oModel, appModelName);
		},
		_onCreateCustomer: function (oEvent) {
			var oModel = this.getView().getModel(appModelName);

			oModel.setProperty("/payload/custId", this.getView().byId("custId").getSelectedKey());
			oModel.setProperty("/payload/orderDesc", this.getView().byId("orderDesc").getValue());
			oModel.setProperty("/payload/createdBy", this.getView().byId("createdBy").getValue());


			var oPayload = this.getView().getModel("ordersModel").getProperty("/payload")

			console.log(oPayload);

			//prepare post
			var URL = "http://localhost:3000/api/sales/orders/";

			$.ajax({
				url: URL,
				type: 'POST',
				data: oPayload,
				dataType: 'json',
				crossDomain: true,
				success: function (results) {
					console.log(results);
					MessageBox.success("Order successfully created with document number : " + results.orderId, {
						details: results,
						contentWidth: "100px"
					});
				},
				error: function (error) {
					console.log(error);
				}
			});


		}

	});

});
