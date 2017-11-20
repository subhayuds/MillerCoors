/***
 * @Author CM02
 * @Date 09/01/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is Order view controller
 */
sap.ui.controller("mc.ccp.order.Order", {
    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * This method retrieves the order information expanded to WEEKSANDQUANTITY by passing selected shipto's and
     * assigns success and failure callback methods
     * Updates the lable on the top
     * @memberOf order.Order
     */
    onInit: function() {
    	//  alert('d');
    	MCAPP.setCurrentViewName(this.getView().sViewName);
        // Get the Service MetaData File
//        var oDataModel = new sap.ui.model.odata.ODataModel(MCAPP.getServiceUrl(MCAPP.getComponent().getModel('service').getProperty('/OrderService')));
    	var oDataModel = new sap.ui.model.json.JSONModel();
        this.getView().data('oDataModel', oDataModel);
        var thisContext = this;
        /*oDataModel.read('ZCCP_ORD_ITM_SET', null, {
            "$expand": "ZCCP_WEEKSANDQTY_NAV",
            "$format": "json",
            "$filter": MCAPP.getSelectedShiptoAsQryParam()
        }, false, function(oData, oResponse) {
            thisContext._dataLoadSuccess(oData, oResponse);
        }, function(oError) {
            thisContext._dataLoadFail(oError);
        });*/
        
        oDataModel.attachRequestCompleted(thisContext._dataLoadSuccess,this);
        oDataModel.loadData("json/Order.json",{},false);
        
        //Update the lable on the view top
        var dataLength = this.getView().getModel().getData().results.length;
        if(dataLength == 0){
        	this.byId("idVehicleCustIdRow").setVisible(false);
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
    	var readOnly;
		var readOnlyRole;
		if(MCAPP.isReadOnlyRole() === true){
			readOnly = true;
			readOnlyRole = true;
		}else {
			readOnlyRole = false;
			if(MCAPP.isReadOnlyState() === true){
				readOnly = true;
			}else{
				readOnly = false;
			}
		}
        //var readOnly = MCAPP.isReadOnlyState();
        //Add State related properties (expand, dirty)
        var obj = evt.getSource().getData();//JSON.parse(oResponse.body);
        var oData = {};
        oData.results = obj.d.results;
        $.each(oData.results, function(i, item) {
            item.index = i + 1;
            item.expand = false;
            item.dirtyState = false;
            item.readOnly = readOnly;
            item.readOnlyRole = readOnlyRole;
        });
        var oModel = new sap.ui.model.json.JSONModel();
        oModel.setData(oData);
        this.getView().setModel(oModel);
        //Get Copy of Original Data
        var oCopyOfData = JSON.parse(JSON.stringify(oData));
        var oModelBackup = new sap.ui.model.json.JSONModel();
        oModelBackup.setData(oCopyOfData);
        this.getView().setModel(oModelBackup, "backup");
        MCAPP.updateSegmentedButton(MCAPP.getDistributorType(), true);
    },
    /***
     * This method is called when data load is Failed in onInit method.
     * removes the onload image and show the application and
     * displays the error message box in case of failure.
     * @param oError
     */
    _dataLoadFail: function(oError) {
    	MCAPP.setBusy(false);
        // Removing Onloading Image and show the Application
        jQuery.sap.byId('ApploadingDivId').hide();
        jQuery.sap.byId('content').show();
        sap.ui.commons.MessageBox.show(MCAPP.getText('GBL_DATA_LOAD_ERROR', this), sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', this), [sap.ui.commons.MessageBox.Action.OK]);
        jQuery.sap.log.info('after fail');
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
       // MCAPP.setBusy(true);
        var combo = this.byId("comboBoxIdTop");
        if (oEvent) {
            this.byId('comboBoxIdTop').setSelectedKey(oEvent.getSource().getSelectedKey());
            this.byId('comboBoxIdBottom').setSelectedKey(oEvent.getSource().getSelectedKey());
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
        var oPaginatory = this.byId("paginatorIdTop");
        oPaginatory.setNumberOfPages(parseInt(noOfPage));
        oPaginatory.setCurrentPage(1);
        oPaginatory = this.byId("paginatorIdBottom");
        oPaginatory.setNumberOfPages(parseInt(noOfPage));
        oPaginatory.setCurrentPage(1);
    },
    /***
     * whenever user clicks on "save and next" or "save and previous" link, changes will be saved to backend.
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
            that._navigate(eventObj);
            return;
        }
        var oDataModel = this.getView().data('oDataModel');
        var dummyHeader = {};
        dummyHeader.ZCCP_WEEKSANDQTY_NAV = changedRecords;
        oDataModel.create('/ZCCP_ORD_ITM_SET', dummyHeader, null, function(data) {
            var changedData = JSON.parse(JSON.stringify(that.getView().getModel().getData()));
            that.getView().getModel('backup').setData(changedData);
            MCAPP.clearDirtyFlag();
            that._navigate(eventObj);
            sap.m.MessageToast.show(MCAPP.getText('GBL_DATA_SAVE_MSG', this), {
                duration: MCAPP.getAppConfigAsInt('MsgToastDurationOnNavigation')
            });
        }, function(data) {
            eventObj.getSource().setCurrentPage(eventObj.getParameter('srcPage'));
            MCAPP.setBusy(false);
            sap.ui.commons.MessageBox.show(MCAPP.getText('GBL_DATA_SAVE_ERROR', that), sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', that), [sap.ui.commons.MessageBox.Action.OK]);
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
        var rp = this.byId("rowRepeaterId");
        rp.gotoPage(oEvent.mParameters.targetPage);
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
        }
        else {
            data.thisContext = this;
        }
        MCAPP.setBusy(true);
        var changedRecords = this._getChangedRecords();
        if (changedRecords.length <= 0) {
            MCAPP.setBusy(false);
            return;
        }
        var oDataModel = this.getView().data('oDataModel');
        var dummyHeader = {};
        dummyHeader.ZCCP_WEEKSANDQTY_NAV = {};
        dummyHeader.ZCCP_WEEKSANDQTY_NAV.results = changedRecords;
        oDataModel.create('/ZCCP_ORD_ITM_SET', dummyHeader, null, function(oData, response) {
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
        if (data.customSaveFlag && data.fnNavigate && data.navigationData) {
            data.fnNavigate.apply(data.fnErrorContext, [data.navigationData]);
        }
        sap.m.MessageToast.show(MCAPP.getText('GBL_DATA_SAVE_MSG', this), {
            duration: MCAPP.getAppConfigAsInt('MsgToastDurationOnSave')
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
        if (data.customSaveFlag && data.fnCall) {
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
        //Update the Header and Menu Selection
        MCAPP.updateHeader(this);
        MCAPP.menuSelection(this);
        MCAPP.updateSegmentedButton(MCAPP.getDistributorType(), true);
    },
    /***
     * Event Handler for expand option
     * Logic: get All the rows check all rows are expanded, if you change the links to 'Collapse All'
     * @param evt
     */
    onExpandedRow: function(oEvent) {
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
    onCollapsedRow: function(oEvent) {
        this.byId('expandCollapseLinkIdTop').setProperty('text', MCAPP.getText('GBL_EXPAND_ALL', this));
        this.byId('expandCollapseLinkIdBottom').setProperty('text', MCAPP.getText('GBL_EXPAND_ALL', this));
    },
    /***
     * Event Handler for Expand All/ Collapse All option. If clicked event is Expand, get all the OrderItemTable controls from RowRepeater
     * and Call expand function on each row.
     * Else
     * get all the OrderItemTable controls from RowRepeater and call collapse function on each row.
     * @param evt
     */
    onPressExpandCollapseAll: function(oEvent) {
    	var list = null;
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
            var elm = sap.ui.getCore().byId(domDiv[0].id);
            result.push(elm);
        }
        return result;
    },
    /***
     * This method is to open a Vehicle Estimator Dialog
     * Creates the dialog object, creates the view and set the content to the dialog
     * @param evt
     */
    onPressVehicleEst: function(evt) {
        MCAPP.setBusy(true);
        var oOkButton = new sap.ui.commons.Button({
            text: MCAPP.getText('GBL_OK', this),
            width: "90px",
            height: '30px'
        });
        oOkButton.attachPress(function(oEvent) {
            oEvent.getSource().getParent().close();
        });
        /*var oVehicleEstDialog = new mc.ccp.control.McDialog(this.createId('vehEstDialog'), {*/
        var oVehicleEstDialog = new mc.ccp.control.McDialog({
            modal: true,
            width: '40%',
            height: '50%',
            title: MCAPP.getText('VW_VEH_EST_TITLE', this),
            buttons: [oOkButton],
            closed: function(oEvent) {
                this.destroy();
            }
        }).addStyleClass('McCcpCustomDialog');
        oVehicleEstDialog.open();
        var oVehicleEstView = new sap.ui.view({
            type: sap.ui.core.mvc.ViewType.JS,
            viewName: "mc.ccp.order.VehicleEstimator"
        });
        oVehicleEstDialog.addContent(oVehicleEstView);
    },
    /***
     * This method is to open a Customer Id/Po Dialog
     * Creates the dialog object, creates the view and set the content to the dialog
     * @param evt
     */
    onPressAddCustId: function(evt) {
        MCAPP.setBusy(true);
        var oCustIdPoView = new sap.ui.view({
            type: sap.ui.core.mvc.ViewType.JS,
            viewName: "mc.ccp.order.AddCustId"
        });
        var oCancelButton = new sap.ui.commons.Button({
            text: this.getView().getModel('i18n').getProperty('GBL_CANCEL'),
            width: "90px",
            height: '30px'
        });
        oCancelButton.attachPress(oCustIdPoView.getController().onPressCancel, oCustIdPoView.getController());
        var oSaveButton = new sap.ui.commons.Button({
            text: this.getView().getModel('i18n').getProperty('GBL_SAVE'),
            width: "90px",
            height: '30px'
        });
        oSaveButton.attachPress(oCustIdPoView.getController().onPressSave, oCustIdPoView.getController());
        var oCustIdPoDialog = new mc.ccp.control.McDialog({
        	dirtyDependent : true,
            modal: true,
            width: '40%',
            height: '50%',
            title: this.getView().getModel('i18n').getProperty('VW_CUST_ID_PO_TITLE'),
            content: [oCustIdPoView],
            buttons: [oCancelButton, oSaveButton],
            closed: function(oEvent) {
            	MCAPP.setBusy(false);               	
            }
        }).addStyleClass('McCcpCustomDialog');
        oCustIdPoDialog.attachCloseClicked(oCustIdPoView.getController().onPressCancel, oCustIdPoView.getController());
        oCustIdPoDialog.open();
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
    /***
     * Event Handler for Cancel Button. Will display a confirmation message box to user whether he wants to revert his changes.
     * _callbackCancel is the call back method upon confirmation
     */
    onPressCancel: function() {
        var that = this;
        if (MCAPP.getDirtyFlag() === true) {
            sap.ui.commons.MessageBox.confirm(MCAPP.getText('GBL_CANCEL_CONFIRM'), function(bResult) {
                that._callbackCancel(bResult);
            }, MCAPP.getText('GBL_CONFIRM')).addStyleClass('McCcpCustomDialog');
        }
    },
    /***
     * Call back method to cancel the changes.
     * This will identify the changed record from original model and replace the record from backup model.
     * and clear the app level dirty flag
     * @param bResult
     */
    _callbackCancel: function(bResult) {
        if (bResult === true) {
            var rows = this._getVisibleRows();
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].getDirtyState() === true) {
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
        changedObj.ZCCP_WEEKSANDQTY_NAV.results[3].OrderedQty = backupObj.ZCCP_WEEKSANDQTY_NAV.results[3].OrderedQty;
        for (var i = 0; i <= 8; i++) {
            changedObj.ZCCP_WEEKSANDQTY_NAV.results[i].ProjDOI = backupObj.ZCCP_WEEKSANDQTY_NAV.results[i].ProjDOI;
            if (i >= 2) {
                changedObj.ZCCP_WEEKSANDQTY_NAV.results[i].DistForecast = backupObj.ZCCP_WEEKSANDQTY_NAV.results[i].DistForecast;
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
     * This method returns changed records in the current view by comparing the original model and backup model.
     * @returns {Array}
     */
    _getChangedRecords: function() {
        var rows = this._getVisibleRows();
        var originalModel = this.getView().getModel('backup');
        var changedDModel = this.getView().getModel();
        var changedRecords = [];
        for (var i = 0; i < rows.length; i++) {
        	var index = (rows[i].getBindingContext().sPath).split("/")[2];
        	 if (originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/0/ProjDOI') != 
             	changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/0/ProjDOI')) 
             {
                 changedRecords.push(changedDModel.getData().results[index].ZCCP_WEEKSANDQTY_NAV.results[0]);
             }
        	 if (originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/1/ProjDOI') != 
             	changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/1/ProjDOI')) 
             {
                 changedRecords.push(changedDModel.getData().results[index].ZCCP_WEEKSANDQTY_NAV.results[1]);
             }
            if (originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/2/DistForecast') != 
            	changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/2/DistForecast') ||
            	originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/2/ProjDOI') != 
                changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/2/ProjDOI')
            ) 
            {
                changedRecords.push(changedDModel.getData().results[index].ZCCP_WEEKSANDQTY_NAV.results[2]);
            }
            if (originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/3/OrderedQty') != 
            	changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/3/OrderedQty') || 
            	originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/3/DistForecast') != 
            	changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/3/DistForecast') ||
            	originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/3/ProjDOI') != 
                changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/3/ProjDOI')) 
            {
                changedRecords.push(changedDModel.getData().results[index].ZCCP_WEEKSANDQTY_NAV.results[3]);
            }
            if (originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/4/DistForecast') != 
            	changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/4/DistForecast') ||
            	originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/4/ProjDOI') != 
                changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/4/ProjDOI')) 
            {
                changedRecords.push(changedDModel.getData().results[index].ZCCP_WEEKSANDQTY_NAV.results[4]);
            }
            if (originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/5/DistForecast') != 
            	changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/5/DistForecast') ||
            	originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/5/ProjDOI') != 
                changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/5/ProjDOI')) 
            {
                changedRecords.push(changedDModel.getData().results[index].ZCCP_WEEKSANDQTY_NAV.results[5]);
            }
            if (originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/6/DistForecast') != 
            	changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/6/DistForecast') ||
            	originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/6/ProjDOI') != 
                changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/6/ProjDOI')) 
            {
                changedRecords.push(changedDModel.getData().results[index].ZCCP_WEEKSANDQTY_NAV.results[6]);
            }
            if (originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/7/DistForecast') != 
            	changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/7/DistForecast') ||
            	originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/7/ProjDOI') != 
                changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/7/ProjDOI')) 
            {
                changedRecords.push(changedDModel.getData().results[index].ZCCP_WEEKSANDQTY_NAV.results[7]);
            }
            if (originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/8/DistForecast') != 
            	changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/8/DistForecast') ||
            	originalModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/8/ProjDOI') != 
                changedDModel.getProperty(rows[i].getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/8/ProjDOI')) 
            {
                changedRecords.push(changedDModel.getData().results[index].ZCCP_WEEKSANDQTY_NAV.results[8]);
            }
        }
        return changedRecords;
    },
    /**
     * trigger navigation on selection of radio button. User will navigate to Change Request Page.
     * @param oEvent
     */
    onSelectChangeReq: function(oEvent) {
        MCAPP.navigateTo("ChangeRequest", {}, this, false, this._cancelCRPageNavigation);
    },
    /**
     * if user press on cancel button on the save prompt while navigation to CR page,
     * Navigation will not happen and reset the radio button selection.
     */
    _cancelCRPageNavigation: function() {
        var radiogrp = sap.ui.getCore().byId('RadioBut1');
        radiogrp.setSelected(true);
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
     * Method to retrive json properties based on column name.
     * @param col
     * @returns {String}
     */
    _getJsonColumn: function(col) {
        var result = '';
        switch (col) {
        	case this.byId('distSkuColId').getId():
                result = 'Dist_SKU';
                break;
        	case this.byId('skuColId').getId():
                result = 'SKU';
                break;
        	case this.byId('descColId').getId():
                result = 'SKU_Desc';
                break;
        	case this.byId('shipToColId').getId():
                result = 'ShipToId';
                break;
        	case this.byId('sourceColId').getId():
                result = 'SourceName';
                break;
        	case this.byId('transitColId').getId():
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
        }
        else {
            if (filterValue !== '') {
                var oFilter = new sap.ui.commons.RowRepeaterFilter("rrFilter", {
                    filters: [new sap.ui.model.Filter(column, oparator, filterValue)]
                });
                rowRepeater.addFilter(oFilter);
                rowRepeater.applyFilter("rrFilter");
            }
        }
        var combo = this.byId("comboBoxIdTop");
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
        var oPaginatory = this.byId("paginatorIdTop");
        oPaginatory.setNumberOfPages(parseInt(noOfPage));
        oPaginatory.setCurrentPage(1);
        oPaginatory = this.byId("paginatorIdBottom");
        oPaginatory.setNumberOfPages(parseInt(noOfPage));
        oPaginatory.setCurrentPage(1);
        MCAPP.setBusy(false);
    }
});