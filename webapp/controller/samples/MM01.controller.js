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
			this.getView().setModel(oModel, "sampleModel");


			var initUsers = function (modelName) {
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
			}

			initUsers("sampleModel");

		},
		// Load Order
		_loadOrder: function (oEvent) {
			var that = this;

			var oModel = this.getView().getModel("jobsModel");
			var oInputControl = oEvent.getSource();


			var initCustomers = function () {
				var URL = "";
				var weHaveSuccess = false;

				URL = "http://localhost:3000/api/customers";
				$.ajax({
					type: "GET",
					url: URL,
					dataType: "json",
					crossDomain: true,

					success: function (results) {
						weHaveSuccess = true;
						that.getView().getModel("jobsModel").setProperty("/lookups/customers", results);
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
			}
			var initFragment = function () {

				that.inputId = oEvent.getSource().getId();
				var oView = that.getView();
				that._valueHelpDialog = oView.byId("order_picker_dialog");
				// create value help dialog

				if (!that._valueHelpDialog) {
					// create dialog via fragment factory
					that._valueHelpDialog = sap.ui.xmlfragment(oView.getId(), "com.limscloud.app.view.jobs.fragments.orderPickerDialog", that);
					oView.addDependent(that._valueHelpDialog);
				}
				// open value help dialog filtered by the input value
				that._valueHelpDialog.open();
			}
			initFragment();
			initCustomers();
		},
		_onSelectCustomer: function (oEvent) {
			console.log(oEvent.getParameters());

			var that = this;

			var custId = oEvent.getParameter("selectedRow").getAggregation("cells")[1].getText();

			var initOrders = function (custId) {
				var URL = "";
				var weHaveSuccess = false;

				URL = "http://localhost:3000/api/orders?custId=" + custId;
				$.ajax({
					type: "GET",
					url: URL,
					dataType: "json",
					crossDomain: true,

					success: function (results) {
						weHaveSuccess = true;
						that.getView().getModel("jobsModel").setProperty("/lookups/orders", results);
					},
					error: function (response) {
						MessageToast.show("Error!  " + response.status);
					},
					complete: function () {
						if (!weHaveSuccess) {
							MessageToast.show("Unable to fetch Orders");
						}
					}
				});

			}

			initOrders(custId);
		},
		//handle ComboBox changes - header level
		_onOrderSelect: function (oEvent) {
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
