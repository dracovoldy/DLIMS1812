sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/m/Popover',
	'sap/m/Button',
	'sap/ui/core/routing/History'
], function (jQuery, Controller, Popover, Button, History) {
	"use strict";

	return Controller.extend("com.limscloud.app.controller.CreateTasks", {

		onInit: function () {
			// alert("Im alive: View");

		},
		onNavBack: function (oEvent) {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("Dashboard", true);
			}
		},
		onCreate: function (oEvent) {
			//Validate
			//Create json
			var task = {};
			task.LabIndex = this.getView().byId("ip_labNo").getValue().trim();
			task.SampleIndex = this.getView().byId("ip_splNo").getValue().trim();
			task.TestGroup = this.getView().byId("ip_tsGrp").getValue().trim();
			task.Issuer = this.getView().byId("ip_issBy").getValue().trim();
			task.Approver = this.getView().byId("ip_apvBy").getValue().trim();


			//prepare post
			var url = "http://localhost:3000/api/jobs/"

			$.ajax({
				url: url,
				type: 'POST',
				data: task,
				dataType: 'json',
				contentType: 'application/x-www-form-urlencoded',
				success: function(data){
					console.log(data);
				},
				error: function(e){
					console.log(e);
				}
			  });
		}
	});

});
