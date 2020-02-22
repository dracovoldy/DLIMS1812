sap.ui.define([
	'com/limscloud/app/controller/BaseController',
	'jquery.sap.global',
	'sap/m/Popover',
	'sap/m/Button',
	'sap/ui/core/routing/History'
], function(BaseController, jQuery, Popover, Button, History) {
	"use strict";

	return BaseController.extend("com.limscloud.app.controller.users.CreateUsers", {

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
