/***
 * @Author DS05
 * @Date 10/13/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is ChangeRequestPreview controller
 */
sap.ui.controller("mc.ccp.changereq.ChangeRequestPreview", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf changereq.ChangeRequestPreview
	 */
	onInit: function() {
		//call for reason codes
//		var oDataModelReason = new sap.ui.model.odata.ODataModel(MCAPP.getServiceUrl(MCAPP.getComponent().getModel('service').getProperty('/CRReasonsService')));
		var oDataModel = new sap.ui.model.json.JSONModel();
        this.getView().data('oDataModel', oDataModel);
        var thisContext = this;
        oDataModel.attachRequestCompleted(thisContext._dataLoadSuccessReasons,this);
        oDataModel.loadData("json/CRReasonsService.json",{},false);

//		this.getView().data('oDataModel', oDataModelReason);
		thisContext = this;
		oFilterValue = ""; //declared to hold the filter value for the table so that it would help during initial load/reload
		/*oDataModelReason.read('ZCCP_CH_REQ_REAS_SET', null, {
			"$format": "json",
		}, false, function(oData, oResponse) {
			thisContext._dataLoadSuccessReasons(oData, oResponse);
		}, function(oError) {
			MCAPP.dataReadFail(oError, this);
		});*/
		// Get the Service MetaData File
//		var oDataModel = new sap.ui.model.odata.ODataModel(MCAPP.getServiceUrl(MCAPP.getComponent().getModel('service').getProperty('/CRPreviewDetailService')));
		var oDataModel = new sap.ui.model.json.JSONModel();
        this.getView().data('oDataModel', oDataModel);
        var thisContext = this;
        oDataModel.attachRequestCompleted(thisContext._dataLoadSuccess,this);
        oDataModel.loadData("json/CRPreviewDetailService.json",{},false);
		var thisContext = this;
		// read the model for view data
		/*oDataModel.read("ZCCP_CH_REQ_HEAD_DUMMY_SET(Sales_Ord_No='123456',Change_Req_No='12012')", null, {
			"$expand": "ZCCP_CH_REQ_HEAD_NAV",
			"$format": "json",
			"$filter": MCAPP.getFilterForCRPreviewScreen(),
		}, false, function(oData, oResponse) {
			thisContext._dataLoadSuccess(oData, oResponse);
		}, function(oError) {
			MCAPP.dataReadFail(oError, this);
		});*/
		 var dataLength = thisContext.getView().getModel().getData().results.length;
	        if(dataLength == 0){
	        	thisContext.byId("idComboPaginatorRow").setVisible(false);
	        	thisContext.byId("idComboPaginatorRowBottom").setVisible(false);
	        }else{
	        	thisContext.byId("totalTxtId").setText(MCAPP.getText('GBL_TOTAL_OF', this) + ' ' + dataLength);
	        	thisContext.byId("totalTxtIdBottom").setText(MCAPP.getText('GBL_TOTAL_OF', this) + ' ' + dataLength);
	        	thisContext.byId("perPage").setText(MCAPP.getText('GBL_PER_PAGE'));
	        	thisContext.byId("perPageBottom").setText(MCAPP.getText('GBL_PER_PAGE'));
	            //set the initial page control values i.e, paginator, rowrepeater etc
	        	thisContext.onChangeDropdown();
	        }
	},

	/**
	 * _dataLoadSuccess is used to set the model to the view.
	 * @memberOf changereq.ChangeRequestPreview
	 * @param data
	 * @param oResponse
	 */
	_dataLoadSuccess: function(evt) {
		var readOnly = this.getReadOnlyFlag();
		//Add State related properties (expand, dirty)
		var obj =  evt.getSource().getData();
		var oData = {};
		oData.results = obj.d.ZCCP_CH_REQ_HEAD_NAV.results;
		$.each(oData.results, function(i, item) {
			item.index = i + 1;
			item.dirtyState = false;
			item.readOnly = !readOnly;
		});        
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData(oData);
		this.getView().setModel(oModel);
		//Get Copy of Original Data
		var oCopyOfData = JSON.parse(JSON.stringify(oData));
		var oModelBackup = new sap.ui.model.json.JSONModel();
		oModelBackup.setData(oCopyOfData);
		this.getView().setModel(oModelBackup, "backup");
		MCAPP.updateBreadcrumb(true);
	},

	/**
	 * _dataLoadSuccessReasons is used to set the reason model to the view.
	 * @memberOf changereq.ChangeRequestPreview
	 * @param data
	 * @param oResponse
	 */
	_dataLoadSuccessReasons: function(evt) {
		//Add State related properties (expand, dirty)
		var obj =  evt.getSource().getData();
		var oData = {};
		oData.results = obj.d.results;
		var object = {
				Reason_Code: "Select",
				Reason_Text: "Select"
		};
		oData.results.push(object);
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData(oData);
		this.getView().setModel(oModel, "reasonsModel");
		//Get Copy of Original Data
		var oCopyOfData = JSON.parse(JSON.stringify(oData));
		var oModelBackup = new sap.ui.model.json.JSONModel();
		oModelBackup.setData(oCopyOfData);
		this.getView().setModel(oModelBackup, "backupReasons");
		MCAPP.updateSegmentedButton(MCAPP.getDistributorType(), false);
	},

	/**
	 * onChangeDropdown is used to set the rows per page.
	 * @memberOf changereq.ChangeRequestPreview
	 * @param oEvent
	 */
	onChangeDropdown: function(oEvent) {
		var oComboBox = "";
		var valBeforeChange = "";
		var dataLength = "";
		var oTable = this.byId("CRPreviewTable");
		if (oEvent === undefined) { //This will work when page is getting loaded
			oComboBox = this.byId("comboBoxIdCrPreview");
		}
		else { // This will work when the combo value will be changed
			oComboBox = this.byId(oEvent.getSource().getId());
			oTable.setFirstVisibleRow(0);
		}
		var oPerPage = oComboBox.getSelectedKey();
		if (oComboBox.sId.indexOf("comboBoxIdCrPreview") > 0 && oComboBox.sId.indexOf("Bottom") <= -1) {
			if (MCAPP.getDirtyFlag() === true) {
				MCAPP.setBusy(true);
				valBeforeChange = this.byId("comboBoxIdCrPreviewBottom").getSelectedKey();
				this.byId("comboBoxIdCrPreview").setSelectedKey(parseInt(valBeforeChange));
				sap.ui.commons.MessageBox.alert(MCAPP.getText('GBL_SAVE_PROMP_DD', this));
				MCAPP.setBusy(false);
				return;
			}
			else this.byId("comboBoxIdCrPreviewBottom").setValue(parseInt(oPerPage));
		}
		else if (oComboBox.sId.indexOf("comboBoxIdCrPreviewBottom") > 0) {
			if (MCAPP.getDirtyFlag() === true) {
				MCAPP.setBusy(true);
				valBeforeChange = this.byId("comboBoxIdCrPreview").getSelectedKey();
				this.byId("comboBoxIdCrPreviewBottom").setSelectedKey(parseInt(valBeforeChange));
				sap.ui.commons.MessageBox.alert(MCAPP.getText('GBL_SAVE_PROMP_DD', this));
				MCAPP.setBusy(false);
				return;
			}
			else this.byId("comboBoxIdCrPreview").setValue(parseInt(oPerPage));
		}
		oTable.setVisibleRowCount(parseInt(oPerPage));
		if (oFilterValue !== "") {
			dataLength = oTable.getBinding("rows").iLength;
		}
		else {
			dataLength = this.getView().getModel().getData().results.length;
		}
		// setting the visible rows of table
		if(dataLength !== 0){
			if(oPerPage > dataLength){
				oTable.setVisibleRowCount(parseInt(dataLength));
			}else{
				oTable.setVisibleRowCount(parseInt(oPerPage));
			}
		}

		this._calculateNumOfPage(oComboBox, dataLength, this);
		oTable.rerender();
	},

	/**
	 * onChangeUpdateModelForReason is used to update the respective oData model with the new selected value
	 * when change is made in reason combo box.
	 * @memberOf changereq.ChangeRequestPreview
	 */
	onChangeUpdateModelForReason: function(oEvent) {
		var oModel = this.getView().getModel();
		var backUpModel = this.getView().getModel("backup");
		var reasonText = oEvent.oSource.mProperties.value;
		var selectedRow = oEvent.getSource().getParent();
		var sPath = selectedRow.getAggregation("cells")[9].getBindingContext().getPath();
		var index = (sPath).split("/")[2]; 
		if (reasonText == "Select") 
			reasonText = "";
		var reasonCode = this._getReasonCode(reasonText);
		if (reasonText != backUpModel.getProperty(selectedRow.getAggregation("cells")[9].getBindingContext().getPath() + '/Reason_Text')) {
			oModel.getData().results[index].Reason_Text = reasonText;
			oModel.getData().results[index].Reason_Code = reasonCode;
			var dirtyStateFlag = this._getDirtyStateFlag(index);
			oModel.getData().results[index].dirtyState = dirtyStateFlag;
		}
		else {
			oModel.getData().results[index].Reason_Text = reasonText;
			oModel.getData().results[index].Reason_Code = reasonCode;
			var dirtyStateFlag = this._getDirtyStateFlag(index);
			oModel.getData().results[index].dirtyState = dirtyStateFlag;
		}
		this._checkDirtyFlag(sPath);
	},

	/**
	 * _getReasonCode is used with in the onChangeUpdateModelForReason method.
	 * purpose is to get the reasonCode for the selected reason from comboBox.
	 * @memberOf changereq.ChangeRequestPreview
	 * @param reasonText
	 */
	_getReasonCode: function(reasonText) {
		var reasonModel = this.getView().getModel("backupReasons").getData();
		var reasonCode = "";
		for (var i = 0; i < reasonModel.results.length; i++) {
			if (reasonModel.results[i].Reason_Text == reasonText) {
				reasonCode = reasonModel.results[i].Reason_Code;
				break;
			}
		}
		return reasonCode;
	},

	/**
	 * onChangeValidateQty is used to validate the CR quantity entered by the user. It should be numeric and non zero.
	 * @memberOf changereq.ChangeRequestPreview
	 * @param oEvent
	 */
	onChangeValidateQty: function(oEvent) {
		var that = this;
		var qty = oEvent.getParameter("changed");
		var sPath = oEvent.oSource.oBindingContexts.undefined.sPath;
		var backUpModel = this.getView().getModel("backup");
		var originalModel = this.getView().getModel();
		var index = sPath.split("/")[2];
		if (qty === 0) {
			sap.ui.commons.MessageBox.show(MCAPP.getText('VW_CR_PRW_QTY_ERROR1', that), sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', that), [sap.ui.commons.MessageBox.Action.OK]);
			var oldQty = backUpModel.getData().results[index].Change_Req_Qty;
			originalModel.getData().results[index].Change_Req_Qty = oldQty;
			oEvent.getSource().setProperty("value", oldQty);
			var dirtyStateFlag = this._getDirtyStateFlag(index);
			originalModel.getData().results[index].dirtyState = dirtyStateFlag;
			this._checkDirtyFlag(sPath);
			return;
		}
		else {
			var dirtyStateFlag = this._getDirtyStateFlag(index);
				originalModel.getData().results[index].dirtyState = dirtyStateFlag;
			this._checkDirtyFlag(sPath);
		}
	},
	
	/**
	 * _getDirtyStateFlag is used to check the dirtyState of current row. 
	 * @memberOf changereq.ChangeRequestPreview
	 * @param index
	 */
	_getDirtyStateFlag : function(index){
		var backUpModel = this.getView().getModel("backup");
		var originalModel = this.getView().getModel();
		if(originalModel.getData().results[index].Change_Req_Qty !== backUpModel.getData().results[index].Change_Req_Qty ||
				originalModel.getData().results[index].Reason_Text !== backUpModel.getData().results[index].Reason_Text || 
				originalModel.getData().results[index].Dist_Comment_Text !== backUpModel.getData().results[index].Dist_Comment_Text){
			return true;
		} else {
			return false;
		}
	},
	
	/**
	 * _checkDirtyFlag is used to check the dirtyState of each row. if dirtyState is true, dirtyFlag will be set to true.
	 * @memberOf changereq.ChangeRequestPreview
	 * @param sPath
	 */
	_checkDirtyFlag: function(sPath) {
		var oTable = this.byId("CRPreviewTable");
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
	 * @memberOf changereq.ChangeRequestPreview
	 * @param oEvent
	 */
	onPageSaveAndNavigate: function(oEvent) {
		MCAPP.setBusy(true);
		var currentPage = parseInt(oEvent.mParameters.targetPage);
		var srcPage = parseInt(oEvent.mParameters.srcPage);
		var id = oEvent.getSource().getId();
		var that = this;
		var source = oEvent.getSource();
		var changedRecords = this._getChangedRecords("",srcPage);
		if (changedRecords[0].length <= 0) {
			MCAPP.setBusy(false);
			this._navigate(currentPage, srcPage, id);
			return;
		}
		else {
			this._removeFlagFromChangedRecords(changedRecords[0]);
			var oDataModel = this.getView().data('oDataModel');
			var dummyHeader = {};
			dummyHeader.ZCCP_CH_REQ_HEAD_NAV = changedRecords[0];
			oDataModel.create('/ZCCP_CH_REQ_HEAD_DUMMY_SET', dummyHeader, null, function(data) {
				var changedData = JSON.parse(JSON.stringify(that.getView().getModel().getData()));
				that.getView().getModel('backup').setData(changedData);
				MCAPP.clearDirtyFlag();
				MCAPP.setBusy(false);
				that._navigate(currentPage, srcPage, id);
				sap.m.MessageToast.show(MCAPP.getText('GBL_DATA_SAVE_MSG', this), {
					duration: MCAPP.getAppConfigAsInt('MsgToastDurationOnNavigation')
				});
			}, function(data) {
				source.setCurrentPage(srcPage);
				MCAPP.setBusy(false);
				that._displyDataSaveError(data, this);
			});
			MCAPP.setBusy(false);
		}
	},

	/**
	 * _openSaveConfirmationDialog is used to open the Save Confirmation Dialog box.
	 * @memberOf changereq.ChangeRequestPreview
	 * @param changedRecords
	 * @param currentPage
	 * @param srcPage
	 * @param id
	 * @param source
	 * @param sourceLink
	 */
	_openSaveConfirmationDialog: function(changedRecords, currentPage, srcPage, id, source, sourceLink) {
		var dataArray = [changedRecords, currentPage, srcPage, id, source, sourceLink];
		var oTextView = new sap.ui.commons.TextView({
			text: MCAPP.getText('VW_CR_PRW_SAVE_TXT', this),
		});
		var oCancelButton = new sap.ui.commons.Button({
			text: this.getView().getModel('i18n').getProperty('GBL_CANCEL'),
			width: "90px",
			height: '30px'
		});
		oCancelButton.attachPress(this.getView().getController()._onPressCloseSaveDialog, this.getView().getController());
		var oSaveButton = new sap.ui.commons.Button({
			text: this.getView().getModel('i18n').getProperty('VW_CR_PRW_SAVE_AND_GO_BTN'),
			width: "90px",
			height: '30px'
		});
		oSaveButton.attachPress(this.getView().getController()._onPressPerformSaveAndNavigate, this.getView().getController());
		var oDoNotSaveButton = new sap.ui.commons.Button({
			text: this.getView().getModel('i18n').getProperty('VW_CR_PRW_DONOTSAVE_BTN'),
			width: "100px",
			height: '30px'
		});
		oDoNotSaveButton.attachPress(this.getView().getController()._onPressNavigateWithoutSave, this.getView().getController());
		var oSaveConfirmationDialog = new mc.ccp.control.McDialog(this.createId("saveConfirmationDialog"), {
			preventEscape : true,
			modal: true,
			width: '30%',
			height: '35%',
			title: this.getView().getModel('i18n').getProperty('GBL_SAVE_PROMT'),
			content: [oTextView],
			buttons: [oCancelButton, oDoNotSaveButton, oSaveButton],
			closed: function() {
				MCAPP.setBusy(false); 
				this.destroy();
			}
		});
		oSaveConfirmationDialog.attachCloseClicked(function(oEvent) {
			oEvent.getSource().close();
			MCAPP.setBusy(false);
		});
		oSaveConfirmationDialog.addStyleClass('McCcpCustomDialog');
		oSaveConfirmationDialog.data("navigationData", dataArray);
		oSaveConfirmationDialog.open();
	},

	/**
	 * _onPressPerformSaveAndNavigate is used to save the changes to the backend and navigate to desired page accordingly.
	 * @memberOf changereq.ChangeRequestPreview
	 * @param oEvent
	 */
	_onPressPerformSaveAndNavigate: function(oEvent) {
		var oDialog = this.byId("saveConfirmationDialog");
		var oData = oDialog.data("navigationData");
		if (oData[5] == "modifySKU") {
			oEvent.getSource().getParent().close();
			MCAPP.clearDirtyFlag();
			MCAPP.setBusy(false);
			this._removeFlagFromChangedRecords(oData[0]);
			this._genericSave(oData[0], this._dataSaveSuccess, this._dataSaveFail, oData[1], oData[2], "");
			this._goToChangeReqPage(oEvent);
		}
	},

	/**
	 * _onPressCloseSaveDialog is used to close the Save Confirmation Dialog box.
	 * @memberOf changereq.ChangeRequestPreview
	 * @param oEvent
	 */
	_onPressCloseSaveDialog: function(oEvent) {
		oEvent.getSource().getParent().close();
		MCAPP.setBusy(false);
	},

	/**
	 * _onPressNavigateWithoutSave is used to navigate to next or previous page without saving the changes.
	 * @memberOf changereq.ChangeRequestPreview
	 * @param oEvent
	 */
	_onPressNavigateWithoutSave: function(oEvent) {
		var oDialog = this.byId("saveConfirmationDialog");
		var oData = oDialog.data("navigationData");
		oEvent.getSource().getParent().close();
		MCAPP.clearDirtyFlag();
		if (oData[5] == "modifySKU") {
			MCAPP.setBusy(false);
			this._goToChangeReqPage(oData[2]);
			MCAPP.setBusy(false);
		}
	},

	/**
	 * _revertChanges is used to revert all the changes to the original model. called when user clicks on Do Not Save and Go button
	 * @memberOf changereq.ChangeRequestPreview
	 * @param thisContext
	 */
	_revertChanges: function(thisContext) {
		var oModel = thisContext.getView().getModel();
		var oBackUpModel = thisContext.getView().getModel('backup');
		var rows = this.byId("CRPreviewTable").getRows();
		for (var i = 0; i < rows.length; i++) {
			if (oBackUpModel.getProperty(rows[i].getBindingContext().sPath + '/Reason_Text') != oModel.getProperty(rows[i].getBindingContext().sPath + '/Reason_Text')) {
				oModel.getData().results[i].Reason_Text = oBackUpModel.getData().results[i].Reason_Text;
				oModel.getData().results[i].Reason_Code = oBackUpModel.getData().results[i].Reason_Code;
			}
			if (oBackUpModel.getProperty(rows[i].getBindingContext().sPath + '/Change_Req_Qty') != oModel.getProperty(rows[i].getBindingContext().sPath + '/Change_Req_Qty')) 
				oModel.getData().results[i].Change_Req_Qty = oBackUpModel.getData().results[i].Change_Req_Qty;
			if (oBackUpModel.getProperty(rows[i].getBindingContext().sPath + '/Dist_Comment_Text') != oModel.getProperty(rows[i].getBindingContext().sPath + '/Dist_Comment_Text')) 
				oModel.getData().results[i].Dist_Comment_Text = oBackUpModel.getData().results[i].Dist_Comment_Text;
			if (oBackUpModel.getProperty(rows[i].getBindingContext().sPath + '/Dist_Comment_Date') != oModel.getProperty(rows[i].getBindingContext().sPath + '/Dist_Comment_Date')) 
				oModel.getData().results[i].Dist_Comment_Date = oBackUpModel.getData().results[i].Dist_Comment_Date;
			if (oBackUpModel.getProperty(rows[i].getBindingContext().sPath + '/Dist_Comment_Time') != oModel.getProperty(rows[i].getBindingContext().sPath + '/Dist_Comment_Time')) 
				oModel.getData().results[i].Dist_Comment_Time = oBackUpModel.getData().results[i].Dist_Comment_Time;
			if (oBackUpModel.getProperty(rows[i].getBindingContext().sPath + '/Dist_Comment_User') != oModel.getProperty(rows[i].getBindingContext().sPath + '/Dist_Comment_User')) 
				oModel.getData().results[i].Dist_Comment_User = oBackUpModel.getData().results[i].Dist_Comment_User;
		}
	},

	/**
	 * _navigate is used to navigate to next or previous page as per the clicked page link of paginator. 
	 * Called inside onPageSaveAndNavigate
	 * @memberOf changereq.ChangeRequestPreview
	 * @param currentPage
	 * @param srcPage
	 * @param id
	 */
	_navigate: function(currentPage, srcPage, id) {
		var oTable = this.byId("CRPreviewTable");
		if (id.indexOf("paginatorCrPreview") > 0 && id.indexOf("Bottom") <= -1) 
			this.byId("paginatorCrPreviewBottom").setCurrentPage(currentPage);
		else 
			this.byId("paginatorCrPreview").setCurrentPage(currentPage);
		oTable._oPaginator.setCurrentPage(currentPage);
		oTable._oPaginator.firePage({
			srcPage: srcPage,
			targetPage: currentPage,
			type: 'GoTo'
		});
		oTable.rerender();
	},

	/**
	 * onPressSave will be called on click of ModifySKU link and Submit Request button. This function will save the changes to the backend.
	 * @memberOf changereq.ChangeRequestPreview
	 * @param oEvent
	 */
	onPressSave: function(oEvent) {
		var oClickedSoureId = oEvent.getSource().getId();
		MCAPP.setBusy(true);
		var changedRecords = "";
		//if Submit Request Button clicked
		if (oClickedSoureId == "idSubmitBtn") {
			changedRecords = this._getChangedRecords("SubmitCR","");
			if (changedRecords[1] !== "") { // if reason code is blank
				MCAPP.setBusy(false);
				this._showReasonError(this, changedRecords[1], "VW_CR_PRW_REASON_ERROR");
				return;
			}
			else {
				if (changedRecords[0].length <= 0) {
					MCAPP.setBusy(false);
					sap.ui.commons.MessageBox.show(MCAPP.getText('VW_CR_PRW_SUBMIT_CR_ERROR', this), sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', this), [sap.ui.commons.MessageBox.Action.OK]);
					return;
				}
				else {
					this._removeFlagFromChangedRecords(changedRecords[0]);
					this._genericSave(changedRecords[0], this._dataSaveSuccess, this._dataSaveFail, this, oEvent, "SubmitCR");
				}
			}
		}else if(oClickedSoureId == "idSKULinkPreview"){ //onClick of Modify SKU Link
			changedRecords = this._getChangedRecords("","");
			if (changedRecords[1] !== "") { // if reason code is blank
				MCAPP.setBusy(false);
				this._showReasonError(this, changedRecords[1], "VW_CR_PRW_QTY_ERROR");
				return;
			}
			else {
				if (changedRecords[0].length <= 0) {
					MCAPP.setBusy(false);
					this._goToChangeReqPage(oEvent);
					return;
				}
				else {
					this._openSaveConfirmationDialog(changedRecords[0], this, oEvent, "", "", "modifySKU");
				}
			}
		}
		else {
			// coming from Application.js navigateTo function
			changedRecords = this._getChangedRecords("","");
			this._removeFlagFromChangedRecords(changedRecords[0]);
			this._genericSave(changedRecords[0], this._dataSaveSuccess, this._dataSaveFail, this, oEvent, "");
		}
	},

	/**
	 * _removeFlagFromChangedRecords is used to delete the dirtyState, Index, expand and readOnly flags from the records which need to be saved.
	 * @memberOf changereq.ChangeRequestPreview
	 * @param changedRecords
	 */
	_removeFlagFromChangedRecords: function(changedRecords) {
		for (var i = 0; i < changedRecords.length; i++) {
			delete changedRecords[i].dirtyState;
			delete changedRecords[i].index;
			delete changedRecords[i].readOnly;
		}
	},

	/**
	 * _dataSaveSuccess will be called if save operation is successful and will be used to set the updated model to the view.
	 * @memberOf changereq.ChangeRequestPreview
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
	 * @memberOf changereq.ChangeRequestPreview
	 * @param oError
	 * @param thisContext
	 */
	_dataSaveFail: function(oError, thisContext) {
		MCAPP.setBusy(false);
		thisContext._displyDataSaveError(oError, thisContext);
	},

	/**
	 * _displyDataSaveError will be called if error occurs while performing save, remove and submit..
	 * @memberOf changereq.ChangeRequestPreview
	 * @param oError
	 * @param thisContext
	 */
	_displyDataSaveError: function(thisContext) {
		sap.ui.commons.MessageBox.show(MCAPP.getText('GBL_DATA_SAVE_ERROR', thisContext), sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', thisContext), [sap.ui.commons.MessageBox.Action.OK]);
	},

	/**
	 * _genericSave will be called in case of ModifySKU and Submit Request button click. This is used to update the backend for the new changes.
	 * @memberOf changereq.ChangeRequestPreview
	 * @param changedRecords
	 * @param successCallFn
	 * @param failCallFn
	 * @param thisContext
	 * @param sourceEvent
	 * @param sourceId
	 */
	_genericSave: function(changedRecords, successCallFn, failCallFn, thisContext, sourceEvent, sourceId) {
		var currView = MCAPP.getCurrentView();
		var oDataModel = currView.data('oDataModel');
		var dummyHeader = {};
		dummyHeader.ZCCP_CH_REQ_HEAD_NAV = changedRecords;
		oDataModel.create('/ZCCP_CH_REQ_HEAD_DUMMY_SET', dummyHeader, null, function(oData, response) {
			successCallFn(oData, response, thisContext);
			MCAPP.clearDirtyFlag();
			sap.m.MessageToast.show(MCAPP.getText('GBL_DATA_SAVE_MSG', this), {
				duration: MCAPP.getAppConfigAsInt('MsgToastDurationOnNavigation')
			});
			if (sourceId == "SubmitCR") //onClick of Submit Request Button
			{
				thisContext.openSubmitCRDialog(sourceEvent, oData);}
			else if(sourceId == "idSKULinkPreview")//onClick of ModifySKU Link
			{thisContext._goToChangeReqPage(sourceEvent);}
			else{
			}
		}, function(oError) {
			failCallFn(oError, thisContext);
		});
	},

	/**
	 * _getChangedRecords is used to prepare the array of all the changed CRs.
	 * @memberOf changereq.ChangeRequestPreview
	 * @param submitFlag
	 */
	_getChangedRecords: function(submitFlag,srcPage) {
		var response = [];
		var originalModel = this.getView().getModel('backup');
		var changedDModel = this.getView().getModel();
		var changedRecords = [];
		var sku = "";
		if (submitFlag == "SubmitCR") {
			var today = new Date();
			var systemDate = today.getFullYear() + "" + today.getMonth() + 1 + "" + today.getDate();
			var systemTime = today.getMilliseconds();
			var statusText = MCAPP.getText('VW_CR_PRW_IN_PROGRESS', this);
			for (var i = 0; i < changedDModel.getData().results.length; i++) {
				if (changedDModel.getData().results[i].Reason_Text !== "Select" && changedDModel.getData().results[i].Reason_Text !== "") {
					changedDModel.getData().results[i].CR_Submit_Date = systemDate;
					changedDModel.getData().results[i].CR_Submit_Time = systemTime;
					changedDModel.getData().results[i].Status_Text = statusText;
					changedDModel.getData().results[i].Change_Req_No = "DUMMY";
					changedDModel.getData().results[i].Status_Code = "03";
					changedRecords.push(changedDModel.getData().results[i]);
				}
				else {
					sku = changedDModel.getData().results[i].SKU;
					sku = MCAPP.getText('VW_CR_PRW_SKU_NUMBER', this) + sku;
					break;
				}
			}
		}
		else {
			var count = 0;
			var rows = this.byId("CRPreviewTable").getRows();
			var rowCount = this._getVisibleRowCount(srcPage);
			var sPath = "";
			for (var ii = 0; ii < rowCount; ii++) {
				sPath = rows[ii].getAggregation("cells")[0].getBindingContext().getPath();
				if (changedDModel.getProperty(sPath + '/Change_Req_Qty') !== "0" ) {
					if (originalModel.getProperty(sPath + '/Reason_Text') != changedDModel.getProperty(sPath + '/Reason_Text')) 
						count++;
					else if (originalModel.getProperty(sPath + '/Change_Req_Qty') != changedDModel.getProperty(sPath + '/Change_Req_Qty')) 
						count++;
					else if (originalModel.getProperty(sPath + '/Dist_Comment_Text') != changedDModel.getProperty(sPath + '/Dist_Comment_Text')) 
						count++;
					if (count > 0) {
						var index = sPath.split("/")[2];
						changedDModel.getData().results[index].Status_Code = "01";
						changedRecords.push(changedDModel.getData().results[index]);
					}
					count = 0;
				}
				else {
					sku = changedDModel.getData().results[ii].SKU;
					sku = MCAPP.getText('VW_CR_PRW_SKU_NUMBER', this) + sku;
					break;
				}
				
			}
		}
		response.push(changedRecords);
		response.push(sku);
		return response;
	},

	/**
	 * _getRowSPath is used to caculate the sPath of the row..
	 * @memberOf changereq.ChangeRequestPreview
	 * @param skuValue
	 */
	_getRowSPath : function(skuValue){
		var oModel = this.getView().getModel().getData().results;
		var sPath = "";
		for(var i =0; i< oModel.length; i++){
			if(skuValue === oModel[i].Dist_SKU){
				sPath = "/results/"+ i ;
				return sPath;
			}
		}
	},

	/**
	 * _getVisibleRowCount is used to get the current rows count for the selected page.
	 * @memberOf changereq.ChangeRequestPreview
	 * @param submitFlag
	 */
	_getVisibleRowCount : function(srcPage){
		var totalNoOfRecords = this.getView().getModel().getData().results.length;
		var rowsPerPage = this.byId("comboBoxIdCrPreview").getSelectedKey();
		var count = 0;
		if(srcPage > 1 ){//src page is existing page
			count = parseInt(totalNoOfRecords) -(parseInt(rowsPerPage)*parseInt(srcPage-1));
			if(count > rowsPerPage){
				count = rowsPerPage;
			}
		}else{
			if(rowsPerPage > totalNoOfRecords){
				count = parseInt(totalNoOfRecords);
			}else{
				count = parseInt(rowsPerPage);
			}

		}
		return count;
	},

	/**
	 * _showReasonError is used display the error while performing save and submit. This will come when no reason is selected on CR Preview screen.
	 * @memberOf changereq.ChangeRequestPreview
	 * @param that
	 * @param oRowIndex
	 */
	_showReasonError: function(that, oRowIndex, error) {
		sap.ui.commons.MessageBox.show(MCAPP.getText(error, that) + oRowIndex, sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', that), [sap.ui.commons.MessageBox.Action.OK]);
	},

	/**
	 * onPressRemoveLineItem is used to delete the selected row from CR Preview Table.
	 * @memberOf changereq.ChangeRequestPreview
	 * @param oEvent
	 */
	onPressRemoveLineItem: function(oEvent) {

		MCAPP.setBusy(true);
		var thisContext = this;        
		var currView = MCAPP.getCurrentView();

		var oRowIndex = oEvent.getSource().mAggregations.customData[0].oPropagatedProperties.oBindingContexts.undefined.sPath;
		oRowIndex = oRowIndex.split("/");
		oRowIndex = oRowIndex[2];

		var oDataModel = currView.data('oDataModel');
		record = oEvent.getSource().getParent().getBindingContext().getObject();
		sap.ui.commons.MessageBox.show(MCAPP.getText('VW_CR_PRW_DELETE_ROW_TXT', thisContext), sap.ui.commons.MessageBox.Icon.CONFIRMATION, MCAPP.getText('GBL_CONFIRM', thisContext), [sap.ui.commons.MessageBox.Action.YES, sap.ui.commons.MessageBox.Action.NO], function(action) {
			if (action == "YES") {
				var DELETE_STATUS_CODE = "02"; 
				delete record.dirtyState;
				delete record.index;
				delete record.readOnly;
				record.Status_Code = DELETE_STATUS_CODE;                
				var changedRecords = [record];            	
				var dummyHeader = {};
				dummyHeader.ZCCP_CH_REQ_HEAD_NAV = changedRecords;
				oDataModel.create('/ZCCP_CH_REQ_HEAD_DUMMY_SET', dummyHeader, null,
						function(data, response) {
					MCAPP.setBusy(false);
					if (response.statusCode == "201") 
						thisContext._deleteSelectedRow(thisContext, oRowIndex);
				}, function(error) {
					MCAPP.setBusy(false);
					thisContext._displyDataSaveError(error, thisContext);
				});
			}
			else {
				MCAPP.setBusy(false);
			}
		});
	},

	/**
	 * _deleteSelectedRow is used to delete the selected row from UI.
	 * @memberOf changereq.ChangeRequestPreview
	 * @param thisContext
	 * @param oRowIndex
	 */
	_deleteSelectedRow: function(thisContext, oRowIndex) {
		var oOrignalModel = thisContext.getView().getModel();
		var oComboBox = this.byId("comboBoxIdCrPreview");
		this._calculateNumOfPage(oComboBox, oOrignalModel.getData().results.length - 1, thisContext);
		var backUpModel = thisContext.getView().getModel('backup').getData();
		oOrignalModel.getData().results.splice(oRowIndex, 1);
		backUpModel.results.splice(oRowIndex, 1);
		MCAPP.clearDirtyFlag();
		oOrignalModel.refresh();
		var oTable =  thisContext.byId("CRPreviewTable");
		var oLength = oOrignalModel.getData().results.length;
		var countPerPage = parseInt(oComboBox.getSelectedKey());
		if ( oLength === 0 ){
			oTable.setVisibleRowCount(2);
		} else if ( oLength > countPerPage) {
			oTable.setVisibleRowCount(countPerPage);
		} else if ( countPerPage > oLength){
			oTable.setVisibleRowCount(oLength);
		} else {
			oTable.setVisibleRowCount(oLength);
		}
		oTable.rerender();
	},

	/**
	 * _calculateNumOfPage is used to caculate the total number of pages for paginator.
	 * @memberOf changereq.ChangeRequestPreview
	 * @param oComboBox
	 * @param dataLength
	 * @param thisContext
	 */
	_calculateNumOfPage: function(oComboBox, dataLength, thisContext) {
		var oPerPage = oComboBox.getSelectedKey();
		var noOfPage = Math.floor(dataLength / oPerPage);
		var remainPage = dataLength % oPerPage;
		if (remainPage > 0) 
			noOfPage = noOfPage + 1;
		MCAPP.setPaginatorTextValue(noOfPage, "paginatorCrPreview", thisContext, dataLength);
	},

	/**
	 * _goToChangeReqPage is used to navigate to CR main page.
	 * @memberOf changereq.ChangeRequestPreview
	 */
	_goToChangeReqPage: function() {
		var thisRouter = sap.ui.core.UIComponent.getRouterFor(this);
		thisRouter.navTo("ChangeRequest");
	},

	/**
	 * onPressOpenAddEditDialog is used to open the dialog box on click of Add and Edit link in the CR Preview Table.
	 * @memberOf changereq.ChangeRequestPreview
	 * @param oEvent
	 */
	onPressOpenAddEditDialog: function(oEvent) {
		var oRowIndex = oEvent.getSource().getParent().getIndex();
		var oSKU = this.getView().getModel().getData().results[oRowIndex].SKU;
		var viewData = [];
		viewData.push(oEvent.getSource().getProperty("text"));
		viewData.push(oEvent.getSource().getBindingContext());
		viewData.push(this.getView().getModel());
		viewData.push(this.getView().getModel("backup"));
		var oAddEditCmtView = new sap.ui.view({
			type: sap.ui.core.mvc.ViewType.JS,
			viewName: "mc.ccp.changereq.ChangeRequestComment",
			viewData: viewData
		});
		var oCancelButton = new sap.ui.commons.Button({
			text: this.getView().getModel('i18n').getProperty('GBL_CANCEL'),
			width: "90px",
			height: '30px'
		});
		oCancelButton.attachPress(oAddEditCmtView.getController().onPressCancelComment, oAddEditCmtView.getController());
		var oSaveButton = new sap.ui.commons.Button({
			text: this.getView().getModel('i18n').getProperty('GBL_SAVE'),
			width: "90px",
			height: '30px'
		});
		oSaveButton.attachPress(oAddEditCmtView.getController().onPressSaveComment, oAddEditCmtView.getController());
		var oAddEditCmtDialog = new mc.ccp.control.McDialog({
			dirtyDependent : true,
			modal: true,
			width: '40%',
			height: '63%',
			title: this.getView().getModel('i18n').getProperty('VW_CR_ADD_EDIT_DIALOG_TITLE') + oSKU,
			content: [oAddEditCmtView],
			buttons: [oCancelButton, oSaveButton],
			closed: function(oEvent) {
				MCAPP.setBusy(false); 
				this.destroy();
			}
		}).addStyleClass('McCcpCustomDialog');
		oAddEditCmtDialog.attachCloseClicked(oAddEditCmtView.getController().onPressCancelComment, this,  oAddEditCmtView.getController());
		oAddEditCmtDialog.open();

	},

	/**
	 * openSubmitCRDialog is used to open Change Request Submit Dialog on click on Submit Request button.
	 * @memberOf changereq.ChangeRequestPreview SubitCR
	 * @param oEvent
	 * @param response
	 */
	openSubmitCRDialog: function(oEvent, response) {
		var viewData = [];
		viewData.push(response.No_Of_SKU);
		viewData.push(response.Change_Req_No);
		viewData.push(response.CR_Submit_Date);
		var oChangeRequestConfirmationView = new sap.ui.view({
			type: sap.ui.core.mvc.ViewType.JS,
			viewName: "mc.ccp.changereq.ChangeRequestConfirmation",
			viewData: viewData
		});
		var oOKButton = new sap.ui.commons.Button({
			text: this.getView().getModel('i18n').getProperty('GBL_OK'),
			width: "90px",
			height: '30px'
		});
		oOKButton.attachPress(oChangeRequestConfirmationView.getController().onPressClose, this, oChangeRequestConfirmationView.getController()); // function name to be changed
		var oChangeRequestConfirmationViewDialog = new mc.ccp.control.McDialog({
			preventEscape : true,
			modal: true,
			width: '40%',
			height: '63%',
			title: this.getView().getModel('i18n').getProperty('VW_CR_PRW_SUBMIT_DIALOG_TITLE'),
			content: [oChangeRequestConfirmationView],
			buttons: [oOKButton],
			closed: function(oEvent) {
				MCAPP.setBusy(false); 
				this.destroy();
			}
		}).addStyleClass('McCcpCustomDialog');
		oChangeRequestConfirmationViewDialog.attachCloseClicked(oChangeRequestConfirmationView.getController().onPressClose, this,  oChangeRequestConfirmationView.getController());
		oChangeRequestConfirmationViewDialog.open();
	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf changereq.ChangeRequestPreview
	 */
	onAfterRendering: function() {
		MCAPP.setBusy(false);
		jQuery.sap.byId('ApploadingDivId').hide();
		jQuery.sap.byId('content').show();
		MCAPP.updateHeaderCRPreview(this);
		MCAPP.menuSelection(this);
		MCAPP.updateSegmentedButton(MCAPP.getDistributorType(), false);
		var isReadOnlyUser = this.getReadOnlyFlag();
		if (isReadOnlyUser === true) {
			this.byId("idDeleteCol").destroyTemplate();
		}
		
	},

	/**
	 * Called when user tries to filter the records in the CR preview table
	 * @memberOf changereq.ChangeRequestPreview
	 * @Param evt
	 */
	onFilterColumn: function(evt) {
		if (MCAPP.getDirtyFlag()) {
			sap.ui.commons.MessageBox.alert(MCAPP.getText('GBL_SAVE_PROMP_FILTER', this));
			evt.preventDefault();
			return;
		}
		else {
			var oData = this.getView().getModel().getData();
			var dataLength = "";
			var filterValue = evt.getParameter('value').trim();
			oFilterValue = filterValue;
			var oTable = this.byId('CRPreviewTable');
			var column = this._getJsonColumn(evt.getParameter('column').sId.split("--")[1]);
			var oparator = sap.ui.model.FilterOperator.EQ;
			if (column == 'SKU_Desc') {
				oparator = sap.ui.model.FilterOperator.Contains;
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
					var newFilter = new sap.ui.model.Filter(column, oparator, filterValue);
					collect.push(newFilter);
				}
				oTable.bindRows({
					path: "/results",
					filters: collect
				});
			}
			else {
				if (filterValue !== '') {
					oTable.bindRows({
						path: "/results",
						filters: [new sap.ui.model.Filter(column, oparator, filterValue)]
					});
				}
			}
			$.each(oData.results, function(i, item) {
				item.Dist_SKU = "" + item.Dist_SKU;
				item.SKU = "" + item.SKU;
				item.Sales_Ord_No = "" + item.Sales_Ord_No;
				item.ShipToId = "" + item.ShipToId;
				item.Confirmed_Qty = "" + item.Confirmed_Qty;
				item.Change_Req_Qty = "" + item.Change_Req_Qty;
			});
			var oComboBox = this.byId("comboBoxIdCrPreview");
			oTable.setFirstVisibleRow(0);
			if (filterValue !== "") {
				dataLength = oTable.getBinding("rows").iLength;
			}
			else {
				dataLength = this.getView().getModel().getData().results.length;
			}
			this._calculateNumOfPage(oComboBox, dataLength, this);
			oTable.rerender();
			MCAPP.setBusy(false);
		}
	},

	/**
	 *  method to retrive json properties based on column name
	 * @param col
	 * @returns {String}
	 */
	_getJsonColumn: function(col) {
		var result = '';
		switch (col) {
		case 'idDistSKUCol' :
			result = 'Dist_SKU';
			break;
		case 'idSKUCol':
			result = 'SKU';
			break;
		case 'idDescCol':
			result = 'SKU_Desc';
			break;
		case 'idSOCol':
			result = 'Sales_Ord_No';
			break;
		case 'idCustomPOCol':
			result = 'Custom_PO';
			break;
		case 'idShipToCol':
			result = 'ShipToId';
			break;
		case 'idSourceCol':
			result = 'SourceName';
			break;
		case 'idConfirmedCol':
			result = 'Confirmed_Qty';
			break;
		case 'idCRQtyCol':
			result = 'Change_Req_Qty';
			break;
		}
		return result;
	},

	/***
	 * Event Handler for Sort Option
	 * @param evt
	 */
	onSortColumn: function(evt) {
		if (MCAPP.getDirtyFlag()) {
			sap.ui.commons.MessageBox.alert(MCAPP.getText('GBL_SAVE_PROMP_SORT', this));
			evt.preventDefault();
			return;
		}
		else {
			var oData = this.getView().getModel().getData();
			$.each(oData.results, function(i, item) {
				if(item.Dist_SKU !== ""){
					item.Dist_SKU = parseInt(item.Dist_SKU);
				}
				item.SKU = parseInt(item.SKU);
				item.Sales_Ord_No = parseInt(item.Sales_Ord_No);
				item.ShipToId = parseInt(item.ShipToId);
				item.Confirmed_Qty = parseInt(item.Confirmed_Qty);
				item.Change_Req_Qty = parseInt(item.Change_Req_Qty);
			});
			var oTable = this.byId('CRPreviewTable');
			oTable.rerender();
		}
	},

	onExit : function(){
		MCAPP.updateBreadcrumb(false);
	},
	
	/***
	 * used to give the readOnly flag as true or false.
	 */
	getReadOnlyFlag : function(){
		if(MCAPP.isReadOnlyRole() === true || MCAPP.isReadOnlyCRState() === true){
			return true;
		} else {
			return false;
		}
	},
});