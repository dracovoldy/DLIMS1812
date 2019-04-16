sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/limscloud/app/model/models"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("com.limscloud.app.Component", {

		metadata: {
			manifest: "json"
		},

		init: function() {
            UIComponent.prototype.init.apply(this, arguments);
            this.getRouter().initialize();
		},
		
		createContent:function(){
		
		var appView = new sap.ui.view('idappView',{
			id: 'idappView',
			viewName:'com.limscloud.app.view.App',
			type:sap.ui.core.mvc.ViewType.JS
		});
		
		return appView;
	}	
		
		
	});

});