sap.ui.define([
	'com/limscloud/app/controller/jobs/JB03.controller',
	'jquery.sap.global',
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	'sap/ui/model/Filter',
	'sap/ui/core/routing/History',
	'com/limscloud/app/util/formatter'
], function (JB03, jQuery, JSONModel, MessageToast, MessageBox, Filter, History, formatter) {
	"use strict";

	var appModelName = "JB03";
	return JB03.extend("com.limscloud.app.controller.jobs.JB03-detail", {
		formatter: formatter,
		onInit: function () {
			this.router = this.getOwnerComponent().getRouter();
			var route = sap.ui.core.UIComponent.getRouterFor(this).getRoute("JB03-detail");
			route.attachPatternMatched(this.onPatternMatched, this);
		},
		onPatternMatched: function (oEvent) {
			console.log("I'm at JB03-detail");
			if (this.formatter.formatSButton(this.getOwnerComponent().getModel(appModelName).getProperty("/selected/status"))) {
				this._showFormFragment("JB03FragmentEdit");
			} else {
				this._showFormFragment("JB03FragmentDisplay");
			}
		},
		refreshSelected: function (labUser, jobId, itemId, isAfterSubmit) {
			var that = this;
			var URL = "";
			var weHaveSuccess = false;
			var appModel = this.getOwnerComponent().getModel(appModelName);

			URL = `http://localhost:3000/api/testing/JB03/refresh?labUser=${labUser}&jobId=${jobId}&itemId=${itemId}&isAfterSubmit=${isAfterSubmit}`
			$.ajax({
				type: "GET",
				url: URL,
				dataType: "json",
				crossDomain: true,

				success: function (results) {					
					console.log(results);
					weHaveSuccess = true;
					MessageToast.show("Selected Job Item Refreshed");
					appModel.setProperty("/selected", results[0]);
				},
				error: function (response) {
					console.log(response);
					MessageToast.show("Error!  " + response.status);
				},
				complete: function () {
					if (!weHaveSuccess) {
						MessageToast.show("JB03 /refresh error!");						
					}		
					that.onPatternMatched();		
				}
			});
		},
		onStatusChangeBtnPress: function (oEvent) {
			var oButton = oEvent.getSource();

			// create action sheet only once
			if (!this._actionSheet) {
				this._actionSheet = sap.ui.xmlfragment(
					"com.limscloud.app.view.jobs.fragments.JB03StatusAction",
					this
				);
				this.getView().addDependent(this._actionSheet);
			}

			this._actionSheet.openBy(oButton);
		},

		_changeStatusWIP: function (oEvent) {
			var that = this;
			var URL = "";
			var weHaveSuccess = false;
			var appModel = this.getOwnerComponent().getModel(appModelName);

			var payload = {
				"jobId": appModel.getProperty("/selected/job_id"),
				"jobItem": appModel.getProperty("/selected/item_id"),
				"comment": "JOB IN PROGRESS",
				"actionUser": "PANDYAH"
			};

			URL = "http://localhost:3000/api/testing/JB03/setStatusWIP"
			$.ajax({
				type: "POST",
				data: payload,
				url: URL,
				dataType: "json",
				crossDomain: true,

				success: function (results) {
					console.log(results);
					weHaveSuccess = true;
					MessageToast.show("Status Changed to 'In Progress' !");
				},
				error: function (response) {
					console.log(response);
					MessageToast.show("Error!  " + response.status);
				},
				complete: function () {
					if (!weHaveSuccess) {
						MessageToast.show("JB03 setStatusWIP error!");
						that._showFormFragment("JB03FragmentDisplay");
					}

					that.refreshSelected(payload.actionUser, payload.jobId, payload.jobItem, false);
				}
			});
		},

		_formFragments: {},
		_showFormFragment: function (sFragmentName) {
			var oPage = this.byId("dynamicPageId");

			// oPage.destroyContent();
			// oPage.destroyContent();
			// oPage.invalidate();
			// oPage.rerender();
			oPage.setContent(this._getFormFragment(sFragmentName));
		},
		_getFormFragment: function (sFragmentName) {
			var oFormFragment = this._formFragments[sFragmentName];

			if (oFormFragment) {
				return oFormFragment;
			}

			oFormFragment = sap.ui.xmlfragment(this.getView().getId(), "com.limscloud.app.view.jobs.fragments." + sFragmentName, this);

			this._formFragments[sFragmentName] = oFormFragment;
			return this._formFragments[sFragmentName];
		},
		_onSavePress: function (oEvent) {
			


		},

		_onSubmitPress: function (oEvent) {
			var that = this;
			var URL = "";
			var weHaveSuccess = false;

			var payload = {
				"jobId": this.getModel(appModelName).getProperty("/selected/job_id"),
				"itemId": this.getModel(appModelName).getProperty("/selected/item_id"),
				"value": this.getModel(appModelName).getProperty("/selected/performValue"),
				"comment": this.getModel(appModelName).getProperty("/selected/performComments"),
				"actionUser": "PANDYAH"
			};

			URL = "http://localhost:3000/api/testing/JB03/perform"
			$.ajax({
				type: "POST",
				data: payload,
				url: URL,
				dataType: "json",
				crossDomain: true,

				success: function (results) {
					console.log(results);
					weHaveSuccess = true;
					MessageToast.show("Successfully Submitted");
				},
				error: function (response) {
					console.log(response);
					MessageToast.show("Error!  " + response.status);
				},
				complete: function () {
					if (!weHaveSuccess) {
						MessageToast.show("JB03 /perform error");
					}

					that.refreshSelected(payload.actionUser, payload.jobId, payload.itemId, true);
				}
			});

		}
	});

});
