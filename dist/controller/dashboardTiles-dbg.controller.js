sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/m/Popover',
	'sap/m/Button'
], function(jQuery, Controller, Popover, Button) {
	"use strict";

	return Controller.extend("com.limscloud.app.controller.dashboardTiles", {

		onInit: function () {
           // alert("Im alive: View");
           this.router = this.getOwnerComponent().getRouter();
		},
		_navCU01: function () {
			this.router.navTo("CU01");
		},
		_navCU05: function () {
			this.router.navTo("CU05");
		},
		_navSU01: function () {
			this.router.navTo("SU01");
		},
		_navSU05: function () {
			this.router.navTo("SU05");
		}
		
	});

});
