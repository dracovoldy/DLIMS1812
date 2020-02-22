sap.ui.define([
	'com/limscloud/app/controller/BaseController',
	'jquery.sap.global',
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	'sap/ui/model/Filter',
	'com/limscloud/app/util/formatter'
], function (BaseController, jQuery, JSONModel, MessageToast, MessageBox, Filter, formatter) {
	"use strict";

	var appModelName = "appModel";

	return BaseController.extend("com.limscloud.app.controller.jobs.CreateJob", {
		formatter: formatter,
		onInit: function () {
			this.router = this.getOwnerComponent().getRouter();
			var route = sap.ui.core.UIComponent.getRouterFor(this).getRoute("JB01");
			route.attachPatternMatched(this.onPatternMatched, this);
		},
		onPatternMatched: function (oEvent) {
			console.log("I'm at JB01 - Create Job")
			var that = this;

			this.initLocalModel();
			this.getDocuments(appModelName);

		},
		initLocalModel: function () {
			// Init Model data
			var oModel = new JSONModel(jQuery.sap.getModulePath("com.limscloud.app.jsonstore", "/JB01.json"));
			oModel.setSizeLimit(1000000);
			this.getView().setModel(oModel, appModelName);
		},


		getDocuments: function (modelName) {
			var that = this;
			var URL = "";
			var weHaveSuccess = false;

			URL = "http://localhost:3000/api/testing/JB01"
			$.ajax({
				type: "GET",
				url: URL,
				dataType: "json",
				crossDomain: true,

				success: function (results) {
					weHaveSuccess = true;
					that.getView().getModel(modelName).setProperty("/jobs", results.jobs);
					that.getView().getModel(modelName).setProperty("/documentsCount", results.count);
				},
				error: function (response) {
					MessageToast.show("Error!  " + response.status);
				},
				complete: function () {
					if (!weHaveSuccess) {
						MessageToast.show("Unable to fetch documents");
					}
					// that.getView().byId("oh1").bindElement("appModel>/documents/0");
				}
			});
		},

		onAssignBtnPress: function (oEvent) {
			var that = this;
			var initUsers = function () {
				var URL = "";
				var weHaveSuccess = false;

				URL = `http://localhost:3000/api/commons/users?type=TESTER`;
				$.ajax({
					type: "GET",
					url: URL,
					dataType: "json",
					crossDomain: true,

					success: function (results) {
						weHaveSuccess = true;
						that.getView().getModel(appModelName).setProperty("/lookups/users", results);
					},
					error: function (response) {
						MessageToast.show("Error!  " + response.status);
					},
					complete: function () {
						if (!weHaveSuccess) {
							MessageToast.show("Unable to fetch users");
						}
					}
				});
			}
			var initFragment = function (oId, oFragment) {

				that.inputId = oEvent.getSource().getId();
				var oView = that.getView();
				that._valueHelpDialog = oView.byId(oId);
				// create value help dialog

				if (!that._valueHelpDialog) {
					// create dialog via fragment factory
					that._valueHelpDialog = sap.ui.xmlfragment(oView.getId(), "com.limscloud.app.view.jobs.fragments." + oFragment, that);
					oView.addDependent(that._valueHelpDialog);
				}
				// open value help dialog filtered by the input value
				that._valueHelpDialog.open();
			}
			// show users dialog

			initUsers();
			initFragment("users_select_dialog", "userSelectDialog");

		},

		handleUserSelect: function (oEvent) {
			var oTreeTable = this.getView().byId("TreeTableBasic");
			debugger;

			var aIndices = oTreeTable.getSelectedIndices();
			MessageToast.show(`Selected Indices: ${aIndices.toString()}`);

			var aContextData = aIndices.map(function (idx) {
				return oTreeTable.getContextByIndex(idx).getObject();
			});

			var lineitems = aContextData.map(function (lineitem) {

				if (!lineitem.itemNo) {
					var aDestruct = lineitem.documents.map(function (doc) {
						return { jobId: doc.documentNo, itemNo: doc.itemNo }
					});

					return aDestruct;
				}
				return { jobId: lineitem.documentNo, itemNo: lineitem.itemNo }
			});

			var flatLineitems = [].concat.apply([], lineitems);

			var jsonObject = flatLineitems.map(function(item) {
				return JSON.stringify(item);
			});

			var finalLineitems = Array.from(new Set(jsonObject)).map(function (item){
				return JSON.parse(item);
			});

			console.log(finalLineitems);

			var actionUser = oEvent.getParameter("selectedItem").getBindingContext("appModel").getObject().userId;
			var comment = "assigned from UI app";

			this.postAssign(finalLineitems, actionUser, comment);

		},
		postAssign: function (lineitems, actionUser, comment) {
			var that = this;
			var URL = "";
			var weHaveSuccess = false;

			URL = "http://localhost:3000/api/testing/JB01";
			$.ajax({
				type: "POST",
				data: {
					lineitems: lineitems,
					actionUser: actionUser,
					comment: comment
				},
				url: URL,
				dataType: "json",
				crossDomain: true,

				success: function (results) {
					console.log(results);
					weHaveSuccess = true;
					MessageToast.show("Assigned !");
					that.getDocuments(appModelName);
				},
				error: function (response) {
					console.log(response);
					MessageToast.show("Error!  " + response.status);
				},
				complete: function () {
					if (!weHaveSuccess) {
						MessageToast.show("Unable to fetch documents");
					}
				}
			});
		},

		onTreeNodeSelected: function (oEvent) {
			// debugger;
		}

	});

});
