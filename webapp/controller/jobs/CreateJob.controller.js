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

		// LIFE CYCLE FUNC.
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

			var initDisp = function () {
				var URL = "";
				var weHaveSuccess = false;

				URL = "http://localhost:3000/api/tests/disp"
				$.ajax({
					type: "GET",
					url: URL,
					dataType: "json",
					crossDomain: true,

					success: function (results) {
						weHaveSuccess = true;
						that.getView().getModel("jobsModel").setProperty("/lookups/testDisp", results);
					},
					error: function (response) {
						MessageToast.show("Error!  " + response.status);
					},
					complete: function () {
						if (!weHaveSuccess) {
							MessageToast.show("Unable to fetch testDisp");
						}
					}
				});
			}

			initUsers();
			initLabs();
			initDisp();

			this.getView().byId("headDate").setDateValue(new Date());

		},
		_resetApp: function (oEvent) {

		},

		// HEADER Customer F4 
		_loadCustomerF4: function (oEvent) {
			var that = this;

			this.inputId = oEvent.getSource().getId();

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
			initFragment("customer_f4", "customerFragment");
			initCustomers();
		},
		_onCustomerF4Select: function (oEvent) {
			
			var oModel = this.getView().getModel("jobsModel");
			var oInput = this.getView().byId(this.inputId);
			
			var sPath = oEvent.getParameters().listItem.getBindingContextPath();
			var sObject = oModel.getProperty(sPath);

			oModel.setProperty("/createJob/header/customerId", sObject.custId);
			oModel.setProperty("/createJob/header/customerName", sObject.name);

			oInput.setValue(sObject.custId + " - " + sObject.name);
			oInput.setValueState("None");
			oInput.setValueStateText("");

			this._valueHelpDialog.close();

		},	
		//HEADER  Load Order F4
		_loadOrderF4: function (oEvent) {
			var that = this;

			var oModel = this.getView().getModel("jobsModel");
			var selCustId = oModel.getProperty("/createJob/header/customerId");

			if (!selCustId || selCustId.length <= 0) {
				this.getView().byId("headCust").setValueState("Error");
				this.getView().byId("headCust").setValueStateText("Please select Customer");
				this.getView().byId("headCust").focus();
				return;
			}			

			var initOrders = function (oCustId) {
				var URL = "";
				var weHaveSuccess = false;

				URL = "http://localhost:3000/api/orders?custId=" + oCustId;
				$.ajax({
					type: "GET",
					url: URL,
					dataType: "json",
					crossDomain: true,

					success: function (results) {
						weHaveSuccess = true;
						oModel.setProperty("/lookups/orders", results);
					},
					error: function (response) {
						MessageToast.show("Error!  " + response.status);
					},
					complete: function () {
						if (!weHaveSuccess) {
							MessageToast.show("Unable to fetch orders");
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

				that._valueHelpDialog.setTitle("Orders for: " + oModel.getProperty("/createJob/header/customerName"))

				// open value help dialog filtered by the input value
				that._valueHelpDialog.open();
			}
			initFragment();
			initOrders(selCustId);
		},
		_onOrderF4Select: function (oEvent) {

			var oInput = this.getView().byId(this.inputId);
			var oModel = this.getView().getModel("jobsModel");

			var sPath = oEvent.getParameters().listItem.getBindingContextPath();
			var sObject = oModel.getProperty(sPath);			

			oInput.setValue(sObject.orderId + " - " + sObject.orderDesc);

			oModel.setProperty("/createJob/header/orderId", sObject.orderId);
			oModel.setProperty("/createJob/header/orderName", sObject.orderDesc);

			oInput.setValueState("None");
			oInput.setValueStateText("");

			this._valueHelpDialog.close();
		},	
		

		// HEADER TEST DISCIPLINE F4 FUNCTIONS
		_handleTestDispF4: function (oEvent){
			this.inputId = oEvent.getSource().getId();
			var oView = this.getView();
			this._valueHelpDialog = oView.byId("test_disp_dialog");
			// create value help dialog

			if (!this._valueHelpDialog) {
				// create dialog via fragment factory
				this._valueHelpDialog = sap.ui.xmlfragment(oView.getId(), "com.limscloud.app.view.jobs.fragments." + "testDispDialog", this);
				oView.addDependent(this._valueHelpDialog);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog.open();
		},
		_hdlTestDispConfirm: function (oEvent) {
			var oItem = oEvent.getParameter("selectedContexts")[0].getObject()
			this.getView().byId(this.inputId).setValue(oItem.disp_id + " - " + oItem.disp_name);
		},
		_hdlTestDispCancel: function (oEvent) {			
			this.getView().byId(this.inputId).setValue(null);
		},

		// HEADER TEST GROUP F4 FUNCTIONS
		_handleTestGrpF4: function (oEvent){
			var that = this;
			this.inputId = oEvent.getSource().getId();
			var oView = this.getView();
			this._valueHelpDialog = oView.byId("test_grp_dialog");
			// create value help dialog

			if (!this._valueHelpDialog) {
				// create dialog via fragment factory
				this._valueHelpDialog = sap.ui.xmlfragment(oView.getId(), "com.limscloud.app.view.jobs.fragments." + "testGroupDialog", this);
				oView.addDependent(this._valueHelpDialog);
			}
			// open value help dialog filtered by the input value

			var getTestGroups = function (dispId) {
				var URL = "";
				var weHaveSuccess = false;

				URL = "http://localhost:3000/api/tests/group?dispId=" + dispId;
				$.ajax({
					type: "GET",
					url: URL,
					dataType: "json",
					crossDomain: true,

					success: function (results) {
						weHaveSuccess = true;
						that.getView().getModel("jobsModel").setProperty("/lookups/testGroup", results);
					},
					error: function (response) {
						MessageToast.show("Error!  " + response.status);
					},
					complete: function (oRes) {
						if (!weHaveSuccess) {
							MessageToast.show(oRes.responseJSON.error);
							return;
						}
						that._valueHelpDialog.open();
					}
				});
			}
			var dispId = this.getView().byId("headDisp").getValue().split(" - ")[0]
			getTestGroups(dispId);

			
		},
		_hdlTestGrpConfirm: function (oEvent) {
			var oItem = oEvent.getParameter("selectedContexts")[0].getObject()
			this.getView().byId(this.inputId).setValue(oItem.grp_id + " - " + oItem.grp_desc);
		},
		_hdlTestGrpCancel: function (oEvent) {			
			this.getView().byId(this.inputId).setValue(null);
		},

		//ITEM TEST PRODUCT MATERIAL F4
		_itemHdlTestProductF4: function (oEvent){
			var that = this;
			this.inputId = oEvent.getSource().getId();
			var oView = this.getView();
			this._valueHelpDialog = oView.byId("test_prod_dialog");
			// create value help dialog

			if (!this._valueHelpDialog) {
				// create dialog via fragment factory
				this._valueHelpDialog = sap.ui.xmlfragment(oView.getId(), "com.limscloud.app.view.jobs.fragments." + "testProdDialog", this);
				oView.addDependent(this._valueHelpDialog);
			}
			// open value help dialog filtered by the input value

			var getTestProds = function (groupId) {
				var URL = "";
				var weHaveSuccess = false;

				URL = "http://localhost:3000/api/tests/prod?groupId=" + groupId;
				$.ajax({
					type: "GET",
					url: URL,
					dataType: "json",
					crossDomain: true,

					success: function (results) {
						weHaveSuccess = true;
						that.getView().getModel("jobsModel").setProperty("/lookups/testProd", results);
					},
					error: function (response) {
						MessageToast.show("Error!  " + response.status);
					},
					complete: function (oRes) {
						if (!weHaveSuccess) {
							MessageToast.show(oRes.responseJSON.error);
							return;
						}
						that._valueHelpDialog.open();
					}
				});
			}
			var groupId = this.getView().byId("headGroup").getValue().split(" - ")[0]
			getTestProds(groupId);

			
		},
		_itemHdlTestProductConfirm: function (oEvent) {
			var oItem = oEvent.getParameter("selectedContexts")[0].getObject()
			this.getView().byId(this.inputId).setValue(oItem.pm_id + " - " + oItem.pm_desc);
		},
		_itemHdlTestProductCancel: function (oEvent) {			
			this.getView().byId(this.inputId).setValue(null);
		},

		//ITEM TEST MASTER F4
		_itemHdlTestMasterF4: function (oEvent){
			var that = this;
			this.inputId = oEvent.getSource().getId();
			var oView = this.getView();
			this._valueHelpDialog = oView.byId("test_master_dialog");
			// create value help dialog

			if (!this._valueHelpDialog) {
				// create dialog via fragment factory
				this._valueHelpDialog = sap.ui.xmlfragment(oView.getId(), "com.limscloud.app.view.jobs.fragments." + "testMasterDialog", this);
				oView.addDependent(this._valueHelpDialog);
			}
			// open value help dialog filtered by the input value

			var getTestMaster = function (prodId) {
				var URL = "";
				var weHaveSuccess = false;

				URL = "http://localhost:3000/api/tests/master?prodId=" + prodId;
				$.ajax({
					type: "GET",
					url: URL,
					dataType: "json",
					crossDomain: true,

					success: function (results) {
						weHaveSuccess = true;
						that.getView().getModel("jobsModel").setProperty("/lookups/testMaster", results);
					},
					error: function (response) {
						MessageToast.show("Error!  " + response.status);
					},
					complete: function (oRes) {
						if (!weHaveSuccess) {
							MessageToast.show(oRes.responseJSON.error);
							return;
						}
						that._valueHelpDialog.open();
					}
				});
			}
			var prodId = this.getView().byId("itemProd").getValue().split(" - ")[0]
			getTestMaster(prodId);

			
		},
		_hdlTestMasterConfirm: function (oEvent) {
			var oItem = oEvent.getParameter("selectedContexts")[0].getObject()
			// console.log(oItem);
			this.getView().byId(this.inputId).setValue(oItem.tms_id + " - " + oItem.tms_snam);
		},
		_hdlTestMasterCancel: function (oEvent) {			
			this.getView().byId(this.inputId).setValue(null);
		},

		//ITEM TEST TYPE F4
		_itemHdlTestTypeF4: function (oEvent){
			var that = this;
			this.inputId = oEvent.getSource().getId();
			var oView = this.getView();
			this._valueHelpDialog = oView.byId("test_type_dialog");
			// create value help dialog

			if (!this._valueHelpDialog) {
				// create dialog via fragment factory
				this._valueHelpDialog = sap.ui.xmlfragment(oView.getId(), "com.limscloud.app.view.jobs.fragments." + "testTypeDialog", this);
				oView.addDependent(this._valueHelpDialog);
			}
			// open value help dialog filtered by the input value

			var getTestType = function (masterId) {
				var URL = "";
				var weHaveSuccess = false;

				URL = "http://localhost:3000/api/tests/type?masterId=" + masterId;
				$.ajax({
					type: "GET",
					url: URL,
					dataType: "json",
					crossDomain: true,

					success: function (results) {
						weHaveSuccess = true;
						that.getView().getModel("jobsModel").setProperty("/lookups/testType", results);
					},
					error: function (response) {
						MessageToast.show("Error!  " + response.status);
					},
					complete: function (oRes) {
						if (!weHaveSuccess) {
							MessageToast.show(oRes.responseJSON.error);
							return;
						}
						that._valueHelpDialog.open();
					}
				});
			}
			var masterId = this.getView().byId("itemTestMaster").getValue().split(" - ")[0]
			getTestType(masterId);

			
		},
		_hdlTestTypeConfirm: function (oEvent) {
			var oItem = oEvent.getParameter("selectedContexts")[0].getObject()
			this.getView().byId(this.inputId).setValue(oItem.tmt_id + " - " + oItem.tmt_desc);
		},
		_hdlTestTypeCancel: function (oEvent) {			
			this.getView().byId(this.inputId).setValue(null);
		},



		// Table Management funcitions
		_triggerAddItem: function (oEvent) {
			var that = this;
			// that.inputId = oEvent.getSource().getId();
			var oView = that.getView();
			that._createDialog = oView.byId("createJobItemDialog");
			// create value help dialog

			if (!that._createDialog) {
				// create dialog via fragment factory
				that._createDialog = sap.ui.xmlfragment(oView.getId(), "com.limscloud.app.view.jobs.fragments.createJobItem", that);
				oView.addDependent(that._createDialog);
			}			

			// open value help dialog filtered by the input value
			that._createDialog.open();


		},
		_addItem: function (oItem) {
			var oModel = this.getView().getModel("jobsModel");
			var tableItems = oModel.getProperty("/createJob/items");
			var tableLength = oModel.getProperty("/createJob/items").length;

			var pad = function (num, size) {
				var s = num + "";
				while (s.length < size) s = "0" + s;
				return s;
			};

			// var oItem = {};
			oItem.itemId = pad(tableLength + 1, 3);
			oItem.info = "";
			// oItem.sampleId = "";
			// oItem.testGroupId = "";
			// oItem.testParamId = "";
			// oItem.testMethId = "";
			// oItem.createdBy = "";

			tableItems.push(oItem);

			oModel.setProperty("/createJob/items", tableItems);
		},
		_manageItems: function (oEvent) {

		},
		_createItemBtnPress: function (oEvent) {
			var that = this;
			var oModel = this.getView().getModel("jobsModel");

			// var orderId = this.getView().byId("headOrder").getValue(),
			// 	desc = this.getView().byId("headDesc").getValue(),
			// 	labId = this.getView().byId("headLab").getSelectedKey(),
			// 	groupId = this.getView().byId("headTestDisp").getSelectedKey(),
			// 	issuerId = this.getView().byId("headIssuer").getSelectedKey(),
			// 	approverId = this.getView().byId("headApprover").getSelectedKey();

			// oModel.setProperty("/createJob/header/jobDesc", desc);
			// oModel.setProperty("/createJob/header/labId", labId);
			// oModel.setProperty("/createJob/header/testGroup", groupId);
			// oModel.setProperty("/createJob/header/createdBy", issuerId);
			// oModel.setProperty("/createJob/header/approverId", approverId);

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

			// initSamples();
			// initTestParams(groupId);

			this.getView().byId("jobItemsTable").setVisible(true);
			this.getView().byId("page0").setShowFooter(true);

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
