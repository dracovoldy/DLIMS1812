sap.ui.define([
	'com/limscloud/app/controller/BaseController',
	'jquery.sap.global',
	'sap/ui/core/Fragment',
	'sap/ui/model/json/JSONModel',	
	'sap/m/MessageToast',
	'sap/m/MessageItem',
	'sap/m/MessagePopover',
	'sap/m/Link',
	'sap/m/Popover',
	'sap/m/Button'
], function (BaseController, jQuery, Fragment, JSONModel, MessageToast, MessageItem, MessagePopover, Link, Popover, Button) {
	"use strict";

	var oLink = new Link({
		text: "Show more information",
		href: "http://sap.com",
		target: "_blank"
	});

	var oMessageTemplate = new MessageItem({
		type: '{notif>type}',
		title: '{notif>title}',
		activeTitle: "{notif>active}",
		description: '{notif>description}',
		subtitle: '{notif>subtitle}',
		counter: '{notif>counter}',
		link: oLink
	});

	var oMessagePopover = new MessagePopover({
		items: {
			path: 'notif>/',
			template: oMessageTemplate
		},
		activeTitlePress: function () {
			MessageToast.show('Active title is pressed');
		}
	});

	return BaseController.extend("com.limscloud.app.controller.dashboard.dashboard", {

		onInit: function () {
			this.router = this.getOwnerComponent().getRouter();
			var route = sap.ui.core.UIComponent.getRouterFor(this).getRoute("Dashboard");
			route.attachPatternMatched(this.onPatternMatched, this);
			this.initNotif();
			// this._setToggleButtonTooltip(!sap.ui.Device.system.desktop);

		},
		onPatternMatched: function (event) {
			// const model = this.getModel("odata");
			this.accessToken = event.getParameter("arguments").itemId;
			MessageToast.show(this.accessToken);
		},
		onAfterRendering: function () {
			this.router.navTo("dashboardTiles");
		},
		handleNotifPress: function (oEvent) {
			oMessagePopover.toggle(oEvent.getSource());
		},
		initNotif: function () {
			// create any data and a model and set it to the view

			var sErrorDescription = 'First Error message description. \n' +
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod' +
				'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,' +
				'quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo' +
				'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse' +
				'cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non' +
				'proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

			var aMockMessages = [{
				type: 'Error',
				title: 'Error message',
				active: true,
				description: sErrorDescription,
				subtitle: 'Example of subtitle',
				counter: 1
			}, {
				type: 'Warning',
				title: 'Warning without description',
				description: ''
			}, {
				type: 'Success',
				title: 'Success message',
				description: 'First Success message description',
				subtitle: 'Example of subtitle',
				counter: 1
			}, {
				type: 'Error',
				title: 'Error message',
				description: 'Second Error message description',
				subtitle: 'Example of subtitle',
				counter: 2
			}, {
				type: 'Information',
				title: 'Information message',
				description: 'First Information message description',
				subtitle: 'Example of subtitle',
				counter: 1
			}];

			var oModel = new JSONModel();
			oModel.setData(aMockMessages);			

			oMessagePopover.setModel(oModel, "notif");
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