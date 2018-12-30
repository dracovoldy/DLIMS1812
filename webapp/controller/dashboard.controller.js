sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/Fragment',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/m/Popover',
	'sap/m/Button'
], function (jQuery, Fragment, Controller, JSONModel, Popover, Button) {
	"use strict";

	var CController = Controller.extend("com.limscloud.app.controller.dashboard", {
		
		toLogout : function () {
			/* Logout */			
			this.getOwnerComponent().getRouter().navTo("LoginPage");
		} ,		
		onInit : function() {
			/* Nav */	
			this.attachDataToNavigation();
			this.attachDataToFixedNavigation();
			this._setToggleButtonTooltip(!sap.ui.Device.system.desktop);

			
		} ,
		navHelper: function (navString, key) {
			/* Navigation Helper for switching views */	
			var that = this;
			//var oScrollContainer = this.getView().byId(key);		
			var navContainerRef = this.getView().byId("pageContainer");
			var oScrollContainer = new sap.m.ScrollContainer(key, {
				horizontal: false,
				vertical: true,
				height: "100%"
				
			});
			//oScrollContainer.removeAllContent();
			var oCurrentView = oScrollContainer.getContent();
			if (!oCurrentView[0]) {
				var view = that.getView().byId(navString);
				if (view === undefined) {
					view = sap.ui.view({
						type: sap.ui.core.mvc.ViewType.XML,
						viewName: "com.limscloud.app.view."+ navString
					});
				}
				oScrollContainer.addContent(view);
				navContainerRef.addPage(oScrollContainer);
			}
			
		} ,
		attachDataToNavigation: function () {
			var self = this;
			/* Generate dynamically */
			var navList = this.getView().byId("navListItems");			
			var aData = jQuery.ajax({
				type : "GET",
				contentType : "application/json",
				url : "/navigations",
				dataType : "json",
				async: true, 
				success : function(data,textStatus, jqXHR) {	

					data.sort(function(a,b){ return a.id.localeCompare(b.id); });

					var dataLength = data.length;
					for(var i = 0; i < dataLength; i++){	
						var navChildList = new sap.tnt.NavigationListItem({				
							text: data[i].title,								
							key: data[i].key,
							icon: data[i].icon,
							expanded: data[i].expanded,
							select: [self.navHelper(data[i].select, data[i].key) , Controller]						
						});
						navList.addItem(navChildList);						
						//console.log(data[i].items);
						try {
							//Block of code to try
							if(data[i].items.length == null) throw "empty";
							var itemsLength = data[i].items.length;
							if(itemsLength > 0){
								
								for(var k = 0; k < itemsLength; k++){
									var navSubChildList = new sap.tnt.NavigationListItem({				
										text: data[i].items[k].title,															
										key: data[i].items[k].key,
										select: [self.navHelper(data[i].items[k].select, data[i].items[k].key) , Controller]
									});
									navChildList.addItem(navSubChildList);
								}
							}
						}
						catch(err) {
							//Block of code to handle errors
						}
						
					}
				}
			});
			
		} ,
		attachDataToFixedNavigation: function () {
			var self = this;
			/* Generate dynamically */
			var navList = this.getView().byId("fixedNavListItems");			
			var aData = jQuery.ajax({
				type : "GET",
				contentType : "application/json",
				url : "/fixedNavigations",
				dataType : "json",
				async: true, 
				success : function(data,textStatus, jqXHR) {	
					
					//data.sort(function(a,b){ return a.id.localeCompare(b.id); });

					var dataLength = data.length;
					for(var i = 0; i < dataLength; i++){	
						var navChildList = new sap.tnt.NavigationListItem({				
							text: data[i].title,					
							icon: data[i].icon,		
							key: data[i].key,				
							select: [self.navHelper(data[i].select, data[i].key) , Controller]						
						});
						navList.addItem(navChildList);						
					}
				}
			});
			
		} ,
		onItemSelect : function(oEvent) {
			var item = oEvent.getParameter('item');
			var viewId = this.getView().getId();
			sap.ui.getCore().byId(viewId + "--pageContainer").to(item.getKey(), "slide");
		},

		handleUserNamePress: function (event) {
			var self = this;
			var popover = new Popover({
				showHeader: false,
				placement: sap.m.PlacementType.Bottom,
				content:[					
					new Button({
						text: 'Help',
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

		onSideNavButtonPress : function() {
			var viewId = this.getView().getId();
			var toolPage = sap.ui.getCore().byId(viewId + "--toolPage");
			var sideExpanded = toolPage.getSideExpanded();

			this._setToggleButtonTooltip(sideExpanded);

			toolPage.setSideExpanded(!toolPage.getSideExpanded());
		},

		_setToggleButtonTooltip : function(bLarge) {
			var toggleButton = this.byId('sideNavigationToggleButton');
			if (bLarge) {
				toggleButton.setTooltip('Expand');
			} else {
				toggleButton.setTooltip('Collapse');
			}
		}

	});


	return CController;

});
