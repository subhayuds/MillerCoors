/***
 * @Author DU09
 * @Date 11/12/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is Inventory Shipment View controller.
 */
sap.ui.controller("mc.ccp.inventory.InventoryShipment", {
	
    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf inventory.InventoryShipment
     */
    onInit: function() {
        var oDataModel = new sap.ui.model.odata.ODataModel(MCAPP.getServiceUrl(MCAPP.getComponent().getModel('service').getProperty('/InventoryShipmentService')));
        this.getView().data('oDataModel', oDataModel);
        thisContext = this;
        var oSKU = parseInt(this.getView().getViewData());
        var oCode = this.getView().getViewData()[1];
        var oWeek = this.getView().getViewData()[3];
        if (oCode === "plannedQuantityLinkWeek1") {
            oCode = MCAPP.getText('VW_INV_SHIP_PLANNED_CODE');
        } else if (oCode === "plannedQuantityLinkWeek3") {
            oCode = MCAPP.getText('VW_INV_SHIP_PLANNED_CODE');
        } else if (oCode === "inTransitQuantityLink") {
            oCode = MCAPP.getText('VW_INV_SHIP_TRANSIT_CODE');
        }
        oDataModel.read('ZCCP_SHIP_HDR_SET', null, {
            "$filter": MCAPP.getFilterForInvShipScreen(oSKU, oCode, oWeek),
            "$format": "json",
            "$expand": "ZCCP_SHIP_HDR_TO_ITEM_NAV"
        }, false, function(oData, oResponse) {
            thisContext._dataLoadSuccess(oData, oResponse);
        }, function(oError) {
            thisContext._dataLoadFail(oError);
        });
        //Setting Paginator Value on initialization
        var dataLength = this.getView().getModel().getData().results.length;
        var oPaginator = this.byId("paginatorShipId");
        oPaginator = this.byId("paginatorShipIdCl");
        var oPerPage = 5;
        var noOfPage = Math.floor(dataLength / oPerPage);
        var remainPage = dataLength % oPerPage;
        if (remainPage > 0) noOfPage = noOfPage + 1;
        oPaginator.setNumberOfPages(noOfPage);
        oPaginator.setCurrentPage(1);
        //Setting the total text value of the number of records on screen
        this.byId("totalTxtShipId").setText(MCAPP.getText('GBL_TOTAL_OF', this) + ' ' + dataLength);
        this.byId("totalTxtShipIdCl").setText(MCAPP.getText('GBL_TOTAL_OF', this) + ' ' + dataLength);
        //set the initial page control values
        this.onChangeDropdown();
    },
    
    /***
     * This method is called when data load is successful in onInit method
     * @param oData
     * @param oResponse
     */
    _dataLoadSuccess: function(oData, oResponse) {
        var readOnly = MCAPP.isReadOnlyState();
        //Add State related properties (expand, dirty)
        var obj = JSON.parse(oResponse.body);
        var oDataShipment = {};
        oDataShipment.results = obj.d.results;
        $.each(oDataShipment.results, function(i, item) {
            item.index = i + 1;
            item.expand = false;
            item.dirtyState = false;
            item.readOnly = readOnly;
        });
        var oModel = new sap.ui.model.json.JSONModel();
        oModel.setData(oDataShipment);
        this.getView().setModel(oModel);
        //Get Copy of Original Data
        var oCopyOfData = JSON.parse(JSON.stringify(oDataShipment));
        var oModelBackup = new sap.ui.model.json.JSONModel();
        oModelBackup.setData(oCopyOfData);
        this.getView().setModel(oModelBackup, "backupShipment");
    },
    
    /***
     * This method is called when data load is Failed in onInit method
     * @param oError
     */
    _dataLoadFail: function(oError) {
        sap.ui.commons.MessageBox.show(MCAPP.getText('GBL_DATA_LOAD_ERROR', this), sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', this), [sap.ui.commons.MessageBox.Action.OK]);
    },
    
    /**
     * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
     * (NOT before the first rendering! onInit() is used for that one!).
     * @memberOf inventory.InventoryShipment
     */
    //	onBeforeRendering: function() {
    //
    //	},
    
    
    /***
     * Event Handler for Dropdown Control. Whenever user change the records per page from combo box,
     * no of pages will be calculated accordingly and paginator will be set accordingly.
     * @param oEvent
     */
    onChangeDropdown: function(oEvent) {
    	 if (MCAPP.getDirtyFlag() === true) {
             var previousValue = "";
             var currentValue = "";
             if (oEvent.getSource().getId().indexOf("comboBoxShipId") > 0) {
            	 previousValue = this.byId("comboBoxShipIdCl").getSelectedKey();
                 currentValue = this.byId("comboBoxShipId").getSelectedKey();
             }
             else if (oEvent.getSource().getId().indexOf("comboBoxShipIdCl") > 0) {
                 previousValue = this.byId("comboBoxShipId").getSelectedKey();
                 currentValue = this.byId("comboBoxShipIdCl").getSelectedKey();
             }
             if (parseInt(previousValue) > parseInt(currentValue)) {
                 if (oEvent.getSource().getId().indexOf("comboBoxShipId") > 0) {
                	 this.byId("comboBoxShipId").setSelectedKey(previousValue);
                 }
                 else {
                	 this.byId("comboBoxShipIdCl").setSelectedKey(previousValue);
                 }
                 sap.ui.commons.MessageBox.alert(MCAPP.getText('GBL_SAVE_PROMP_DD', this));
                 return;
             }
         }
         MCAPP.setBusy(true);
         var combo = this.byId("comboBoxShipId");
         if (oEvent) {
        	 this.byId('comboBoxShipId').setSelectedKey(oEvent.getSource().getSelectedKey());
        	 this.byId('comboBoxShipIdCl').setSelectedKey(oEvent.getSource().getSelectedKey());
         }
         var rp = sap.ui.getCore().byId("rowRepeaterId");
         rp.setNumberOfRows(parseInt(combo.getSelectedKey()));
         rp.gotoPage(1);
         var dataLength = rp._getRowCount();
         var oPerPage = combo.getSelectedKey();
         var noOfPage = Math.floor(dataLength / oPerPage);
         var remainPage = dataLength % oPerPage;
         if (remainPage > 0) {
             noOfPage = noOfPage + 1;
         }
         var oPaginatory = this.byId("paginatorShipId");
         oPaginatory.setNumberOfPages(parseInt(noOfPage));
         oPaginatory.setCurrentPage(1);
         oPaginatory = this.byId("paginatorShipIdCl");
         oPaginatory.setNumberOfPages(parseInt(noOfPage));
         oPaginatory.setCurrentPage(1);
         MCAPP.setBusy(false); 
    },

    
    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     * @memberOf inventory.InventoryShipment
     */
    onAfterRendering: function() {
    	MCAPP.setBusy(false);
    	jQuery.sap.byId('ApploadingDivId').hide();
        jQuery.sap.byId('content').show();
    },
    
    /**
     * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
     * @memberOf inventory.InventoryShipment
     */
    //	onExit: function() {
    //	
    //  },
    
    /**
     * called when the user clicks on Save & Next Link.
     * the method will save the data with the oData service call.
     * @param oEvent
     */
    onSaveAndNavigate: function(oEvent) {
        MCAPP.setBusy(true);
        var that = this;
        var eventObj = oEvent;
        var changedRecords = this._getChangedRecords();
        if (changedRecords.length <= 0) {
            MCAPP.setBusy(false);
            var emptyArray = [];
            that._navigate(eventObj, emptyArray, changedRecords);
            var rp = sap.ui.getCore().byId("rowRepeaterId");
            var page = oEvent.mParameters.targetPage;
            rp.gotoPage(page);
            this.byId("paginatorShipId").setCurrentPage(parseInt(page));
            this.byId("paginatorShipIdCl").setCurrentPage(parseInt(page));
            return;
        } else {
            var itemLevelData = [];
            for (var i = 0; i < changedRecords.length; i++) {
                itemLevelData.push(changedRecords[i].ZCCP_SHIP_HDR_TO_ITEM_NAV);
            }
            this._removeFlagFromChangedRecords(changedRecords);
            this._genericSave(changedRecords, this._dataSaveSuccess, this._dataSaveFail, this, itemLevelData);
            that._navigate(eventObj, itemLevelData, changedRecords);
            var roRepId = sap.ui.getCore().byId("rowRepeaterId");
            var pageNum = oEvent.mParameters.targetPage;
            roRepId.gotoPage(pageNum);
            this.byId("paginatorShipId").setCurrentPage(parseInt(pageNum));
            this.byId("paginatorShipIdCl").setCurrentPage(parseInt(pageNum));
        }
    },
    
    /**
     * called from within the saveAndNavigate method.
     * the method navigates the control to the previous or the next page as per the action selected by the user.
     * @param oEvent
     * @param itemLevelData
     * @param changedRecords
     */
    _navigate: function(oEvent, itemLevelData, changedRecords) {
        if (itemLevelData.length > 0) {
            for (var i = 0; i < itemLevelData.length; i++) {
                changedRecords[i].ZCCP_SHIP_HDR_TO_ITEM_NAV = itemLevelData[i];
            }
        }
     },
    
    /**
	 Function to Close the shipment dialog
	 @param oEvent
	 **/
    onPressCancel: function(oEvent) {
        if (MCAPP.getDirtyFlag() === true) 
        	sap.ui.commons.MessageBox.alert(MCAPP.getText('COMMENT_SAVE_PROMP_DD', this),"", MCAPP.getText('VW_SAVE_PROMPT_TITLE',this));
        else 
        	oEvent.getSource().getParent().getParent().close(); 
        
        
    },
    
    /**
     * called when the user clicks on save button
     * @param oEvent
     */
    onPressSave: function(oEvent) {
        MCAPP.setBusy(true);
        var changedRecords = this._getChangedRecords();
        if (changedRecords.length <= 0) {
            MCAPP.setBusy(false);
            return;
        } else {
        	// To capture the detailed item level ZCCP_SHIP_HDR_TO_ITEM_NAV data in the temporary object
        	var itemLevelData = [];
            for (var i = 0; i < changedRecords.length; i++) {
                itemLevelData.push(changedRecords[i].ZCCP_SHIP_HDR_TO_ITEM_NAV);
            }
            this._removeFlagFromChangedRecords(changedRecords);
            this._genericSave(changedRecords, this._dataSaveSuccess, this._dataSaveFail, this, itemLevelData);
        }
    },
    
    /**
     * helping method called from within the save method.
     * the method will remove all the flags from changed records
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
    
    /**
     * helping method called from within the save method.
     * the method will get all the records changed by the user.
     */
    _getChangedRecords: function() {
        var rows = this.getView().getController()._getVisibleRows(); // This may  not work when saving from OUTSIDE
        var originalModel = this.getView().getModel('backupShipment');
        var changedDModel = this.getView().getModel();
        var changedRecords = [];
        for (var i = 0; i < rows.length; i++) {
            if (originalModel.getProperty(rows[i].getBindingContext().sPath + '/Status_Code') !== changedDModel.getProperty(rows[i].getBindingContext().sPath + '/Status_Code')) {
                changedRecords.push(changedDModel.getData().results[i]);
            }
        }
        return changedRecords;
    },
    
    /***
     * Method to call upon successfully save
     * @param oData
     * @param response
     * @param thisContext
     * @param changedRecords
     * @param itemLevelData
     */
    _dataSaveSuccess: function(oData, response, thisContext, changedRecords, itemLevelData) {
    	if (itemLevelData.length > 0) {
            for (var i = 0; i < itemLevelData.length; i++) {
                changedRecords[i].ZCCP_SHIP_HDR_TO_ITEM_NAV = itemLevelData[i];
            }
        }
    	var changedData = JSON.parse(JSON.stringify(thisContext.getView().getModel().getData()));
        thisContext.getView().getModel('backupShipment').setData(changedData);
        MCAPP.clearDirtyFlag();
        MCAPP.setBusy(false);
        sap.m.MessageToast.show(MCAPP.getText('GBL_DATA_SAVE_MSG', this), {
            duration: 1000
        });
    },
    
    /***
     * Method to call upon  save failure
     * @param oError
     * @param thisContext
     */
    _dataSaveFail: function(oError, thisContext) {
        MCAPP.setBusy(false);
        sap.ui.commons.MessageBox.show(MCAPP.getText('GBL_DATA_SAVE_ERROR', thisContext), sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', thisContext), [sap.ui.commons.MessageBox.Action.OK]);
    },
    
    /**
     * called from within the save method.
     * the method makes a call to the oData service and subsequently saves the data or throws an error accordingly.
     * @param changedRecords
     * @param successCallFn
     * @param failCallFn
     * @param thisContext
     * @param itemLevelData
     */
    _genericSave: function(changedRecords, successCallFn, failCallFn, thisContext, itemLevelData) {
        var oUpdateDataModel = new sap.ui.model.odata.ODataModel(MCAPP.getServiceUrl(MCAPP.getComponent().getModel('service').getProperty('/InventoryShipmentUpdateService')));
        var dummyHeader = {};
        dummyHeader.ZCCP_DUMMY_TO_SHIP_HDR_NAV = changedRecords;
        oUpdateDataModel.create('/ZCCP_SHIP_HDR_HEAD_DUMMY_SET', dummyHeader, null, function(oData, response) {
            successCallFn(oData, response, thisContext, changedRecords, itemLevelData);
        }, function(oError) {
            failCallFn(oError, thisContext);
        });
    },
    
    /**
     * helping function to get the visible rows on the screen
     */
    _getVisibleRows: function() {
        var result = [];
        var oDomRef = sap.ui.getCore().byId("rowRepeaterId").getDomRef();
        var domLi = $(oDomRef).find('li[class=sapUiRrRow]');
        for (var i = 0; i < domLi.length; i++) {
            var domDiv = $(domLi[i]).find('div');
            var elm = sap.ui.getCore().byId(domDiv[0].id);
            result.push(elm);
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
            return;
        }
        if (evt.getParameter('sortOrder') == sap.ui.table.SortOrder.Ascending) {
            sap.ui.getCore().byId("rowRepeaterId").triggerSort(evt.getParameter('column').sId + '-Asc');
        } else {
            sap.ui.getCore().byId("rowRepeaterId").triggerSort(evt.getParameter('column').sId + '-Dsc');
        }
    },
    
    /***
     * Event Handler for Filter Option
     * @param evt
     */
    onFilterColumn: function(evt) {
    	
        if (MCAPP.getDirtyFlag()) {
            sap.ui.commons.MessageBox.alert(MCAPP.getText('GBL_SAVE_PROMP_FILTER', this));
            return;
        }
        var filterValue = parseInt(evt.getParameter('value').trim()); // get the value to be filtered
        var fValue = evt.getParameter('value').trim();
        var rowRepeater = sap.ui.getCore().byId('rowRepeaterId');
        var column = this._getJsonColumn(evt.getParameter('column').sId);
        var oparator = sap.ui.model.FilterOperator.EQ;
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
            if (fValue !== '') {
                var newFilter = new sap.ui.model.Filter(column, oparator, fValue);
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
    },
    
    /**
     *  method to retrieve json properties based on column name
     * @param col
     * @returns {String}
     */
    _getJsonColumn: function(col) {
    	var oColumn = col.substring(11);
        var result = '';
        switch (oColumn) {
            case 'invShipToId':
                result = 'ShipToId';
                break;
            case 'shipNumId':
                result = 'ShipmentNo';
                break;
            case 'statusId':
                result = 'Status_Text';
                break;
            case 'podId':
                result = 'POD';
                break;
            case 'sourceId':
                result = 'SourceId';
                break;
            case 'carrierId':
                result = 'CarrierName';
                break;
            case 'modeId':
                result = 'Mode';
                break;
            case 'transportId':
                result = 'TruckRailNumber';
                break;
            case 'actLoadId':
                result = 'ActLoad';
                break;
            case 'schdShipId':
                result = 'ScheduledShip';
                break;
            case 'actShipId':
                result = 'ActualShip';
                break;
            case 'estArriveId':
                result = 'EstArrival';
                break;
            case 'actArriveId':
                result = 'ActArrival';
                break;
        }
        return result;
    },
});