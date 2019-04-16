sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/m/Popover',
	'sap/m/Button'
], function(jQuery, Controller, Popover, Button) {
	"use strict";

	return Controller.extend("com.limscloud.app.controller.dashboardTasks", {

		onInit: function () {
           // alert("Im alive: View");
           this.router = this.getOwnerComponent().getRouter();
		}
		
		
	});

});
