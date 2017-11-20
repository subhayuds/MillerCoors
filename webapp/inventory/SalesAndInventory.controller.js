/***
 * @Author DS05
 * @Date 11/19/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is Sales And Inventory controller
 */
sap.ui.controller("mc.ccp.inventory.SalesAndInventory", {
	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf inventory.SalesAndInventory
	 */
	onInit: function() {
		// Get the Service MetaData File
		/*var oDataModel = new sap.ui.model.odata.ODataModel(MCAPP.getServiceUrl(MCAPP.getComponent().getModel('service').getProperty('/SalesAndInventoryService')));
		this.getView().data('oDataModel', oDataModel);
		var thisContext = this;
		// read the model for view data
		oDataModel.read("ZCCP_SALES_INV_HDR_SET('')", null, {
			"$expand": "ZCCP_HDRSALES_INV_NAV",
			"$format": "json",
			"$filter": MCAPP.getSelectedShiptoAsQryParam()
		}, false, function(oData, oResponse) {
			thisContext._dataLoadSuccess(oData, oResponse);
		}, function(oError) {
			MCAPP.dataReadFail(oError);
		});*/
		
		var oDataModel = new sap.ui.model.json.JSONModel();
        this.getView().data('oDataModel', oDataModel);
        var thisContext = this;
        oDataModel.attachRequestCompleted(thisContext._dataLoadSuccess,this);
        oDataModel.loadData("json/SalesAndInventoryService.json",{},false);
		//updates label for the total number of rows
		var dataLength = this.getView().getModel().getData().results.length;
		this.byId("totalTxtId").setText(MCAPP.getText('GBL_TOTAL_OF', this) + ' ' + dataLength);
		this.byId("totalTxtIdBottom").setText(MCAPP.getText('GBL_TOTAL_OF', this) + ' ' + dataLength);
		this.onChangeDropdown();
	},

	/**
	 * _dataLoadSuccess is used to set the model to the view.
	 * @memberOf inventory.SalesAndInventory
	 * @param data
	 * @param oResponse
	 */
	_dataLoadSuccess: function(evt) {
		var readOnly = MCAPP.isReadOnlyRole();
		//Add State related properties (readOnly, dirty)
		var obj =  evt.getSource().getData();
		var oData = {};
		oData.results = obj.d.ZCCP_HDRSALES_INV_NAV.results;
		$.each(oData.results, function(i, item) {
			item.dirtyState = false;
			item.readOnly = readOnly;
		});
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData(oData);
		this.getView().setModel(oModel);
		//Get Copy of Original Data
		var oCopyOfData = JSON.parse(JSON.stringify(oData));
		var oModelBackup = new sap.ui.model.json.JSONModel();
		oModelBackup.setData(oCopyOfData);
		this.getView().setModel(oModelBackup, "backup");
		MCAPP.updateSegmentedButton(MCAPP.getDistributorType(), false);
	},

	/**
	 * onChangeDropdown is used to set the rows per page.
	 * @memberOf inventory.SalesAndInventory
	 * @param oEvent
	 */
	onChangeDropdown: function(oEvent) {
		var oComboBox = "";
		var flag = true;
		var dataLength = "";
		var oTable = this.byId("SalesAndInvTable");
		if (oEvent === undefined) { //This will work when page is getting loaded
			oComboBox = this.byId("comboBoxIdSalesAndInv");
		} else { // This will work when the combo value will be changed
			oComboBox = this.byId(oEvent.getSource().getId());
			oTable.setFirstVisibleRow(0);
		}
		var oPerPage = oComboBox.getSelectedKey();
		if (oComboBox.getId().indexOf("comboBoxIdSalesAndInv") > 0 && oComboBox.getId().indexOf("Bottom") <= -1) {
			flag = this._setComboBoxValues("comboBoxIdSalesAndInv", oPerPage);
			if (flag === false) {
				return;
			}
		} else if (oComboBox.getId().indexOf("comboBoxIdSalesAndInvBottom") > 0) {
			flag = this._setComboBoxValues("comboBoxIdSalesAndInvBottom", oPerPage);
			if (flag === false) {
				return;
			}
		}
		oTable.setVisibleRowCount(parseInt(oPerPage));
		var oFilterValue = MCAPP.getSalesInvFilter();
		if (oFilterValue !== "") {
			dataLength = oTable.getBinding("rows").iLength;
		} else {
			dataLength = this.getView().getModel().getData().results.length;
		}
		// setting the visible rows of table
		if (oPerPage > dataLength) {
			oTable.setVisibleRowCount(parseInt(dataLength));
		} else {
			oTable.setVisibleRowCount(parseInt(oPerPage));
		}
		this._calculateNumberOfPage(oComboBox, dataLength);
		oTable.rerender();
	},

	/**
	 * _setComboBoxValues is used to manage upper and bottom drop down values.
	 * @memberOf inventory.SalesAndInventory
	 * @param id
	 * @param oPerPage
	 * @returns {Boolean}
	 */
	_setComboBoxValues: function(id, oPerPage) {
		var sComboBoxId = "";
		if (id.indexOf("Bottom") <= -1) {
			sComboBoxId = id + "Bottom";
		} else {
			sComboBoxId = id.replace("Bottom", "");
		}
		if (MCAPP.getDirtyFlag() === true) {
			MCAPP.setBusy(true);
			var orignalValue = this.byId(sComboBoxId).getSelectedKey();
			this._displayDataSaveError(id, orignalValue);
			return false;
		} else {
			this.byId(sComboBoxId).setValue(parseInt(oPerPage));
			return true;
		}
	},

	/**
	 * _displayDataSaveError is used to display the error if user has made some change on screen and trying to change drop down value.
	 * @memberOf inventory.SalesAndInventory
	 * @param id
	 * @param valueBeforeChange
	 */
	_displayDataSaveError: function(id, valueBeforeChange) {
		this.byId(id).setSelectedKey(parseInt(valueBeforeChange));
		sap.ui.commons.MessageBox.alert(MCAPP.getText('GBL_SAVE_PROMP_DD', this));
		MCAPP.setBusy(false);
	},

	/**
	 * onChangeValidateQty is used to validate the quantity entered by the user. It should be numeric and non zero.
	 * @memberOf inventory.SalesAndInventory
	 * @param oEvent
	 */
	onChangeValidateQty: function(oEvent) {
		var quantity = oEvent.getParameter("changed");
		var field = oEvent.oSource.mBindingInfos.value.binding.sPath;
		var sPath = oEvent.oSource.mBindingInfos.value.binding.oContext.sPath;
		var index = sPath.split("/")[2];
		var backUpModel = this.getView().getModel("backup");
		if (quantity === 0) {
			sap.ui.commons.MessageBox.show(MCAPP.getText('VW_SI_QTY_ERROR', this), sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', this), [sap.ui.commons.MessageBox.Action.OK]);
			return;
		}
		else {
			if (quantity != backUpModel.getProperty(sPath + '/' + field)) {
				this.getView().getModel().getData().results[index].dirtyState = true;
			} else {
				this.getView().getModel().getData().results[index].dirtyState = false;
			}
			this._checkDirtyFlag(sPath);
		}
	},

	/**
	 * _checkDirtyFlag is used to check the dirtyState of each row. if dirtyState is true, dirtyFlag will be set to true.
	 * @memberOf inventory.SalesAndInventory
	 * @param sPath
	 */
	_checkDirtyFlag: function(sPath) {
		var oTable = this.byId("SalesAndInvTable");
		var rows = oTable.getRows();
		var oModel = this.getView().getModel();
		var count = 0;
		for (var i = 0; i < rows.length; i++) {
			var dirtyState = oModel.getProperty(sPath + "/dirtyState");
			if (dirtyState === true) {
				count++;
				break;
			}
		}
		if (count > 0) {
			MCAPP.setDirtyFlag(true);
		} else {
			MCAPP.clearDirtyFlag();
		}
	},

	/**
	 * onPageSaveAndNavigate is used to save the changes to backend and navigate to next or previous page.
	 * @memberOf inventory.SalesAndInventory
	 * @param oEvent
	 */
	onPageSaveAndNavigate: function(oEvent) {
		MCAPP.setBusy(true);
		var currentPage = parseInt(oEvent.mParameters.targetPage);
		var sourcePage = parseInt(oEvent.mParameters.srcPage);
		var id = oEvent.getSource().getId();
		var source = oEvent.getSource();
		var changedRecords = this._getChangedRecords(sourcePage);
		if (changedRecords[1] !== "") { // if reason code is blank
			MCAPP.setBusy(false);
			this._showBlankQuantityError(this, changedRecords[1]);
			this.byId("paginatorSalesAndInv").setCurrentPage(parseInt(sourcePage));
			this.byId("paginatorSalesAndInvBottom").setCurrentPage(parseInt(sourcePage));
			return;
		}
		else {
			if (changedRecords[0].length <= 0) {
				MCAPP.setBusy(false);
				this._navigate(currentPage, sourcePage, id);
				return;
			} else {
				this._removeFlagFromChangedRecords(changedRecords[0]);
				var navigationData = [currentPage, sourcePage, id, source];
				this._genericSave(changedRecords[0], this._dataSaveSuccess, this._dataSaveFail, this, navigationData);
			}
		}
	},

	/***
	 * revert the changes in the model based on the index. This will get the sales of quantity and beginning inventory quantity from back up model
	 * and copy the same values in original model.
	 * @param index
	 */
	_revertChanges: function(index) {
		var backupModel = this.getView().getModel('backup');
		var changedModel = this.getView().getModel();
		//Now Copy One by One
		changedModel.getData().results[index].LastWeekSales = backupModel.getData().results[index].LastWeekSales;
		changedModel.getData().results[index].dirtyState = backupModel.getData().results[index].dirtyState;
		changedModel.getData().results[index].BegINV = backupModel.getData().results[index].BegINV;
		changedModel.refresh();
	},

	/**
	 * _navigate is used to navigate to next or previous page as per the clicked page link of paginator.
	 * Called inside onPageSaveAndNavigate
	 * @memberOf inventory.SalesAndInventory
	 * @param currentPage
	 * @param srcPage
	 * @param id
	 */
	_navigate: function(currentPage, srcPage, id) {
		var oTable = this.byId("SalesAndInvTable");
		if (id.indexOf("paginatorSalesAndInv") > 0 && id.indexOf("Bottom") <= -1) {
			this.byId("paginatorSalesAndInvBottom").setCurrentPage(currentPage);
		} else {
			this.byId("paginatorSalesAndInv").setCurrentPage(currentPage);
		}
		oTable._oPaginator.setCurrentPage(currentPage);
		oTable._oPaginator.firePage({
			srcPage: srcPage,
			targetPage: currentPage,
			type: 'GoTo'
		});
		oTable.rerender();
	},

	/**
	 * onPressSave will be called on click of Save button. This function will save the changes to the backend.
	 * @memberOf inventory.SalesAndInventory
	 * @param oEvent
	 */
	onPressSave: function(oEvent) {
		if (MCAPP.getDirtyFlag() === true) {
			MCAPP.setBusy(true);
			var changedRecords = "";
			var sourcePage = $(".naviText").children()[0].value;
			changedRecords = this._getChangedRecords(sourcePage);
			if (changedRecords[1] !== "") { // if reason code is blank
				MCAPP.setBusy(false);
				this._showBlankQuantityError(this, changedRecords[1]);
				return;
			}
			else {
				if (changedRecords[0].length <= 0) {
					MCAPP.setBusy(false);
					return;
				} else {
					this._removeFlagFromChangedRecords(changedRecords[0]);
					//passing empty since the event is not triggered from paginator and do not have navigation data.
					this._genericSave(changedRecords[0], this._dataSaveSuccess, this._dataSaveFail, this, "");
				}
			}
		} else {
			return;
		}
	},

	/**
	 * _showBlankQuantityError is used display the error while performing save. This will come when user has put sales and Inventory value as zero.
	 * @memberOf inventory.SalesAndInventory
	 * @param that
	 * @param oRowIndex
	 */
	_showBlankQuantityError: function(that, oRowIndex) {
		sap.ui.commons.MessageBox.show(MCAPP.getText('VW_SI_QTY_ERROR_SKU', that) + oRowIndex, sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', that), [sap.ui.commons.MessageBox.Action.OK]);
	},

	/**
	 * _removeFlagFromChangedRecords is used to delete the dirtyState, Index, expand and readOnly flags from the records which need to be saved.
	 * @memberOf inventory.SalesAndInventory
	 * @param changedRecords
	 */
	_removeFlagFromChangedRecords: function(changedRecords) {
		for (var i = 0; i < changedRecords.length; i++) {
			delete changedRecords[i].dirtyState;
			delete changedRecords[i].readOnly;
		}
	},

	/**
	 * _dataSaveSuccess will be called if save operation is successful and will be used to set the updated model to the view.
	 * @memberOf inventory.SalesAndInventory
	 * @param oData
	 * @param response
	 * @param thisContext
	 */
	_dataSaveSuccess: function(oData, response, thisContext) {
		var changedData = JSON.parse(JSON.stringify(thisContext.getView().getModel().getData()));
		thisContext.getView().getModel('backup').setData(changedData);
		MCAPP.clearDirtyFlag();
		MCAPP.setBusy(false);
	},

	/**
	 * _dataSaveFail will be called if save operation gets fail and will display the error message to user.
	 * @memberOf inventory.SalesAndInventory
	 * @param oError
	 * @param thisContext
	 */
	_dataSaveFail: function(oError, thisContext) {
		MCAPP.setBusy(false);
		thisContext._displyDataSaveError(oError, thisContext);
	},

	/**
	 * _displyDataSaveError will be called if error occurs while performing save.
	 * @memberOf inventory.SalesAndInventory
	 * @param thisContext
	 */
	_displyDataSaveError: function(thisContext) {
		sap.ui.commons.MessageBox.show(MCAPP.getText('GBL_DATA_SAVE_ERROR', thisContext), sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', thisContext), [sap.ui.commons.MessageBox.Action.OK]);
	},

	/**
	 * _genericSave will be called on click of Save button. This is used to update the backend for the new changes.
	 * @memberOf inventory.SalesAndInventory
	 * @param changedRecords
	 * @param successCallFn
	 * @param failCallFn
	 * @param thisContext
	 * @param navigationData
	 */
	_genericSave: function(changedRecords, successCallFn, failCallFn, thisContext, navigationData) {
		var currentView = MCAPP.getCurrentView();
		var oDataModel = currentView.data('oDataModel');
		var dummyHeader = {};
		dummyHeader.SKU = "12"; // random value is required to hit oData
		dummyHeader.ShipToId = "";
		dummyHeader.SourceId = "";
		dummyHeader.ZCCP_HDRSALES_INV_NAV = changedRecords;
		oDataModel.create('/ZCCP_SALES_INV_HDR_SET', dummyHeader, null, function(oData, response) {
			successCallFn(oData, response, thisContext);
			MCAPP.clearDirtyFlag();
			sap.m.MessageToast.show(MCAPP.getText('GBL_DATA_SAVE_MSG', this), {
				duration: MCAPP.getAppConfigAsInt('MsgToastDurationOnNavigation')
			});
			if (navigationData !== "" && navigationData.length > 0) {
				thisContext._navigate(navigationData[0], navigationData[1], navigationData[2]);
			}
		}, function(oError) {
			if (navigationData !== "" && navigationData.length > 0) {
				//navigationData[3] stores the source from where the event is triggered.
				navigationData[3].setCurrentPage(navigationData[1]);
			}
			failCallFn(oError, thisContext);
		});
	},

	/**
	 * _getChangedRecords is used to prepare the array of all the changed rows.
	 * @memberOf inventory.SalesAndInventory
	 * @param srcPage
	 * @returns {Array}
	 */
	_getChangedRecords: function(srcPage) {
		var originalModel = this.getView().getModel('backup');
		var changedDModel = this.getView().getModel();
		var changedRecords = [];
		var count = 0;
		var rows = this.byId("SalesAndInvTable").getRows();
		var rowCount = this._getVisibleRowCount(srcPage);
		var error = "";
		var response = [];
		for (var i = 0; i < rowCount; i++) {
			var sPath = rows[i].getAggregation("cells")[0].getBindingContext().sPath;
			if (originalModel.getProperty(sPath + '/LastWeekSales') != changedDModel.getProperty(sPath + '/LastWeekSales')) {
				count++;
			} else if (originalModel.getProperty(sPath + '/BegINV') != changedDModel.getProperty(sPath + '/BegINV')) {
				count++;
			}
			if (count > 0) {
				var index = sPath.split("/")[2];
				if(changedDModel.getProperty(sPath + '/LastWeekSales') > 0 && changedDModel.getProperty(sPath + '/BegINV') > 0 ){
					changedRecords.push(changedDModel.getData().results[index]);
				} else {
					error = changedDModel.getData().results[index].SKU;
					break;
				}
			}
			count = 0;
		} 
		response.push(changedRecords);
		response.push(error);
		return response;
	},

	/**
	 * _getVisibleRowCount is used to get the current rows count for the selected page.
	 * @memberOf inventory.SalesAndInventory
	 * @param sourcePage
	 * @returns {Integer}
	 */
	_getVisibleRowCount: function(sourcePage) {
		var oTable = this.byId("SalesAndInvTable");
		var totalNoOfRecords = oTable.getBinding("rows").iLength;
		var rowsPerPage = this.byId("comboBoxIdSalesAndInv").getSelectedKey();
		var count = 0;
		if (sourcePage > 1) { //src page is existing page
			count = parseInt(totalNoOfRecords) - (parseInt(rowsPerPage) * parseInt(sourcePage - 1));
			if (count > rowsPerPage) {
				count = rowsPerPage;
			}
		} else {
			if (rowsPerPage > totalNoOfRecords) {
				count = parseInt(totalNoOfRecords);
			} else {
				count = parseInt(rowsPerPage);
			}
		}
		return count;
	},

	/**
	 * _calculateNumberOfPage is used to calculate the total number of pages for paginator.
	 * @memberOf inventory.SalesAndInventory
	 * @param oComboBox
	 * @param dataLength
	 */
	_calculateNumberOfPage: function(oComboBox, dataLength) {
		var oPerPage = oComboBox.getSelectedKey();
		var noOfPage = Math.floor(dataLength / oPerPage);
		var remainPage = dataLength % oPerPage;
		if (remainPage > 0) {
			noOfPage = noOfPage + 1;
		}
		MCAPP.setPaginatorTextValue(noOfPage, "paginatorSalesAndInv", this, dataLength);
	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf inventory.SalesAndInventory
	 */
	onAfterRendering: function() {
		MCAPP.setBusy(false);
		jQuery.sap.byId('ApploadingDivId').hide();
		jQuery.sap.byId('content').show();
		MCAPP.updateHeaderSalesAndInv(this);
		MCAPP.menuSelection(this);
		var isReadOnlyUser = MCAPP.isReadOnlyRole();
		if (isReadOnlyUser === true) {
			this.byId("idSaveBtn").detachPress(this.onPressSave, this);
			this.byId("idSaveBtnBottom").detachPress(this.onPressSave, this);
		}
	},

	/**
	 * Called when user tries to filter the records in Sales And Inventory table
	 * @memberOf inventory.SalesAndInventory
	 * @Param evt
	 */
	onFilterColumn: function(evt) {
		if (MCAPP.getDirtyFlag()) {
			sap.ui.commons.MessageBox.alert(MCAPP.getText('GBL_SAVE_PROMP_FILTER', this));
			evt.preventDefault();
			return;
		} else {
			var oData = this.getView().getModel().getData();
			var dataLength = "";
			var filterValue = evt.getParameter('value').trim();
			MCAPP.setSalesInvFilter(filterValue);
			var oTable = this.byId('SalesAndInvTable');
			var column = this._getJsonColumn(evt.getParameter('column').getId().split("--")[1]);
			var operator = sap.ui.model.FilterOperator.EQ;
			if (column === 'SKU_Desc') {
				operator = sap.ui.model.FilterOperator.Contains;
			}
			var oTableFilters = oTable.mBindingInfos.rows.filters;
			var collect = [];
			if (oTableFilters !== undefined) {
				var filters = oTableFilters;
				for (var i = 0; i < filters.length; i++) {
					if (filters[i].sPath != evt.getParameter('column').getFilterProperty()) {
						collect.push(filters[i]);
					}
				}
				if (filterValue !== '') {
					var newFilter = new sap.ui.model.Filter(column, operator, filterValue);
					collect.push(newFilter);
				}
				oTable.bindRows({
					path: "/results",
					filters: collect
				});
			} else {
				if (filterValue !== '') {
					oTable.bindRows({
						path: "/results",
						filters: [new sap.ui.model.Filter(column, operator, filterValue)]
					});
				}
			}
			$.each(oData.results, function(i, item) {
				item.Dist_SKU = "" + item.Dist_SKU;
				item.SKU = "" + item.SKU;
				item.ShipToId = "" + item.ShipToId;
				item.LastWeekSales = "" + item.LastWeekSales;
				item.BegINV = "" + item.BegINV;
			});
			var oComboBox = this.byId("comboBoxIdSalesAndInv");
			oTable.setFirstVisibleRow(0);
			if (filterValue !== "") {
				dataLength = oTable.getBinding("rows").iLength;
			} else {
				dataLength = this.getView().getModel().getData().results.length;
			}
			this._calculateNumberOfPage(oComboBox, dataLength);
			oTable.rerender();
			MCAPP.setBusy(false);
		}
	},

	/**
	 * method to retrieve json properties based on column name
	 * @memberOf inventory.SalesAndInventory
	 * @param column
	 * @returns {String}
	 */
	_getJsonColumn: function(column) {
		var result = '';
		switch (column) {
		case 'idDistSKUCol':
			result = 'Dist_SKU';
			break;
		case 'idSKUCol':
			result = 'SKU';
			break;
		case 'idDescCol':
			result = 'SKU_Desc';
			break;
		case 'idShipToCol':
			result = 'ShipToId';
			break;
		case 'idSourceCol':
			result = 'SourceName';
			break;
		case 'idSalesCol':
			result = 'LastWeekSales';
			break;
		case 'idBegInvCol':
			result = 'BegINV';
			break;
		}
		return result;
	},

	/***
	 * Event Handler for Sort Option
	 * @memberOf inventory.SalesAndInventory
	 * @param evt
	 */
	onSortColumn: function(evt) {
		if (MCAPP.getDirtyFlag()) {
			sap.ui.commons.MessageBox.alert(MCAPP.getText('GBL_SAVE_PROMP_SORT', this));
			evt.preventDefault();
			return;
		} else {
			var oData = this.getView().getModel().getData();
			$.each(oData.results, function(i, item) {
				item.Dist_SKU = parseInt(item.Dist_SKU);
				item.SKU = parseInt(item.SKU);
				item.ShipToId = parseInt(item.ShipToId);
				item.LastWeekSales = parseInt(item.LastWeekSales);
				item.BegINV = parseInt(item.BegINV);
			});
			var oTable = this.byId('SalesAndInvTable');
			var oComboBox = this.byId("comboBoxIdSalesAndInv");
			var dataLength = this.getView().getModel().getData().results.length;
			this._calculateNumberOfPage(oComboBox, dataLength);
			oTable.rerender();
		}
	},

	/**
	 * Called on click of Import Data image.
	 * @memberOf inventory.SalesAndInventory
	 * @param oEvent
	 */
	onPressImportData: function(oEvent) {
		this._openImportDataDialog();
	},

	/**
	 * Called to open the import data dialog
	 * @memberOf inventory.SalesAndInventory
	 */
	_openImportDataDialog: function() {
		var oTable = this.byId('SalesAndInvTable');
		var that = this;
		var oImportDataDailogView = new sap.ui.view({
			type: sap.ui.core.mvc.ViewType.JS,
			viewName: "mc.ccp.inventory.ImportDataDialog",
			viewData : oTable
		});
		//Creating sales and Inventory radio buttons
		var oRadioSales = new sap.ui.commons.RadioButton(this.createId("idradioSales"), {
			text: "Sales",
			selected: true,
			key: "salesRadio"
		});
		var oRadioInventory = new sap.ui.commons.RadioButton(this.createId("idradioInventory"), {
			text: "Inventory",
			selected: false,
			key: "inventoryRadio"
		});
		var oMcHLayout = new mc.ccp.control.McHorizontalLayout({
			height: "1px",
			width: "100%",
			widths: ["15%", "15%", "70%"],
			content: [oRadioSales, oRadioInventory, new sap.ui.core.HTML()]
		});
		//creating file uploader
		var oFileUploader = this._createFileUploader(oImportDataDailogView);
		oImportDataDailogView.addContent(oFileUploader).addStyleClass("fileUploaderPadding");
		//creating cancel button
		var oCancelButton = new sap.ui.commons.Button({
			text: this.getView().getModel('i18n').getProperty('GBL_CANCEL'),
			width: "90px",
			height: '30px'
		});
		oCancelButton.attachPress(oImportDataDailogView.getController().onPressClose, this, oImportDataDailogView.getController());
		//creating OK button
		var oOKButton = new sap.ui.commons.Button(this.createId("importOkButtonId"),{
			text: this.getView().getModel('i18n').getProperty('GBL_OK'),
			width: "90px",
			height: '30px',
			enabled: false
		});
		oOKButton.attachPress(oImportDataDailogView.getController().onPressUploadFile);
		//creating dialog
		var oImportDataDialog = new sap.ui.commons.Dialog({
			modal: true,
			width: '35%',
			height: '45%',
			title: that.getView().getModel('i18n').getProperty('VW_SI_IMPORT_DATA_TITLE'),
			content: [oMcHLayout, oImportDataDailogView],
			buttons: [oCancelButton, oOKButton],
			closed: function() {
				this.destroy();
			}
		}).addStyleClass('McCcpCustomDialog');
		oImportDataDialog.setModel(this.getView().getModel());
		oImportDataDialog.setModel(this.getView().getModel("backup"), "backup");
		oImportDataDialog.open();
	},

	/**
	 * returns the file uploader object
	 * @memberOf inventory.SalesAndInventory
	 * @param oImportDataDailogView
	 * @param oDataModel
	 */
	_createFileUploader: function(oImportDataDailogView) {
		var oFileUploader = new sap.ui.unified.FileUploader("fileuploader", {
			name: "upload",
			placeholder: "File:",
			multiple: false,
			maximumFileSize: 2, // max file size can be 2 MB
			mimeType: "xml",
			fileType: "xml",
			sendXHR: true,
			uploadOnChange: false,
			useMultipart: false,
			sameFilenameAllowed: true,
			headerParameters:[],
            change: oImportDataDailogView.getController().onChange,
            fileSizeExceed: function(oEvent) {
        	   var sName = oEvent.getParameter("fileName");
        	   var fileSize = oEvent.getParameter("fileSize");
        	   var fileSizeLimit = oFileUploader.getMaximumFileSize();
        	   if (fileSize > fileSizeLimit) {
        		   var errMessage  = MCAPP.getText("VW_SI_FILE", this) + " :: " + sName + ", " + MCAPP.getText("VW_SI_SIZE", this) + " :: " + fileSize + " " + MCAPP.getText("VW_SI_FILE_SIZE_EXCEED", this);
        		   sap.ui.commons.MessageBox.show(errMessage, sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', this));	
        	   }
        	   MCAPP.getCurrentView().getController().byId("importOkButtonId").setEnabled(false);
            },
            typeMissmatch: function(oEvent) {
        	   var sName = oEvent.getParameter("fileName");
        	   var sType = oEvent.getParameter("fileType");
        	   var sMimeType = oFileUploader.getMimeType();
        	   if (!sMimeType) {
        		   sMimeType = oFileUploader.getFileType();
        	   }
        	   var errMessage  = MCAPP.getText("VW_SI_FILE", this) + " :: " + sName + ", " + MCAPP.getText("VW_SI_FILE_TYPE", this) + " :: " + sType + ", " + MCAPP.getText("VW_SI_FILE_TYPE_WRONG", this);
        	   sap.ui.commons.MessageBox.show(errMessage, sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', this));
        	   MCAPP.getCurrentView().getController().byId("importOkButtonId").setEnabled(false);
            },
            uploadComplete: function(oEvent) {
        	   oEvent.getSource().getParent().getParent().close();
        	   oImportDataDailogView.getController().fileUploaderUploadComplete(oEvent);
            }
		});
		return oFileUploader;
	},

	/**
	 * Called on click of Cancel button
	 * @memberOf inventory.SalesAndInventory
	 */
	onPressCancel: function() {
		var that = this;
		if (MCAPP.getDirtyFlag()) {
			sap.ui.commons.MessageBox.confirm(MCAPP.getText('GBL_CANCEL_CONFIRM', this), function(bResult) {
				that._callbackCancel(bResult);
			}, MCAPP.getText('GBL_CONFIRM', this));
		}
	},

	/***
	 * Call back method to cancel the changes.
	 * This will identify the changed record from original model and replace the record from backup model.
	 * and clear the application level dirty flag
	 * @memberOf inventory.SalesAndInventory
	 * @param bResult
	 */
	_callbackCancel: function(bResult) {
		if (bResult) {
			var backupmodel = this.getView().getModel("backup").getData();
			var rows = this.byId("SalesAndInvTable").getRows();
			var dirtyState = false;
			for (var i = 0; i < rows.length; i++) {
				dirtyState = this.getView().getModel().getProperty(rows[i].mAggregations.cells[0].getBindingContext().sPath + '/dirtyState');
				if (dirtyState) {
					var index = (rows[i].mAggregations.cells[0].getBindingContext().sPath).split("/")[2];
					this._revertChanges(index);
					var cells = rows[i].getAggregation("cells");
					cells[5].setProperty("value", backupmodel.results[index].LastWeekSales); //Sales cell
					cells[6].setProperty("value", backupmodel.results[index].BegINV); //BegINV cell
				}
			}
			MCAPP.clearDirtyFlag();
		}
	},
});