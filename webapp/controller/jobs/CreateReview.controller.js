sap.ui.define([
	'com/limscloud/app/controller/BaseController',
	'jquery.sap.global',
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	'sap/ui/model/Filter'
], function (BaseController, jQuery, JSONModel, MessageToast, MessageBox, Filter) {
	"use strict";

	return BaseController.extend("com.limscloud.app.controller.jobs.CreateReview", {

		// LIFE CYCLE FUNC.
		onInit: function () {
			this.router = this.getOwnerComponent().getRouter();

			var route1 = sap.ui.core.UIComponent.getRouterFor(this).getRoute("RD01");
			var route2 = sap.ui.core.UIComponent.getRouterFor(this).getRoute("RD02");
			route1.attachPatternMatched(this.onPatternMatched1, this);
			route2.attachPatternMatched(this.onPatternMatched2, this);
		},
		onPatternMatched1: function (oEvent) {
			var that = this;
			this.setCreateMode();
			//Init Model data
			// var oModel = new JSONModel(jQuery.sap.getModulePath("com.limscloud.app.jsonstore", "/jobsData.json"));
			// oModel.setSizeLimit(1000000);
			// this.getView().setModel(oModel, "jobsModel");

			this.getView().byId("jobItemsTable").setSticky(["ColumnHeaders", "HeaderToolbar"]);

			var initUsers = function () {
				var URL = "";
				var weHaveSuccess = false;

				URL = "http://localhost:3000/api/commons/users"
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

				URL = "http://localhost:3000/api/commons/labs"
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

				URL = "http://localhost:3000/api/testing/repository/disp"
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
		onPatternMatched2: function (oEvent) {
			var that = this;
			
			this.onPatternMatched1();
			this.setEditMode();
			
			MessageBox.show("I'm RD02");
		},
		setCreateMode: function (oEvent){
			var oView = this.getView();
			oView.byId("page0").setTitle("Create Review Document")
		},
		setEditMode: function (oEvent){
			var oView = this.getView();
			oView.byId("page0").setTitle("Edit Review Document")
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

				URL = "http://localhost:3000/api/sales/customers";
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

				URL = "http://localhost:3000/api/sales/orders?custId=" + oCustId;
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
		_handleTestDispF4: function (oEvent) {
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
		_handleTestGrpF4: function (oEvent) {
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

				URL = "http://localhost:3000/api/testing/repository/group?dispId=" + dispId;
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
		_itemHdlTestProductF4: function (oEvent) {
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

				URL = "http://localhost:3000/api/testing/repository/prod?groupId=" + groupId;
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
		_itemHdlTestMasterF4: function (oEvent) {
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

				URL = "http://localhost:3000/api/testing/repository/master?prodId=" + prodId;
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
		_itemHdlTestTypeF4: function (oEvent) {
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

				URL = "http://localhost:3000/api/testing/repository/type?masterId=" + masterId;
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

		// ITEM SAMPLE F4
		_itemSampleF4: function (oEvent) {
			var that = this;
			this.inputId = oEvent.getSource().getId();
			var oView = this.getView();
			this._valueHelpDialog = oView.byId("sampleLookupDialog");
			// create value help dialog

			if (!this._valueHelpDialog) {
				// create dialog via fragment factory
				this._valueHelpDialog = sap.ui.xmlfragment(oView.getId(), "com.limscloud.app.view.jobs.fragments." + "sampleLookup", this);
				oView.addDependent(this._valueHelpDialog);
			}
			// open value help dialog filtered by the input value

			var getSampleF4 = function (orderId) {
				var URL = "";
				var weHaveSuccess = false;

				URL = "http://localhost:3000/api/mm/samples?orderId=" + orderId;
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
					complete: function (oRes) {
						if (!weHaveSuccess) {
							MessageToast.show(oRes.responseJSON.error);
							return;
						}
						that._valueHelpDialog.open();
					}
				});
			}
			var orderId = this.getView().byId("headOrder").getValue().split(" - ")[0]
			getSampleF4(orderId);
		},
		_itemSampleF4Confirm: function (oEvent) {
			var oInput = this.getView().byId(this.inputId);
			var oModel = this.getView().getModel("jobsModel");

			var sPath = oEvent.getParameters().listItem.getBindingContextPath();
			var sObject = oModel.getProperty(sPath);

			oInput.setValue(sObject.sampleId + " - " + sObject.sampleName);

			oModel.setProperty("/createJob/header/sampleId", sObject.sampleId);
			oModel.setProperty("/createJob/header/sampleName", sObject.sampleName);

			oInput.setValueState("None");
			oInput.setValueStateText("");

			this.getView().byId("itemUom").setValue(sObject.unit);

			this._valueHelpDialog.close();
		},
		_itemSampleF4Cancel: function (oEvent) {

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
		_addItemSubmit: function (oEvent) {
			var oView = this.getView();

			var sampleId = oView.byId("itemSample").getValue().split(" - ")[0];
			var sampleName = oView.byId("itemSample").getValue().split(" - ")[1];
			var itemQty = parseFloat(oView.byId("itemQty").getValue());
			var itemUom = oView.byId("itemUom").getValue();
			var itemQtyOk = oView.byId("itemQtyOK").getState() ? 'X' : ' ';

			var itemProd = oView.byId("itemProd").getValue().split(" - ")[0];
			var itemProdName = oView.byId("itemProd").getValue().split(" - ")[1];
			var itemTestMaster = oView.byId("itemTestMaster").getValue().split(" - ")[0];
			var itemTestMasterName = oView.byId("itemTestMaster").getValue().split(" - ")[1];
			var itemType = oView.byId("itemType").getValue().split(" - ")[0];
			var itemTypeName = oView.byId("itemType").getValue().split(" - ")[1];
			var itemTestCap = oView.byId("itemTestCap").getState() ? 'X' : ' ';

			//Validations here

			var oItem = {
				"sampleId": sampleId,
				"sampleName": sampleName,
				"itemQty": itemQty,
				"itemUom": itemUom,
				"itemQtyOk": itemQtyOk,
				"itemProd": itemProd,
				"itemProdName": itemProdName,
				"itemTestMaster": itemTestMaster,
				"itemTestMasterName": itemTestMasterName,
				"itemType": itemType,
				"itemTypeName": itemTypeName,
				"itemTestCap": itemTestCap,
				"info": "Sample: " + sampleName + "\nQuantity: " + itemQty + " " + itemUom + "\nTest Specification: " +
					itemProdName + ", " + itemTestMasterName + ", " + itemTypeName
			};

			if (this._addItem(oItem)) {
				this._createDialog.close();
				MessageToast.show("Item added");
			}

			// console.log(oItem);

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
			oItem.itemId = pad(tableLength + 1, 3);

			tableItems.push(oItem);
			oModel.setProperty("/createJob/items", tableItems);

			return true;
		},
		_triggerShowItem: function (oEvent) {

			var oView = this.getView();
			this._valueHelpDialog = oView.byId("viewJobItemDialog");

			if (!this._valueHelpDialog) {
				this._valueHelpDialog = sap.ui.xmlfragment(oView.getId(), "com.limscloud.app.view.jobs.fragments." + "viewJobItem", this);
				oView.addDependent(this._valueHelpDialog);
			}

			this._valueHelpDialog.bindElement("jobsModel>" + oEvent.getSource().getParent().getParent().getBindingContextPath());

			this._valueHelpDialog.open();

		},
		_triggerEditItem: function (oEvent) {
			var oView = this.getView();
			this._valueHelpDialog = oView.byId("editJobItemDialog");

			if (!this._valueHelpDialog) {
				this._valueHelpDialog = sap.ui.xmlfragment(oView.getId(), "com.limscloud.app.view.jobs.fragments." + "editJobItem", this);
				oView.addDependent(this._valueHelpDialog);
			}

			this._valueHelpDialog.bindElement("jobsModel>" + oEvent.getSource().getParent().getParent().getBindingContextPath());

			this._valueHelpDialog.open();
		},


		_manageItems: function (oEvent) {

		},
		_createItemBtnPress: function (oEvent) {
			var oView = this.getView();
			var oModel = oView.getModel("jobsModel");

			// VALIDATIONS
			var isValid = true;

			var hCustomer = oView.byId("headCust");
			var hOrder = oView.byId("headOrder");
			var hDate = oView.byId("headDate");
			var hDesc = oView.byId("headDesc");

			var hLab = oView.byId("headLab");
			var hDiscipline = oView.byId("headDisp");
			var hGroup = oView.byId("headGroup");

			var hIssuer = oView.byId("headIssuer");
			var hApprover = oView.byId("headApprover");

			if (hCustomer.getValue().trim().length <= 0) {
				isValid = false;
				//push message
			}
			if (hOrder.getValue().trim().length <= 0) {
				isValid = false;
				//push message
			}
			if (hDate.getValue().trim().length <= 0) {
				isValid = false;
				//push message
			}
			if (hLab.getValue().trim().length <= 0) {
				isValid = false;
				//push message
			}
			if (hDiscipline.getValue().trim().length <= 0) {
				isValid = false;
				//push message
			}
			if (hGroup.getValue().trim().length <= 0) {
				isValid = false;
				//push message
			}
			if (hIssuer.getValue().trim().length <= 0) {
				isValid = false;
				//push message
			}
			if (hApprover.getValue().trim().length <= 0) {
				isValid = false;
				//push message
			}

			if (!isValid) {
				//show messages
				return;
			} else {
				hCustomer.setEditable(false);
				hOrder.setEditable(false);
				hDate.setEditable(false);
				hDesc.setEditable(false);
				hLab.setEditable(false);
				hDiscipline.setEditable(false);
				hGroup.setEditable(false);
				hIssuer.setEditable(false);
				hApprover.setEditable(false);

				// add to json payload
				oModel.setProperty("/createJob/header/hOrder", hOrder.getValue());
				oModel.setProperty("/createJob/header/hDate", hDate.getDateValue());
				oModel.setProperty("/createJob/header/labId", hLab.getValue());
				oModel.setProperty("/createJob/header/testGroup", hGroup.getValue());
				oModel.setProperty("/createJob/header/hDiscipline", hDiscipline.getValue());
				oModel.setProperty("/createJob/header/approverId", hApprover.getValue());
				oModel.setProperty("/createJob/header/createdBy", hIssuer.getValue());
				
				oView.byId("jobItemsTable").setVisible(true);
				oView.byId("page0").setShowFooter(true);
			}

		},

		buildSavePayload: function (inputObj) {
			var fObj = {
				hJob: {
					approverId: inputObj.header.approverId,
					issuerId: inputObj.header.createdBy,
					customerId: inputObj.header.customerId.toString(),
					orderId: inputObj.header.hOrder.split(" - ")[0],
					labId: inputObj.header.labId,
					disciplineId: inputObj.header.hDiscipline.split(" - ")[0],
					groupId: inputObj.header.testGroup.split(" - ")[0],
					hText: inputObj.header.jobDesc,
					recDate: inputObj.header.hDate,
				},
				iJob: []
			};

			fObj.iJob = inputObj.items.map(function (item) {
				return {
					testProduct: item.itemProd,
					testMaster: item.itemTestMaster,
					testType: item.itemType,
					sampleId: item.sampleId,
					qty: item.itemQty,
					qtyUom: item.itemUom,
					qsCode: item.itemQtyOk,
					tcCode: item.itemTestCap
				}
			})

			return fObj;
		},

		onCreateSave: function (oEvent) {
			//Validate
			//Create json
			var oPayload = this.getOwnerComponent().getModel("jobsModel").getProperty("/createJob");
			var fpayload = this.buildSavePayload(oPayload);

			console.log(fpayload);


			//prepare post
			var URL = "http://localhost:3000/api/review/";

			$.ajax({
				url: URL,
				type: 'POST',
				data: fpayload,
				dataType: 'json',
				crossDomain: true,
				success: function (results) {
					console.log(results);
					MessageBox.success("Job successfully created with document number : " + results.jobId, {
						details: results,
						contentWidth: "500px"
					});
				},
				error: function (error) {
					console.log(error);
					MessageBox.error("Message : " + error.statusText, {
						details: error.responseJSON.message,
						contentWidth: "500px"
					});
				}
			});
		}
	});

});
