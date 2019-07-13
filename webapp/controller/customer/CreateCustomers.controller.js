sap.ui.define([
	'com/limscloud/app/controller/BaseController',
	'jquery.sap.global',
	'sap/m/Popover',
	'sap/m/Button',
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageBox'
], function (BaseController, jQuery, Popover, Button, JSONModel, MessageBox) {
	"use strict";

	return BaseController.extend("com.limscloud.app.controller.customer.CreateCustomers", {

		onInit: function () {
			this.router = this.getOwnerComponent().getRouter();
			var route = sap.ui.core.UIComponent.getRouterFor(this).getRoute("CU01");
			route.attachPatternMatched(this.onPatternMatched, this);

		},
		onPatternMatched: function (oEvent) {
			var that = this;
			// Init Model data
			var oModel = new JSONModel(jQuery.sap.getModulePath("com.limscloud.app.jsonstore", "/CU01.json"));
			oModel.setSizeLimit(1000000);
			this.getView().setModel(oModel, "customerModel");


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

			initUsers("customerModel");

		},
		_onCreateCustomer: function (oEvent) {
			var oModel = this.getView().getModel("customerModel");

			oModel.setProperty("/payload/name", this.getView().byId("custName").getValue());
			oModel.setProperty("/payload/addLine1", this.getView().byId("custAddLine1").getValue());
			oModel.setProperty("/payload/addLine2", this.getView().byId("custAddLine2").getValue());
			oModel.setProperty("/payload/desc", this.getView().byId("custDesc").getValue());
			oModel.setProperty("/payload/zipcode", this.getView().byId("custZipcode").getValue());
			oModel.setProperty("/payload/city", this.getView().byId("custCity").getValue());
			oModel.setProperty("/payload/createdBy", this.getView().byId("createdBy").getSelectedKey());
			oModel.setProperty("/payload/modifiedBy", this.getView().byId("createdBy").getSelectedKey());			

			var oPayload = this.getView().getModel("customerModel").getProperty("/payload")

			console.log(oPayload);

			//prepare post
			var URL = "http://localhost:3000/api/customers/";

			$.ajax({
				url: URL,
				type: 'POST',
				data: oPayload,
				dataType: 'json',
				crossDomain: true,
				success: function (results) {
					console.log(results);
					MessageBox.success("Customer successfully created with document number : " + results.custId, {
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
