sap.ui.define([
	'com/limscloud/app/controller/jobs/TT02.controller',
	'jquery.sap.global',
	'sap/ui/model/json/JSONModel',
	'sap/m/MessageToast',
	'sap/m/MessageBox',
	'sap/ui/model/Filter',
	'sap/ui/core/routing/History'
], function (TT02, jQuery, JSONModel, MessageToast, MessageBox, Filter, History) {
	"use strict";

	return TT02.extend("com.limscloud.app.controller.jobs.TT02-detail", {

		onInit: function () {
			this.router = this.getOwnerComponent().getRouter();
			var route = sap.ui.core.UIComponent.getRouterFor(this).getRoute("TT02-detail");
			route.attachPatternMatched(this.onPatternMatched, this);

		},
		onPatternMatched: function (oEvent) {
			var that = this;
			console.log("I'm at detail");

			var that = this;

			var initJobItem = function () {
				var URL = "";
				var weHaveSuccess = false;

				URL = "http://localhost:3000/api/jobs/items?jobId=" + that.getView().getModel("jobsModel").getProperty("/perform/header/jobId");
				$.ajax({
					type: "GET",
					url: URL,
					dataType: "json",
					crossDomain: true,

					success: function (results) {
						weHaveSuccess = true;
						that.getView().getModel("jobsModel").setProperty("/perform/items", results);

					},
					error: function (response) {
						MessageToast.show("Error!" + response.status);
					},
					complete: function () {
						if (!weHaveSuccess) {
							MessageToast.show("Unable to fetch job items");
						}
					}
				});
			}

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

			var initJobHeader = function (jobId) {
				var URL = "";
				var weHaveSuccess = false;

				URL = "http://localhost:3000/api/jobs?jobId=" + jobId;
				$.ajax({
					type: "GET",
					url: URL,
					dataType: "json",
					crossDomain: true,

					success: function (results) {
						weHaveSuccess = true;
						console.log(results[0]);
						that.getView().getModel("jobsModel").setProperty("/perform/header", results[0])
					},
					error: function (response) {
						MessageToast.show("Error!" + response.status);
					},
					complete: function () {
						if (!weHaveSuccess) {
							MessageToast.show("Unable to fetch job header");
						}
					}
				});
			}



			initUsers();
			initJobItem();
			initJobHeader(this.getView().getModel("jobsModel").getProperty("/perform/header/jobId"));

		},
		_selectPerformBy: function (oEvent) {
			var userID = oEvent.getParameters().selectedItem.getProperty("key");
			var sPath = oEvent.getSource().getParent().getBindingContextPath();
			this.getView().getModel("jobsModel").setProperty(sPath + "/performBy", userID);
		},

		_onSavePress: function (oEvent) {
			var that = this;
			var filterItems = function (item) {
				if (item.XFLAG === 'T' || item.XFLAG === 'X') {
					return false;
				} else {
					return true;
				}
			}

			var createObj = function (item) {
				return {
					"jobId": that.getView().getModel("jobsModel").getProperty("/perform/header/jobId"),
					"itemId": item.itemId,
					"test_value": item.test_value,
					"performBy": item.performBy
				}
			}

			var payload = {
				"jobId": that.getView().getModel("jobsModel").getProperty("/perform/header/jobId"),
				"items": this.getView().getModel("jobsModel").getProperty("/perform/items").filter(filterItems).map(createObj)
			}

			console.log(payload);

			//prepare post
			var URL = "http://localhost:3000/api/jobs/performSave";

			$.ajax({
				url: URL,
				type: 'POST',
				data: payload,
				dataType: 'json',
				crossDomain: true,
				success: function (results) {
					console.log(results);
					MessageBox.success("Job successfully saved", {
						details: results,
						contentWidth: "100px"
					});

					that.onPatternMatched();
				},
				error: function (error) {
					console.log(error);
					that.onPatternMatched();
				}
			});


		},

		_onSubmitPress: function (oEvent) {
			var that = this;
			if(this.getView().byId("jobItemsTable").getSelectedContexts().length < 1){
				MessageBox.error("Please select item(s) to submit");
				return;
			}


			var filterItems = function (item) {
				if (item.XFLAG === 'T' || item.XFLAG === 'X') {
					return false;
				} else {
					return true;
				}
			}

			var createObj = function (item) {
				return {
					"jobId": that.getView().getModel("jobsModel").getProperty("/perform/header/jobId"),
					"itemId": item.itemId,
					"test_value": item.test_value,
					"performBy": item.performBy
				}
			}
			
			var payload = {
				"jobId": that.getView().getModel("jobsModel").getProperty("/perform/header/jobId"),
				"items": that.getView().byId("jobItemsTable").getSelectedContexts().map(function (oContext){
					return oContext.getObject();
				}).filter(filterItems).map(createObj)
			}

			console.log(payload);

			//prepare post
			var URL = "http://localhost:3000/api/jobs/performSubmit";

			$.ajax({
				url: URL,
				type: 'POST',
				data: payload,
				dataType: 'json',
				crossDomain: true,
				success: function (results) {
					console.log(results);
					MessageBox.success("Job successfully submitted", {
						details: results,
						contentWidth: "100px"
					});

					that.onPatternMatched();
				},
				error: function (error) {
					console.log(error);
					that.onPatternMatched();
				}
			});


		}
	});

});
