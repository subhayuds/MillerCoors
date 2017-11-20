/***
 * @Author RA03
 * @Date 14-10-2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is the controller specific to Inventory WorkSheet View.
 */
sap.ui.controller("mc.ccp.inventory.InventoryWorkSheet", {
    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * This method retrieves the Inventory WorkSheet information expanded to ZCCP_INV_SKU_SET by passing selected shipToId,Source Id and SKU values.
     * @memberOf inventory.InventoryWorkSheet
     */
    onInit: function() {
        // Get the Service MetaData File
        /*var oDataModelItems = new sap.ui.model.odata.ODataModel(MCAPP.getServiceUrl(MCAPP.getComponent().getModel('service').getProperty('/InventoryWorkSheet')));
        this.getView().data('oDataModel', oDataModelItems);
        thisContext = this;*/
    	var oDataModel = new sap.ui.model.json.JSONModel();
        this.getView().data('oDataModel', oDataModel);
        var thisContext = this;
        oDataModel.attachRequestCompleted(thisContext._dataLoadSuccess,this);
        oDataModel.loadData("json/InventoryWorkSheet.json",{},false);
        thisCurrentSKU = "";
        var sInventoryData = this.getView().getViewData();
        var sSku = sInventoryData[1];
        var sShipTo = sInventoryData[3];
        var sSourceId = sInventoryData[4];
       /* oDataModelItems.read('ZCCP_INV_SKU_SET', null, {
            "$format": "json",
            "$filter": MCAPP.getFilterForInventoryWorkSheet(sSku, sShipTo, sSourceId)
        }, false, function(oData, oResponse) {
            thisContext._dataLoadSuccess(oData, oResponse);
        }, function(oError) {
            thisContext._dataLoadFail(oError);
        });*/
    },


    /***
     * This method is called when data load fails inside onInit method.
     * removes the onLoad image and shows the application and displays the error message box.
     * @param oError
     */
    _dataLoadFail: function(oError) {
        // removing onLoad image and show the Application.
        jQuery.sap.byId('ApploadingDivId').hide();
        jQuery.sap.byId('content').show();
        sap.ui.commons.MessageBox.show(MCAPP.getText('GBL_DATA_LOAD_ERROR', this), sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', this), [sap.ui.commons.MessageBox.Action.OK]);
    },

    /***
     * Event Handler for Save Button. Changes will be saved to backend in case of any change.
     * @param oEvent
     */
    onPressSave: function(oEvent) {

        var that = this.getParent().getParent().getAggregation("content")[0].getController();
        var oCurrentView = this.getParent().getParent().getAggregation("content")[0];
        var oCustomTable = oCurrentView.getAggregation("content")[0].getAggregation("content")[3].getAggregation("rows")[0];
        var sInsOutsWeek1 = oCustomTable.getAggregation("insOutsQuantityWeek1").getAggregation("textField").getValue();
        var sInsOutsWeek2 = oCustomTable.getAggregation("insOutsQuantityWeek2").getAggregation("textField").getValue();
        var sInsOutsWeek3 = oCustomTable.getAggregation("insOutsQuantityWeek3").getAggregation("textField").getValue();
        var sInsOutsWeek4 = oCustomTable.getAggregation("insOutsQuantityWeek4").getAggregation("textField").getValue();
        var sCurrentOrderQuantity = oCustomTable.getAggregation("currentOrderedQuantity").getAggregation("textField").getValue();
        var preservedRecords = that.getView().getModel().getData();
        
        var dummyHeader = {};
        var changedRecords = that._getChangedRecords();
        if (!((sInsOutsWeek1 !== '') && (sInsOutsWeek2 !== '') && (sInsOutsWeek3 !== '') && (sInsOutsWeek4 !== '') && (sCurrentOrderQuantity !== ''))) {
            sap.ui.commons.MessageBox.show(MCAPP.getText('GBL_SAVE_BLANK', this), sap.ui.commons.MessageBox.Icon.WARNING, MCAPP.getText('GBL_WARNING', this), [sap.ui.commons.MessageBox.Action.OK]);
        } else if (changedRecords.length >= 1) {
            that._removeFlagFromChangedRecords(changedRecords);
            dummyHeader.ZCCP_INV_DUMMY_TO_INV_SKU_NAV = changedRecords;
            var oDataModel = oCurrentView.data('oDataModel');
            oDataModel.create('/ZCCP_INV_DUMMY_HEAD_SET', dummyHeader, null, function(data) {
            	
            	//Saving the Changed Data Again
            	for(var i=0; i<that.getView().getModel().getData().InventoryItemsData.length; i++){
            		that.getView().getModel().getData().InventoryItemsData[i] = preservedRecords.InventoryItemsData[i];
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
     */
    _removeFlagFromChangedRecords: function(changedRecords) {
        for (var i = 0; i < changedRecords.length; i++) {
            delete changedRecords[i].dirtyState;
            delete changedRecords[i].expand;
            delete changedRecords[i].index;
            delete changedRecords[i].readOnly;
            delete changedRecords[i].FRST_ACCURACY;
            delete changedRecords[i].PERCENTAGE_SALES;
        }
    },

    /***
     * This method returns changed records in the current view by comparing the original model and backup model.
     * @returns {Array}
     */
    _getChangedRecords: function() {
        var thisView = this.getView();
        var thisController = thisView.getController();
        var rows = thisController._getVisibleRows();
        var originalModel = thisView.getModel('backup');
        var changedDModel = thisView.getModel();
        var changedRecords = [];
        var lengthModel = originalModel.getData().InventoryItemsData.length;
    	if(originalModel.getData().InventoryItemsData.length > 0){
    		for(var i=0; i<lengthModel; i++){
    			if(i == 0 || i == 1){
    				//All fields except Dist Forecast editable fields should be checked for Changed values
    				 if (originalModel.getProperty('/InventoryItemsData/'+ i +'/Ins_Out') != rows[0].getAggregation("insOutsQuantityWeek" + (i+1)).getProperty("value")
    						 || originalModel.getData().InventoryItemsData[i].BegINV != changedDModel.getData().InventoryItemsData[i].BegINV
    						 || originalModel.getData().InventoryItemsData[i].EndINV != changedDModel.getData().InventoryItemsData[i].EndINV 
    						 || originalModel.getData().InventoryItemsData[i].ProjDOI != changedDModel.getData().InventoryItemsData[i].ProjDOI) {
    		              	changedRecords.push(changedDModel.getData().InventoryItemsData[i]);
    		          }
    			}
    			else if (i == 2){
    				//In this case both Insout and Dist Forecast and Change Request Quantity (editable) along with non-editable fields  would be checked for changed values
    				if (originalModel.getProperty('/InventoryItemsData/'+ i +'/Ins_Out') != rows[0].getAggregation("insOutsQuantityWeek" + (i+1)).getProperty("value")
   						 || originalModel.getProperty('/InventoryItemsData/'+ i +'/Change_Req_Qty') != rows[0].getAggregation("changeRequestQuantity").getProperty("value")
   						 || originalModel.getProperty('/InventoryItemsData/'+ i +'/DistForecast') != rows[0].getAggregation("distForecastQuantityWeek" + (i+1)).getProperty("value")
    					 || originalModel.getData().InventoryItemsData[i].BegINV != changedDModel.getData().InventoryItemsData[i].BegINV
    					 || originalModel.getData().InventoryItemsData[i].EndINV != changedDModel.getData().InventoryItemsData[i].EndINV
    					 || originalModel.getData().InventoryItemsData[i].ProjDOI != changedDModel.getData().InventoryItemsData[i].ProjDOI) {
   		              	changedRecords.push(changedDModel.getData().InventoryItemsData[i]);
   		          }
    			}
    			else if (i == 3){
    				//In this case both Insout and Dist Forecast and Current Order Quantity (editable) along with non-editable fields  would be checked for changed values
    				if(originalModel.getProperty('/InventoryItemsData/'+ i +'/Ins_Out') != rows[0].getAggregation("insOutsQuantityWeek" + (i+1)).getProperty("value")
    						||originalModel.getProperty('/InventoryItemsData/'+ i +'/DistForecast') != rows[0].getAggregation("distForecastQuantityWeek" + (i+1)).getProperty("value")
    						|| originalModel.getProperty('/InventoryItemsData/'+ i +'/Current_Ord_Qty') != rows[0].getAggregation("currentOrderedQuantity").getProperty("value")
    						|| originalModel.getData().InventoryItemsData[i].BegINV != changedDModel.getData().InventoryItemsData[i].BegINV
    						|| originalModel.getData().InventoryItemsData[i].EndINV != changedDModel.getData().InventoryItemsData[i].EndINV
    						|| originalModel.getData().InventoryItemsData[i].ProjDOI != changedDModel.getData().InventoryItemsData[i].ProjDOI ) {
    						changedRecords.push(changedDModel.getData().InventoryItemsData[i]);
    				}
    			}
    			else{
    				//In this case only Dist Forecast (editable) along with non-editable fields  would be checked for changed values
    				if(originalModel.getProperty('/InventoryItemsData/'+ i +'/DistForecast') != rows[0].getAggregation("distForecastQuantityWeek" + (i+1)).getProperty("value")
    						|| originalModel.getData().InventoryItemsData[i].BegINV != changedDModel.getData().InventoryItemsData[i].BegINV
    						|| originalModel.getData().InventoryItemsData[i].EndINV != changedDModel.getData().InventoryItemsData[i].EndINV
    						|| originalModel.getData().InventoryItemsData[i].ProjDOI != changedDModel.getData().InventoryItemsData[i].ProjDOI) {
    						changedRecords.push(changedDModel.getData().InventoryItemsData[i]);
    				}
    			}
    		}
    	}
    	return changedRecords;
    },

    /***
     * This method wil return the number of visible rows on the screen
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
     * Event Handler for Cancel Button. Will display a confirmation message box to user whether he wants to revert his changes.
     * _callbackCancel is the call back method upon confirmation
     */
    onPressCancel: function(oEvent) {
        var oCancelLink = this;
        //var that = this.getParent().getParent().getAggregation("content")[0].getController();
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
                if (bResult) {
                    that._callbackCancel(bResult);
                    if(this.sId !== undefined)
            			oCancelLink.getParent().getParent().close();
            		else
            			that.getView().getParent().close();
                }

            }, MCAPP.getText('GBL_CONFIRM', this));
        } else {
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
     * revert the changes in the model based on the index. This will get the InsOuts, Current Order Quantity, Change Request Quantity one by one from back up model
     * and copy the same values in original model.
     * @param index
     */
    _revertChanges: function(index) {
        var originalModel = this.getView().getModel('backup');
        var changedModel = this.getView().getModel();
        if (originalModel.getData().InventoryItemsData[0].Ins_Out != changedModel.getData().InventoryItemsData[0].Ins_Out) {
            changedModel.getData().InventoryItemsData[0].Ins_Out = originalModel.getData().InventoryItemsData[0].Ins_Out;
        }
        if (originalModel.getData().InventoryItemsData[1].Ins_Out != changedModel.getData().InventoryItemsData[1].Ins_Out) {
            changedModel.getData().InventoryItemsData[1].Ins_Out = originalModel.getData().InventoryItemsData[1].Ins_Out;
        }
        if (originalModel.getData().InventoryItemsData[2].Ins_Out != changedModel.getData().InventoryItemsData[2].Ins_Out) {
            changedModel.getData().InventoryItemsData[2].Ins_Out = originalModel.getData().InventoryItemsData[2].Ins_Out;
        }
        if (originalModel.getData().InventoryItemsData[3].Ins_Out != changedModel.getData().InventoryItemsData[3].Ins_Out) {
            changedModel.getData().InventoryItemsData[3].Ins_Out = originalModel.getData().InventoryItemsData[3].Ins_Out;
        }
        if (originalModel.getData().InventoryItemsData[3].Current_Ord_Qty != changedModel.getData().InventoryItemsData[3].Current_Ord_Qty) {
            changedModel.getData().InventoryItemsData[3].Current_Ord_Qty = originalModel.getData().InventoryItemsData[3].Current_Ord_Qty;
        }
        if (originalModel.getData().InventoryItemsData[2].Change_Req_Qty != changedModel.getData().InventoryItemsData[2].Change_Req_Qty) {
            changedModel.getData().InventoryItemsData[2].Change_Req_Qty = originalModel.getData().InventoryItemsData[2].Change_Req_Qty;
        }
        for (var i = 0; i <= 8; i++) {
            if (originalModel.getData().InventoryItemsData[i].ProjDOI != changedModel.getData().InventoryItemsData[i].ProjDOI) {
                changedModel.getData().InventoryItemsData[i].ProjDOI = originalModel.getData().InventoryItemsData[i].ProjDOI;
            }
        }
        for (var i = 2; i <= 8; i++) {
            if (originalModel.getData().InventoryItemsData[i].DistForecast != changedModel.getData().InventoryItemsData[i].DistForecast) {
                changedModel.getData().InventoryItemsData[i].DistForecast = originalModel.getData().InventoryItemsData[i].DistForecast;
            }
        }
        //reverting the model with previous BegINV
        var noOfWeeks = originalModel.getData().InventoryItemsData.length;
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
        for (var i = 0; i < noOfWeeks-7; i++) {
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
     **/
    onPressPreviousSku: function(oEvent) {
        var currentPageValue = oEvent.getSource().getParent().getCurrentPage();
        if (currentPageValue < MCAPP.getCurrentView().getModel().getData().results.length && currentPageValue >= 1) {
            var myView = this.getParent().getParent().getParent().getAggregation("content")[0];
            var dummyHeader = {};
            var that = myView.getController();
            var changedRecords = that._getChangedRecords();
            var preservedRecords = that.getView().getModel().getData();
            
            if (changedRecords.length >= 1) {
                that._removeFlagFromChangedRecords(changedRecords);
                dummyHeader.ZCCP_INV_DUMMY_TO_INV_SKU_NAV = changedRecords;
                var oDataModel = myView.data('oDataModel');
                oDataModel.create('/ZCCP_INV_DUMMY_HEAD_SET', dummyHeader, null, function(data) {
                	
                	//Saving the Changed Data Again
                	for(var i=0; i<that.getView().getModel().getData().InventoryItemsData.length; i++){
                		that.getView().getModel().getData().InventoryItemsData[i] = preservedRecords.InventoryItemsData[i];
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
                var oDataModelItems = new sap.ui.model.odata.ODataModel(MCAPP.getServiceUrl(MCAPP.getComponent().getModel('service').getProperty('/InventoryWorkSheet')));
                myView.data('oDataModel', oDataModelItems);
                thisContext = myView.getController();
                oDataModelItems.read('ZCCP_INV_SKU_SET', null, {
                    "$format": "json",
                    "$filter": "ShipToId eq '" + result.ShipToId + "' and SourceId eq '" + result.SourceId + "' and SKU eq '" + result.SKU + "'"
                }, false, function(oData, oResponse) {
                    thisContext._dataLoadSuccess(oData, oResponse, currentPageValue);
                }, function(oError) {
                    thisContext._dataLoadFail(oError);
                });
            }
            var oEnableCRLink = myView.getAggregation("content")[0].getAggregation("content")[1].getAggregation("content")[3];
            oEnableCRLink.setProperty("visible", true);
        } 
    },

    /**
     *whenever user clicks on "save & next" link in dialog box footer of Inventory Main
     *it will display the next SKU details in the Custom Table
     *@param oEvent
     **/
    onPressNextSku: function(oEvent) {
        var currentPageValue = oEvent.getSource().getParent().getCurrentPage();
        if (currentPageValue <= MCAPP.getCurrentView().getModel().getData().results.length) {
            var myView = this.getParent().getParent().getParent().getAggregation("content")[0];
            var dummyHeader = {};
            var that = myView.getController();
            var preservedRecords = that.getView().getModel().getData();
            
            var changedRecords = that._getChangedRecords();
            if (changedRecords.length >= 1) {
                that._removeFlagFromChangedRecords(changedRecords);
                dummyHeader.ZCCP_INV_DUMMY_TO_INV_SKU_NAV = changedRecords;
                var oDataModel = myView.data('oDataModel');
                oDataModel.create('/ZCCP_INV_DUMMY_HEAD_SET', dummyHeader, null, function(data) {
                	
                	//Saving the Changed Data Again
                	for(var i=0; i<that.getView().getModel().getData().InventoryItemsData.length; i++){
                		that.getView().getModel().getData().InventoryItemsData[i] = preservedRecords.InventoryItemsData[i];
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
	            var oDataModelItems = new sap.ui.model.odata.ODataModel(MCAPP.getServiceUrl(MCAPP.getComponent().getModel('service').getProperty('/InventoryWorkSheet')));
	            myView.data('oDataModel', oDataModelItems);
	            thisContext = myView.getController();
	            oDataModelItems.read('ZCCP_INV_SKU_SET', null, {
	                "$format": "json",
	                "$filter": "ShipToId eq '" + oInventoryData.ShipToId + "' and SourceId eq '" + oInventoryData.SourceId + "' and SKU eq '" + oInventoryData.SKU + "'"
	            }, false, function(oData, oResponse) {
	                thisContext._dataLoadSuccess(oData, oResponse, currentPageValue);
	            }, function(oError) {
	                thisContext._dataLoadFail(oError);
	            });
            }
            var oEnableCRLink = myView.getAggregation("content")[0].getAggregation("content")[1].getAggregation("content")[3];
            oEnableCRLink.setProperty("visible", true);
        } 
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
        if (currentPageValue <= MCAPP.getCurrentView().getModel().getData().results.length) {
            var myView = this.getView();
            var dummyHeader = {};
            var that = myView.getController();
            var preservedRecords = that.getView().getModel().getData();
            
            var changedRecords = that._getChangedRecords();
            if (changedRecords.length >= 1) {
                that._removeFlagFromChangedRecords(changedRecords);
                dummyHeader.ZCCP_INV_DUMMY_TO_INV_SKU_NAV = changedRecords;
                var oDataModel = myView.data('oDataModel');
                oDataModel.create('/ZCCP_INV_DUMMY_HEAD_SET', dummyHeader, null, function(data) {
                	
                	//Saving the Changed Data Again
                	for(var i=0; i<that.getView().getModel().getData().InventoryItemsData.length; i++){
                		that.getView().getModel().getData().InventoryItemsData[i] = preservedRecords.InventoryItemsData[i];
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
            var oDataModelItems = new sap.ui.model.odata.ODataModel(MCAPP.getServiceUrl(MCAPP.getComponent().getModel('service').getProperty('/InventoryWorkSheet')));
            myView.data('oDataModel', oDataModelItems);
            thisContext = myView.getController();
            oDataModelItems.read('ZCCP_INV_SKU_SET', null, {
                "$format": "json",
                "$filter": "ShipToId eq '" + oInventoryData.ShipToId + "' and SourceId eq '" + oInventoryData.SourceId + "' and SKU eq '" + oInventoryData.SKU + "'"
            }, false, function(oData, oResponse) {
                thisContext._dataLoadSuccess(oData, oResponse, currentPageValue);
            }, function(oError) {
                thisContext._dataLoadFail(oError);
            });
            var oEnableCRLink = myView.getAggregation("content")[0].getAggregation("content")[1].getAggregation("content")[3];
            oEnableCRLink.setProperty("visible", true);
        }
    },
    

    /***
     * called when data load is successful in onChangePaginatorValue method
     * It will parse the JSON response and put the index, dirtyState, expand and readOnly flags in the parsed JSON response
     * It will split Result JSON object into two entity arrays in oInvWSData object.
     * and sets the model to the current view along with creating a backup model and setting it to view.
     * @param oData
     * @param oResponse
     *  @param page
     */
    _dataLoadSuccess: function(evt) {
        var readOnly = MCAPP.isReadOnlyState();
        var changeRequestReadOnly = MCAPP.isReadOnlyCRState();
        var obj =  evt.getSource().getData();//JSON.parse(oResponse.body);
        var oJsonData = {};
        oJsonData.results = obj.d.results;
        var oInvWSData = {
            AnalyticsData: [],
            InventoryItemsData: []
        };
        $.each(oJsonData.results, function(i, item) {
            item.index = i + 1;
            item.expand = false;
            item.dirtyState = false;
            item.readOnly = readOnly;
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
            this.byId("enableCRLink").setProperty("enabled", !changeRequestReadOnly);
            this.byId("previewAndSubmitCR").setProperty("enabled", !changeRequestReadOnly);
        }        
    },
    
    /**
     *whenever user clicks on preview&submit link in the Inventory WorkSheet
     *it will navigate to change request preview page
     *@param oEvent
     **/
    onPressPreviewAndSubmitCR: function(oEvent) {
        var that = this;
        var dummyHeader = {};
        var myView = that.getView();
        var preservedRecords = that.getView().getModel().getData();
        var changedRecords = this._getChangedRecords();
        if (changedRecords.length >= 1) {
            sap.ui.commons.MessageBox.confirm(MCAPP.getText('VW_INV_WORK_SHEET_SAVE_MESSAGE', this), function(bResult) {
                if (bResult) {
                	 that._removeFlagFromChangedRecords(changedRecords);
		                dummyHeader.ZCCP_INV_DUMMY_TO_INV_SKU_NAV = changedRecords;
		                var oDataModel = myView.data('oDataModel');
//		                oDataModel.create('/ZCCP_INV_DUMMY_HEAD_SET', dummyHeader, null, function(data) {
		                	
		                	//Saving the Changed Data Again
		                	for(var i=0; i<that.getView().getModel().getData().InventoryItemsData.length; i++){
		                		that.getView().getModel().getData().InventoryItemsData[i] = preservedRecords.InventoryItemsData[i];
		                	}
		                	
		                    var changedData = JSON.parse(JSON.stringify(that.getView().getModel().getData()));
		                    that.getView().getModel('backup').setData(changedData);
		                    MCAPP.clearDirtyFlag();
		                    MCAPP.setBusy(false);
		                    sap.m.MessageToast.show(MCAPP.getText('GBL_DATA_SAVE_MSG', this), {
		                        duration: MCAPP.getAppConfigAsInt('MsgToastDurationOnNavigation')
		                    });
		               /* }, function(data) {
		                    MCAPP.setBusy(false);
		                    sap.ui.commons.MessageBox.show(MCAPP.getText('GBL_DATA_SAVE_ERROR', that), sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', that), [sap.ui.commons.MessageBox.Action.OK]);
		                });*/
                    var thisRouter = that.getView().getParent().getParent().oCore.mObjects.component.__component0._oRouter;
                    thisRouter.navTo("ChangeRequestPreview");
                    that.getView().getParent().close();
                }

            }, MCAPP.getText('GBL_CONFIRM', this));
        } else {
            var thisRouter = this.getView().getParent().getParent().oCore.mObjects.component.__component0._oRouter;
            thisRouter.navTo("ChangeRequestPreview");
            this.getView().getParent().close();
        }
    },

    /**
     *whenever user clicks on Accordion to Expand Section
     *it will change the section title to show analytics
     *@param oEvent
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
     **/
    onPressHideAnalytics: function(oEvent) {
    	var that = this;
        var section = that.byId("sectionAnalytics");
        section.setTitle(MCAPP.getText("VW_INV_WORK_SHEET_HIDE_ANALYTICS"));
    },

    /**
     *whenever user click on Enable Change CR link in Inventory Worksheet.
     *It will editable the current week +1(week3) change request field
     *@param oEvent
     **/
    onPressEnableChangeRequest: function(oEvent) {
        var that = this;
        var oChangeRequest = that.getView().getAggregation("content")[0].getAggregation("content")[3].getAggregation("rows")[0].getAggregation("changeRequestQuantity");
        oChangeRequest.getAggregation("textField").setProperty("editable", true);
        oChangeRequest.setProperty("arrows", true);
        oEvent.getSource().setProperty("visible", false);
    },

});