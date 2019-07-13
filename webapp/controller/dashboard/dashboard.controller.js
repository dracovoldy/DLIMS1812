sap.ui.define([
	'com/limscloud/app/controller/BaseController',
	'jquery.sap.global',
	'sap/ui/core/Fragment',
	'sap/ui/model/json/JSONModel',
	'sap/m/Popover',
	'sap/m/Button',
	'sap/m/MessageToast'
], function (BaseController, jQuery, Fragment, JSONModel, Popover, Button, MessageToast) {
	"use strict";

	return BaseController.extend("com.limscloud.app.controller.dashboard.dashboard", {

		onInit: function () {
			this.router = this.getOwnerComponent().getRouter();
			var route = sap.ui.core.UIComponent.getRouterFor(this).getRoute("Dashboard");
			route.attachPatternMatched(this.onPatternMatched, this);
			this._setToggleButtonTooltip(!sap.ui.Device.system.desktop);
		},
		onPatternMatched: function (event) {
			// const model = this.getModel("odata");
			this.accessToken = event.getParameter("arguments").itemId;
			MessageToast.show(this.accessToken);
		},
		onAfterRendering: function () {
			this.router.navTo("dashboardTiles");
		},
		onItemSelect: function (oEvent) {
			this.router.navTo(oEvent.getParameter("item").getKey());
		},
		toLogout: function () {
			/* Logout */
			this.getOwnerComponent().getRouter().navTo("LoginPage");
		},
		handleUserNamePress: function (event) {
			var self = this;
			var popover = new Popover({
				showHeader: false,
				placement: sap.m.PlacementType.Bottom,
				content: [
					new Button({
						text: 'Settings',
						type: sap.m.ButtonType.Transparent
					}),
					new Button({
						text: 'Logout',
						type: sap.m.ButtonType.Transparent,
						press: [self.toLogout, self]
					})
				]
			}).addStyleClass('sapMOTAPopover sapTntToolHeaderPopover');

			popover.openBy(event.getSource());
		},

		onSideNavButtonPress: function () {
			var viewId = this.getView().getId();
			var toolPage = sap.ui.getCore().byId(viewId + "--toolPage");
			var sideExpanded = toolPage.getSideExpanded();

			this._setToggleButtonTooltip(sideExpanded);

			toolPage.setSideExpanded(!toolPage.getSideExpanded());
		},

		_setToggleButtonTooltip: function (bLarge) {
			var toggleButton = this.byId('sideNavigationToggleButton');
			if (bLarge) {
				toggleButton.setTooltip('Expand');
			} else {
				toggleButton.setTooltip('Collapse');
			}
		}

	});

});