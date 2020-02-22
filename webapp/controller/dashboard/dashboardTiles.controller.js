sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/m/Popover',
	'sap/m/Button'
], function (jQuery, Controller, Popover, Button) {
	"use strict";

	return Controller.extend("com.limscloud.app.controller.dashboard.dashboardTiles", {

		onInit: function () {
			// alert("Im alive: View");
			this.router = this.getOwnerComponent().getRouter();
		},
		_navCU01: function () {
			this.router.navTo("CU01");
		},
		// _navCU05: function () {
		// 	this.router.navTo("CU05");
		// },
		_navOR01: function () {
			this.router.navTo("OR01");
		},
		// _navSU01: function () {
		// 	this.router.navTo("SU01");
		// },
		// _navSU05: function () {
		// 	this.router.navTo("SU05");
		// },

		_navMM01: function () {
			this.router.navTo("MM01");
		},
		_navTT01: function () {
			this.router.navTo("TT01");
		},
		_navRD01: function () {
			this.router.navTo("RD01");
		},
		_navRD50: function () {
			this.router.navTo("RD50");
		},
		_navRD02: function () {
			this.router.navTo("RD02");
		},
		_navJB01: function () {
			this.router.navTo("JB01");
		},
		_navAD01: function () {
			this.router.navTo("AD01");
		},
		_navTT02: function () {
			this.router.navTo("TT02");
		}

	});

});
