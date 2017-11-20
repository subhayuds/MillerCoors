/***
 * @Author EX66
 * @Date 11/12/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is Setting controller
 */
sap.ui.controller("mc.ccp.setting.Setting", {
	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf setting.Settting
	 */
	onInit: function() {
		/*var oDataModel = new sap.ui.model.odata.ODataModel(MCAPP.getServiceUrl(MCAPP.getComponent().getModel('service').getProperty('/OMSettingGetService')));
		this.getView().data('oDataModel', oDataModel);
		thisContext = this;
		oFilterValue ="";
		oDataModel.read('ZCCP_OM_SETTINGS_SET', null, {
			"$format": "json",
			"$filter": MCAPP.getSelectedShiptoAsQryParam()
		}, false, function(oData, oResponse) {
			thisContext._dataLoadSuccess(oData, oResponse);
		}, function(oError) {
			thisContext._dataLoadFail(oError);
		});*/
		
		var oDataModel = new sap.ui.model.json.JSONModel();
        this.getView().data('oDataModel', oDataModel);
        var thisContext = this;
        oFilterValue ="";
        oDataModel.attachRequestCompleted(thisContext._dataLoadSuccess,this);
        oDataModel.loadData("json/OMSettingGetService.json",{},false);
        
		//updates label for the total number of record
        var dataLength = this.getView().getModel().getData().results.length;
        if(dataLength > 0){
        	this.byId("totalTxtId").setText(MCAPP.getText('GBL_TOTAL_OF', this) + ' ' + dataLength);
            this.byId("totalTxtIdBottom").setText(MCAPP.getText('GBL_TOTAL_OF', this) + ' ' + dataLength);
        }else{
        	this.byId("totalTxtId").setText(MCAPP.getText('GBL_TOTAL_OF', this) + ' ' + 0);
            this.byId("totalTxtIdBottom").setText(MCAPP.getText('GBL_TOTAL_OF', this) + ' ' + 0);
        }
		this.onChangeDropdown();
	},

	/***
	 * This method is called when data load is successful in onInit method
	 * @param oData
	 * @param oResponse
	 */
	_dataLoadSuccess: function(evt) {
		var readOnly = MCAPP.isReadOnlyRole();	
		var obj = evt.getSource().getData();
		oData = {};
		oData.results = obj.d.results;
		$.each(oData.results, function(i, item) {
			item.index = i + 1;	
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
	},

	/***
	 * This method is called when data load is Failed in onInit method
	 */
	_dataLoadFail: function() {
		// Removing onLoading Image and show the Application
		jQuery.sap.byId('ApploadingDivId').hide();
		jQuery.sap.byId('content').show();
		sap.ui.commons.MessageBox.show(MCAPP.getText('GBL_DATA_LOAD_ERROR', this), sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', this), [sap.ui.commons.MessageBox.Action.OK]);		
	},

	/***
	 * This event Handler will be called on change of dropDown value
	 * @param oEvent
	 */
	onChangeDropdown: function(oEvent) {
		var oComboBox = "";
		var valBeforeChange = "";
		var dataLength = "";
		var oTable = this.byId("SettingTable");
		if (oEvent === undefined) { //This will work when page is getting loaded
			oComboBox = this.byId("comboBoxId");
		}
		else { // This will work when the combo value will be changed
			oComboBox = this.byId(oEvent.getSource().getId());
			oTable.setFirstVisibleRow(0);
		}
		var oPerPage = oComboBox.getSelectedKey();
		if (oComboBox.sId.indexOf("comboBoxId") > 0 && oComboBox.sId.indexOf("Bottom") <= -1) {
			if (MCAPP.getDirtyFlag() === true) {
				MCAPP.setBusy(true);
				valBeforeChange = this.byId("comboBoxIdBottom").getSelectedKey();
				this.byId("comboBoxId").setSelectedKey(parseInt(valBeforeChange));
				sap.ui.commons.MessageBox.alert(MCAPP.getText('GBL_SAVE_PROMP_DD', this));
				MCAPP.setBusy(false);
				return;
			}
			else this.byId("comboBoxIdBottom").setValue(parseInt(oPerPage));
		}
		else if (oComboBox.sId.indexOf("comboBoxIdBottom") > 0) {
			if (MCAPP.getDirtyFlag() === true) {
				MCAPP.setBusy(true);
				valBeforeChange = this.byId("comboBoxId").getSelectedKey();
				this.byId("comboBoxIdBottom").setSelectedKey(parseInt(valBeforeChange));
				sap.ui.commons.MessageBox.alert(MCAPP.getText('GBL_SAVE_PROMP_DD', this));
				MCAPP.setBusy(false);
				return;
			}
			else this.byId("comboBoxId").setValue(parseInt(oPerPage));
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
	 * _calculateNumOfPage is used to calculate the total number of pages for paginator.
	 * @memberOf setting.Setting
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
		if(dataLength > 0){
			thisContext.byId("paginatorId").setNumberOfPages(noOfPage);
			thisContext.byId("paginatorIdBottom").setNumberOfPages(noOfPage);
		}else{
			thisContext.byId("paginatorId").setNumberOfPages(1);
			thisContext.byId("paginatorIdBottom").setNumberOfPages(1);
		}
		thisContext.byId("paginatorId").setCurrentPage(1);
		thisContext.byId("paginatorIdBottom").setCurrentPage(1);
	},	
	
	/**
	 * setPaginatorTextValue is used to set the paginator text fields values.
	 * @memberOf setting.Setting
	 * @param pageNo
	 */
	setPaginatorTextValue: function(pageNo) {
		this.byId("paginatorId").setNumberOfPages(parseInt(pageNo));
		this.byId("paginatorId").setCurrentPage(1);
		this.byId("paginatorIdBottom").setNumberOfPages(parseInt(pageNo));
		this.byId("paginatorIdBottom").setCurrentPage(1);
	},

	/**
	 * onPageSaveAndNavigate is called when the paginator is clicked .
	 * First is saves any modified data to the back end and then navigates to the new page
	 * @memberOf setting.Setting
	 */
	onPageSaveAndNavigate: function(oEvent) {
		MCAPP.setBusy(true);
		var that = this;
		var data = {};
		if (oEvent.mParameters.data) {
			data = oEvent.mParameters.data;
			data.thisContext = this;
		}
		else {
			data.thisContext = this;
		}
		var currentPage = parseInt(oEvent.mParameters.targetPage);
		var srcPage = parseInt(oEvent.mParameters.srcPage);
		var id = oEvent.getSource().getId();
		var changedRecords = this._getChangedRecords(srcPage);
		if (changedRecords.length <= 0) {
			MCAPP.setBusy(false);
			this._navigate(currentPage, srcPage, id);
			return;
		}
		else {
			this._removeFlagFromChangedRecords(changedRecords);
			var oDataModel = this.getView().data('oDataModel');
			var dummyHeader = {};
			dummyHeader.ZCCP_OM_SETTINGSSet = changedRecords;
			oDataModel.create('/ZCCP_OM_SETTINGS_HDR_SET', dummyHeader, null, function(oData, response) {
				that._dataSaveSuccess(oData, response, data);
				that.onPressDoNotPlan();
				that._navigate(currentPage, srcPage, id);				
			}, function(oError) {
				that._dataSaveFail(oError, data);
			});
			MCAPP.setBusy(false);
		}
	},

	/**
	 * _navigate is used to navigate to next or previous page as per the clicked page link of paginator. 
	 * Called inside onPageSaveAndNavigate
	 * @memberOf setting.Setting
	 * @param currentPage
	 * @param srcPage
	 * @param id
	 */
	_navigate: function(currentPage, srcPage, id) {
		var oTable = this.byId("SettingTable");
		if (id.indexOf("paginatorId") > 0 && id.indexOf("Bottom") <= -1) this.byId("paginatorIdBottom").setCurrentPage(currentPage);
		else this.byId("paginatorId").setCurrentPage(currentPage);
		oTable._oPaginator.setCurrentPage(currentPage);
		oTable._oPaginator.firePage({
			srcPage: srcPage,
			targetPage: currentPage,
			type: 'GoTo'
		});
		oTable.rerender();
	},

	/**
	 * Called when the Cancel button is clicked
	 * @memberOf Setting
	 * @param oEvent
	 */
	onPressCancel: function(oEvent) {
        var srcPage = parseInt(oEvent.mParameters.srcPage);
        var rows = this.byId("SettingTable").getRows();
        var rowCount = this._getVisibleRowCount(srcPage);
        var originalModel = this.getView().getModel('backup');
        var changedDModel = this.getView().getModel();
        var sPath = "";
        var index = "";
        for (var i = 0; i < rowCount; i++) {
        	sPath = rows[i].getBindingContext().sPath;
        	index = sPath.split("/")[2];  
               if (originalModel.getProperty(sPath + '/HideFlag') !== changedDModel.getProperty(sPath + '/HideFlag')) {
                     changedDModel.getData().results[index].DoNotPlanFlag = originalModel.getData().results[index].DoNotPlanFlag;
                     changedDModel.getData().results[index].HideFlag = originalModel.getData().results[index].HideFlag;
                     if (originalModel.getProperty(sPath + '/HideFlag') === "X") {
                            rows[i].mAggregations.cells[5].mProperties.checked = true;
                            rows[i].mAggregations.cells[4].mProperties.checked = true;                            
                            rows[i].mAggregations.cells[5].rerender();
                            rows[i].mAggregations.cells[4].rerender();
                     }                     
                     else if ((originalModel.getProperty(sPath + '/HideFlag') !== "X") && (originalModel.getProperty(sPath + '/DoNotPlanFlag') === "X")) {
                         rows[i].mAggregations.cells[5].mProperties.checked = false;
                         rows[i].mAggregations.cells[4].mProperties.checked = true;                         
                         rows[i].mAggregations.cells[5].rerender();
                         rows[i].mAggregations.cells[4].rerender();
                     }
                     else if ((originalModel.getProperty(sPath + '/HideFlag') !== "X") || (originalModel.getProperty(sPath + '/DoNotPlanFlag') !== "X")) {
                         rows[i].mAggregations.cells[5].mProperties.checked = false;
                         rows[i].mAggregations.cells[4].mProperties.checked = false;                         
                         rows[i].mAggregations.cells[5].rerender();
                         rows[i].mAggregations.cells[4].rerender();
                     } 
                     else {
                            rows[i].mAggregations.cells[5].mProperties.checked = false;                            
                            rows[i].mAggregations.cells[5].rerender();
                     }
               }
               if (originalModel.getProperty(sPath + '/DoNotPlanFlag') !== changedDModel.getProperty(sPath + '/DoNotPlanFlag')) {
                     changedDModel.getData().results[index].DoNotPlanFlag = originalModel.getData().results[index].DoNotPlanFlag;
                     changedDModel.getData().results[index].HideFlag = originalModel.getData().results[index].HideFlag;
                     if (originalModel.getProperty(sPath + '/DoNotPlanFlag') === "X") {
                            rows[i].mAggregations.cells[4].mProperties.checked = true;
                            rows[i].mAggregations.cells[4].rerender();
                     }
                     else {
                            rows[i].mAggregations.cells[4].mProperties.checked = false;
                            rows[i].mAggregations.cells[4].rerender();
                     }
               }
        }
        MCAPP.setDirtyFlag(false);
	},

	/**
	 * _removeFlagFromChangedRecords is used to delete the Index and readOnly flags from the records which need to be saved.
	 * @memberOf setting.Setting
	 * @param changedRecords
	 */
	_removeFlagFromChangedRecords: function(changedRecords) {
		for (var i = 0; i < changedRecords.length; i++) {			
			delete changedRecords[i].index;
			delete changedRecords[i].readOnly;
		}
	},

	/***
	 * Event Handler for Save Button. Changes will be saved to back end in case of any change.
	 * _dataSaveSuccess and _dataSaveFail are call back functions on success or failure
	 * NOTE : This method also called from outside of the file (in case of navigation if any change)
	 * @param oEvent
	 */
	onPressSave: function(oEvent) {
		var that = this;
		var data = {};
		if (oEvent.mParameters.data) {
			data = oEvent.mParameters.data;
			data.thisContext = this;
		}
		else {
			data.thisContext = this;
		}
		MCAPP.setBusy(true);		
		var srcPage = this.byId("paginatorId").getProperty("currentPage");
		var changedRecords = this._getChangedRecords(srcPage);
		if (changedRecords.length <= 0) {
			MCAPP.setBusy(false);
			return;
		}
		else {
			this._removeFlagFromChangedRecords(changedRecords);
			var oDataModel = this.getView().data('oDataModel');
			var dummyHeader = {};
			dummyHeader.ZCCP_OM_SETTINGSSet = changedRecords;
			oDataModel.create('/ZCCP_OM_SETTINGS_HDR_SET', dummyHeader, null, function(oData, response) {
					that.onPressDoNotPlan();
					that._dataSaveSuccess(oData, response, data);
			}, function(oError) {
				that._dataSaveFail(oError, data);
			});
		}		
	},

	/**
	 * returns the changed/modified records in the page
	 * @memberOf setting.Setting
	 */
	_getChangedRecords: function(srcPage) {
		var rows = this.byId("SettingTable").getRows();
		var rowCount = this._getVisibleRowCount(srcPage);
		var originalModel = this.getView().getModel('backup');
		var changedDModel = this.getView().getModel();
		var changedRecords = [];		
		var count = 0;
		var sPath = "";
		var index = "";
        for (var j = 0; j < rowCount; j++) {           
        	sPath = rows[j].getAggregation("cells")[0].getBindingContext().sPath;
        	index = sPath.split("/")[2];        	
            if (originalModel.getProperty(sPath + '/DoNotPlanFlag') != changedDModel.getProperty(sPath + '/DoNotPlanFlag')) {
                count++;
            } 
            else if (originalModel.getProperty(sPath + '/HideFlag') != changedDModel.getProperty(sPath + '/HideFlag')) {
                count++;
            }
            if (count > 0) {
                changedRecords.push(changedDModel.getData().results[index]);
            }
            count = 0;
        }
		return changedRecords;
	},

	/**
	 * onChangeDoNotPlanFlag is used to update the respective oData model with the new selected value
	 * @memberOf setting.Settting
	 */
	onChangeDoNotPlanFlag: function(oEvent) {
		MCAPP.setDirtyFlag(false);
		var oModel = this.getView().getModel();
		var index = oEvent.getSource().getBindingContext().sPath.split("/");
		if (oEvent.getSource().mProperties.checked === true) {
			oModel.getData().results[index[2]].DoNotPlanFlag = "X";
		}		
		else if (oEvent.getSource().mProperties.checked === false && oEvent.getSource().getParent().getCells()[5].getChecked() === true) {
			oEvent.getSource().getParent().getCells()[4].setChecked(false);
			oEvent.getSource().getParent().getCells()[5].setChecked(false);
			oModel.getData().results[index[2]].DoNotPlanFlag = "";
			oModel.getData().results[index[2]].HideFlag = "";
		}
		else if (oEvent.getSource().mProperties.checked === false) {
			oModel.getData().results[index[2]].DoNotPlanFlag = "";
		}		
		var originalModel = this.getView().getModel('backup');
		var changedDModel = this.getView().getModel();
		var sPath = oEvent.getSource().getBindingContext().sPath;
		if (originalModel.getProperty(sPath + '/HideFlag') != changedDModel.getProperty(sPath + '/HideFlag') || originalModel.getProperty(sPath + '/DoNotPlanFlag') != changedDModel.getProperty(sPath + '/DoNotPlanFlag')){
			MCAPP.setDirtyFlag(true);
		}
	},

	/**
	 * _getVisibleRowCount is used to get the current rows count for the selected page.
	 * @memberOf setting.Settting
	 * @param srcPage
	 */
	_getVisibleRowCount: function(srcPage) {
		var oTable = this.byId("SettingTable");
		var totalNoOfRecords = oTable.getBinding("rows").iLength;
		var rowsPerPage = this.byId("comboBoxId").getSelectedKey();
		var count = 0;
		if (srcPage > 1) { //src page is existing page
			count = parseInt(totalNoOfRecords) - (parseInt(rowsPerPage) * parseInt(srcPage - 1));
			if (count > rowsPerPage) {
				count = rowsPerPage;
			}
		}
		else if (totalNoOfRecords < rowsPerPage) {
			count = parseInt(totalNoOfRecords);
		}
		else {
			count = parseInt(rowsPerPage);
		}
		return count;
	},

	/***
	 * Called upon successful save at back end. This method will update the backup model as well.
	 * call any callback method(fnNavigate) in case of navigation with out save
	 */
	_dataSaveSuccess: function() {
		MCAPP.setBusy(false);
		sap.m.MessageToast.show(MCAPP.getText('GBL_DATA_SAVE_MSG', this), {
			duration: MCAPP.getAppConfigAsInt('MsgToastDurationOnSave')
		});
		var oCopyOfData = JSON.parse(JSON.stringify(this.getView().getModel().getData()));
		var oModelBackup = new sap.ui.model.json.JSONModel();
		oModelBackup.setData(oCopyOfData);
		this.getView().setModel(oModelBackup, "backup");
		MCAPP.setDirtyFlag(false);
	},

	/***
	 * called upon save failure. This will display the error message to User in case of failure.
	 * call any callback method(fnCall) in case of navigation with out save

	 * @param data
	 */
	_dataSaveFail: function(data) {
		MCAPP.setBusy(false);
		if (data.customSaveFlag && data.fnCall) {
			data.fnCall.apply(data.thisContext);
		}
		sap.ui.commons.MessageBox.show(MCAPP.getText('GBL_DATA_SAVE_ERROR', data.thisContext), sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', data.thisContext), [sap.ui.commons.MessageBox.Action.OK]);
	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf setting.Settting
	 */
	onAfterRendering: function() {
		MCAPP.setBusy(false);
		// Removing onLoading Image and show the Application
		jQuery.sap.byId('ApploadingDivId').hide();
		jQuery.sap.byId('content').show();
		MCAPP.updateHeaderSetting(this);
		var menu = sap.ui.getCore().byId('GlobalFrameId').getAggregation('menu')[0];
		menu.byId('orderMenuId').removeStyleClass('selecteditem');
		menu.byId('forecastlink').removeStyleClass('selecteditem');
		menu.byId('inventorylink').removeStyleClass('selecteditem');
		menu.byId('shipmentlink').removeStyleClass('selecteditem');
		menu.byId('salesinventorylink').removeStyleClass('selecteditem');
		menu.byId('changereqlink').removeStyleClass('selecteditem');
	},

	/**
	 * This method is called on to show the message about do not plan and hiding sku.
	 */
	onPressDoNotPlan: function() {
		var oButtonDoNotPlanView = new sap.ui.view({
			type: sap.ui.core.mvc.ViewType.JS,
			viewName: "mc.ccp.setting.DoNotPlan"
		});
		var oDialog = new mc.ccp.control.McDialog({
			modal: true,
			width: '35%',
			height: '50%',
			closed: function() {
				this.destroy();
			}
		}).addStyleClass('McCustomDialog');
		oDialog.setTitle(MCAPP.getText("VW_DNP_PLANNING_SKUS", this));
		oDialog.addContent(oButtonDoNotPlanView);
		oDialog.addButton(new sap.ui.commons.Button({
			text: MCAPP.getText("GBL_OK", this),
			press: function() {
				oDialog.close();
			}
		}));
		oDialog.open();
	},

	/**
	 * This function will check and/or unCheck the hide column and based on that Do not plan column will be checked and/or unChecked.
	 * @param oEvent
	 */
	onChangeDoNotPlanAndHideFlag: function(oEvent) {
		MCAPP.setDirtyFlag(false);
		var oModel = this.getView().getModel();
		var index = oEvent.getSource().getBindingContext().sPath.split("/");
		if (oEvent.getParameter('checked') === true) {
			oEvent.getSource().getParent().getCells()[4].setChecked(true);			
			oModel.getData().results[index[2]].DoNotPlanFlag = "X";
			oModel.getData().results[index[2]].HideFlag = "X";
		}
		else {			
			oModel.getData().results[index[2]].HideFlag = "";
		}		
		var originalModel = this.getView().getModel('backup');
		var changedDModel = this.getView().getModel();
		var sPath = oEvent.getSource().getBindingContext().sPath;
		if (originalModel.getProperty(sPath + '/HideFlag') != changedDModel.getProperty(sPath + '/HideFlag') || originalModel.getProperty(sPath + '/DoNotPlanFlag') != changedDModel.getProperty(sPath + '/DoNotPlanFlag')){
			MCAPP.setDirtyFlag(true);
		}
	},
	/***
	 * This method handles the sorting functionality.
	 * @param event
	 */
	onSortColumn: function(event) {
		if (MCAPP.getDirtyFlag()) {
			sap.ui.commons.MessageBox.alert(MCAPP.getText('GBL_SAVE_PROMP_SORT', this));
			event.preventDefault();
			return;
		}
		else {
			var oData = this.getView().getModel().getData();
			$.each(oData.results, function(item) {
				item.Dist_SKU = parseInt(item.Dist_SKU);
				item.SKU = parseInt(item.SKU);
				item.SKU_Desc = item.SKU_Desc;
				item.ShipToId = parseInt(item.ShipToId);
				item.DoNotPlanFlag = item.DoNotPlanFlag;
				item.HideFlag = item.HideFlag;
			});
		}
	},

	/**
	 * Called when user tries to filter the records in the setting table
	 * @memberOf setting.Setting
	 * @Param event
	 */
	onFilterColumn: function(event) {
		var filterValue;
		var newFilter;
		if (MCAPP.getDirtyFlag()) {
			sap.ui.commons.MessageBox.alert(MCAPP.getText('GBL_SAVE_PROMP_FILTER', this));
			filterValue = event.getParameter('value').trim();
			oFilterValue = filterValue;
			if (filterValue !== '') {
				newFilter = new sap.ui.model.Filter(column, oparator, filterValue);
				collect.push(newFilter);
			}
			event.preventDefault();
			return;
		}
		else {
			var oData = this.getView().getModel().getData();
			var dataLength = "";
			filterValue = event.getParameter('value').trim();
			oFilterValue = filterValue;
			var oTable = this.byId('SettingTable');
			var column = this._getJsonColumn(event.getParameter('column').sId.split("--")[1]);
			var oparator = sap.ui.model.FilterOperator.EQ;
			if (column == 'SKU_Desc') {
				oparator = sap.ui.model.FilterOperator.Contains;
			}
			var oTableFilters = oTable.mBindingInfos.rows.filters;
			var collect = [];
			if (oTableFilters !== undefined) {
				var filters = oTableFilters;
				for (var i = 0; i < filters.length; i++) {
					if (filters[i].sPath != event.getParameter('column').getFilterProperty()) {
						collect.push(filters[i]);
					}
				}
				if (filterValue !== '') {
					newFilter = new sap.ui.model.Filter(column, oparator, filterValue);
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
			$.each(oData.results, function(item) {
				item.Dist_SKU = "" + item.Dist_SKU;
				item.SKU = "" + item.SKU;
				item.SKU_Desc = "" + item.SKU_Desc;
				item.ShipToId = "" + item.ShipToId;				
			});
			var combo = this.byId("comboBoxId");
			oTable.setFirstVisibleRow(0);
			if (filterValue !== "") {
				dataLength = oTable.getBinding("rows").iLength;
			}
			else {
				dataLength = this.getView().getModel().getData().results.length;
			}
			var oPerPage = combo.getSelectedKey();
			var noOfPage = Math.floor(dataLength / oPerPage);
			var oRemainPage = dataLength % oPerPage;
			if (oRemainPage > 0) {
				noOfPage = noOfPage + 1;
			}
			oTable.setFirstVisibleRow(noOfPage);
			oTable.rerender();
			var oPaginatory = this.byId("paginatorId");
			oPaginatory.setNumberOfPages(parseInt(noOfPage));
			oPaginatory.setCurrentPage(1);
			oPaginatory = this.byId("paginatorIdBottom");
			oPaginatory.setNumberOfPages(parseInt(noOfPage));
			oPaginatory.setCurrentPage(1);
			MCAPP.setBusy(false);
		}
	},

	/**
	 * method to retrieve JSON properties based on column name
	 * @param col
	 * @returns {String}
	 */
	_getJsonColumn: function(col) {
		var result = '';
		switch (col) {
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
		}		
		return result;
	},
});