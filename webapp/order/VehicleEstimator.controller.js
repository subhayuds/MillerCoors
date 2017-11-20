/***
 * @Author CM02
 * @Date 09/01/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is Vehicle Estimator view controller
 */
sap.ui.controller("mc.ccp.order.VehicleEstimator", {
    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * Since we have to pass the Order Qty,SKU,Source etc from Order main page, getting the order view model and reading the data
     * passing as a create method in the oData service
     * _dataLoadSuccess and _dataLoadFail are call back methods
     * @memberOf order.VehicleEstimator
     */
    onInit: function() {
        var orderView = mc.ccp.util.Application.getCurrentView();
        var displayedData = orderView.byId('rowRepeaterId').getModel().getData().results;
        
        var changedRecords = [];
        for (var i = 0; i < displayedData.length; i++) {
            var obj = {};
            if(MCAPP.getDistributorType() == 'I'){
            	var selectedButton = sap.ui.getCore().byId("segmentedbuttonId").getAssociation("selectedButton");
            	if (selectedButton == MCAPP.getText('DH_IMPORT', this) && sap.ui.getCore().byId("segmentedbuttonId").getVisible() == true) {
            		obj.SKU = displayedData[i].SKU;
                    obj.SourceId = displayedData[i].SourceId;
                    obj.ShipToId = displayedData[i].ShipToId;
                    if(MCAPP.getDistributorType() == 'I'){
                    	if(displayedData[i].editableWeek > 0){
                    		obj.OrderedQty = displayedData[i].ZCCP_ORD_CR_HEAD_ITM_NAV.results[displayedData[i].editableWeek - 1].OrderedQty;
                    	}else{
                    		obj.OrderedQty = displayedData[i].ZCCP_ORD_CR_HEAD_ITM_NAV.results[3].OrderedQty;
                    	}
                    	
                    }else{
                    	obj.OrderedQty = displayedData[i].ZCCP_ORD_CR_HEAD_ITM_NAV.results[3].OrderedQty;	
                    }
            	}else{
                	obj.SKU = displayedData[i].SKU;
                    obj.SourceId = displayedData[i].SourceId;
                    obj.ShipToId = displayedData[i].ShipToId;
                	obj.OrderedQty = displayedData[i].ZCCP_WEEKSANDQTY_NAV.results[3].OrderedQty;
            	}
            }
            else if(MCAPP.getDistributorType() == 'E'){
            	obj.SKU = displayedData[i].SKU;
                obj.SourceId = displayedData[i].SourceId;
                obj.ShipToId = displayedData[i].ShipToId;
            	obj.OrderedQty = displayedData[i].ZCCP_ORD_CR_HEAD_ITM_NAV.results[3].OrderedQty;
            }            
            else{
            	obj.SKU = displayedData[i].SKU;
                obj.SourceId = displayedData[i].SourceId;
                obj.ShipToId = displayedData[i].ShipToId;
            	obj.OrderedQty = displayedData[i].ZCCP_WEEKSANDQTY_NAV.results[3].OrderedQty;
            }
            changedRecords.push(obj);
        }
        var dummyHeader = {};
        dummyHeader.ZCCP_VECH_EST_NAV = changedRecords;
        var thisContext = this;
        
        var oDataModel;
        if(MCAPP.getDistributorType() == 'I' || MCAPP.getDistributorType() == 'E'){
        	oDataModel = new sap.ui.model.odata.ODataModel(MCAPP.getServiceUrl(MCAPP.getComponent().getModel('service').getProperty('/OrderService')));
        }else{
        	oDataModel = orderView.data('oDataModel');
        }
        oDataModel.create('/ZCCP_VECH_HDR_SET', dummyHeader, null, function(oData, oResponse) {
            thisContext._dataLoadSuccess(oData, oResponse);
        }, function(oError) {
            thisContext._dataLoadFail(oError);
        }, false, {
            "$format": "json"
        });
    },
    /***
     * This method is called when data load is successful in onInit method
     * set the data to the view
     * @param oData
     * @param oResponse
     */
    _dataLoadSuccess: function(oData, oResponse) {
        var oModel = new sap.ui.model.json.JSONModel();
        oModel.setData(oData);
        this.getView().setModel(oModel);
    },
    /***
     * This method is called when data load is Failed in onInit method
     * Remove App busy flag, close the dialog and show the error message
     * @param oError
     */
    _dataLoadFail: function(oError) {
        MCAPP.setBusy(false);
        //MCAPP.getCurrentView().byId('vehEstDialog').close();
        this.getView().getParent().close();
        sap.ui.commons.MessageBox.show(MCAPP.getText('GBL_DATA_LOAD_ERROR', this), sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', this), [sap.ui.commons.MessageBox.Action.OK]);
    },
    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     * NOTE : Incase of data read failure case we are removing the Application Busy flag. This is for success case
     * @memberOf order.VehicleEstimator
     */
    onAfterRendering: function() {
        MCAPP.setBusy(false);
    },
});