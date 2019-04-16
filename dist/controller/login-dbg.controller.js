sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/m/Popover',
	'sap/m/Button',
	'sap/m/MessageToast'
], function (jQuery, Controller, Popover, Button, MessageToast) {
	"use strict";

	return Controller.extend("com.limscloud.app.controller.login", {

		onInit: function () {

			this.addAllCSS();
			this.addDynamicContent();

		},
		_tryLogin: function (oEvent) {
			var that = this;
			that.getOwnerComponent().getRouter().navTo("Dashboard", { itemId: "devLogin" });

			// var context  = oEvent.getSource().getBindingContext();
			var oView = this.getView();
			var user = oView.byId("inUser").getValue(),
				pass = oView.byId("inPass").getValue(),
				someurl = "https://abhi4api.herokuapp.com/authentication",
				somedata = {};

			somedata.strategy = "local";
			somedata.email = user;
			somedata.password = pass;

			var weHaveSuccess = false;
			this.accessToken = "";

			$.ajax({
				type: "POST",
				url: someurl,
				dataType: "json",
				crossDomain: true,
				data: somedata,
				
				success: function (result) {
					that.accessToken = result.accessToken;
					MessageToast.show(that.accessToken);
					weHaveSuccess = true;
					that.getOwnerComponent().getRouter().navTo("Dashboard", { itemId: that.accessToken });
					
				},
				error: function (response) {
					MessageToast.show("Error!  " + response.status);
				},
				complete: function () {
					if (!weHaveSuccess) {
						MessageToast.show("Your username/password seems to be incorrect!");
					}
				}
			});
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