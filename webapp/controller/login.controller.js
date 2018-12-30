sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/m/Popover',
	'sap/m/Button'
], function (jQuery, Controller, Popover, Button) {
	"use strict";

	return Controller.extend("com.limscloud.app.controller.login", {

		onInit: function () {

			this.addAllCSS();
			this.addDynamicContent();

		},
		toDashboard: function () {
			this.getOwnerComponent().getRouter().navTo("Dashboard");
		},
		addDynamicContent: function () {

			/* LoginPage */
			var loginFooter = this.getView().byId("loginFooter");
			loginFooter.setText("Made with ❤ in UI5 + Node.js");
		},
		addAllCSS: function () {
			/* UI references */

			/* LoginPage */
			var loginHeader = this.getView().byId("loginHeader");
			var loginFlex = this.getView().byId("loginBoxFlex");
			var loginBox = this.getView().byId("loginBox");
			var signinButton = this.getView().byId("signButton");
			var nosignButton = this.getView().byId("noSignButton");
			var loginFooter = this.getView().byId("loginFooter");

			/* Login CSS  */
			loginHeader.addStyleClass("loginHeader");
			loginFlex.addStyleClass("shellCustom-BG");
			loginBox.addStyleClass("shellCustom");
			signinButton.addStyleClass("buttonLoginBox");
			nosignButton.addStyleClass("buttonLoginBox");
			loginFooter.addStyleClass("footerLoginBox");

		}
	});

});