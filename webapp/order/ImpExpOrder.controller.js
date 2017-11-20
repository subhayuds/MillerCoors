/***
 * @Author OD79
 * @Date 11/20/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is Import / Export Order view controller
 */
sap.ui.controller("mc.ccp.order.ImpExpOrder", {
    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * This method retrieves the import order information expanded to ZCCP_ORD_CR_HEAD_ITM_NAV by passing selected shipto's and
     * assigns success and failure callback methods
     * Updates the label on the top
     * @memberOf order.ImpExpOrder
     */
    onInit: function() {
        // Get the Service MetaData File
        var oDataModel = new sap.ui.model.odata.ODataModel(MCAPP.getServiceUrl(MCAPP.getComponent().getModel('service').getProperty('/ImportOrderService')));
        this.getView().data('oDataModel', oDataModel);
        var thisContext = this;
        oDataModel.read('ZCCP_ORD_ITM_SET', null, {
            "$expand": "ZCCP_ORD_CR_HEAD_ITM_NAV",
            "$format": "json",
            "$filter": '(('+ MCAPP.getSelectedShiptoAsQryParam() + ') and (' + MCAPP.getFilterImpExp() +'))'
        }, false, function(oData, oResponse) {
            thisContext._dataLoadSuccess(oData, oResponse);
        }, function(oError) {
            thisContext._dataLoadFail(oError);
        });
        //Update the label on the view top
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
    _dataLoadSuccess: function(data, oResponse) {
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
        var obj = JSON.parse(oResponse.body);
        var oData = {};
        oData.results = obj.d.results;
        $.each(oData.results, function(i, item) {
            item.index = i + 1;
            item.expand = false;
            item.dirtyState = false;
            item.readOnly = readOnly;
            item.readOnlyRole = readOnlyRole;
            for (var x = 0; x < item.ZCCP_ORD_CR_HEAD_ITM_NAV.results.length; x++) {
                if (item.Week_No == item.ZCCP_ORD_CR_HEAD_ITM_NAV.results[x].Week_No) {
                    item.editableWeek = x + 1;
                    break;
                } else {
                    item.editableWeek = 0;
                }
            }
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
        MCAPP.setBusy(false);
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
            } else if (oEvent.getSource().getId().indexOf("comboBoxIdBottom") > 0) {
                previousValue = this.byId("comboBoxIdTop").getSelectedKey();
                currentValue = this.byId("comboBoxIdBottom").getSelectedKey();
            }
            if (parseInt(previousValue) > parseInt(currentValue)) {
                if (oEvent.getSource().getId().indexOf("comboBoxIdTop") > 0) {
                    this.byId("comboBoxIdTop").setSelectedKey(previousValue);
                } else {
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
        /*if(oEvent){
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
		}*/
        MCAPP.setBusy(false);
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
        var eventObject = oEvent;
        var aChangedRecords = this._getChangedRecords();
        if (aChangedRecords.length <= 0) {
            that._navigate(eventObject);
            return;
        }
        var oDataModel = this.getView().data('oDataModel');
        var dummyHeader = {};
        dummyHeader.ZCCP_ORD_CR_HEAD_ITM_NAV = aChangedRecords;
        oDataModel.create('/ZCCP_ORD_ITM_SET', dummyHeader, null, function(data) {
            var oChangedData = JSON.parse(JSON.stringify(that.getView().getModel().getData()));
            that.getView().getModel('backup').setData(oChangedData);
            MCAPP.clearDirtyFlag();
            that._navigate(eventObject);
            sap.m.MessageToast.show(MCAPP.getText('GBL_DATA_SAVE_MSG', this), {
                duration: MCAPP.getAppConfigAsInt('MsgToastDurationOnNavigation')
            });
        }, function(data) {
            eventObject.getSource().setCurrentPage(eventObject.getParameter('srcPage'));
            MCAPP.setBusy(false);
            sap.ui.commons.MessageBox.show(MCAPP.getText('GBL_DATA_SAVE_ERROR', that), sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', that), [sap.ui.commons.MessageBox.Action.OK]);
        });
    },
    
    /***
     * Navigation to desired page method by using RowRepeater's goToPage method.
     * @param oEvent
     */
    _navigate: function(oEvent) {
        var oRowRepeater = this.byId("rowRepeaterId");
        oRowRepeater.gotoPage(oEvent.getParameter("targetPage"));
        if (oEvent.getSource().getId().split('--')[1] == 'paginatorIdTop') {
            this.byId("paginatorIdBottom").setCurrentPage(parseInt(oEvent.getParameter("targetPage")));
        } else {
            this.byId("paginatorIdTop").setCurrentPage(parseInt(oEvent.getParameter("targetPage")));
        }
		/*var list = this._getVisibleRows();
		if (this.byId('expandCollapseLinkIdTop').getProperty('text').indexOf(MCAPP.getText('GBL_EXPAND_ALL', this)) >= 0) {
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
     * NOTE : This method also called from outside of the file (in case of navigation if any change)
     * @param oEvent
     */
    onPressSave: function(oEvent) {
        var that = this;
        var data = {};
        if (oEvent.getParameter('data')) {
            data = oEvent.getParameter('data');
            data.thisContext = this;
        } else {
            data.thisContext = this;
        }
        MCAPP.setBusy(true);
        var aChangedRecords = this._getChangedRecords();
        if (aChangedRecords.length <= 0) {
            MCAPP.setBusy(false);
            return;
        }
        var oDataModel = this.getView().data('oDataModel');
        var dummyHeader = {};
        dummyHeader.ZCCP_ORD_CR_HEAD_ITM_NAV = {};
        dummyHeader.ZCCP_ORD_CR_HEAD_ITM_NAV.results = aChangedRecords;
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
        var oChangedData = JSON.parse(JSON.stringify(data.thisContext.getView().getModel().getData()));
        data.thisContext.getView().getModel('backup').setData(oChangedData);
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
        MCAPP.updateHeaderImpExp(this);
        MCAPP.menuSelection(this);
    },
    
    /***
     * Event Handler for expand option
     * Logic: get All the rows check all rows are expanded, if you change the links to 'Collapse All'
     * @param oEvent
     */
    onExpandRow: function(oEvent) {
        var aList = this._getVisibleRows();
        var flag = false;
        for (var i = 0; i < aList.length; i++) {
            if (!aList[i].getExpand()) {
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
     * @param oEvent
     */
    onCollapseRow: function(oEvent) {
        this.byId('expandCollapseLinkIdTop').setProperty('text', MCAPP.getText('GBL_EXPAND_ALL', this));
        this.byId('expandCollapseLinkIdBottom').setProperty('text', MCAPP.getText('GBL_EXPAND_ALL', this));
    },
    
    /***
     * Event Handler for Expand All/ Collapse All option. If clicked event is Expand, get all the OrderItemTable controls from RowRepeater
     * and Call expand function on each row.
     * Else
     * get all the OrderItemTable controls from RowRepeater and call collapse function on each row.
     * @param oEvent
     */
    onPressExpandCollapseAll: function(oEvent) {
        var aList = null;
        if (this.byId('expandCollapseLinkIdTop').getProperty('text').indexOf(MCAPP.getText('GBL_EXPAND_ALL', this)) >= 0) {
            aList = this._getVisibleRows();
            for (var i = 0; i < aList.length; i++) {
                aList[i].expand();
            }
            this.byId('expandCollapseLinkIdTop').setProperty('text', MCAPP.getText('GBL_COLLAPSE_ALL', this));
            this.byId('expandCollapseLinkIdBottom').setProperty('text', MCAPP.getText('GBL_COLLAPSE_ALL', this));
        } else {
            aList = this._getVisibleRows();
            for (var a = 0; a < aList.length; a++) {
                aList[a].collapse();
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
        var aResult = [];
        var oDomRef = this.byId('rowRepeaterId').getDomRef();
        var domLi = $(oDomRef).find('li[class=sapUiRrRow]');
        for (var i = 0; i < domLi.length; i++) {
            var domDiv = $(domLi[i]).find('div');
            var elm = sap.ui.getCore().byId(domDiv[0].id);
            aResult.push(elm);
        }
        return aResult;
    },
    
    /***
     * This method is to open a Vehicle Estimator Dialog
     * Creates the dialog object, creates the view and set the content to the dialog
     * @param evt
     */
    onPressVehicleEstimator: function(evt) {
        MCAPP.setBusy(true);
        var oOkButton = new sap.ui.commons.Button({
            text: MCAPP.getText('GBL_OK', this),
            width: "90px",
            height: '30px'
        });
        oOkButton.attachPress(function(oEvent) {
            oEvent.getSource().getParent().close();
        });
        var oVehicleEstimatorDialog = new mc.ccp.control.McDialog('vehEstDialog', {
            modal: true,
            width: '40%',
            height: '50%',
            title: MCAPP.getText('VW_VEH_EST_TITLE', this),
            buttons: [oOkButton],
            closed: function(oEvent) {
                this.destroy();
            }
        }).addStyleClass('McCcpCustomDialog');
        oVehicleEstimatorDialog.open();
        var oVehicleEstimatorView = new sap.ui.view({
            type: sap.ui.core.mvc.ViewType.JS,
            viewName: "mc.ccp.order.VehicleEstimator"
        });
        oVehicleEstimatorDialog.addContent(oVehicleEstimatorView);
    },
    
    /***
     * This method is to open a Customer Id/PO Dialog
     * Creates the dialog object, creates the view and set the content to the dialog
     * @param evt
     */
    onPressAddCustomIdPO: function(evt) {
        MCAPP.setBusy(true);
        var oCustomIdPoView = new sap.ui.view({
            type: sap.ui.core.mvc.ViewType.JS,
            viewName: "mc.ccp.order.AddCustId"
        });
        var oCancelButton = new sap.ui.commons.Button({
            text: this.getView().getModel('i18n').getProperty('GBL_CANCEL'),
            width: "90px",
            height: '30px'
        });
        oCancelButton.attachPress(oCustomIdPoView.getController().onPressCancel, oCustomIdPoView.getController());
        var oSaveButton = new sap.ui.commons.Button({
            text: this.getView().getModel('i18n').getProperty('GBL_SAVE'),
            width: "90px",
            height: '30px'
        });
        oSaveButton.attachPress(oCustomIdPoView.getController().onPressSave, oCustomIdPoView.getController());
        var oCustomIdPoDialog = new mc.ccp.control.McDialog({
        	dirtyDependent : true,
            modal: true,
            width: '40%',
            height: '50%',
            title: this.getView().getModel('i18n').getProperty('VW_CUST_ID_PO_TITLE'),
            content: [oCustomIdPoView],
            buttons: [oCancelButton, oSaveButton],
            closed: function(oEvent) {
                oCustomIdPoView.getController().onPressCancel(oEvent);
            }
        }).addStyleClass('McCcpCustomDialog');
        oCustomIdPoDialog.attachCloseClicked(oCustomIdPoView.getController().onPressCancel, oCustomIdPoView.getController());
        oCustomIdPoDialog.open();
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
            var aRows = this._getVisibleRows();
            for (var i = 0; i < aRows.length; i++) {
                if (aRows[0].getDirtyState() === true) {
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
            var aRows = this._getVisibleRows();
            for (var i = 0; i < aRows.length; i++) {
                if (aRows[i].getDirtyState() === true) {
                    var index = this.getView().getModel('backup').getProperty(aRows[i].getBindingContext().sPath + '/index');
                    this._revertChanges(index);
                    aRows[i].setDirtyState(false);
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
        var oBackupModel = this.getView().getModel('backup');
        var backupObject = this._getObjectByIndex(oBackupModel, index);
        var oChangedModel = this.getView().getModel();
        var changedObject = this._getObjectByIndex(oChangedModel, index);
        //Now Copy One by One
        changedObject.ZCCP_ORD_CR_HEAD_ITM_NAV.results[changedObject.editableWeek - 1].OrderedQty = backupObject.ZCCP_ORD_CR_HEAD_ITM_NAV.results[backupObject.editableWeek - 1].OrderedQty;
        for (var i = 0; i < 13; i++) {
            changedObject.ZCCP_ORD_CR_HEAD_ITM_NAV.results[i].ProjDOI = backupObject.ZCCP_ORD_CR_HEAD_ITM_NAV.results[i].ProjDOI;
            if (i >= 2) {
                changedObject.ZCCP_ORD_CR_HEAD_ITM_NAV.results[i].DistForecast = backupObject.ZCCP_ORD_CR_HEAD_ITM_NAV.results[i].DistForecast;
            }
        }
        oChangedModel.refresh();
    },
    
    /**
     * Method to get the object based on Index
     * @param model
     * @param index
     * @returns record from the model at the index passed
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
             viewName: "mc.ccp.inventory.ImportInventoryWS",
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
        var aRows = this._getVisibleRows();
        var oOriginalModel = this.getView().getModel('backup');
        var oChangedModel = this.getView().getModel();
        var aChangedRecords = [];
        for (var i = 0; i < aRows.length; i++) {
        	var index = (aRows[i].getBindingContext().sPath).split("/")[2];
            var aWeeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
            var editableWeek = oOriginalModel.getProperty(aRows[i].getBindingContext().sPath + '/editableWeek');
            var aFiltered;
            if (editableWeek !== 0) {
                //editableWeek = editableWeek - 1;
                aFiltered = jQuery.grep(aWeeks, function(value) {
                    return value != editableWeek;
                });
                if (oOriginalModel.getProperty(aRows[i].getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/' + (editableWeek - 1) + '/OrderedQty') != 
                	oChangedModel.getProperty(aRows[i].getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/' + (editableWeek - 1) + '/OrderedQty') || 
                	oOriginalModel.getProperty(aRows[i].getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/' + (editableWeek - 1) + '/DistForecast') != 
                	oChangedModel.getProperty(aRows[i].getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/' + (editableWeek - 1) + '/DistForecast') 
                	||
                	oOriginalModel.getProperty(aRows[i].getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/' + (editableWeek - 1) + '/ProjDOI') != 
                    oChangedModel.getProperty(aRows[i].getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/' + (editableWeek - 1) + '/ProjDOI')
                	) {
                    aChangedRecords.push(oChangedModel.getData().results[index].ZCCP_ORD_CR_HEAD_ITM_NAV.results[editableWeek - 1]);
                }
                for (var x = 0; x < aFiltered.length; x++) {
                    var currentIndex = aFiltered[x];
                    if (oOriginalModel.getProperty(aRows[i].getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/' + (currentIndex - 1) + '/DistForecast') != 
                    	oChangedModel.getProperty(aRows[i].getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/' + (currentIndex - 1) + '/DistForecast') 
                    	||
                    	oOriginalModel.getProperty(aRows[i].getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/' + (currentIndex - 1) + '/ProjDOI') != 
                        oChangedModel.getProperty(aRows[i].getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/' + (currentIndex - 1) + '/ProjDOI')
                        ) {
                        aChangedRecords.push(oChangedModel.getData().results[index].ZCCP_ORD_CR_HEAD_ITM_NAV.results[currentIndex - 1]);
                    }
                }
            } else {
                for (var y = 0; y < aWeeks.length; y++) {
                    var ind = aWeeks[y];
                    if (oOriginalModel.getProperty(aRows[i].getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/' + (ind -1) + '/DistForecast') != 
                    	oChangedModel.getProperty(aRows[i].getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/' + (ind - 1) + '/DistForecast') 
                    	||
                    	oOriginalModel.getProperty(aRows[i].getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/' + (ind - 1) + '/ProjDOI') != 
                        oChangedModel.getProperty(aRows[i].getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/' + (ind - 1) + '/ProjDOI')
                        ) {
                        aChangedRecords.push(oChangedModel.getData().results[index].ZCCP_ORD_CR_HEAD_ITM_NAV.results[ind - 1]);
                    }
                }
            }
        }
        return aChangedRecords;
    },
    
    /**
     * if user press on cancel button on the save prompt while navigation to CR page,
     * Navigation will not happen and reset the radio button selection.
     */
    _cancelCRPageNavigation: function() {
        var oRadioGroup = sap.ui.getCore().byId('RadioBut1');
        oRadioGroup.setSelected(true);
    },
    
    /***
     * Event Handler for Sort Option
     * @param evt
     */
    onSortColumn: function(evt) {
        if (MCAPP.getDirtyFlag() === true) {
            sap.ui.commons.MessageBox.alert(MCAPP.getText('GBL_SAVE_PROMP_SORT', this));
            return;
        }else{
        	var oData = this.getView().getModel().getData();
            $.each(oData.results, function(i, item) {
                item.Dist_SKU = parseInt(item.Dist_SKU);
                item.SKU = parseInt(item.SKU);
                item.ShipToId = parseInt(item.ShipToId);
                item.EstdTransitDays = parseInt(item.EstdTransitDays);
            });
            if (evt.getParameter('sortOrder') == sap.ui.table.SortOrder.Ascending) {
                this.byId('rowRepeaterId').triggerSort(evt.getParameter('column').sId + '-Asc');
            } else {
                this.byId('rowRepeaterId').triggerSort(evt.getParameter('column').sId + '-Dsc');
            }
        }
    },
    
    /**
     * Method to retrieve json properties based on column name.
     * @param col
     * @returns {String}
     */
    _getJsonColumn: function(col) {
    	var result = '';
    	switch (col) {
    	case this.byId('distSkuColIdIo').getId():
    		result = 'Dist_SKU';
    		break;
    	case this.byId('skuColIdIo').getId():
    		result = 'SKU';
    		break;
    	case this.byId('descColIdIo').getId():
    		result = 'SKU_Desc';
    		break;
    	case this.byId('shipToColIdIo').getId():
    		result = 'ShipToId';
    		break;
    	case this.byId('sourceColIdIo').getId():
    		result = 'SourceId';
    		break;
    	case this.byId('transitColIdIo').getId():
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
        var oRowRepeater = this.byId('rowRepeaterId');
        var column = this._getJsonColumn(evt.getParameter('column').sId);
        var operator = sap.ui.model.FilterOperator.EQ;
        if (column == 'SKU_Desc') {
            operator = sap.ui.model.FilterOperator.Contains;
        }
        var oRowRepeaterFilters = oRowRepeater.getFilters();
        oRowRepeater.destroyFilters();
        var collect = [];
        if (oRowRepeaterFilters.length > 0) {
            var filters = oRowRepeaterFilters[0].getFilters();
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
            oRowRepeater.addFilter(oFilterNew);
            oRowRepeater.applyFilter("rrFilter");
        } else {
            if (filterValue !== '') {
                var oFilter = new sap.ui.commons.RowRepeaterFilter("rrFilter", {
                    filters: [new sap.ui.model.Filter(column, operator, filterValue)]
                });
                oRowRepeater.addFilter(oFilter);
                oRowRepeater.applyFilter("rrFilter");
            }
        }
        var oComboBox = this.byId("comboBoxIdTop");
        //var oRowRepeater = this.byId("rowRepeaterId");
        oRowRepeater.setNumberOfRows(parseInt(oComboBox.getSelectedKey()));
        oRowRepeater.gotoPage(1);
        dataLength = oRowRepeater._getRowCount();
        var oPerPage = oComboBox.getSelectedKey();
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
    }
});