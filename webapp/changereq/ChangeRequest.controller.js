/***
 * @Author OD79
 * @Date 10/13/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is the controller specific to Change Request View.
 */
sap.ui.controller("mc.ccp.changereq.ChangeRequest", {
	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * This method retrieves the change request information expanded to ZCCP_CH_REQ_HEAD_ITEM_NAV by passing selected shipto's and
	 * assigns success and failure callback methods
	 * Updates label for the total number of CR to be displayed.
	 * @memberOf changereq.ChangeRequest
	 */
	onInit: function() {
		// Get the Service MetaData File
		/*var oDataModel = new sap.ui.model.odata.ODataModel(MCAPP.getServiceUrl(MCAPP.getComponent().getModel('service').getProperty('/ChangeRequestService')));
		this.getView().data('oDataModel', oDataModel);
		var thisContext = this;
		oDataModel.read('ZCCP_CH_REQ_HEADSet', null, {
			"$expand": "ZCCP_CH_REQ_HEAD_ITEM_NAV",
			"$format": "json",
			"$filter": MCAPP.getFilterForCRscreen()
		}, false, function(oData, oResponse) {
			thisContext._dataLoadSuccess(oData, oResponse);
		}, function(oError) {
			thisContext._dataLoadFail(oError);
		});*/
		
		var oDataModel = new sap.ui.model.json.JSONModel();
        this.getView().data('oDataModel', oDataModel);
        var thisContext = this;
        oDataModel.attachRequestCompleted(thisContext._dataLoadSuccess,this);
        oDataModel.loadData("json/ChangeRequestService.json",{},false);
		var thisContext = this;
		
		//Update the lable on the view top
        var dataLength = thisContext.getView().getModel().getData().results.length;
        if(dataLength == 0){
        	thisContext.byId("idTopControlsRow").setVisible(false);
        	thisContext.byId("idTopControlsRowCl").setVisible(false);
        	thisContext.byId("idDateHeader").setVisible(false);
        }else{
        	thisContext.byId("totalTxtId").setText(MCAPP.getText('GBL_TOTAL_OF', this) + ' ' + dataLength);
        	thisContext.byId("totalTxtIdCl").setText(MCAPP.getText('GBL_TOTAL_OF', this) + ' ' + dataLength);
        	thisContext.byId("perPage").setText(MCAPP.getText('GBL_PER_PAGE'));
        	thisContext.byId("perPageCl").setText(MCAPP.getText('GBL_PER_PAGE'));
            //set the initial page control values i.e, paginator, rowrepeater etc
        	thisContext.onChangeDropdown();
        }
	},

	/***
	 * This method is called when data load is successful inside onInit method.
	 * It will parse the JSON response and put the index, dirtyState, expand and readOnly flags in the parsed JSON response
	 * and sets the model to the current view along with creating a backup model and setting it to view.
	 * @param oData
	 * @param oResponse
	 */

	_dataLoadSuccess: function(evt) {
		var readOnly;
		var readOnlyRole;
		if(MCAPP.isReadOnlyRole() === true){
			readOnly = true;
			readOnlyRole = true;
		}else {
			readOnlyRole = false;
			if(MCAPP.isReadOnlyCRState() === true){
				readOnly = true;
			}else{
				readOnly = false;
			}
		} 
		//var readOnly = MCAPP.isReadOnlyCRState();
		//var readOnlyRole = MCAPP.isReadOnlyRole();
		// add state related properties (expand, dirty)
		var obj = evt.getSource().getData();
		var oCustomData = {};
		oCustomData.results = obj.d.results;
		$.each(oCustomData.results, function(i, item) {
			item.index = i + 1;
			item.expand = false;
			item.dirtyState = false;
			item.readOnly = readOnly;
			item.readOnlyRole = readOnlyRole;
		});
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData(oCustomData);
		this.getView().setModel(oModel);
		// get Copy of original data
		var oCopyOfData = JSON.parse(JSON.stringify(oCustomData));
		// creating the backup model
		var oModelBackup = new sap.ui.model.json.JSONModel();
		oModelBackup.setData(oCopyOfData);
		this.getView().setModel(oModelBackup, "backup");
		MCAPP.updateSegmentedButton(MCAPP.getDistributorType(), false);
	},

	/***
	 * This method is called when data load fails inside onInit method.
	 * removes the onload image and shows the application and displays the error message box.
	 * @param oError
	 */
	_dataLoadFail: function(oError) {
		MCAPP.setBusy(false);
		// removing onload image and show the Application
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
			if (oEvent.getSource().getId().indexOf("comboBoxId") > 0) {
				previousValue = this.byId("comboBoxIdCl").getSelectedKey();
				currentValue = this.byId("comboBoxId").getSelectedKey();
			}
			else if (oEvent.getSource().getId().indexOf("comboBoxIdCl") > 0) {
				previousValue = this.byId("comboBoxId").getSelectedKey();
				currentValue = this.byId("comboBoxIdCl").getSelectedKey();
			}
			if (parseInt(previousValue) > parseInt(currentValue)) {
				if (oEvent.getSource().getId().indexOf("comboBoxId") > 0) {
					this.byId("comboBoxId").setSelectedKey(previousValue);
				}
				else {
					this.byId("comboBoxIdCl").setSelectedKey(previousValue);
				}
				sap.ui.commons.MessageBox.alert(MCAPP.getText('GBL_SAVE_PROMP_DD', this));
				return;
			}
		}
		MCAPP.setBusy(true);
		var combo = this.byId("comboBoxId");
		if (oEvent) {
			this.byId('comboBoxId').setSelectedKey(oEvent.getSource().getSelectedKey());
			this.byId('comboBoxIdCl').setSelectedKey(oEvent.getSource().getSelectedKey());
		}
		var rp = this.byId("rowRepeaterId");
		rp.setNumberOfRows(parseInt(combo.getSelectedKey()));
		rp.gotoPage(1);
		var dataLength = rp._getRowCount();
		var oPerPage = combo.getSelectedKey();
		var noOfPage = Math.floor(dataLength / oPerPage);
		var remainPage = dataLength % oPerPage;
		if (remainPage > 0) {
			noOfPage = noOfPage + 1;
		}
		var oPaginatory = this.byId("paginatorId");
		oPaginatory.setNumberOfPages(parseInt(noOfPage));
		oPaginatory.setCurrentPage(1);
		oPaginatory = this.byId("paginatorIdCl");
		oPaginatory.setNumberOfPages(parseInt(noOfPage));
		oPaginatory.setCurrentPage(1);
		/*if(oEvent){
			var list = rp.getAggregation('rows');
			var length = rp.getNumberOfRows();
			if(length > list.length){
				length = list.length;
			}
			if (this.byId('expandCollapseLinkId').getProperty('text').indexOf(MCAPP.getText('GBL_EXPAND_ALL', this)) >= 0) {
				for (var i = 0; i < length; i++) {
					list[i].collapse();
				}
			}else{
				for (var i = 0; i < length; i++) {
					list[i].expand();
				}
			}	 
		}*/
		MCAPP.setBusy(false); 
	},

	/***
	 * whenever user clicks on "save & next" or "save & previous" link, changes will be saved to backend.
	 * if no change is happened on the screen, user will navigate to next or previous page.
	 * _navigate is the call back in case of save successful.
	 * @param oEvent
	 */
	onPageNextAndPreviousLink: function(oEvent) {
		MCAPP.setBusy(true);
		var that = this;
		var eventObj = oEvent;
		var changedRecords = this._getChangedRecords();
		if (changedRecords.length <= 0) {
			MCAPP.setBusy(false);
			that._navigate(eventObj);
			return;
		}
		var CREATE_STATUS_CODE = "01";
		//change the status code 
		for (var i = 0; i < changedRecords.length; i++) {
			changedRecords[i].Status_Code = CREATE_STATUS_CODE;
		}
		var oDataModel = new sap.ui.model.odata.ODataModel(MCAPP.getServiceUrl(MCAPP.getComponent().getModel('service').getProperty('/ChangeRequestSaveService')));
		//var oDataModel = this.getView().data('oDataModel');
		var dummyHeader = {};
		//dummyHeader.Processed_Flag = "X";
		dummyHeader.ZCCP_CH_REQ_HEAD_ITEM_NAV = {};
		dummyHeader.ZCCP_CH_REQ_HEAD_ITEM_NAV.results = changedRecords;
		var CREATE_STATUS_CODE = "01";
		//change the status code 
		for (var i = 0; i < changedRecords.length; i++) {
			changedRecords[i].Status_Code = CREATE_STATUS_CODE;
		}

		oDataModel.create('/ZCCP_CH_REQ_HEADSet', dummyHeader, null, function(oData) {
			var changedData = JSON.parse(JSON.stringify(that.getView().getModel().getData()));
			that.getView().getModel('backup').setData(changedData);
			MCAPP.clearDirtyFlag();
			MCAPP.setBusy(false);
			sap.m.MessageToast.show(MCAPP.getText('GBL_DATA_SAVE_MSG', this), {
				duration: MCAPP.getAppConfigAsInt('MsgToastDurationOnNavigation')
			});
			that._navigate(eventObj);
		}, function(oData) {
			eventObj.getSource().setCurrentPage(eventObj.getParameter('srcPage'));
			MCAPP.setBusy(false);
			sap.ui.commons.MessageBox.show(MCAPP.getText('GBL_DATA_SAVE_ERROR', that), sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', that), [sap.ui.commons.MessageBox.Action.OK]);
		});
	},

	/***
	 * This method returns changed records in the current view by comparing the original model and backup model.
	 * @returns {Array}
	 */
	_getChangedRecords: function() {
		var thisView = mc.ccp.util.Application.getCurrentView();
		var thisController = thisView.getController();
		var rows = thisController._getVisibleRows();
		var originalModel = thisView.getModel('backup');
		var changedDModel = thisView.getModel();
		var changedRecords = [];
		for (var i = 0; i < rows.length; i++) {
			var index = (rows[i].getBindingContext().sPath).split("/")[2];
			if (originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/0/ProjDOI') != 
				changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/0/ProjDOI')) 
             {
                 changedRecords.push(changedDModel.getData().results[index].ZCCP_CH_REQ_HEAD_ITEM_NAV.results[0]);
             }
			if (originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/1/ProjDOI') != 
				changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/1/ProjDOI')) 
             {
                 changedRecords.push(changedDModel.getData().results[index].ZCCP_CH_REQ_HEAD_ITEM_NAV.results[1]);
             }
			if (originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/2/Change_Req_Qty') != 
				changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/2/Change_Req_Qty') || 
				originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/2/DistForecast') != 
				changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/2/DistForecast') ||
				originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/2/ProjDOI') != 
				changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/2/ProjDOI')) {
				changedRecords.push(changedDModel.getData().results[index].ZCCP_CH_REQ_HEAD_ITEM_NAV.results[2]);
			}
			if (originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/3/DistForecast') != 
				changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/3/DistForecast') ||
				originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/3/ProjDOI') != 
				changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/3/ProjDOI')) {
				changedRecords.push(changedDModel.getData().results[index].ZCCP_CH_REQ_HEAD_ITEM_NAV.results[3]);
			}
			if (originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/4/DistForecast') != 
				changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/4/DistForecast') || 
				originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/4/ProjDOI') != 
				changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/4/ProjDOI')) {
				changedRecords.push(changedDModel.getData().results[index].ZCCP_CH_REQ_HEAD_ITEM_NAV.results[4]);
			}
			if (originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/5/DistForecast') != 
				changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/5/DistForecast') ||
				originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/5/ProjDOI') != 
				changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/5/ProjDOI')) {
				changedRecords.push(changedDModel.getData().results[index].ZCCP_CH_REQ_HEAD_ITEM_NAV.results[5]);
			}
			if (originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/6/DistForecast') != 
				changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/6/DistForecast') ||
				originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/6/ProjDOI') != 
				changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/6/ProjDOI')) {
				changedRecords.push(changedDModel.getData().results[index].ZCCP_CH_REQ_HEAD_ITEM_NAV.results[6]);
			}
			if (originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/7/DistForecast') != 
				changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/7/DistForecast') || 
				originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/7/ProjDOI') != 
				changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/7/ProjDOI')) {
				changedRecords.push(changedDModel.getData().results[index].ZCCP_CH_REQ_HEAD_ITEM_NAV.results[7]);
			}
			if (originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/8/DistForecast') != 
				changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/8/DistForecast') ||
				originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/8/ProjDOI') != 
				changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/8/ProjDOI')) {
				changedRecords.push(changedDModel.getData().results[index].ZCCP_CH_REQ_HEAD_ITEM_NAV.results[8]);
			}
		}
		return changedRecords;
	},

	/***
	 * This method will return the displayed custom controls on the screen
	 * @returns {Array}
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

	/***
	 * Navigation to desired page method by using RowRepeater's goToPage method.
	 * @param oEvent
	 */
	_navigate: function(oEvent) {
		var rp = this.byId("rowRepeaterId");
		var page = oEvent.mParameters.targetPage;
		rp.gotoPage(oEvent.mParameters.targetPage);
		if (oEvent.getSource().getId().split('--')[1] == 'paginatorId') {
			this.byId("paginatorIdCl").setCurrentPage(parseInt(page));
		} else {
			this.byId("paginatorId").setCurrentPage(parseInt(page));
		}
		/*var list = this._getVisibleRows();
		if (this.byId('expandCollapseLinkId').getProperty('text').indexOf(MCAPP.getText('GBL_EXPAND_ALL', this)) >= 0) {
			for (var i = 0; i < list.length; i++) {
				list[i].collapse();
			}
		}else{
			for (var i = 0; i < list.length; i++) {
				list[i].expand();
			}
		}*/
	},
	
	/***
	 * Event Handler for Save Button. Changes will be saved to backend in case of any change.
	 * _dataSaveSuccess and _dataSaveFail are call back functions on success or failure
	 * @param oEvent
	 */
	onPressSave: function(oEvent) {
		var that = this;
		var data = {};
		if (oEvent.mParameters.data) {
			data = oEvent.mParameters.data;
			data.thisContext = this;
		} else {
			data.thisContext = this;
		}
		MCAPP.setBusy(true);
		var changedRecords = this._getChangedRecords();
		if (changedRecords.length <= 0) {
			MCAPP.setBusy(false);
			return;
		}

		var CREATE_STATUS_CODE = "01";
		//change the status code 
		for (var i = 0; i < changedRecords.length; i++) {
			if(changedRecords[i].Status_Code != "03"){
				changedRecords[i].Status_Code = CREATE_STATUS_CODE;
			}
		}
		//var currView = MCAPP.getCurrentView();
		//var oDataModel = currView.data('oDataModel');
		var oDataModel = new sap.ui.model.odata.ODataModel(MCAPP.getServiceUrl(MCAPP.getComponent().getModel('service').getProperty('/ChangeRequestSaveService')));
		var dummyHeader = {};
		//dummyHeader.Processed_Flag = "X";
		dummyHeader.ZCCP_CH_REQ_HEAD_ITEM_NAV = {};
		dummyHeader.ZCCP_CH_REQ_HEAD_ITEM_NAV.results = changedRecords;
		oDataModel.create('/ZCCP_CH_REQ_HEADSet', dummyHeader, null, function(oData, response) {
			that._dataSaveSuccess(oData, response, data);
		}, function(oError) {
			that._dataSaveFail(oError, data);
		});
	},

	/***
	 * Called upon successful save at backend. This method will update the backup model as well.
	 * call any callback method(fnNavigate) in case of navigation with out save
	 * @param oData
	 * @param response
	 * @param data
	 */
	_dataSaveSuccess: function(oData, response, data) {
		var changedData = JSON.parse(JSON.stringify(data.thisContext.getView().getModel().getData()));
		data.thisContext.getView().getModel('backup').setData(changedData);
		MCAPP.clearDirtyFlag();
		MCAPP.setBusy(false);
		if ((data.customSaveFlag === true) && data.fnNavigate && data.navigationData) {
			data.fnNavigate.apply(data.fnErrorContext, [data.navigationData]);
		}
		sap.m.MessageToast.show(MCAPP.getText('GBL_DATA_SAVE_MSG', this), {
			duration: MCAPP.getAppConfigAsInt('MsgToastDurationOnNavigation')
		});
	},

	/***
	 * called upon save failure. This will display the error message to User in case of failure.
	 * call any callback method(fnCall) in case of navigation with out save
	 * @param oError
	 * @param data
	 */
	_dataSaveFail: function(oError, data) {
		MCAPP.setBusy(false);
		if ((data.customSaveFlag === true) && data.fnCall) {
			data.fnCall.apply(data.thisContext);
		}
		sap.ui.commons.MessageBox.show(MCAPP.getText('GBL_DATA_SAVE_ERROR', data.thisContext), sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', data.thisContext), [sap.ui.commons.MessageBox.Action.OK]);
	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * This method removes the loading image and updates the header and menu selection
	 * @memberOf order.Order
	 */
	onAfterRendering: function() {
		MCAPP.setBusy(false);
		// Removing Onloading Image and show the Application
		jQuery.sap.byId('ApploadingDivId').hide();
		jQuery.sap.byId('content').show();
		//Update the Header for this view
		MCAPP.updateHeader(this);
		MCAPP.menuSelection(this);
		MCAPP.updateSegmentedButton(MCAPP.getDistributorType(), false);
	},
	/***
	 * Event Handler for Cancel Button. Will display a confirmation message box to user whether he wants to revert his changes.
	 * _callbackCancel is the call back method upon confirmation
	 */
	onPressCancel: function() {
		var that = this;
		if (MCAPP.getDirtyFlag()) {
			sap.ui.commons.MessageBox.confirm(MCAPP.getText('GBL_CANCEL_CONFIRM', this), function(bResult) {
				that._callbackCancel(bResult);
			}, MCAPP.getText('GBL_CONFIRM', this)).addStyleClass('McCustomDialog');
		}
	},

	/***
	 * Call back method to cancel the changes.
	 * This will identify the changed record from original model and replace the record from backup model.
	 * and clear the application level dirty flag
	 * @param bResult
	 */
	_callbackCancel: function(bResult) {
		if (bResult) {
			var rows = this._getVisibleRows();
			for (var i = 0; i < rows.length; i++) {
				if (rows[i].getDirtyState()) {
					var index = this.getView().getModel('backup').getProperty(rows[i].getBindingContext().sPath + '/index');
					this._revertChanges(index);
					rows[i].setDirtyState(false);
				}
			}
			MCAPP.clearDirtyFlag();
		}
	},

	/***
	 * revert the changes in the model based on the index. This will get the order qty, proj DOI and Dist Forecast one by one from back up model
	 * and copy the same values in original model.
	 * @param index
	 */
	_revertChanges: function(index) {
		var backupModel = this.getView().getModel('backup');
		var backupObj = this._getObjectByIndex(backupModel, index);
		var changedModel = this.getView().getModel();
		var changedObj = this._getObjectByIndex(changedModel, index);
		//Now Copy One by One
		changedObj.ZCCP_CH_REQ_HEAD_ITEM_NAV.results[2].Change_Req_Qty = backupObj.ZCCP_CH_REQ_HEAD_ITEM_NAV.results[2].Change_Req_Qty;
		for (var i = 0; i <= 8; i++) {
			changedObj.ZCCP_CH_REQ_HEAD_ITEM_NAV.results[i].ProjDOI = backupObj.ZCCP_CH_REQ_HEAD_ITEM_NAV.results[i].ProjDOI;
			if (i >= 2) {
				changedObj.ZCCP_CH_REQ_HEAD_ITEM_NAV.results[i].DistForecast = backupObj.ZCCP_CH_REQ_HEAD_ITEM_NAV.results[i].DistForecast;
			}
		}
		changedModel.refresh();
	},

	/**
	 * Method to get the object based on Index
	 * @param model
	 * @param index
	 * @returns
	 */
	_getObjectByIndex: function(model, index) {
		var records = model.getData().results;
		for (var i = 0; i < records.length; i++) {
			if (records[i].index == index) {
				return records[i];
			}
		}
	},

	/***
	 * Event Handler for Expand All/ Collapse All option. If clicked event is Expand, get all the OrderItemTable controls from RowRepeater
	 * and Call expand function on each row.
	 * Else
	 * get all the OrderItemTable controls from RowRepeater and call collapse function on each row.
	 * @param evt
	 */
	onPressExpandCollapseAll: function() {
		var list = this._getVisibleRows();
		if (this.byId('expandCollapseLinkId').getProperty('text').indexOf(MCAPP.getText('GBL_EXPAND_ALL', this)) >= 0) {
			for (var i = 0; i < list.length; i++) {
				list[i].expand();
			}
			this.byId('expandCollapseLinkId').setProperty('text', MCAPP.getText('GBL_COLLAPSE_ALL', this));
			this.byId('expandCollapseLinkIdCl').setProperty('text', MCAPP.getText('GBL_COLLAPSE_ALL', this));
		} else {
			for (var j = 0; j < list.length; j++) {
				list[j].collapse();
			}
			this.byId('expandCollapseLinkId').setProperty('text', MCAPP.getText('GBL_EXPAND_ALL', this));
			this.byId('expandCollapseLinkIdCl').setProperty('text', MCAPP.getText('GBL_EXPAND_ALL', this));
		}
	},

	/***
	 * Event Handler for expand option
	 * Logic: get All the rows check all rows are expanded, if you change the links to 'Collapse All'
	 * @param oEvent
	 */
	onExpandRow: function(oEvent) {
		var list = this._getVisibleRows();
		var flag = false;
		for (var i = 0; i < list.length; i++) {
			if (!list[i].getExpand()) {
				flag = true;
				break;
			}
		}
		if (!flag) {
			this.byId('expandCollapseLinkId').setProperty('text', MCAPP.getText('GBL_COLLAPSE_ALL', this));
			this.byId('expandCollapseLinkIdCl').setProperty('text', MCAPP.getText('GBL_COLLAPSE_ALL', this));
		}
	},

	/***
	 * Event Handler for Collapse option
	 * Change the links to 'Expand All'
	 * @param oEvent
	 */
	onCollapseRow: function(oEvent) {
		this.byId('expandCollapseLinkId').setProperty('text', MCAPP.getText('GBL_EXPAND_ALL', this));
		this.byId('expandCollapseLinkIdCl').setProperty('text', MCAPP.getText('GBL_EXPAND_ALL', this));
	},

	/***
	 * Event Handler for link press on custom Control.
	 * If user press the SKU link, navigate to Inventory Page.
	 * @param oEvent
	 */
	onPressSkuLink: function(oEvent) {
	       // MCAPP.navigateTo("Inventory", {}, this, false, null);
	    	var oRowObject = this.getView().getModel().getProperty(oEvent.getSource().getBindingContext().sPath);
	    	var oDistSkuValue = oRowObject.Dist_SKU;
	    	var oSkuValue = oRowObject.SKU;
	    	var oSkuDescription = oRowObject.SKU_Desc;
	    	var oShipToValue = oRowObject.ShipToId;
	    	var oSourceIdValue = oRowObject.SourceId;
	    	var oEsdTransitValue = oRowObject.EstdTransitDays;
	    	var skuArray = [];
	    	var inventorySkuIndex = oEvent.getSource().getBindingContext().sPath.split("/")[2];
	    	var oSkuDetailView = new sap.ui.view({
	            type: sap.ui.core.mvc.ViewType.JS,
	            viewName: "mc.ccp.inventory.InventoryWorkSheet",
	            viewData: [oDistSkuValue, oSkuValue, oSkuDescription, oShipToValue, oSourceIdValue, oEsdTransitValue, skuArray, inventorySkuIndex]
	        });
	    	var oCancelLink = new sap.ui.commons.Link({
	            width: "50px",
	            text: MCAPP.getText('GBL_CANCEL'),
	            tooltip: MCAPP.getText('GBL_CANCEL')
	        });
	        oCancelLink.attachPress(oSkuDetailView.getController().onPressCancel);
	        var oSaveButton = new sap.ui.commons.Button({
	            text: MCAPP.getText("GBL_SAVE"),
	            width: "60px"
	        });
	        oSaveButton.attachPress(oSkuDetailView.getController().onPressSave);
	        var oHorizontalLayout = new mc.ccp.control.McHorizontalLayout({
	            height: "100%",
	            width: "100%",
	            widths: ["50%", "50%"],
	            content: [oCancelLink, oSaveButton]
	        });
	    	var oSkuDialog = new mc.ccp.control.McDialog({
	        	dirtyDependent : true,
	            modal: true,
	            width: '91%',
	            height: '90%',
	            title: this.getView().getModel('i18n').getProperty('VW_INV_WORK_SHEET_INVE_WORK_SHEET'),
	            content: [oSkuDetailView],
	            buttons: [oHorizontalLayout],
	            closed: function(oEvent) {
	                this.destroy();
	            }
	        }).addStyleClass('invShowDialog');
	        oSkuDialog.open();
	},

	/***
	 * Event Handler for data change in the custom control. Used to set the dirtyFlag value.
	 * if any of the row is dirty set the application level dirty flag
	 * @param oEvent
	 */
	onChangeRecord: function(oEvent) {
		var dirtyState = oEvent.getParameter('dirtyState');
		if (dirtyState === true) {
			MCAPP.setDirtyFlag(dirtyState);
		}
		if (dirtyState === false) {
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

	/**
	 * Event handler when the user clicks on CR preview button.
	 * the method will navigate to  Change Request Preview screen.
	 * @param oEvent
	 */
	onPressCRPreviewButton: function() {
		// part to check if any unsaved data
		MCAPP.navigateTo("ChangeRequestPreview", {}, this, false, this._cancelCRPreviewPageNavigation);
	},

	/**
	 * helping function inside onPressCRPreviewButton function.
	 */
	_cancelCRPreviewPageNavigation: function() {
		var radiogrp = sap.ui.getCore().byId('CRRadioBut2');
		radiogrp.setSelected(true);
	},

	/**
	 * Called when the user clicks on Current order tab radio Button.
	 * @param oEvent
	 */
	onSelectOrderPage: function() {
		MCAPP.navigateTo("Empty", {}, this, false, this._cancelOrderPageNavigation);
	},

	/**
	 * helping function inside onSelectOrderPage function.
	 */
	_cancelOrderPageNavigation: function() {
		var radiogrp = sap.ui.getCore().byId('CRRadioBut2');
		radiogrp.setSelected(true);
	},

	/***
	 * Event Handler for Sort Option
	 * @param evt
	 */
	onSortColumn: function(oEvent) {
		if (MCAPP.getDirtyFlag() === true) {
			sap.ui.commons.MessageBox.alert(MCAPP.getText('GBL_SAVE_PROMP_SORT', this));
			return;
		}
		if (oEvent.getParameter('sortOrder') == sap.ui.table.SortOrder.Ascending) {
			this.byId('rowRepeaterId').triggerSort(oEvent.getParameter('column').sId + '-Asc');
		} else {
			this.byId('rowRepeaterId').triggerSort(oEvent.getParameter('column').sId + '-Dsc');
		}
	},

	/**
	 * Method to retreive json properties based on column name.
	 * @param col
	 * @returns {String}
	 */
	_getJsonColumn: function(col) {
		var result = '';
		switch (col) {
		case this.byId('distSKUColmId').getId():
			result = 'Dist_SKU';
			break;
		case this.byId('skUColmId').getId():
			result = 'SKU';
			break;
		case this.byId('skuDescColmId').getId():
			result = 'SKU_Desc';
			break;
		case this.byId('salesOrdNoColmId').getId():
			result = 'Sales_Ord_No';
			break;
		case this.byId('customPoColmId').getId():
			result = 'Custom_PO';
			break;
		case this.byId('shipToColmId').getId():
			result = 'ShipToId';
			break;
		case this.byId('sourceNameColmId').getId():
			result = 'SourceName';
			break;
		case this.byId('EstdTransitDaysColmId').getId():
			result = 'EstdTransitDays';
			break;
		}
		return result;
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
		var column = this._getJsonColumn(evt.getParameter('column').sId);
		var oparator = sap.ui.model.FilterOperator.EQ;
		if (column == 'SKU_Desc') {
			oparator = sap.ui.model.FilterOperator.Contains;
		}


		var rrFilters = rowRepeater.getFilters();
		rowRepeater.destroyFilters();
		var collect = [];

		if (rrFilters.length > 0) {
			var filters = rrFilters[0].getFilters();
			for (var i = 0; i < filters.length; i++) {
				if (filters[i].sPath != evt.getParameter('column').getFilterProperty()) {
					collect.push(filters[i]);
				}
			}
			if (filterValue !== '') {
				var newFilter = new sap.ui.model.Filter(column, oparator, filterValue);
				collect.push(newFilter);
			}
			var oFilter2 = new sap.ui.commons.RowRepeaterFilter("rrFilter", {
				filters: collect
			});
			rowRepeater.addFilter(oFilter2);
			rowRepeater.applyFilter("rrFilter");
		} else {
			if (filterValue !== '') {
				var oFilter = new sap.ui.commons.RowRepeaterFilter("rrFilter", {
					filters: [new sap.ui.model.Filter(column, oparator, filterValue)]
				});
				rowRepeater.addFilter(oFilter);
				rowRepeater.applyFilter("rrFilter");
			}
		}
		var combo = this.byId("comboBoxId");
		var rp = this.byId("rowRepeaterId");
		rp.setNumberOfRows(parseInt(combo.getSelectedKey()));
		rp.gotoPage(1);
		dataLength = rowRepeater._getRowCount();
		var oPerPage = combo.getSelectedKey();
		var noOfPage = Math.floor(dataLength / oPerPage);
		var oRemainPage = dataLength % oPerPage;
		if (oRemainPage > 0) {
			noOfPage = noOfPage + 1;
		}
		var oPaginatory = this.byId("paginatorId");
		oPaginatory.setNumberOfPages(parseInt(noOfPage));
		oPaginatory.setCurrentPage(1);
		oPaginatory = this.byId("paginatorIdCl");
		oPaginatory.setNumberOfPages(parseInt(noOfPage));
		oPaginatory.setCurrentPage(1);
		MCAPP.setBusy(false);
	}
});