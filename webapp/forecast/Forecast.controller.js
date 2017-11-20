/***
 * @Author SO97
 * @Date 10/10/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is Forecast view controller
 */
sap.ui.controller("mc.ccp.forecast.Forecast", {
	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf forecast.Forecast
	 */
	onInit: function() {
//		var oDataModel = new sap.ui.model.odata.ODataModel(MCAPP.getServiceUrl(MCAPP.getComponent().getModel('service').getProperty('/ForecastService')));
		var oDataModel = new sap.ui.model.json.JSONModel();
		this.getView().data('oDataModel', oDataModel);
		var thisContext = this;
		/*oDataModel.read('ZCCP_FORE_HEAD_SET', null, {
			"$expand": "ZCCP_FORE_HEAD_ITEM_NAV",
			"$format": "json",
			"$filter": MCAPP.getSelectedShiptoAsQryParam()
		}, false, function(oData, oResponse) {
			thisContext._dataLoadSuccess(oData, oResponse);
		}, function(oError) {
			thisContext._dataLoadFail(oError);
		});*/
		
		 oDataModel.attachRequestCompleted(thisContext._dataLoadSuccess,this);
	        oDataModel.loadData("json/Forecast.json",{},false);
		//Update the lable on the view top
		var dataLength = thisContext.getView().getModel().getData().results.length;
		if(dataLength == 0){
			this.byId("idPageControlsRowTop").setVisible(false);
			this.byId("idPageControlsRowBottom").setVisible(false);
			this.byId("idDateHeader").setVisible(false);
		}else{
			this.byId("totalTxtIdTop").setText(MCAPP.getText('GBL_TOTAL_OF', this) + ' ' + dataLength);
			this.byId("totalTxtIdBottom").setText(MCAPP.getText('GBL_TOTAL_OF', this) + ' ' + dataLength);
			this.byId("perPageTop").setText(MCAPP.getText('GBL_PER_PAGE'));
			this.byId("perPageBottom").setText(MCAPP.getText('GBL_PER_PAGE'));
			//set the initial page control values i.e, paginator, rowrepeater etc
			this.onChangeDropdown();
			this._openImportDataDailog(); 
		}
	},

	/***
	 * This method is called when data load is successful in onInit method.
	 * It will parse the JSON response and put the index, dirtyState, expand and readOnly flags in the parsed JSON response
	 * and set the model to the current view and also creates a backup model and set it to view.
	 * @param oData
	 * @param oResponse
	 */
	_dataLoadSuccess: function(evt) {
		var readOnly = MCAPP.isReadOnlyRole();
		var obj = evt.getSource().getData();//JSON.parse(oResponse.body);
		oData = {};
		oData.results = obj.d.results;
		//Add State related properties (expand, dirty, error)
		$.each(oData.results, function(i, item) {
			item.expand = false;
			item.dirtyState = false;
			item.errorState = false;
			item.readOnly = readOnly;
			item.index = i + 1;
			$.each(item.ZCCP_FORE_HEAD_ITEM_NAV.results, function(j, subItem) {
				if((parseInt(subItem.DistForecast) + parseInt(subItem.PriorYearSales)) == 0){
					subItem.PERCENTAGE_SALES = 0 + "%";
				}else{
					subItem.PERCENTAGE_SALES = parseInt((subItem.DistForecast - subItem.PriorYearSales) / ((parseInt(subItem.DistForecast) + parseInt(subItem.PriorYearSales)) / 2)) + "%";
				}
				if(subItem.CurrentYearSales == 0 || subItem.CurrentYearSales ===undefined){
					subItem.FRST_ACCURACY = 0 + "%";
				}else{
					subItem.FRST_ACCURACY = parseInt(1 - Math.abs((subItem.DistForecast - subItem.CurrentYearSales) / subItem.CurrentYearSales)) + "%";
				}

			});
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
	 * dataLoadFail is used to display an error in case oData hit gets failed.
	 * @memberOf Forecast
	 */
	_dataLoadFail: function() {
		// Removing onLoading Image and show the Application
		jQuery.sap.byId('ApploadingDivId').hide();
		jQuery.sap.byId('content').show();
		sap.ui.commons.MessageBox.show(MCAPP.getText('GBL_DATA_LOAD_ERROR', this), sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', this), [sap.ui.commons.MessageBox.Action.OK]);
	},

	/***
	 * Event Handler for Dropdown Control. Whenever user change the records per page from combo box,
	 * no of pages will be calculated accordingly and paginator will be set accordingly.
	 * @param oEvent
	 */
	onChangeDropdown: function(oEvent) {
		if (MCAPP.getDirtyFlag() === true) {
			var previousValue = "";
			var currentValue = "";
			if (oEvent.getSource().getId().indexOf("comboBoxIdTop") > 0) {
				previousValue = this.byId("comboBoxIdBottom").getSelectedKey();
				currentValue = this.byId("comboBoxIdTop").getSelectedKey();
			}
			else if (oEvent.getSource().getId().indexOf("comboBoxIdBottom") > 0) {
				previousValue = this.byId("comboBoxIdTop").getSelectedKey();
				currentValue = this.byId("comboBoxIdBottom").getSelectedKey();
			}
			if (parseInt(previousValue) > parseInt(currentValue)) {
				if (oEvent.getSource().getId().indexOf("comboBoxIdTop") > 0) {
					this.byId("comboBoxIdTop").setSelectedKey(previousValue);
				}
				else {
					this.byId("comboBoxIdBottom").setSelectedKey(previousValue);
				}
				sap.ui.commons.MessageBox.alert(MCAPP.getText('GBL_SAVE_PROMP_DD', this));
				return;
			}
		}
		MCAPP.setBusy(true);
		if (oEvent) {
			this.byId('comboBoxIdTop').setSelectedKey(oEvent.getSource().getSelectedKey());
			this.byId('comboBoxIdBottom').setSelectedKey(oEvent.getSource().getSelectedKey());
		}
		var combo = this.byId("comboBoxIdTop");
		var rp = this.byId("rowRepeaterId");
		rp.setNumberOfRows(parseInt(combo.getSelectedKey()));
		rp.gotoPage(1);
		var dataLength = this.getView().getModel().getData().results.length;
		var oPerPage = combo.getSelectedKey();
		var noOfPage = Math.floor(dataLength / oPerPage);
		var oRemainPage = dataLength % oPerPage;
		if (oRemainPage > 0) {
			noOfPage = noOfPage + 1;
		}
		var oPaginatory = this.byId("paginatorIdTop");
		oPaginatory.setNumberOfPages(parseInt(noOfPage));
		oPaginatory.setCurrentPage(1);
		oPaginatory = this.byId("paginatorIdBottom");
		oPaginatory.setNumberOfPages(parseInt(noOfPage));
		oPaginatory.setCurrentPage(1);
		MCAPP.setBusy(false);
	},

	/**
	 * _removeFlagFromChangedRecords is used to delete the dirtyState, Index, expand and readOnly flags from the records which need to be saved.
	 * @memberOf changereq.ChangeRequestPreview
	 * @param changedRecords
	 */
	_removeFlagFromChangedRecords: function(changedRecords) {
		for (var i = 0; i < changedRecords.length; i++) {
			delete changedRecords[i].dirtyState;
			delete changedRecords[i].expand;
			delete changedRecords[i].index;
			delete changedRecords[i].readOnly;
			delete changedRecords[i].PERCENTAGE_SALES;
			delete changedRecords[i].FRST_ACCURACY;
		}
	},

	/**
	 * onPageSaveAndNavigate is called when the paginator is clicked .
	 * First is saves any modified data to the backend and then navigates to the new page
	 * @memberOf Forecast
	 * @param oEvent
	 */
	onPageSaveAndNavigate: function(oEvent) {
		MCAPP.setBusy(true);
		var that = this;
		var eventObj = oEvent;
		var changedRecords = this._getChangedRecords();
		var rp = this.byId("rowRepeaterId");
		var page = oEvent.mParameters.targetPage;
		rp.gotoPage(oEvent.mParameters.targetPage);
		if (oEvent.getSource().getId().split('--')[1] == 'paginatorIdTop') {
			this.byId("paginatorIdBottom").setCurrentPage(parseInt(page));
		}
		else {
			this.byId("paginatorIdTop").setCurrentPage(parseInt(page));
		}
		this._removeFlagFromChangedRecords(changedRecords);
		if (changedRecords.length <= 0) {
			that._navigate(eventObj);
			MCAPP.setBusy(false);
			return;
		}
		else {
			var oDataModel = this.getView().data('oDataModel');
			var dummyHeader = {};
			dummyHeader.ZCCP_FORE_HEAD_ITEM_NAV = changedRecords;
			oDataModel.create('/ZCCP_FORE_HEAD_SET', dummyHeader, null, function(data) {
				var changedData = JSON.parse(JSON.stringify(that.getView().getModel().getData()));
				that.getView().getModel('backup').setData(changedData);
				MCAPP.clearDirtyFlag();
				that._navigate(eventObj);
				sap.m.MessageToast.show(MCAPP.getText('GBL_DATA_SAVE_MSG', this), {
					duration: MCAPP.getAppConfigAsInt('MsgToastDurationOnNavigation')
				});
				MCAPP.setBusy(false);
			}, function(data) {
				eventObj.getSource().setCurrentPage(eventObj.getParameter('srcPage'));
				MCAPP.setBusy(false);
				sap.ui.commons.MessageBox.show(MCAPP.getText('GBL_DATA_SAVE_ERROR', that), sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', that), [sap.ui.commons.MessageBox.Action.OK]);
			});
		}
	},

	/**
	 * _navigate is called to navigate to the next/previous page
	 *
	 * @memberOf Forecast
	 */
	_navigate: function(oEvent) {
		if(oEvent.getSource().getId().indexOf("paginatorIdTop") > 0){
			this.byId("paginatorIdBottom").setCurrentPage(oEvent.mParameters.targetPage);
		}else{
			this.byId("paginatorIdTop").setCurrentPage(oEvent.mParameters.targetPage);
		}
		var rp = this.byId("rowRepeaterId");
		rp.gotoPage(oEvent.mParameters.targetPage);
	},

	/**
	 * onPressSave is called to navigate to the next/previous page
	 *
	 * @memberOf Forecast
	 */
	onPressSave: function() {
		MCAPP.setBusy(true);
		var changedRecords = this._getChangedRecords();
		this._removeFlagFromChangedRecords(changedRecords);
		if (changedRecords.length <= 0) {
			MCAPP.setBusy(false);
			return;
		}
		if (changedRecords.length >= 0) {
			this._genericSave(changedRecords, this._dataSaveSuccess, this._dataSaveFail, this);
		}
	},

	/**
	 * _dataSaveSuccess is the callback function which is called after data is saved successfully
	 *
	 * @memberOf Forecast
	 */
	_dataSaveSuccess: function(thisContext) {
		var changedData = JSON.parse(JSON.stringify(thisContext.getView().getModel().getData()));
		thisContext.getView().getModel('backup').setData(changedData);
		MCAPP.clearDirtyFlag();
		MCAPP.setBusy(false);
	},

	/**
	 * _dataSaveFail is the callback function which is called after data is not saved successfully
	 *
	 * @memberOf Forecast
	 * @param thisContext
	 */
	_dataSaveFail: function(thisContext) {
		MCAPP.setBusy(false);
		sap.ui.commons.MessageBox.show(MCAPP.getText('GBL_DATA_SAVE_ERROR', thisContext), sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', thisContext), [sap.ui.commons.MessageBox.Action.OK]);
	},

	/**
	 * _genericSave is the method which does the data saving to the backend
	 *
	 * @memberOf Forecast
	 * @param changedRecords
	 */
	_genericSave: function(changedRecords) {
		var currView = MCAPP.getCurrentView();
		var oDataModel = currView.data('oDataModel');
		var that = this;
		var dummyHeader = {};
		dummyHeader.ZCCP_FORE_HEAD_ITEM_NAV = changedRecords;
		oDataModel.create('/ZCCP_FORE_HEAD_SET', dummyHeader, null, function() {
			var changedData = JSON.parse(JSON.stringify(that.getView().getModel().getData()));
			that.getView().getModel('backup').setData(changedData);
			MCAPP.clearDirtyFlag();
			sap.m.MessageToast.show(MCAPP.getText('GBL_DATA_SAVE_MSG', this), {
				duration: MCAPP.getAppConfigAsInt('MsgToastDurationOnNavigation')
			});
			MCAPP.setBusy(false);
		}, function(oError) {
			MCAPP.setBusy(false);
			var xml = $.parseXML(oError.response.body);
			sap.ui.commons.MessageBox.show($(xml).context.childNodes[0].childNodes[1].textContent, sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', that), [sap.ui.commons.MessageBox.Action.OK]);
		});
	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf order.Order
	 */
	onAfterRendering: function() {
		MCAPP.setBusy(false);
		// Removing onLoading Image and show the Application
		jQuery.sap.byId('ApploadingDivId').hide();
		jQuery.sap.byId('content').show();
		//Update the Header for this view
		MCAPP.updateHeader(this);
		MCAPP.menuSelection(this);

	},

	/**
	 * Called when the Expand image is clicked
	 * @memberOf Forecast
	 */
	onExpandedRow: function() {
		var list = this._getVisibleRows();
		var flag = false;
		for (var i = 0; i < list.length; i++) {
			if (!list[i].getExpand()) {
				flag = true;
				break;
			}
		}
		if (!flag) {
			this.byId('expandCollapseLinkIdTop').setProperty('text', MCAPP.getText('GBL_COLLAPSE_ALL', this));
			this.byId('expandCollapseLinkIdBottom').setProperty('text', MCAPP.getText('GBL_COLLAPSE_ALL', this));
		}
	},

	/**
	 * Called when the Collapse image is clicked
	 * @memberOf Forecast
	 */
	onCollapsedRow: function() {
		this.byId('expandCollapseLinkIdTop').setProperty('text', MCAPP.getText('GBL_EXPAND_ALL', this));
		this.byId('expandCollapseLinkIdBottom').setProperty('text', MCAPP.getText('GBL_EXPAND_ALL', this));
	},

	/**
	 * Called when the ExpandAll/ CollapseAll image is clicked
	 * @memberOf Forecast
	 */
	onPressExpandCollapseAll: function() {
		var list;
		if (this.byId('expandCollapseLinkIdTop').getProperty('text').indexOf(MCAPP.getText('GBL_EXPAND_ALL', this)) >= 0) {
			list = this._getVisibleRows();
			for (var i = 0; i < list.length; i++) {
				list[i].expand();
			}
			this.byId('expandCollapseLinkIdTop').setProperty('text', MCAPP.getText('GBL_COLLAPSE_ALL', this));
			this.byId('expandCollapseLinkIdBottom').setProperty('text', MCAPP.getText('GBL_COLLAPSE_ALL', this));
		}
		else {
			list = this._getVisibleRows();
			for (var j = 0; j < list.length; j++) {
				list[j].collapse();
			}
			this.byId('expandCollapseLinkIdTop').setProperty('text', MCAPP.getText('GBL_EXPAND_ALL', this));
			this.byId('expandCollapseLinkIdBottom').setProperty('text', MCAPP.getText('GBL_EXPAND_ALL', this));
		}
	},

	/**
	 * Checks the Visible rows in the page row repeater
	 * @memberOf Forecast
	 */
	_getVisibleRows: function() {
		var result = [];
		var oDomRef = this.byId('rowRepeaterId').getDomRef();
		var domLi = $(oDomRef).find('li[class=sapUiRrRow]');
		for (var i = 0; i < domLi.length; i++) {
			var domDiv = $(domLi[i]).find('div');
			var elm = sap.ui.getCore().byId(domDiv[0].id);
			result.push(elm);
		}
		return result;
	},

	/**
	 * Checks and sets the dirty flag to the changed record
	 * @memberOf Forecast
	 * @param oEvent
	 */
	onChangeRecord: function(oEvent) {
		var dirtyState = oEvent.getParameter('dirtyState');
		if (dirtyState) {
			MCAPP.setDirtyFlag(dirtyState);
		}
		if (!dirtyState) {
			var flag = false;
			var rows = this._getVisibleRows();
			for (var i = 0; i < rows.length; i++) {
				if (rows[0].getDirtyState() === true) {
					flag = true;
					break;
				}
			}
			MCAPP.setDirtyFlag(flag);
		}
	},

	/**** CANCEL FUNCTIONALITY ******************************************/
	/**
	 * Called when the Cancel button is clicked
	 * @memberOf Forecast
	 */
	onPressCancel: function() {
		var that = this;
		if (MCAPP.getDirtyFlag()) {
			sap.ui.commons.MessageBox.confirm(MCAPP.getText('GBL_CANCEL_CONFIRM', this), function(bResult) {
				that._callbackCancel(bResult);
			}, MCAPP.getText('GBL_CONFIRM', this)); //.addStyleClass('McCustomDialog');
		}
	},

	/**
	 * Called to restore the previous back up data
	 * @memberOf Forecast
	 * @param bResult
	 */
	_callbackCancel: function(bResult) {
		if (bResult) {
			var rows = this._getVisibleRows();
			for (var i = 0; i < rows.length; i++) {
				if (rows[i].getDirtyState()) {
					var index = this.getView().getModel('backup').getProperty(rows[i].getBindingContext().sPath + '/index');
					this.revertChanges(index);
					rows[i].setDirtyState(false);
				}
			}
			MCAPP.clearDirtyFlag();
		}
	},

	/**
	 * Restore the back up data to the model
	 * @memberOf Forecast
	 * @param index
	 */
	revertChanges: function(index) {
		var backupModel = this.getView().getModel('backup');
		var backupObj = this._getObjectByIndex(backupModel, index);
		var changedModel = this.getView().getModel();
		var changedObj = this._getObjectByIndex(changedModel, index);
		var noOfWeeks = 12;
		//Now Copy One by One
		for (var i = 0; i < noOfWeeks; i++) {
			if (i >= 2) {
				changedObj.ZCCP_FORE_HEAD_ITEM_NAV.results[i].DistForecast = backupObj.ZCCP_FORE_HEAD_ITEM_NAV.results[i].DistForecast;
			}
		}
		changedModel.refresh();
	},

	/**
	 * returns the record by the index
	 * @memberOf Forecast
	 * @param model
	 * @param index
	 */
	_getObjectByIndex: function(model, index) {
		var records = model.getData().results;
		for (var i = 0; i < records.length; i++) {
			if (records[i].index == index) {
				return records[i];
			}
		}
	},

	/**** END OF CANCEL FUNCTIONALITY **************************************/
	/**
	 * returns the changed/modified records in the page
	 * @memberOf Forecast
	 */
	_getChangedRecords: function() {
		var rows = this._getVisibleRows();
		var originalModel = this.getView().getModel('backup');
		var changedDModel = this.getView().getModel();
		var changedRecords = [];
		for (var i = 0; i < rows.length; i++) {
			if (originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/2/DistForecast') != changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/2/DistForecast')) {
				changedRecords.push(changedDModel.getData().results[i].ZCCP_FORE_HEAD_ITEM_NAV.results[2]);
			}
			if (originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/3/DistForecast') != changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/3/DistForecast')) {
				changedRecords.push(changedDModel.getData().results[i].ZCCP_FORE_HEAD_ITEM_NAV.results[3]);
			}
			if (originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/4/DistForecast') != changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/4/DistForecast')) {
				changedRecords.push(changedDModel.getData().results[i].ZCCP_FORE_HEAD_ITEM_NAV.results[4]);
			}
			if (originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/5/DistForecast') != changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/5/DistForecast')) {
				changedRecords.push(changedDModel.getData().results[i].ZCCP_FORE_HEAD_ITEM_NAV.results[5]);
			}
			if (originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/6/DistForecast') != changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/6/DistForecast')) {
				changedRecords.push(changedDModel.getData().results[i].ZCCP_FORE_HEAD_ITEM_NAV.results[6]);
			}
			if (originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/7/DistForecast') != changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/7/DistForecast')) {
				changedRecords.push(changedDModel.getData().results[i].ZCCP_FORE_HEAD_ITEM_NAV.results[7]);
			}
			if (originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/8/DistForecast') != changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/8/DistForecast')) {
				changedRecords.push(changedDModel.getData().results[i].ZCCP_FORE_HEAD_ITEM_NAV.results[8]);
			}
			if (originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/9/DistForecast') != changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/9/DistForecast')) {
				changedRecords.push(changedDModel.getData().results[i].ZCCP_FORE_HEAD_ITEM_NAV.results[9]);
			}
			if (originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/10/DistForecast') != changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/10/DistForecast')) {
				changedRecords.push(changedDModel.getData().results[i].ZCCP_FORE_HEAD_ITEM_NAV.results[10]);
			}
			if (originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/11/DistForecast') != changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/11/DistForecast')) {
				changedRecords.push(changedDModel.getData().results[i].ZCCP_FORE_HEAD_ITEM_NAV.results[11]);
			}
		}
		return changedRecords;
	},

	/**
	 * Called to open the import data dialog
	 * @memberOf Forecast
	 */
	_openImportDataDailog: function() {
		var oDataModel = this.getView().data().oDataModel;
		var oTable = this.byId('columnHeaderId');
		var that = this;
		var oImportDataDailogView = new sap.ui.view({
			type: sap.ui.core.mvc.ViewType.JS,
			viewName: "mc.ccp.forecast.ImportDataDialog",
			viewData : oTable
		});
		var oFileUploader = this._createFileUploader(oImportDataDailogView, oDataModel);
		oImportDataDailogView.addContent(oFileUploader);
		var oCancelButton = new sap.ui.commons.Button({
			text: MCAPP.getText("GBL_CANCEL", this),
			width: "90px",
			height: '30px'
		});
		oCancelButton.attachPress(oImportDataDailogView.getController().onPressClose, this, oImportDataDailogView.getController());
		var oOKButton = new sap.ui.commons.Button(	this.createId("importOkButtonId"),{
			text: MCAPP.getText("GBL_OK", this),
			width: "90px",
			height: '30px',
			enabled: false
		});
		oOKButton.attachPress(oImportDataDailogView.getController().onPressUploadFile);
		oImportDataDialog = new sap.ui.commons.Dialog(this.createId("importDataDialogBox"),{
			modal: true,
			width: '30%',
			height: '50%',
			title: MCAPP.getText("VW_FORECAST_IMPORT_DATA", this),
			content: [oImportDataDailogView],
			buttons: [oCancelButton, oOKButton],
			closed: function() {
				this.close();
			}
		}).addStyleClass('McCustomDialog');
		oImportDataDialog.setModel(this.getView().getModel());
		oImportDataDialog.setModel(this.getView().getModel("backup"), "backup");
	},

	/**
	 * returns the file uploader object
	 * @memberOf Forecast
	 * @param oImportDataDailogView
	 * @param oDataModel
	 */
	_createFileUploader: function(oImportDataDailogView, oDataModel) {
		var oFileUploader = new sap.ui.unified.FileUploader("fileuploader", {
			name: "upload",
			placeholder: "File:",
			multiple: false,
			maximumFileSize: 2,
			mimeType: "xml",
			fileType: "xml",
			sendXHR: true,
			uploadOnChange: false,
			useMultipart: false,
			sameFilenameAllowed: true,
			headerParameters: [],
			change: oImportDataDailogView.getController().onChange,
			fileSizeExceed: function(oEvent) {
				var sName = oEvent.getParameter("fileName");
				var fSize = oEvent.getParameter("fileSize");
				var fLimit = oFileUploader.getMaximumFileSize();
				var errMessage  = MCAPP.getText("VW_FORECAST_FILE", this) +" : "+ sName + ", " + MCAPP.getText("VW_FORECAST_SIZE", this) + " : " + fSize + MCAPP.getText("VW_FORECAST_FILE_SIZE_EXCEED", this);
				sap.ui.commons.MessageBox.show(errMessage, sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', this));
				MCAPP.getCurrentView().getController().byId("importOkButtonId").setEnabled(false);	

			},
			typeMissmatch: function(oEvent) {
				var sName = oEvent.getParameter("fileName");
				var sType = oEvent.getParameter("fileType");
				var sMimeType = oFileUploader.getMimeType();
				if (!sMimeType) {
					sMimeType = oFileUploader.getFileType();
				}
				var errMessage  = MCAPP.getText("VW_FORECAST_FILE", this) +" : "+ sName +", "+ MCAPP.getText("VW_FORECAST_FILE_TYPE", this) + " : " + sType +", "+ MCAPP.getText("VW_FORECAST_FILE_TYPE_WRONG", this);
				sap.ui.commons.MessageBox.show(errMessage, sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', this));
				MCAPP.getCurrentView().getController().byId("importOkButtonId").setEnabled(false);	

			},
			uploadComplete: function(oEvent) {
				oImportDataDailogView.getController().fileUploaderUploadComplete(oEvent);            	 
			}
		});

		return oFileUploader;
	},

	/**
	 * Called when the import link is clicked
	 * @memberOf Forecast
	 */
	onPressImport: function() {
		var changedRecords = this._getChangedRecords();
		if (changedRecords.length <= 0) {
			var oFileUploader = sap.ui.getCore().byId("fileuploader"); 
			oFileUploader.setValue(""); 
			MCAPP.getCurrentView().getController().byId("importOkButtonId").setEnabled(false);	 
			this.byId("importDataDialogBox").open();
		}
		else {
			sap.ui.commons.MessageBox.show(this.getView().getModel("i18n").getProperty("VW_FORECAST_MSG_UNSAVED_DATA"));
			return false;
		}
	},

	/**
	 * Called to return the security token
	 * @memberOf Forecast
	 * @param oDataModel
	 */
	_getXsrfToken: function(oDataModel) {
		var sToken = oDataModel.getHeaders()['x-csrf-token'];
		if (!sToken) {
			oDataModel.refreshSecurityToken(function(evt,obj) {
				sToken = obj.headers['x-csrf-token'];
			}, function(oError) {
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('VW_FORECAST_XSRF_TOKEN'),
					details: ''
				});
			}, false);
		}
		return sToken;
	},

	/***
	 * Event Handler for Filter Option, no of rows would be calculated after the filter and
	 * paginator's no of pages and combo box values would be updated accordingly.
	 * @param evt
	 */
	onFilterColumn: function(evt) {
		if (MCAPP.getDirtyFlag() === true) {
			sap.ui.commons.MessageBox.alert(MCAPP.getText('GBL_SAVE_PROMP_FILTER', this));
			return;
		}
		var dataLength = "";
		var filterValue = evt.getParameter('value').trim();
		var rowRepeater = this.byId('rowRepeaterId');
		var column = this._getJsonColumn(evt.getParameter('column').sId.split('--')[1]);
		var oparator = sap.ui.model.FilterOperator.EQ;
		if (column == 'SKU_Desc' || column == 'SourceName'  || column =='EstdTransitDays') {
			oparator = sap.ui.model.FilterOperator.Contains;
		}
		if(column == 'Dist_SKU' || column == 'SKU' || column == 'ShipToId'){
			filterValue = this._convertFilterValue(column,filterValue);
		}

		var rowRepeaterFilters = rowRepeater.getFilters();
		rowRepeater.destroyFilters();
		var collect = [];
		if (rowRepeaterFilters.length > 0) {
			var filters = rowRepeaterFilters[0].getFilters();
			for (var i = 0; i < filters.length; i++) {
				if (filters[i].sPath != evt.getParameter('column').getFilterProperty()) {
					collect.push(filters[i]);
				}
			}
			if (filterValue !== '') {
				var newFilter = new sap.ui.model.Filter(column, oparator, filterValue);
				collect.push(newFilter);
			}
			var oFilter = new sap.ui.commons.RowRepeaterFilter("rowRepeaterFilter", {
				filters: collect
			});
			rowRepeater.addFilter(oFilter);
			rowRepeater.applyFilter("rowRepeaterFilter");
		}
		else {
			if (filterValue !== '') {
				var oFilter = new sap.ui.commons.RowRepeaterFilter("rowRepeaterFilter", {
					filters: [new sap.ui.model.Filter(column, oparator, filterValue)]
				});
				rowRepeater.addFilter(oFilter);
				rowRepeater.applyFilter("rowRepeaterFilter");
			}
		}
		var combo = this.byId("comboBoxIdTop");
		rowRepeater.setNumberOfRows(parseInt(combo.getSelectedKey()));
		rowRepeater.gotoPage(1);
		dataLength = rowRepeater._getRowCount();
		var oPerPage = combo.getSelectedKey();
		var noOfPage = Math.floor(dataLength / oPerPage);
		var oRemainPage = dataLength % oPerPage;
		if (oRemainPage > 0) {
			noOfPage = noOfPage + 1;
		}
		var oPaginatory = this.byId("paginatorIdTop");
		oPaginatory.setNumberOfPages(parseInt(noOfPage));
		oPaginatory.setCurrentPage(1);
		oPaginatory = this.byId("paginatorIdBottom");
		oPaginatory.setNumberOfPages(parseInt(noOfPage));
		oPaginatory.setCurrentPage(1);
		MCAPP.setBusy(false);
	},
	/**
	 * Method to convert the filter value from String to Integer.
	 * @param column
	 * @param filterValue
	 * @returns {Integer}
	 */
	_convertFilterValue : function(column, filterValue){
		if(filterValue != ""){  
			filterValue = parseInt(filterValue);
		}
		return filterValue;
	},


	/**
	 * Method to retrive json properties based on column name.
	 * @param col
	 * @returns {String}
	 */
	_getJsonColumn: function(col) {
		var result = '';
		switch (col) {
		case 'distSkuColIdFr':
			result = 'Dist_SKU';
			break;
		case 'skuColIdFr':
			result = 'SKU';
			break;
		case 'descColIdFr':
			result = 'SKU_Desc';
			break;
		case 'shipToColIdFr':
			result = 'ShipToId';
			break;
		case 'sourceColIdFr':
			result = 'SourceName';
			break;
		case 'transitColIdFr':
			result = 'EstdTransitDays';
			break;
		}
		return result;
	},

	/***
	 * Event Handler for Sort Option
	 * @param evt
	 */
	onSortColumn: function(evt) {
		if (MCAPP.getDirtyFlag() === true) {
			sap.ui.commons.MessageBox.alert(MCAPP.getText('GBL_SAVE_PROMP_SORT', this));
			return;
		}
		if (evt.getParameter('sortOrder') == sap.ui.table.SortOrder.Ascending) {
			this.byId('rowRepeaterId').triggerSort(evt.getParameter('column').sId + '-Asc');
		}
		else {
			this.byId('rowRepeaterId').triggerSort(evt.getParameter('column').sId + '-Dsc');
		}
	},
	
	/**
	* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	* @memberOf Forecast
	*/
	onExit:function(){ 
		this.byId("importDataDialogBox").destroy(); 
	}
});