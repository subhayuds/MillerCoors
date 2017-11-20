/***
 * @Author FN31
 * @Date 12/05/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is Shipments Import/Export view controller
 */
sap.ui.controller("mc.ccp.shipment.ShipmentsImpExp", {
    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * This method retrieves the Shipment information expanded to ZCCP_SHIP_HDR_TO_ITEM_NAV by passing selected shiptoId, 
     * Week_No, Shipment Type, SKU and Status_Code 
     * Assigns success and failure callback methods
     * Updates the label on the top 
     * @memberOf shipment.ShipmentsImpExp
     */
    onInit: function() {
        // Get the Service MetaData File
        var oDataModel = new sap.ui.model.odata.ODataModel(MCAPP.getServiceUrl(MCAPP.getComponent().getModel('service').getProperty('/ShipmentsImpExpService')));
        this.getView().data('oDataModel', oDataModel);
        var thisContext = this;        
    	oDataModel.read('ZCCP_SHIP_HDR_SET', null, {
    		"$expand":"ZCCP_SHIP_HDR_TO_ITEM_NAV",
    		"$format":"json",
            "$filter":MCAPP.getFilterForShipmentImpExpScreen(),
            }, false, 
			function(oData, oResponse) { thisContext._dataLoadSuccess(oData, oResponse); }, 
			function(oError) { thisContext._dataLoadFail(oError); }
		);
        //Update the label on the view top
        var dataLength = this.getView().getModel().getData().results.length;
        this.byId("totalTxtIdTop").setText(MCAPP.getText('GBL_TOTAL_OF', this) + ' ' + dataLength);
        this.byId("totalTxtIdBottom").setText(MCAPP.getText('GBL_TOTAL_OF', this) + ' ' + dataLength);
        //set the initial page control values i.e, paginator, rowrepeater etc
        this.onChangeDropdown();
    },
    
    /***
     * This method is called when data load is successful in onInit method.
     * It will parse the JSON response and put the index, dirtyState, expand and readOnly flags in the parsed JSON response 
     * and set the model to the current view and also creates a backup model and set it to view.
     * @param oData
     * @param oResponse
     */
    _dataLoadSuccess: function(oData, oResponse) {
        var readOnly = MCAPP.isReadOnlyState();
        //Add State related properties (expand, dirty)
        var obj = JSON.parse(oResponse.body);
        var oData = {};
        oData.results = obj.d.results;
        $.each(oData.results, function(i, item) {
            item.index = i + 1;
            item.expand = false;
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
    },
    
    /***
     * This method is called when data load is Failed in onInit method. 
     * removes the onload image and show the application and 
     * displays the error message box in case of failure.
     * @param oError
     */
    _dataLoadFail: function(oError) {
        // Removing Onloading Image and show the Application
        jQuery.sap.byId('ApploadingDivId').hide();
        jQuery.sap.byId('content').show();
        sap.ui.commons.MessageBox.show(MCAPP.getText('GBL_DATA_LOAD_ERROR', this), sap.ui.commons.MessageBox.Icon.ERROR,
        		MCAPP.getText('GBL_ERROR', this), [sap.ui.commons.MessageBox.Action.OK]);
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
        	if(oEvent.getSource().getId().indexOf("comboBoxIdTop")  > 0 ){
        		previousValue = this.byId("comboBoxIdBottom").getSelectedKey();
        		currentValue = this.byId("comboBoxIdTop").getSelectedKey();                
        	}else if(oEvent.getSource().getId().indexOf("comboBoxIdBottom")  > 0){
        		previousValue = this.byId("comboBoxIdTop").getSelectedKey();
        		currentValue = this.byId("comboBoxIdBottom").getSelectedKey();    
        	}
        	
        	if(parseInt(previousValue) > parseInt(currentValue) ){
        		if(oEvent.getSource().getId().indexOf("comboBoxIdTop") > 0 ){
        			this.byId("comboBoxIdTop").setSelectedKey(previousValue);
        		}else{
        			this.byId("comboBoxIdBottom").setSelectedKey(previousValue);
        		}        		
        		sap.ui.commons.MessageBox.alert(MCAPP.getText('GBL_SAVE_PROMP_DD', this));
        		return;
        	}
        }
        
        MCAPP.setBusy(true);        
        var combo = this.byId("comboBoxIdTop");
        if (oEvent) {
            this.byId('comboBoxIdTop').setSelectedKey(oEvent.getSource().getSelectedKey());
            this.byId('comboBoxIdBottom').setSelectedKey(oEvent.getSource().getSelectedKey());
        }
        var oRowRepeater = this.byId("rowRepeaterId");
        oRowRepeater.setNumberOfRows(parseInt(combo.getSelectedKey()));
        oRowRepeater.gotoPage(1);
        var dataLength = oRowRepeater._getRowCount();
        var oPerPage = combo.getSelectedKey();
        var noOfPage = Math.floor(dataLength / oPerPage);
        var remainPage = dataLength % oPerPage;
        if (remainPage > 0) {
            noOfPage = noOfPage + 1;
        }
        var oPaginator = this.byId("paginatorIdTop");
        oPaginator.setNumberOfPages(parseInt(noOfPage));
        oPaginator.setCurrentPage(1);
        oPaginator = this.byId("paginatorIdBottom");
        oPaginator.setNumberOfPages(parseInt(noOfPage));
        oPaginator.setCurrentPage(1);
        if(oEvent){
            var list = oRowRepeater.getAggregation('rows');
            var length = oRowRepeater.getNumberOfRows();
            if(length > list.length){
                  length = list.length;
            }
            if (this.byId('expandCollapseLinkIdTop').getProperty('text').indexOf(MCAPP.getText('GBL_EXPAND_ALL', this)) >= 0) {
                  for (var i = 0; i < length; i++) {
                         list[i].collapse();
                  }
            }else{
                  for (var i = 0; i < length; i++) {
                         list[i].expand();
                  }
            }      
        }
    },
    
    /***
     * whenever user clicks on "save and next" or "save and previous" link, changes will be saved to back end. 
     * if no change is happened on the screen, user will navigate to next or previous page.  
     * _navigate is the call back in case of save successful.
     * @param oEvent
     */
    onPageNextAndPreviousLink: function(oEvent) {
        MCAPP.setBusy(true);
        var that = this;
        var eventObj = oEvent;
        var changedRecords = [];
        if(MCAPP.getDirtyFlag()){
        	changedRecords = this._getChangedRecords();
        }
        
        if (changedRecords.length <= 0) {
            MCAPP.setBusy(false);
            that._navigate(eventObj);
            return;
        }
        
        //this._removeFlagFromChangedRecords(changedRecords);
        var oDataModel = new sap.ui.model.odata.ODataModel(MCAPP.getServiceUrl(MCAPP.getComponent().getModel('service').getProperty('/ShipmentImpExpSaveService')));
        var dummyHeader = {};
        dummyHeader.ZCCP_DUMMY_TO_SHIP_HDR_NAV = {};
        dummyHeader.ZCCP_DUMMY_TO_SHIP_HDR_NAV.results = changedRecords;
        oDataModel.create('/ZCCP_SHIP_HDR_HEAD_DUMMY_SET', dummyHeader, null, function(oData) {
        	var changedRecordsBackup = [];
        	for (var i = 0; i < changedRecords.length; i++) {
        		changedRecordsBackup.push(changedRecords[i].ZCCP_SHIP_HDR_TO_ITEM_NAV);
            }
        	this._removeFlagFromChangedRecords(changedRecords);
            var changedData = JSON.parse(JSON.stringify(that.getView().getModel().getData()));
            that.getView().getModel('backup').setData(changedData);
            MCAPP.clearDirtyFlag();
            MCAPP.setBusy(false);
            sap.m.MessageToast.show(MCAPP.getText('GBL_DATA_SAVE_MSG', this), {
                duration: MCAPP.getAppConfigAsInt('MsgToastDurationOnNavigation')
            });
            for (var i = 0; i < changedRecordsBackup.length; i++) {
        		changedRecords[i].ZCCP_SHIP_HDR_TO_ITEM_NAV = changedRecordsBackup[i];
            }
            that._navigate(eventObj);
        }, function(oData) {
            eventObj.getSource().setCurrentPage(eventObj.getParameter('srcPage'));
            MCAPP.setBusy(false);
            sap.ui.commons.MessageBox.show(MCAPP.getText('GBL_DATA_SAVE_ERROR', that), sap.ui.commons.MessageBox.Icon.ERROR, 
            		MCAPP.getText('GBL_ERROR', that), [sap.ui.commons.MessageBox.Action.OK]);
        });
    },
    
    /***
     * Navigation to desired page method by using RowRepeater's goToPage method.
     * @param oEvent
     */
    _navigate: function(oEvent) {
    	if(oEvent.getSource().getId().indexOf("paginatorIdTop") > 0){
    		 this.byId("paginatorIdBottom").setCurrentPage(oEvent.mParameters.targetPage);
    	}else{
    		this.byId("paginatorIdTop").setCurrentPage(oEvent.mParameters.targetPage);
    	}
        var oRowRepeater = this.byId("rowRepeaterId");
        oRowRepeater.gotoPage(oEvent.mParameters.targetPage);
        var list = this._getVisibleRows();
        if (this.byId('expandCollapseLinkIdTop').getProperty('text').indexOf(MCAPP.getText('GBL_EXPAND_ALL', this)) >= 0) {
               for (var i = 0; i < list.length; i++) {
                     list[i].collapse();
               }
        }else{
               for (var i = 0; i < list.length; i++) {
                     list[i].expand();
               }
        }
    },
    
    /***
     * Event Handler for Save Button. Changes will be saved to backend in case of any change.
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
        } else {
            data.thisContext = this;
        }
        MCAPP.setBusy(true);
        var changedRecords = this._getChangedRecords();
        if (changedRecords.length <= 0) {
            MCAPP.setBusy(false);
            return;
        }else if (changedRecords.length > 0 ){
        	var changedRecordsBackup = [];
        	for (var i = 0; i < changedRecords.length; i++) {
        		changedRecordsBackup.push(changedRecords[i].ZCCP_SHIP_HDR_TO_ITEM_NAV);
            }
        	
        	this._removeFlagFromChangedRecords(changedRecords);
        	
        	//var oDataModel = this.getView().data('oDataModel');
        	var oDataModel = new sap.ui.model.odata.ODataModel(MCAPP.getServiceUrl(MCAPP.getComponent().getModel('service').getProperty('/ShipmentImpExpSaveService')));
            var dummyHeader = {};
            dummyHeader.ZCCP_SHIP_DUMMY_HDR_TO_HDR_NAV = {};
            dummyHeader.ZCCP_SHIP_DUMMY_HDR_TO_HDR_NAV = changedRecords;
            oDataModel.create('/ZCCP_SHIP_DUMMY_HEAD_SET', dummyHeader, null, function() {
                that._dataSaveSuccess(data, changedRecords, changedRecordsBackup);
                
            }, function(oError) {
                that._dataSaveFail(oError, data);
            });
        }
    },
    
    /***
     * Called upon successful save at back end. This method will update the backup model as well.
     * call any callback method(fnNavigate) in case of navigation without save
     * @param data
     * @param changedRecords
     * @param changedRecordsBackup
     */
    _dataSaveSuccess: function(data, changedRecords, changedRecordsBackup) {
    	for (var i = 0; i < changedRecordsBackup.length; i++) {
    		changedRecords[i].ZCCP_SHIP_HDR_TO_ITEM_NAV = changedRecordsBackup[i];
        }
    	
        var changedData = JSON.parse(JSON.stringify(data.thisContext.getView().getModel().getData()));
        data.thisContext.getView().getModel('backup').setData(changedData);
        MCAPP.clearDirtyFlag();
        MCAPP.setBusy(false);
        if (data.customSaveFlag && data.fnNavigate && data.navigationData) {
            data.fnNavigate.apply(data.fnErrorContext, [data.navigationData]);
        }
        sap.m.MessageToast.show(MCAPP.getText('GBL_DATA_SAVE_MSG', this), {
        	duration: MCAPP.getAppConfigAsInt('MsgToastDurationOnNavigation')
        });
    },
    
    /***
     * called upon save failure. This will display the error message to User in case of failure.
     * call any callback method(fnCall) in case of navigation without save
     * @param oError
     * @param data
     */
    _dataSaveFail: function(oError, data) {
        MCAPP.setBusy(false);
        if (data.customSaveFlag && data.fnCall) {
            data.fnCall.apply(data.thisContext);
        }
        sap.ui.commons.MessageBox.show(MCAPP.getText('GBL_DATA_SAVE_ERROR', data.thisContext), sap.ui.commons.MessageBox.Icon.ERROR, 
        		MCAPP.getText('GBL_ERROR', data.thisContext), [sap.ui.commons.MessageBox.Action.OK]);
    },
    
    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     * This method removes the loading image and updates the header and menu selection
     * @memberOf shipment.ShipmentsImpExp
     */
    onAfterRendering: function() {
    	MCAPP.setBusy(false);
        // Removing Onloading Image and show the Application
        jQuery.sap.byId('ApploadingDivId').hide();
        jQuery.sap.byId('content').show();
        //Update the Header and Menu Selection
        MCAPP.updateHeaderShipmentsImpExp(this);
        MCAPP.menuSelection(this);
    },
    
    /***
     * Event Handler for expand option
     * get All the rows check all rows are expanded, if you change the links to 'Collapse All'
     * @param evt
     */
    expand: function(evt) {
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
    
    /***
     * Event Handler for Collapse option
     * Change the links to 'Expand All'
     * @param evt
     */
    collapse: function(evt) {
        this.byId('expandCollapseLinkIdTop').setProperty('text', MCAPP.getText('GBL_EXPAND_ALL', this));
        this.byId('expandCollapseLinkIdBottom').setProperty('text', MCAPP.getText('GBL_EXPAND_ALL', this));
    },
    
    /***
     * Event Handler for Expand All/ Collapse All option. If clicked event is Expand, get all the ShipmentImpExpItemTable controls from RowRepeater
     * and Call expand function on each row.
     * Else
     * get all the ShipmentImpExpItemTable controls from RowRepeater and call collapse function on each row.
     * @param evt
     */
    onPressExpandCollapseAll: function(evt) {
        if (this.byId('expandCollapseLinkIdTop').getProperty('text').indexOf(MCAPP.getText('GBL_EXPAND_ALL', this)) >= 0) {
            var list = this._getVisibleRows();
            for (var i = 0; i < list.length; i++) {
                list[i].expand();
            }
            this.byId('expandCollapseLinkIdTop').setProperty('text', MCAPP.getText('GBL_COLLAPSE_ALL', this));
            this.byId('expandCollapseLinkIdBottom').setProperty('text', MCAPP.getText('GBL_COLLAPSE_ALL', this));
        } else {
            var list = this._getVisibleRows();
            for (var i = 0; i < list.length; i++) {
                list[i].collapse();
            }
            this.byId('expandCollapseLinkIdTop').setProperty('text', MCAPP.getText('GBL_EXPAND_ALL', this));
            this.byId('expandCollapseLinkIdBottom').setProperty('text', MCAPP.getText('GBL_EXPAND_ALL', this));
        }
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
            var element = sap.ui.getCore().byId(domDiv[0].id);
            result.push(element);
        }
        return result;
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
                if (rows[0].getDirtyState() == true) {
                    flag = true;
                    break;
                }
            }
            MCAPP.setDirtyFlag(flag);
        }
    },
    
    /***
     * Event Handler for Cancel Button. Will display a confirmation message box to user whether he wants to revert his changes. 
     * _callbackCancel is the call back method upon confirmation
     */
    onPressCancel: function() {
        var that = this;
        if (MCAPP.getDirtyFlag()) {
            sap.ui.commons.MessageBox.confirm(MCAPP.getText('GBL_CANCEL_CONFIRM'), function(bResult) {
                that._callbackCancel(bResult);
            }, MCAPP.getText('GBL_CONFIRM')).addStyleClass('McCustomDialog');
        }
    },
    
    /***
     * Call back method to cancel the changes. 
     * This will identify the changed record from original model and replace the record from backup model.
     * and clear the app level dirty flag
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
     * revert the changes in the model based on the index. This will get the POD one by one from back up model 
     * and copy the same values in original model.
     * @param index
     */
    _revertChanges: function(index) {
        var backupModel = this.getView().getModel('backup');
        var backUpObject = this._getObjectByIndex(backupModel, index);
        var changedModel = this.getView().getModel();
        var changedObject = this._getObjectByIndex(changedModel, index);
        //Now Copy One by One
        changedObject.ProofOfDelivery = backUpObject.ProofOfDelivery;
        changedObject.Status_Code = backUpObject.Status_Code;
        changedObject.Status_Text = backUpObject.Status_Text;
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
     * This method returns changed records in the current view by comparing the original model and backup model.
     * @returns {Array}
     */
    _getChangedRecords : function() {
		var rows = this._getVisibleRows();
		var originalModel = this.getView().getModel('backup');
		var changedDModel = this.getView().getModel();
		var changedRecords = [];
		for ( var i = 0; i < rows.length; i++) {
			if (rows[i] !== undefined) {
				if (originalModel.getProperty(rows[i].getBindingContext().sPath	+ '/ProofOfDelivery') 
						!= changedDModel.getProperty(rows[i].getBindingContext().sPath	+ '/ProofOfDelivery')) {
					changedRecords.push(changedDModel.getData().results[i]);
				}
			}
		}
		return changedRecords;
	},
   
	 /***
     * Event Handler for Sort Option
     * @param oEvent
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
     * Method to retrieve json properties based on column name.
     * @param col
     * @returns {String}
     */
    _getJsonColumn: function(column) {
        var result = '';
        switch (column) {
            case 'shpto':
                result = 'ShipToId';
                break;
            case 'shipment':
                result = 'ShipmentNo';
                break;
            case 'status':
                result = 'Status_Text';
                break;
            case 'sourceid':
                result = 'SourceId';
                break;
            case 'oceancarrier':
                result = 'OceanCarrier';
                break;
            case 'destinationport':
                result = 'DestinationPort';
                break;
            case 'scheduleload':
                result = 'ScheduleLoad';
                break;
            case 'actload':
                result = 'ActLoad';
                break;
            case 'scheduleship':
                result = 'ScheduleShip';
                break;
            case 'actship':
                result = 'ActShip';
                break;
            case 'clearedcustom':
                result = 'ClearedCustom';
                break;
            case 'estarrival':
                result = 'EstArrival';
                break;
            case 'actarrival':
                result = 'ActArrival';
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
        var operator = sap.ui.model.FilterOperator.Contains;
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
                var newFilter = new sap.ui.model.Filter(column, operator, filterValue);
                collect.push(newFilter);
            }
            var oFilterNew = new sap.ui.commons.RowRepeaterFilter("rrFilter", {
                filters: collect
            });
            rowRepeater.addFilter(oFilterNew);
            rowRepeater.applyFilter("rrFilter");
        } else {
            if (filterValue !== '') {
                var oFilter = new sap.ui.commons.RowRepeaterFilter("rrFilter", {
                    filters: [new sap.ui.model.Filter(column, operator, filterValue)]
                });
                rowRepeater.addFilter(oFilter);
                rowRepeater.applyFilter("rrFilter");
            }
        }
        var combo = this.byId("comboBoxIdTop");
        var oRowRepeater = this.byId("rowRepeaterId");
        oRowRepeater.setNumberOfRows(parseInt(combo.getSelectedKey()));
        oRowRepeater.gotoPage(1);
        dataLength = rowRepeater._getRowCount();
        var oPerPage = combo.getSelectedKey();
        var noOfPage = Math.floor(dataLength / oPerPage);
        var oRemainPage = dataLength % oPerPage;
        if (oRemainPage > 0) {
            noOfPage = noOfPage + 1;
        }
        var oPaginator = this.byId("paginatorIdTop");
        oPaginator.setNumberOfPages(parseInt(noOfPage));
        oPaginator.setCurrentPage(1);
        oPaginator = this.byId("paginatorIdBottom");
        oPaginator.setNumberOfPages(parseInt(noOfPage));
        oPaginator.setCurrentPage(1);
        MCAPP.setBusy(false);
    },
    
    /**
     * _removeFlagFromChangedRecords is used to delete the dirtyState, Index, expand and readOnly flags from the records which need to be saved.
     * @memberOf shipment.ShipmentsImpExp
     * @param changedRecords
     */
    _removeFlagFromChangedRecords: function(changedRecords) {
        for (var i = 0; i < changedRecords.length; i++) {
            delete changedRecords[i].dirtyState;
            delete changedRecords[i].expand;
            delete changedRecords[i].index;
            delete changedRecords[i].readOnly;
            delete changedRecords[i].ZCCP_SHIP_HDR_TO_ITEM_NAV;
        }
    },
    
    /***
     * Event handler for on Press Print. This method prints current shipment details page.
     */
    onPressPrint: function() {
    	window.print();
    }
});
