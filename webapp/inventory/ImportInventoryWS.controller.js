/***
 * @Author II84
 * @Date 03-12-2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is Controller for Import Inventory WorkSheet View.
 */
sap.ui.controller("mc.ccp.inventory.ImportInventoryWS", {

	/**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * This method retrieves the Import Inventory WorkSheet information expanded to ZCCP_INV_IMP_SKU_HEAD_DUMMY_SET by passing selected shipToId,Source Id and SKU values.
     * @memberOf inventory.ImportInventoryWS
     */
    onInit: function() {
        // Get the Service MetaData File
        var oDataModelItems = new sap.ui.model.odata.ODataModel(MCAPP.getServiceUrl(MCAPP.getComponent().getModel('service').getProperty('/ImportInventoryWS')));
        this.getView().data('oDataModel', oDataModelItems);
        thisContext = this;
        thisCurrentSKU = "";
        
        //Selected SKU No - passed from Import Inventory Main Page at 2nd Position
        var sSku = this.getView().getViewData()[1];
        //Selected Source Id - passed from Import Inventory Main Page at 5th Position
        var sSourceId = this.getView().getViewData()[4];
        ////Selected ShipTo Id - passed from Import Inventory Main Page at 4th Position
        var sShipToId = this.getView().getViewData()[3];
        
        oDataModelItems.read('ZCCP_INV_IMP_SKU_HEAD_DUMMY_SET(SourceId=\'' + sSourceId + '\',SKU=\'' + sSku + '\',ShipToId=\'' + sShipToId + '\')', null, {
        	"$expand": "ZCCP_DUMMY_TO_INV_IMP_SKU_NAV",
            "$format": "json",
            "$filter": MCAPP.getFilterForImportInventoryWorkSheet(sShipToId, sSourceId, sSku)
        }, false, function(oData, oResponse) {
            thisContext._dataLoadSuccess(oData, oResponse);
        }, function(oError) {
            thisContext._dataLoadFail(oError);
        });
    },
    
    /**
     * This method is called when data load fails inside onInit method.
     * removes the onload image and shows the application and displays the error message box.
     * @param oError
     * @memberOf inventory.ImportInventoryWS
     */
    _dataLoadFail: function(oError) {
        // removing onload image and show the Application.
        jQuery.sap.byId('ApploadingDivId').hide();
        jQuery.sap.byId('content').show();
        sap.ui.commons.MessageBox.show(MCAPP.getText('GBL_DATA_LOAD_ERROR', this), sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', this), [sap.ui.commons.MessageBox.Action.OK]);
    },
    
    /**
     *whenever user change current page value of paginator in the Inventory WorkSheet page
     *it will display the corresponding SKU details information in the Custom Table
     *@param oEvent
     **/
    onChangePaginatorValue: function(oEvent) {
        var currentPageValue = parseInt(oEvent.target.value);
        var paginator = oEvent.srcControl;
        paginator.setCurrentPage(currentPageValue);
        var preservedCurrentOrderWeek = this.getView().getViewData()[8];
        
        if (currentPageValue <= MCAPP.getCurrentView().getModel().getData().results.length) {
            var myView = this.getView();
            var dummyHeader = {};
            var that = myView.getController();
            var changedRecords = that._getChangedRecords();
            if (changedRecords.length >= 1) {
            	that._removeFlagFromChangedRecords(changedRecords);
                dummyHeader.ZCCP_DUMMY_TO_INV_IMP_SKU_NAV = changedRecords;
                var oDataModel = this.getView().data('oDataModel');
                oDataModel.create('/ZCCP_INV_IMP_SKU_HEAD_DUMMY_SET', dummyHeader, null, function(data) {
                	
                	//Saving the Changed Data Again
                	for(var i=0; i<that.getView().getModel().getData().InventoryItemsData.length; i++){
                		that.getView().getModel().getData().InventoryItemsData[i].currentOrderWeek = preservedCurrentOrderWeek;                		
                	}
                    var changedData = JSON.parse(JSON.stringify(that.getView().getModel().getData()));
                    that.getView().getModel('backup').setData(changedData);
                    MCAPP.clearDirtyFlag();
                    MCAPP.setBusy(false);
                    sap.m.MessageToast.show(MCAPP.getText('GBL_DATA_SAVE_MSG', this), {
                        duration: MCAPP.getAppConfigAsInt('MsgToastDurationOnNavigation')
                    });
                }, function(data) {
                    MCAPP.setBusy(false);
                    if(data.response != null && data.response.body != null){
                    	var errorMessageFromBackend = jQuery.parseXML(data.response.body).getElementsByTagName("message")[0].firstChild.nodeValue;
                    									//$(data.response.body).find("message")[0].firstChild.nodeValue;
                    	sap.ui.commons.MessageBox.show(errorMessageFromBackend, sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', that), [sap.ui.commons.MessageBox.Action.OK]);
                    }
                    else{
                    	sap.ui.commons.MessageBox.show(MCAPP.getText('GBL_DATA_SAVE_ERROR', that), sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', that), [sap.ui.commons.MessageBox.Action.OK]);
                    }
                });
            }
            var oSKUArray = MCAPP.getCurrentView().getModel().getData();
            var oInventoryData = oSKUArray.results[currentPageValue - 1];
            thisCurrentSKU = oInventoryData.SKU;
            var oDataModelItems = new sap.ui.model.odata.ODataModel(MCAPP.getServiceUrl(MCAPP.getComponent().getModel('service').getProperty('/ImportInventoryWS')));
            myView.data('oDataModel', oDataModelItems);
            thisContext = myView.getController();
            oDataModelItems.read('ZCCP_INV_IMP_SKU_HEAD_DUMMY_SET(SourceId=\'' + oInventoryData.SourceId + '\',SKU=\'' + oInventoryData.SKU + '\',ShipToId=\'' + oInventoryData.ShipToId + '\')', null, {
            	"$expand": "ZCCP_DUMMY_TO_INV_IMP_SKU_NAV",
                "$format": "json",
                "$filter": MCAPP.getFilterForImportInventoryWorkSheet(oInventoryData.ShipToId, oInventoryData.SourceId, oInventoryData.SKU)
            }, false, function(oData, oResponse) {
                thisContext._dataLoadSuccess(oData, oResponse, currentPageValue);
            }, function(oError) {
                thisContext._dataLoadFail(oError);
            });
        }
    },
    
    /***
     * called when data load is successful in onChangePaginatorValue method
     * It will parse the JSON response and put the index, dirtyState, expand and readOnly flags in the parsed JSON response
     * It will split Result JSON object into two entity arrays in oInvWSData object.
     * and sets the model to the current view along with creating a backup model and setting it to view.
     * @param oData
     * @param oResponse
     *  @param page - page on which screen would navigate after Save
     */
    _dataLoadSuccess: function(oData, oResponse, page) {
        var readOnly = MCAPP.isReadOnlyState();
        var obj = JSON.parse(oResponse.body);
        var oJsonData = {};
        oJsonData = obj.d.ZCCP_DUMMY_TO_INV_IMP_SKU_NAV.results;        
        var currentOrderWeek = this.getView().getViewData()[8];
        var oInvWSData = {
            AnalyticsData: [],
            InventoryItemsData: []
        };
        $.each(oJsonData, function(i, item) {
            item.index = i + 1;
            item.expand = false;
            item.dirtyState = false;
            item.readOnly = readOnly;
          //Updated with Current Order Week 
            item.currentOrderWeek = currentOrderWeek;
            if (item.DistForecast === 0 && item.PriorYearSales === 0)
                item.PERCENTAGE_SALES = "0%";
            else
                item.PERCENTAGE_SALES = parseInt((item.DistForecast - item.PriorYearSales) / ((parseInt(item.DistForecast) + parseInt(item.PriorYearSales)) / 2)) + "%";
            if (item.CurrentYearSales === 0)
                item.FRST_ACCURACY = "0%";
            else
                item.FRST_ACCURACY = parseInt(1 - Math.abs((item.DistForecast - item.CurrentYearSales) / item.CurrentYearSales)) + "%";
            if (i <= 3) {
                oInvWSData.AnalyticsData.push(item);
            }
            if (i >= 3) {
                oInvWSData.InventoryItemsData.push(item);
            }
        });
        var oModel = new sap.ui.model.json.JSONModel();
        oModel.setData(oInvWSData);
        this.getView().setModel(oModel);
      //Calculating the Position of Current Order Week
        MCAPP.calculatePositionCurrentOrderWeek(oModel);
        //End
        //Get Copy of Original Data
        var oCopyOfData = JSON.parse(JSON.stringify(oInvWSData));
        // creating the backup model
        var oModelBackup = new sap.ui.model.json.JSONModel();
        oModelBackup.setData(oCopyOfData);
        this.getView().setModel(oModelBackup, "backup");
        
        //Its the case of dataLoad Success at onInit
        if (null !== this.getView().oParent && page != undefined && page != null) {
        	var oSKUArray = this.getView().oParent.getModel().getData();
            var oInventoryData = oSKUArray.results[page - 1];
            this.getView().getViewData()[1] = oInventoryData.SKU;
            thisCurrentSKU = oInventoryData.SKU;
            this.byId("distSKUId").setText(oInventoryData.Dist_SKU);
            this.byId("SKUId").setText(oInventoryData.SKU);
            this.byId("distSKUDescId").setText(oInventoryData.SKU_Desc);
            this.byId("shipToId").setText(oInventoryData.ShipToId);
            this.byId("sourceId").setText(oInventoryData.SourceId);
            this.byId("transTimeId").setText(oInventoryData.EstdTransitDays);
        }
        
    },
    
    /**
     * Event Handler for Save Button. Changes will be saved to backend in case of any change.
     * @param oEvent
     * @memberOf inventory.ImportInventoryWS
     */
    onPressSave: function(oEvent) {
        var that = this.getParent().getParent().getAggregation("content")[0].getController();
        var oCurrentView = this.getParent().getParent().getAggregation("content")[0];
        var dummyHeader = {};
        var changedRecords = that._getChangedRecords();
        //Preserving the value for Current Editable Order Week
        var preservedCurrentOrderWeek = that.getView().getViewData()[8];
        
        if (changedRecords.length >= 1) {
            that._removeFlagFromChangedRecords(changedRecords);
            dummyHeader.ZCCP_DUMMY_TO_INV_IMP_SKU_NAV = changedRecords;
            var oDataModel = oCurrentView.data('oDataModel');
            oDataModel.create('/ZCCP_INV_IMP_SKU_HEAD_DUMMY_SET', dummyHeader, null, function(data) {
            	//Saving the Changed Data Again
            	for(var i=0; i<that.getView().getModel().getData().InventoryItemsData.length; i++){
            		that.getView().getModel().getData().InventoryItemsData[i].currentOrderWeek = preservedCurrentOrderWeek;
            	}
                var changedData = JSON.parse(JSON.stringify(that.getView().getModel().getData()));
                that.getView().getModel('backup').setData(changedData);
                MCAPP.clearDirtyFlag();
                MCAPP.setBusy(false);
                sap.m.MessageToast.show(MCAPP.getText('GBL_DATA_SAVE_MSG', this), {
                    duration: MCAPP.getAppConfigAsInt('MsgToastDurationOnNavigation')
                });
            }, function(data) {
                MCAPP.setBusy(false);
                if(data.response != null && data.response.body != null){
                	var errorMessageFromBackend = jQuery.parseXML(data.response.body).getElementsByTagName("message")[0].firstChild.nodeValue;
                									//$(data.response.body).find("message")[0].firstChild.nodeValue;
                	sap.ui.commons.MessageBox.show(errorMessageFromBackend, sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', that), [sap.ui.commons.MessageBox.Action.OK]);
                }
                else{
                	sap.ui.commons.MessageBox.show(MCAPP.getText('GBL_DATA_SAVE_ERROR', that), sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', that), [sap.ui.commons.MessageBox.Action.OK]);
                }
            });
        }
    },
    
    /**
     * helping method called within the onSave method.
     * the method will remove all the flags from changed records
     * @param changedRecords
     * @memberOf inventory.ImportInventoryWS
     */
    _removeFlagFromChangedRecords: function(changedRecords) {
        for (var i = 0; i < changedRecords.length; i++) {
            delete changedRecords[i].dirtyState;
            delete changedRecords[i].expand;
            delete changedRecords[i].index;
            delete changedRecords[i].readOnly;
            delete changedRecords[i].FRST_ACCURACY;
            delete changedRecords[i].PERCENTAGE_SALES;
            delete changedRecords[i].currentOrderWeek;
        }
    },
    
    /**
     * This method returns changed records in the current view by comparing the original model and backup model.
     * @returns {Array}
     * @memberOf inventory.ImportInventoryWS
     */
    _getChangedRecords: function() {
        var thisView = this.getView();
        var thisController = thisView.getController();
        var rows = thisController._getVisibleRows();
        var originalModel = thisView.getModel('backup');
        var changedModel = thisView.getModel();
        var changedRecords = [];
        var noOfWeeks=15;
        var i = 0;
        //Get the Current Ordered Week
        var positionCurrentOrderWeek = MCAPP.getPositionCurrentOrderWeek();
        
        for(i = 0; i<=positionCurrentOrderWeek; i++){
        	if(i === 0 || i === 1){
        		if (originalModel.getProperty('/InventoryItemsData/' + i + '/Ins_Out') != rows[0].getAggregation("insOutsQuantityWeek" + (i+1)).getProperty("value")
        				|| originalModel.getData().InventoryItemsData[i].BegINV != changedModel.getData().InventoryItemsData[i].BegINV
						 || originalModel.getData().InventoryItemsData[i].EndINV != changedModel.getData().InventoryItemsData[i].EndINV 
						 || originalModel.getData().InventoryItemsData[i].ProjDOI != changedModel.getData().InventoryItemsData[i].ProjDOI) {
                    changedRecords.push(changedModel.getData().InventoryItemsData[i]);
                }
        	}
        	if(i === positionCurrentOrderWeek){
        		if (originalModel.getProperty('/InventoryItemsData/' + i + '/Ins_Out') != rows[0].getAggregation("insOutsQuantityWeek" + (i+1)).getProperty("value")
        				|| originalModel.getProperty('/InventoryItemsData/' + i + '/DistForecast') != rows[0].getAggregation("distForecastQuantityWeek" + (i+1)).getProperty("value")
        				|| originalModel.getProperty('/InventoryItemsData/' + positionCurrentOrderWeek +'/Current_Ord_Qty') != rows[0].getAggregation("currentOrderedQuantity").getProperty("value")
        				|| originalModel.getData().InventoryItemsData[i].BegINV != changedModel.getData().InventoryItemsData[i].BegINV
						 || originalModel.getData().InventoryItemsData[i].EndINV != changedModel.getData().InventoryItemsData[i].EndINV 
						 || originalModel.getData().InventoryItemsData[i].ProjDOI != changedModel.getData().InventoryItemsData[i].ProjDOI) {
                    changedRecords.push(changedModel.getData().InventoryItemsData[i]);
                }
        	}
        	else{
        		if (originalModel.getProperty('/InventoryItemsData/' + i + '/Ins_Out') != rows[0].getAggregation("insOutsQuantityWeek" + (i+1)).getProperty("value")
        				|| originalModel.getProperty('/InventoryItemsData/' + i + '/DistForecast') != rows[0].getAggregation("distForecastQuantityWeek" + (i+1)).getProperty("value")
        				|| originalModel.getData().InventoryItemsData[i].BegINV != changedModel.getData().InventoryItemsData[i].BegINV
						 || originalModel.getData().InventoryItemsData[i].EndINV != changedModel.getData().InventoryItemsData[i].EndINV 
						 || originalModel.getData().InventoryItemsData[i].ProjDOI != changedModel.getData().InventoryItemsData[i].ProjDOI) {
                    changedRecords.push(changedModel.getData().InventoryItemsData[i]);
                }
        	}        	
        }
        for(i = positionCurrentOrderWeek+1; i<noOfWeeks; i++){
        	if (originalModel.getProperty('/InventoryItemsData/' + i + '/DistForecast') != rows[0].getAggregation("distForecastQuantityWeek" + (i+1)).getProperty("value")
        			|| originalModel.getData().InventoryItemsData[i].BegINV != changedModel.getData().InventoryItemsData[i].BegINV
					 || originalModel.getData().InventoryItemsData[i].EndINV != changedModel.getData().InventoryItemsData[i].EndINV 
					 || originalModel.getData().InventoryItemsData[i].ProjDOI != changedModel.getData().InventoryItemsData[i].ProjDOI) {
                changedRecords.push(changedModel.getData().InventoryItemsData[i]);
            }
        }
//        if (originalModel.getProperty('/InventoryItemsData/' + positionCurrentOrderWeek +'/Current_Ord_Qty') != rows[0].getAggregation("currentOrderedQuantity").getProperty("value")
//        		|| originalModel.getData().InventoryItemsData[i].BegINV != changedDModel.getData().InventoryItemsData[i].BegINV
//				 || originalModel.getData().InventoryItemsData[i].EndINV != changedDModel.getData().InventoryItemsData[i].EndINV 
//				 || originalModel.getData().InventoryItemsData[i].ProjDOI != changedDModel.getData().InventoryItemsData[i].ProjDOI) {
//            changedRecords.push(changedModel.getData().InventoryItemsData[positionCurrentOrderWeek]);
//        }
        return changedRecords;
    },
    
    /**
     * This method will return the displayed custom controls on the screen
     * @returns {Array}
     * @memberOf inventory.ImportInventoryWS
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
     * Event Handler for Cancel Button. Will display a confirmation message box to user whether he wants to revert his changes.
     * _callbackCancel is the call back method upon confirmation
     * @param oEvent
     * @memberOf inventory.ImportInventoryWS
     */
    onPressCancel: function(oEvent) {
        var oCancelLink = this;
        var that;
        if(this.sId !== undefined)
        	//Clicked from Cancel Link
        	that = this.getParent().getParent().getAggregation("content")[0].getController();
        else
        	//Clicked from X top icon
        	that = this.getView().getController();
        var changedRecords = that._getChangedRecords();
        if (changedRecords.length >= 1) {
            sap.ui.commons.MessageBox.confirm(MCAPP.getText('GBL_CANCEL_CONFIRM', this), function(bResult) {
            	if(bResult)
            		{
	            		that._callbackCancel(bResult);
	            		if(this.sId !== undefined)
	            			oCancelLink.getParent().getParent().close();
	            		else
	            			that.getView().getParent().close();
            		}
                
            }, MCAPP.getText('GBL_CONFIRM', this));
        }
        else {
        	if(this.sId !== undefined)
        		oEvent.getSource().getParent().getParent().close();
        	else
        		oEvent.getSource().close();
        }
    },
    
    /***
     * Call back method to cancel the changes.
     * This will identify the changed record from original model and replace the record from backup model.
     * and clear the application level dirty flag
     * @param bResult
     * @memberOf inventory.ImportInventoryWS
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
    
    /**
     * revert the changes in the model based on the index. This will get the InsOuts, Current Order Quantity, Change Request Quantity one by one from back up model
     * and copy the same values in original model.
     * @param index
     * @memberOf inventory.ImportInventoryWS
     */
    _revertChanges: function(index) {
    	var noOfWeeks = 15;
        var originalModel = this.getView().getModel('backup');
        var changedModel = this.getView().getModel();
        
      //Get the Current Ordered Week
        var positionCurrentOrderWeek = MCAPP.getPositionCurrentOrderWeek();
        
        for(var i = 0; i<=positionCurrentOrderWeek; i++){
        	if (originalModel.getData().InventoryItemsData[i].Ins_Out != changedModel.getData().InventoryItemsData[i].Ins_Out) {
                changedModel.getData().InventoryItemsData[i].Ins_Out = originalModel.getData().InventoryItemsData[i].Ins_Out;
            }
        }        
        if (originalModel.getData().InventoryItemsData[positionCurrentOrderWeek].Current_Ord_Qty != changedModel.getData().InventoryItemsData[positionCurrentOrderWeek].Current_Ord_Qty) {
            changedModel.getData().InventoryItemsData[positionCurrentOrderWeek].Current_Ord_Qty = originalModel.getData().InventoryItemsData[positionCurrentOrderWeek].Current_Ord_Qty;
        }
        for (var i = 0; i <noOfWeeks; i++) {
            if (originalModel.getData().InventoryItemsData[i].ProjDOI != changedModel.getData().InventoryItemsData[i].ProjDOI) {
                changedModel.getData().InventoryItemsData[i].ProjDOI = originalModel.getData().InventoryItemsData[i].ProjDOI;
            }
        }
        
        //Dist Forecast
        for (var i = 2; i <noOfWeeks; i++) {
            if (originalModel.getData().InventoryItemsData[i].DistForecast != changedModel.getData().InventoryItemsData[i].DistForecast) {
                changedModel.getData().InventoryItemsData[i].DistForecast = originalModel.getData().InventoryItemsData[i].DistForecast;
            }
        }
        //reverting the model with previous BegINV
        for (var i = 0; i < noOfWeeks; i++) {
            if (originalModel.getData().InventoryItemsData[i].BegINV != changedModel.getData().InventoryItemsData[i].BegINV) {
                changedModel.getData().InventoryItemsData[i].BegINV = originalModel.getData().InventoryItemsData[i].BegINV;
            }
        }
        //reverting the model with previous EndINV
        for (var i = 0; i < noOfWeeks; i++) {
            if (originalModel.getData().InventoryItemsData[i].EndINV != changedModel.getData().InventoryItemsData[i].EndINV) {
                changedModel.getData().InventoryItemsData[i].EndINV = originalModel.getData().InventoryItemsData[i].EndINV;
            }
        }
        //reverting the model with previous Inv_Variance
        for (var i = 0; i < noOfWeeks-13; i++) {
            if (originalModel.getData().InventoryItemsData[i].Inv_Variance != changedModel.getData().InventoryItemsData[i].Inv_Variance) {
                changedModel.getData().InventoryItemsData[i].Inv_Variance = originalModel.getData().InventoryItemsData[i].Inv_Variance;
            }
        }
        changedModel.refresh();
    },
    
    /**
     *whenever user clicks on "save & previous" link in dialog box footer of Inventory Main
     *it will display the previous SKU details in the Custom Table
     *@param oEvent
     *@memberOf inventory.ImportInventoryWS
     **/
    onPressPreviousSku: function(oEvent) {
        var currentPageValue = oEvent.getSource().getParent().getCurrentPage();
        if (currentPageValue < MCAPP.getCurrentView().getModel().getData().results.length 
        		&& currentPageValue >= 1) {
            var currentView = this.getParent().getParent().getParent().getAggregation("content")[0];
            var that = currentView.getController();
            var dummyHeader = {};
            var changedRecords = that._getChangedRecords();
            //Preserving the value for Current Editable Order Week
            var preservedCurrentOrderWeek = that.getView().getViewData()[8];
            
            if (changedRecords.length >= 1) {
                that._removeFlagFromChangedRecords(changedRecords);
                dummyHeader.ZCCP_DUMMY_TO_INV_IMP_SKU_NAV = changedRecords;
                var oDataModel = currentView.data('oDataModel');
                oDataModel.create('/ZCCP_INV_IMP_SKU_HEAD_DUMMY_SET', dummyHeader, null, function(data) {
                	
                	//Saving the Changed Data Again
                	for(var i=0; i<that.getView().getModel().getData().InventoryItemsData.length; i++){
                		that.getView().getModel().getData().InventoryItemsData[i].currentOrderWeek = preservedCurrentOrderWeek;                	
                	}
                    var changedData = JSON.parse(JSON.stringify(that.getView().getModel().getData()));
                    that.getView().getModel('backup').setData(changedData);
                    MCAPP.clearDirtyFlag();
                    MCAPP.setBusy(false);
                    sap.m.MessageToast.show(MCAPP.getText('GBL_DATA_SAVE_MSG', this), {
                        duration: MCAPP.getAppConfigAsInt('MsgToastDurationOnNavigation')
                    });
                }, function(data) {
                    MCAPP.setBusy(false);
                    if(data.response != null && data.response.body != null){
                    	var errorMessageFromBackend = jQuery.parseXML(data.response.body).getElementsByTagName("message")[0].firstChild.nodeValue;
                    									//$(data.response.body).find("message")[0].firstChild.nodeValue;
                    	sap.ui.commons.MessageBox.show(errorMessageFromBackend, sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', that), [sap.ui.commons.MessageBox.Action.OK]);
                    }
                    else{
                    	sap.ui.commons.MessageBox.show(MCAPP.getText('GBL_DATA_SAVE_ERROR', that), sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', that), [sap.ui.commons.MessageBox.Action.OK]);
                    }
                });
            }
            var oSKUArray = MCAPP.getCurrentView().getModel().getData();
            var i = 0;
            var currentSKU = this.getParent().getParent().getParent().getAggregation("content")[0].getViewData()[1];
            $.each(oSKUArray.results, function() {
                if ((this.SKU) == currentSKU) {
                    return false;
                }
                i++;
            });
            if (i !== 0) {
                var result = oSKUArray.results[i - 1];
                var oDataModelItems = new sap.ui.model.odata.ODataModel(MCAPP.getServiceUrl(MCAPP.getComponent().getModel('service').getProperty('/ImportInventoryWS')));
                currentView.data('oDataModel', oDataModelItems);
                thisContext = currentView.getController();
                oDataModelItems.read('ZCCP_INV_IMP_SKU_HEAD_DUMMY_SET(SourceId=\'' + result.SourceId + '\',SKU=\'' + result.SKU + '\',ShipToId=\'' + result.ShipToId + '\')', null, {
                	"$expand": "ZCCP_DUMMY_TO_INV_IMP_SKU_NAV",
                    "$format": "json",
                    "$filter": "ShipToId eq '" + result.ShipToId + "' and SourceId eq '" + result.SourceId + "' and SKU eq '" + result.SKU + "'" 
                }, false, function(oData, oResponse) {
                    thisContext._dataLoadSuccess(oData, oResponse, currentPageValue);
                }, function(oError) {
                    thisContext._dataLoadFail(oError);
                });
            }
        }
        else {
        }
    },
    
    /**
     *whenever user clicks on "save & next" link in dialog box footer of Inventory Main
     *it will display the next SKU details in the Custom Table
     *@param oEvent
     *@memberOf inventory.ImportInventoryWS
     **/
    onPressNextSku: function(oEvent) {
        var currentPageValue = oEvent.getSource().getParent().getCurrentPage();
        if (currentPageValue <= MCAPP.getCurrentView().getModel().getData().results.length) {
            var currentView = this.getParent().getParent().getParent().getAggregation("content")[0];
            var that = currentView.getController();
            var dummyHeader = {};
            var changedRecords = that._getChangedRecords();
            //Preserving the value for Current Editable Order Week
            var preservedCurrentOrderWeek = that.getView().getViewData()[8];
                       
            if (changedRecords.length >= 1) {
                that._removeFlagFromChangedRecords(changedRecords);
                dummyHeader.ZCCP_DUMMY_TO_INV_IMP_SKU_NAV = changedRecords;
                var oDataModel = currentView.data('oDataModel');
                oDataModel.create('/ZCCP_INV_IMP_SKU_HEAD_DUMMY_SET', dummyHeader, null, function(data) {
                	
                	//Saving the Changed Data Again
                	for(var i=0; i<that.getView().getModel().getData().InventoryItemsData.length; i++){
                		that.getView().getModel().getData().InventoryItemsData[i].currentOrderWeek = preservedCurrentOrderWeek;
                	}
                    var changedData = JSON.parse(JSON.stringify(that.getView().getModel().getData()));
                    that.getView().getModel('backup').setData(changedData);
                    MCAPP.clearDirtyFlag();
                    MCAPP.setBusy(false);
                    sap.m.MessageToast.show(MCAPP.getText('GBL_DATA_SAVE_MSG', this), {
                        duration: MCAPP.getAppConfigAsInt('MsgToastDurationOnNavigation')
                    });
                }, function(data) {
                    MCAPP.setBusy(false);
                    if(data.response != null && data.response.body != null){
                    	var errorMessageFromBackend = jQuery.parseXML(data.response.body).getElementsByTagName("message")[0].firstChild.nodeValue;
                    									//$(data.response.body).find("message")[0].firstChild.nodeValue;
                    	sap.ui.commons.MessageBox.show(errorMessageFromBackend, sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', that), [sap.ui.commons.MessageBox.Action.OK]);
                    }
                    else{
                    	sap.ui.commons.MessageBox.show(MCAPP.getText('GBL_DATA_SAVE_ERROR', that), sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', that), [sap.ui.commons.MessageBox.Action.OK]);
                    }
                });
            }

            var oSKUArray = MCAPP.getCurrentView().getModel().getData();
            var i = 0;
            var currentSKU = this.getParent().getParent().getParent().getAggregation("content")[0].getViewData()[1];
            $.each(oSKUArray.results, function() {
                if ((this.SKU) == currentSKU) {
                    return false;
                }
                i++;
            });
            if(i<MCAPP.getCurrentView().getModel().getData().results.length-1)
        	{
            var oInventoryData = oSKUArray.results[i + 1];
            thisCurrentSKU = oInventoryData.SKU;
            var oDataModelItems = new sap.ui.model.odata.ODataModel(MCAPP.getServiceUrl(MCAPP.getComponent().getModel('service').getProperty('/ImportInventoryWS')));
            currentView.data('oDataModel', oDataModelItems);
            thisContext = currentView.getController();
            oDataModelItems.read('ZCCP_INV_IMP_SKU_HEAD_DUMMY_SET(SourceId=\'' + oInventoryData.SourceId + '\',SKU=\'' + oInventoryData.SKU + '\',ShipToId=\'' + oInventoryData.ShipToId + '\')', null, {
            	"$expand": "ZCCP_DUMMY_TO_INV_IMP_SKU_NAV",            	
                "$format": "json",
                "$filter": "ShipToId eq '" + oInventoryData.ShipToId + "' and SourceId eq '" + oInventoryData.SourceId + "' and SKU eq '" + oInventoryData.SKU + "'" 
            }, false, function(oData, oResponse) {
                thisContext._dataLoadSuccess(oData, oResponse, currentPageValue);
            }, function(oError) {
                thisContext._dataLoadFail(oError);
            });
        	}
            //End 
        }
        else {
        }
    },
    
    /**
     *whenever user clicks on Accordion to Expand Section
     *it will change the section title to show analytics
     *@param oEvent
     *@memberOf inventory.ImportInventoryWS
     **/
    onPressShowAnalytics: function(oEvent) {
    	var that = this;
        var section = that.byId("sectionAnalytics");
        section.setTitle(MCAPP.getText("VW_INV_WORK_SHEET_SHOW_ANALYTICS"));
    },
    
    /**
     *whenever user clicks on Accordion to Collapse Section
     *it will change the section title to hide analytics
     *@param oEvent
     *@memberOf inventory.ImportInventoryWS
     **/
    onPressHideAnalytics: function(oEvent) {
    	var that = this;
        var section = that.byId("sectionAnalytics");
        section.setTitle(MCAPP.getText("VW_INV_WORK_SHEET_HIDE_ANALYTICS"));
    },
       
    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     * @memberOf inventory.ImportInventoryWS
     */
    onAfterRendering: function() {
    	MCAPP.setBusy(false);
        jQuery.sap.byId('ApploadingDivId').hide();
        jQuery.sap.byId('content').show();
        MCAPP.updateHeader(this);
        
        //Updating the Column Color Dynamically
        var positionCurrentOrderWeek = MCAPP.getPositionCurrentOrderWeek();
        if(positionCurrentOrderWeek != undefined && positionCurrentOrderWeek != null)
        	this.getView().byId('dateHeaderId').setColumnColor(positionCurrentOrderWeek + 1);
    }
});