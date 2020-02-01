sap.ui.define([
	'com/limscloud/app/controller/BaseController',
	'jquery.sap.global',
	'sap/m/Popover',
	'sap/m/Button',
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageBox',
	'sap/m/MessageToast'
], function (BaseController, jQuery, Popover, Button, JSONModel, MessageBox, MessageToast) {
	"use strict";

	var appModelName = "sampleModel";

	return BaseController.extend("com.limscloud.app.controller.samples.MM01", {

		onInit: function () {
			this.router = this.getOwnerComponent().getRouter();
			var route = sap.ui.core.UIComponent.getRouterFor(this).getRoute("MM01");
			route.attachPatternMatched(this.onPatternMatched, this);
		},
		onPatternMatched: function (oEvent) {
			var that = this;
			// Init Model data
			var oModel = new JSONModel(jQuery.sap.getModulePath("com.limscloud.app.jsonstore", "/MM01.json"));
			oModel.setSizeLimit(1000000);
			this.getView().setModel(oModel, appModelName);		

			this.loadUsers();
		},
		loadUsers: function () {
			var that = this;		
			var URL = "";
			var weHaveSuccess = false;

			URL = "http://localhost:3000/api/lookups/users"
			$.ajax({
				type: "GET",
				url: URL,
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
		},
		loadOrderHelpDialog: function () {			
			var oView = this.getView();

			this._valueHelpDialog = oView.byId("order_picker_dialog");
			// create value help dialog
			if (!this._valueHelpDialog) {
				// create dialog via fragment factory
				this._valueHelpDialog = sap.ui.xmlfragment(oView.getId(), "com.limscloud.app.view.samples.fragments.orderPickerDialog", this);
				oView.addDependent(this._valueHelpDialog);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog.open();
		},
		getOrders: function () {
			var that = this;
			var URL = "";
			var weHaveSuccess = false;

			URL = "http://localhost:3000/api/orders";
			$.ajax({
				type: "GET",
				url: URL,
				dataType: "json",
				crossDomain: true,

				success: function (results) {
					weHaveSuccess = true;
					that.getView().getModel(appModelName).setProperty("/lookups/orders", results);
				},
				error: function (response) {
					MessageToast.show("Error!  " + response.status);
				},
				complete: function () {
					if (!weHaveSuccess) {
						MessageToast.show("Unable to fetch customers");
					}
				}
			});
		},		
		handleOrderHelp: function (oEvent) {
			this.inputId = oEvent.getSource().getId();			
			this.loadOrderHelpDialog();
			this.getOrders();
		},			
		handleOrderSelect: function (oEvent) {
			var orderId = oEvent.getParameter("listItem").getCells()[0].getTitle();
			this.getView().byId(this.inputId).setValue(orderId);
			this._valueHelpDialog.close();
		},
		_createSample: function (oEvent) {
			var oPayload = {
				"orderId": this.getView().byId("orderId").getValue(),
				"sampleName": this.getView().byId("sampleName").getValue(),
				"sampleDesc": this.getView().byId("sampleDesc").getValue(),
				"sampleQty": this.getView().byId("sampleQty").getValue(),
				"sampleUom": this.getView().byId("sampleUom").getValue(),
				"sampleCKey": this.getView().byId("sampleCKey").getSelectedKey(),
				"sampleCond": this.getView().byId("sampleCond").getValue(),
				"createdBy": this.getView().byId("createdBy").getSelectedKey(),
				"createdAt": new Date()
			}

			console.log(oPayload);
			//prepare post
			var URL = "http://localhost:3000/api/samples";

			$.ajax({
				url: URL,
				type: 'POST',
				data: oPayload,
				dataType: 'json',
				crossDomain: true,
				success: function (results) {
					console.log(results);
					MessageBox.success("Sample successfully created with document number : " + results.sampleId, {
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
