sap.ui.define([
	'com/limscloud/app/controller/BaseController',
	'jquery.sap.global',
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	'sap/ui/model/Filter'
], function (BaseController, jQuery, JSONModel, MessageToast, MessageBox, Filter) {
	"use strict";

	return BaseController.extend("com.limscloud.app.controller.jobs.CreateJob", {

		onInit: function () {
			this.router = this.getOwnerComponent().getRouter();
			var route = sap.ui.core.UIComponent.getRouterFor(this).getRoute("TT01");
			route.attachPatternMatched(this.onPatternMatched, this);

		},
		onPatternMatched: function (oEvent) {
			var that = this;
			//Init Model data
			// var oModel = new JSONModel(jQuery.sap.getModulePath("com.limscloud.app.jsonstore", "/jobsData.json"));
			// oModel.setSizeLimit(1000000);
			// this.getView().setModel(oModel, "jobsModel");


			var initUsers = function () {
				var URL = "";
				var weHaveSuccess = false;

				URL = "http://localhost:3000/api/lookups/users"
				$.ajax({
					type: "GET",
					url: URL,
					dataType: "json",
					crossDomain: true,

					success: function (results) {
						weHaveSuccess = true;
						that.getView().getModel("jobsModel").setProperty("/lookups/users", results);
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

			var initLabs = function () {
				var URL = "";
				var weHaveSuccess = false;

				URL = "http://localhost:3000/api/lookups/labs"
				$.ajax({
					type: "GET",
					url: URL,
					dataType: "json",
					crossDomain: true,

					success: function (results) {
						weHaveSuccess = true;
						that.getView().getModel("jobsModel").setProperty("/lookups/labs", results);
					},
					error: function (response) {
						MessageToast.show("Error!  " + response.status);
					},
					complete: function () {
						if (!weHaveSuccess) {
							MessageToast.show("Unable to fetch labs");
						}
					}
				});
			}

			var initTestGroups = function () {
				var URL = "";
				var weHaveSuccess = false;

				URL = "http://localhost:3000/api/lookups/testGroups"
				$.ajax({
					type: "GET",
					url: URL,
					dataType: "json",
					crossDomain: true,

					success: function (results) {
						weHaveSuccess = true;
						that.getView().getModel("jobsModel").setProperty("/lookups/testGroups", results);
					},
					error: function (response) {
						MessageToast.show("Error!  " + response.status);
					},
					complete: function () {
						if (!weHaveSuccess) {
							MessageToast.show("Unable to fetch testGroups");
						}
					}
				});
			}

			initUsers();
			initLabs();
			initTestGroups();

		},

		_resetApp: function (oEvent) {

		},


		// Load Order
		_loadOrder: function (oEvent) {
			var that = this;

			var oModel = this.getView().getModel("jobsModel");
			var oInputControl = oEvent.getSource();


			var initCustomers = function () {
				var URL = "";
				var weHaveSuccess = false;

				URL = "http://localhost:3000/api/customers";
				$.ajax({
					type: "GET",
					url: URL,
					dataType: "json",
					crossDomain: true,

					success: function (results) {
						weHaveSuccess = true;
						that.getView().getModel("jobsModel").setProperty("/lookups/customers", results);
					},
					error: function (response) {
						MessageToast.show("Error!  " + response.status);
					},
					complete: function () {
						if (!weHaveSuccess) {
							MessageToast.show("Unable to fetch customers");
						}
					}
				});
			}
			var initFragment = function () {

				that.inputId = oEvent.getSource().getId();
				var oView = that.getView();
				that._valueHelpDialog = oView.byId("order_picker_dialog");
				// create value help dialog

				if (!that._valueHelpDialog) {
					// create dialog via fragment factory
					that._valueHelpDialog = sap.ui.xmlfragment(oView.getId(), "com.limscloud.app.view.jobs.fragments.orderPickerDialog", that);
					oView.addDependent(that._valueHelpDialog);
				}
				// open value help dialog filtered by the input value
				that._valueHelpDialog.open();
			}
			initFragment();
			initCustomers();
		},
		//Test Method Dialog
		_loadTestMethods: function (oEvent) {
			var that = this;

			var oModel = this.getView().getModel("jobsModel");
			var oInputControl = oEvent.getSource();
			var sPath = oInputControl.getParent().getBindingContextPath();

			var groupId = this.getView().byId("headTestGroup").getSelectedKey(),
				paramId = oModel.getObject(sPath).testParamId;

			var initTestParams = function (groupId, paramId) {
				var URL = "";
				var weHaveSuccess = false;

				URL = "http://localhost:3000/api/lookups/testMethods?groupId=" + groupId + "&paramId=" + paramId;
				$.ajax({
					type: "GET",
					url: URL,
					dataType: "json",
					crossDomain: true,

					success: function (results) {
						weHaveSuccess = true;
						that.getView().getModel("jobsModel").setProperty("/lookups/testMethods", results);
					},
					error: function (response) {
						MessageToast.show("Error!  " + response.status);
					},
					complete: function () {
						if (!weHaveSuccess) {
							MessageToast.show("Unable to fetch testMethods");
						}
					}
				});
			}
			var initFragment = function () {
				var sInputValue = oEvent.getSource().getValue();
				that.inputId = oEvent.getSource().getId();
				var oView = that.getView();
				that._valueHelpDialog = oView.byId("test_method_dialog");
				// create value help dialog

				if (!that._valueHelpDialog) {
					// create dialog via fragment factory
					that._valueHelpDialog = sap.ui.xmlfragment(oView.getId(), "com.limscloud.app.view.jobs.fragments.testMethDialog", that);
					oView.addDependent(that._valueHelpDialog);
				}

				// create a filter for the binding
				that._valueHelpDialog.getBinding("items").filter([new Filter(
					"MethodValue",
					sap.ui.model.FilterOperator.Contains, ""
				)]);

				// open value help dialog filtered by the input value
				that._valueHelpDialog.open();
			}

			initTestParams(groupId, paramId);
			initFragment();


		},
		_handleInputConfirm: function (oEvent) {
			var obj = this.getOwnerComponent().getModel("jobsModel").getProperty(oEvent.getParameter("selectedItem").getBindingContextPath());
			this.getView().getModel("jobsModel").setProperty(sap.ui.getCore().byId(this.inputId).getParent().getBindingContextPath() + "/testMethId", obj.MethodId);
			sap.ui.getCore().byId(this.inputId).setValue(obj.MethodValue + " - " + obj.MethodDesc);
		},



		// Table Management funcitions
		_addItem: function (oEvent) {
			var oModel = this.getView().getModel("jobsModel");
			var tableItems = oModel.getProperty("/createJob/items");
			var tableLength = oModel.getProperty("/createJob/items").length;

			var pad = function (num, size) {
				var s = num + "";
				while (s.length < size) s = "0" + s;
				return s;
			};

			var oItem = {};
			oItem.itemId = pad(tableLength + 1, 3);
			oItem.desc = "";
			oItem.sampleId = "";
			oItem.testGroupId = this.getView().byId("headTestGroup").getSelectedKey();
			oItem.testParamId = "";
			oItem.testMethId = "";
			oItem.createdBy = this.getView().byId("headIssuer").getSelectedKey();

			tableItems.push(oItem);

			oModel.setProperty("/createJob/items", tableItems);
		},
		_manageItems: function (oEvent) {

		},
		_createItemBtnPress: function (oEvent) {
			var that = this;
			var oModel = this.getView().getModel("jobsModel");

			var orderId = this.getView().byId("headOrder").getValue(),
				desc = this.getView().byId("headDesc").getValue(),
				labId = this.getView().byId("headLab").getSelectedKey(),
				groupId = this.getView().byId("headTestGroup").getSelectedKey(),
				issuerId = this.getView().byId("headIssuer").getSelectedKey(),
				approverId = this.getView().byId("headApprover").getSelectedKey();

			oModel.setProperty("/createJob/header/jobDesc", desc);
			oModel.setProperty("/createJob/header/labId", labId);
			oModel.setProperty("/createJob/header/testGroup", groupId);
			oModel.setProperty("/createJob/header/createdBy", issuerId);
			oModel.setProperty("/createJob/header/approverId", approverId);

			var initSamples = function () {
				var URL = "";
				var weHaveSuccess = false;

				URL = "http://localhost:3000/api/lookups/samples";
				$.ajax({
					type: "GET",
					url: URL,
					dataType: "json",
					crossDomain: true,

					success: function (results) {
						weHaveSuccess = true;
						that.getView().getModel("jobsModel").setProperty("/lookups/samples", results);
					},
					error: function (response) {
						MessageToast.show("Error!  " + response.status);
					},
					complete: function () {
						if (!weHaveSuccess) {
							MessageToast.show("Unable to fetch samples");
						}
					}
				});
			}

			var initTestParams = function (groupId) {
				var URL = "";
				var weHaveSuccess = false;

				URL = "http://localhost:3000/api/lookups/testParams?groupId=" + groupId;
				$.ajax({
					type: "GET",
					url: URL,
					dataType: "json",
					crossDomain: true,

					success: function (results) {
						weHaveSuccess = true;
						that.getView().getModel("jobsModel").setProperty("/lookups/testParams", results);
					},
					error: function (response) {
						MessageToast.show("Error!  " + response.status);
					},
					complete: function () {
						if (!weHaveSuccess) {
							MessageToast.show("Unable to fetch testParams");
						}
					}
				});
			}

			initSamples();
			initTestParams(groupId);

			this.getView().byId("jobItemsTable").setVisible(true);
			this.getView().byId("page0").setShowFooter(true);

		},

		//handle ComboBox changes - header level
		_onOrderSelect: function (oEvent) {
			var orderId = oEvent.getParameter("listItem").getCells()[0].getTitle();
			this.getView().byId(this.inputId).setValue(orderId);
			this._valueHelpDialog.close();
			this.getView().getModel("jobsModel").setProperty("/createJob/header/orderId", orderId);
		},
		_onSelectCustomer: function (oEvent) {
			console.log(oEvent.getParameters());

			var that = this;

			var custId = oEvent.getParameter("selectedRow").getAggregation("cells")[1].getText();

			var initOrders = function (custId) {
				var URL = "";
				var weHaveSuccess = false;

				URL = "http://localhost:3000/api/orders?custId=" + custId;
				$.ajax({
					type: "GET",
					url: URL,
					dataType: "json",
					crossDomain: true,

					success: function (results) {
						weHaveSuccess = true;
						that.getView().getModel("jobsModel").setProperty("/lookups/orders", results);
					},
					error: function (response) {
						MessageToast.show("Error!  " + response.status);
					},
					complete: function () {
						if (!weHaveSuccess) {
							MessageToast.show("Unable to fetch Orders");
						}
					}
				});

			}

			initOrders(custId);
		},

		//handle ComboBox changes - item level
		_onSampleChange: function (oEvent) {
			var oComboBox = oEvent.getSource(),
				sSelectedKey = oComboBox.getSelectedKey();

			var sPath = oComboBox.getParent().getBindingContextPath();

			if (!sSelectedKey) {
				oComboBox.setValueState("Error");
			} else {
				this.getView().getModel("jobsModel").setProperty(sPath + "/sampleId", oEvent.getSource().getSelectedKey());
				oComboBox.setValueState("None");
			}
		},
		_onTestParamChange: function (oEvent) {
			var oComboBox = oEvent.getSource(),
				sSelectedKey = oComboBox.getSelectedKey();

			var sPath = oComboBox.getParent().getBindingContextPath();

			if (!sSelectedKey) {
				oComboBox.setValueState("Error");
			} else {
				this.getView().getModel("jobsModel").setProperty(sPath + "/testParamId", oEvent.getSource().getSelectedKey());
				oComboBox.setValueState("None");
			}
		},
		_onTestMethodChange: function (oEvent) {
			var oComboBox = oEvent.getSource(),
				sSelectedKey = oComboBox.getSelectedKey();

			var sPath = oComboBox.getParent().getBindingContextPath();

			if (!sSelectedKey) {
				oComboBox.setValueState("Error");
			} else {
				this.getView().getModel("jobsModel").setProperty(sPath + "/testMethId", oEvent.getSource().getSelectedKey());
				oComboBox.setValueState("None");
			}
		},


		onCreateSave: function (oEvent) {
			//Validate
			//Create json
			var oPayload = this.getOwnerComponent().getModel("jobsModel").getProperty("/createJob");

			console.log(oPayload);

			//prepare post
			var URL = "http://localhost:3000/api/jobs/";

			$.ajax({
				url: URL,
				type: 'POST',
				data: oPayload,
				dataType: 'json',
				crossDomain: true,
				success: function (results) {
					console.log(results);
					MessageBox.success("Job successfully created with document number : " + results.jobId, {
						details: results,
						contentWidth: "100px"
					});
				},
				error: function (error) {
					console.log(error);
				}
			});
		}
	});

});
