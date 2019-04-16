sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/m/Popover',
	'sap/m/Button',
	'sap/ui/core/routing/History'
], function(jQuery, Controller, Popover, Button, History) {
	"use strict";

	return Controller.extend("com.limscloud.app.controller.CreateUsers", {

		onInit: function () {
           // alert("Im alive: View");
           
		},
		onNavBack: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("Dashboard", true);
			}
		}
	
		
	});

});
