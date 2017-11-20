jQuery.sap.declare("mc.ccp.util.Application");
mc.ccp.util.Application = {
    setAppLoadError: function(flag) {
        sap.ui.getCore().AppContext.AppLoadError = flag;
    },
    getAppLoadError: function() {    
        return sap.ui.getCore().AppContext.AppLoadError;
    },
    setDirtyFlag: function(flag) {
        sap.ui.getCore().AppContext.currentView.dirtyFlag = flag;
    },
    getDirtyFlag: function() {
        return sap.ui.getCore().AppContext.currentView.dirtyFlag;
    },
    clearDirtyFlag: function() {
        sap.ui.getCore().AppContext.currentView.dirtyFlag = false;
    },
    getCurrentView: function() {
        return sap.ui.getCore().byId('GlobalFrameId').getAggregation('content')[0];
    },
    getCurrentViewName: function() {
        return sap.ui.getCore().AppContext.currentView.Name;
    },
    setCurrentViewName: function(viewName) { 
        return sap.ui.getCore().AppContext.currentView.Name = viewName;
    },
    getMenuView: function() {
        return sap.ui.getCore().byId('GlobalFrameId').getAggregation('menu')[0];
    },
    getHeaderView: function() {
    	 return sap.ui.getCore().byId('GlobalFrameId').getAggregation('header')[0];
    },
    getFooterView: function() {
        return sap.ui.getCore().byId('GlobalFrameId').getAggregation('footer')[0];
    },
    setBusy: function(flag) {
        sap.ui.getCore().byId('GlobalFrameId').setBusy(flag);
    },
    getBusy: function() {
        return sap.ui.getCore().byId('GlobalFrameId').getBusy();

    },
    getComponent: function() {
debugger;
        return sap.ui.getCore().byId('rootComponentContainer').getParent().oCore.mObjects.component.__component0;
    },
    getText: function(key, object) {
        var model;
        if (object instanceof sap.ui.core.mvc.View) {
        	
            model = object.getModel('i18n');
            if (model) {
                return model.getProperty(key);
            }
        }
        if (object instanceof sap.ui.core.mvc.Controller) {
        	
            model = object.getView().getModel('i18n');
            if (model) {
                return model.getProperty(key);
            }
        }
        return this.getComponent().getModel('i18n').getProperty(key);
    },
    
    getSelectedShiptoAsQryParam: function() {
    	var selectedButton;
    	var distributorType;
        if(sap.ui.getCore().byId("segmentedbuttonId").getVisible() === true){
        	selectedButton = sap.ui.getCore().byId("segmentedbuttonId").getAssociation("selectedButton");
        	if(selectedButton === MCAPP.getText('DH_IMPORT', this)){
        		distributorType = "I";
        	}else{
        		distributorType = "D";
        	}
        }else{
        	distributorType = MCAPP.getDistributorType();
        }
    	var strShipto = "";
        var selectedShipToArr = [];
        var shiptoArr = this.getShipTos();
        for (var i = 0; i < shiptoArr.length; i++) {
        	if (shiptoArr[i].selectFlag == true && (shiptoArr[i].Import === distributorType 
        			|| ( shiptoArr[i].Import === "X" && distributorType !== "E" )))	{
        		selectedShipToArr.push(shiptoArr[i]);
        	}
        }
        for (var i = 0; i < selectedShipToArr.length; i++) {
            if (i !== selectedShipToArr.length - 1)
                strShipto += "ShipToId eq '" + selectedShipToArr[i].ShipToId + "' or ";
            else
                strShipto += "ShipToId eq '" + selectedShipToArr[i].ShipToId + "'";
        }
        return strShipto;
    },

    setCRcount: function(crcount) {
        sap.ui.getCore().AppContext.crcount = crcount;
    },
    getCRcount: function() {
    	return sap.ui.getCore().AppContext.crcount;
    },
    setShipTos: function(shipto) {
        sap.ui.getCore().AppContext.shitos = shipto;
    },
    getShipTos: function() {
        return sap.ui.getCore().AppContext.shitos;
    },
    setCurrentweek: function(currentweek) {
        sap.ui.getCore().AppContext.currentweek = currentweek;
    },
    getCurrentweek: function() {
        return sap.ui.getCore().AppContext.currentweek;
    },
    getCutOffTime: function() {
        return sap.ui.getCore().AppContext.CutOffTime;
    },
    setCutOffTime: function(cutOffTime) {
        sap.ui.getCore().AppContext.CutOffTime = cutOffTime;
    },
    getCRCutOffTime: function() {
        return sap.ui.getCore().AppContext.CRCutOffTime;
    },
    setCRCutOffTime: function(CRcutOffTime) {
        sap.ui.getCore().AppContext.CRCutOffTime = CRcutOffTime;
    },
    //setter for Import flag
    setDistributorType: function(value) {
        sap.ui.getCore().AppContext.distributorType = value;
    },
    //getter for Import flag
    getDistributorType: function() {
        if (jQuery.sap.getUriParameters().get("dType") == null) {
            return sap.ui.getCore().AppContext.distributorType;
        } else {
            return jQuery.sap.getUriParameters().get("dType");
        }
    },
    // getter for Distributor Id
    getDistributorId: function() {
    	return sap.ui.getCore().AppContext.distributorId;
    },
    // setter for Distributor Id
    setDistributorId: function(value) {
        sap.ui.getCore().AppContext.distributorId = value;
    },
 	// getter for Distributor Name
    getDistributorName: function() {
    	return sap.ui.getCore().AppContext.distributorName;
    },
    // setter for Distributor Name
    setDistributorName: function(value) {
        sap.ui.getCore().AppContext.distributorName = value;
    },
    
    setAlertsData: function(data) {
        sap.ui.getCore().AppContext.alerts = data;
    },
    getAlertsData: function() {
        return sap.ui.getCore().AppContext.alerts;
    },
    setImportFlag: function(flag) {
        sap.ui.getCore().AppContext.importFlag = flag;
    },
    getImportFlag: function() {
        return sap.ui.getCore().AppContext.importFlag;
    },
    updateHeader: function(oContrllr) {
        jQuery.sap.byId('McTitleBarId').empty();
        if (sap.ui.getCore().byId('headerFragment')) {
            sap.ui.getCore().byId('headerFragment').destroy();
        }
        var viewName = oContrllr.getView().sViewName;
        var frgmntName = viewName.substring(0, viewName.lastIndexOf(".") + 1) + 'top.Header';
        var hdrFrag = sap.ui.jsfragment(frgmntName, oContrllr);
        var obj = sap.ui.getCore().createUIArea('McTitleBarId');
        obj.removeAllContent();
        obj.addContent(hdrFrag);
    },
    updateHeaderCRDetail: function(oContrllr) {
        jQuery.sap.byId('McTitleBarId').empty();
        if (sap.ui.getCore().byId('headerFragment')) {
            sap.ui.getCore().byId('headerFragment').destroy();
        }
        var viewName = oContrllr.getView().sViewName;
        var frgmntName = viewName.substring(0, viewName.lastIndexOf(".") + 1) + 'top.CRDetailHeader';
        var hdrFrag = sap.ui.jsfragment(frgmntName, oContrllr);
        var obj = sap.ui.getCore().createUIArea('McTitleBarId');
        obj.removeAllContent();
        obj.addContent(hdrFrag);
    },
    updateHeaderCRPreview: function(oContrllr) {
        jQuery.sap.byId('McTitleBarId').empty();
        if (sap.ui.getCore().byId('headerFragment')) {
            sap.ui.getCore().byId('headerFragment').destroy();
        }
        var viewName = oContrllr.getView().sViewName;
        var frgmntName = viewName.substring(0, viewName.lastIndexOf(".") + 1) + 'top.CRPreviewHeader';
        var hdrFrag = sap.ui.jsfragment(frgmntName, oContrllr);
        var obj = sap.ui.getCore().createUIArea('McTitleBarId');
        obj.removeAllContent();
        obj.addContent(hdrFrag);
    },
    updateHeaderImpExp: function(oContrllr) {
        jQuery.sap.byId('McTitleBarId').empty();
        if (sap.ui.getCore().byId('headerFragment')) {
            sap.ui.getCore().byId('headerFragment').destroy();
        }
        var viewName = oContrllr.getView().sViewName;
        var frgmntName = viewName.substring(0, viewName.lastIndexOf(".") + 1) + 'top.ImpExpHeader';
        var hdrFrag = sap.ui.jsfragment(frgmntName, oContrllr);
        var obj = sap.ui.getCore().createUIArea('McTitleBarId');
        obj.removeAllContent();
        obj.addContent(hdrFrag);
    },
    getFilterForCRscreen: function() {
    	if(MCAPP.getSelectedShiptoAsQryParam() !== ""){
    		return "((SC_Code eq 'A') and (" + MCAPP.getSelectedShiptoAsQryParam() + "))";
    	}else{
    		return "((SC_Code eq 'A') and (ShipToId eq '' ))";
    	}
    },
    getFilterForCRDetailScreen: function() {
    	if(MCAPP.getSelectedShiptoAsQryParam() !== ""){
    		 return "((SC_Code eq 'C') and (" + MCAPP.getSelectedShiptoAsQryParam() + "))";
    	}else{
    		return "((SC_Code eq 'C') and (ShipToId eq '' ))";
    	}
    },
    getFilterForCRPreviewScreen: function() {
    	if(MCAPP.getSelectedShiptoAsQryParam() !== ""){
   		 return "((SC_Code eq 'B') and (" + MCAPP.getSelectedShiptoAsQryParam() + "))";
   	}else{
   		return "((SC_Code eq 'B') and (ShipToId eq '' ))";
   	}
    },
    // Navigation Logic		
    navigateTo: function(page, parameters, passedController, bHistory, fnRevert) {
        var dirtyFlag = this.getDirtyFlag();
        if (dirtyFlag) {
            var oDialog = new mc.ccp.control.McDialog({
                modal: true,
                width: '30%',
                height: '35%',
                title : MCAPP.getText('GBL_NAVIGATETO_TITLE', this),
                content: [new sap.ui.commons.TextView({
                    text : MCAPP.getText('GBL_CONTENT_TEXT', this)
                })],
            });
            oDialog.addStyleClass('McCcpCustomDialog');
            var but1 = new sap.ui.commons.Button({
            	text : MCAPP.getText('GBL_DIALOG_CANCEL', this)
            });
            but1.attachPress({
                controller: passedController,
                dialog: oDialog,
                fnCall: fnRevert
            }, this._cancelSaveDialog, this);
            var but2 = new sap.ui.commons.Button({
            	text : MCAPP.getText('GBL_DIALOG_DONTSAVEANDGO', this)
            });
            but2.attachPress({
                controller: passedController,
                dialog: oDialog,
                fnCall: fnRevert,
                page: page,
                parameters: parameters,
                history: bHistory
            }, this._navigateWithoutSave, this);
            var but3 = new sap.ui.commons.Button({
                text : MCAPP.getText('GBL_DIALOG_SAVEANDGO', this)
            });
            but3.attachPress({
                controller: passedController,
                dialog: oDialog,
                fnCall: fnRevert,
                page: page,
                parameters: parameters,
                history: bHistory
            }, this._saveCurrentDataAndNavigate, this);
            oDialog.addButton(but1);
            oDialog.addButton(but2);
            oDialog.addButton(but3);
            oDialog.open();
        } else {   
        	var router = sap.ui.core.UIComponent.getRouterFor(passedController);
        	if(router != undefined && page !== router._oRouter._prevMatchedRequest){
        		this.setBusy(true);
        	}
            router.navTo(page, parameters, bHistory);
        }
    },
    _cancelSaveDialog: function(oEvent, oData) {
        if (oData.fnCall) {
            oData.fnCall.apply(oData.controller);
        }
        oData.dialog.close();
    },
    _navigateWithoutSave: function(oEvent, oData) {
        this.clearDirtyFlag();
        oData.dialog.close();
        this.navigateTo(oData.page, oData.parameters, oData.controller, oData.history);
    },
    _saveCurrentDataAndNavigate: function(oEvent, oData) {
        oData.dialog.close();
        oEvent.mParameters.data = {};
        oEvent.mParameters.data.customSaveFlag = true;
        oEvent.mParameters.data.fnCall = oData.fnCall;
        // in Case of success need to call the navigation again
        oEvent.mParameters.data.fnErrorContext = this;
        oEvent.mParameters.data.fnNavigate = this._navigateTo;
        oEvent.mParameters.data.navigationData = oData;
        MCAPP.getCurrentView().getController().onPressSave(oEvent);
        this.navigateTo(oData.page, oData.parameters, oData.controller, oData.history);
    },
    //Private Method
    _navigateTo: function(data) {
    },
    menuSelection: function(oContrllr) {
        var vwName = oContrllr.getView().sViewName;
        switch (vwName) {
            case 'mc.ccp.order.Order':
                var menu = sap.ui.getCore().byId('GlobalFrameId').getAggregation('menu')[0];
                menu.byId('changereqlink').removeStyleClass('selecteditem');
                menu.byId('forecastlink').removeStyleClass('selecteditem');
                menu.byId('inventorylink').removeStyleClass('selecteditem');
                menu.byId('shipmentlink').removeStyleClass('selecteditem');
                menu.byId('salesinventorylink').removeStyleClass('selecteditem');
                menu.byId('orderMenuId').addStyleClass('selecteditem');
                break;
            case 'mc.ccp.changereq.ChangeRequest':
                var menu = sap.ui.getCore().byId('GlobalFrameId').getAggregation('menu')[0];
                menu.byId('orderMenuId').removeStyleClass('selecteditem');
                menu.byId('forecastlink').removeStyleClass('selecteditem');
                menu.byId('inventorylink').removeStyleClass('selecteditem');
                menu.byId('shipmentlink').removeStyleClass('selecteditem');
                menu.byId('salesinventorylink').removeStyleClass('selecteditem');
                menu.byId('changereqlink').addStyleClass('selecteditem');
                break;
            case 'mc.ccp.changereq.ChangeRequestDetail':
                var menu = sap.ui.getCore().byId('GlobalFrameId').getAggregation('menu')[0];
                menu.byId('orderMenuId').removeStyleClass('selecteditem');
                menu.byId('forecastlink').removeStyleClass('selecteditem');
                menu.byId('inventorylink').removeStyleClass('selecteditem');
                menu.byId('shipmentlink').removeStyleClass('selecteditem');
                menu.byId('salesinventorylink').removeStyleClass('selecteditem');
                menu.byId('changereqlink').addStyleClass('selecteditem');
                break;
            case 'mc.ccp.changereq.ChangeRequestPreview':
                var menu = sap.ui.getCore().byId('GlobalFrameId').getAggregation('menu')[0];
                menu.byId('orderMenuId').removeStyleClass('selecteditem');
                menu.byId('forecastlink').removeStyleClass('selecteditem');
                menu.byId('inventorylink').removeStyleClass('selecteditem');
                menu.byId('shipmentlink').removeStyleClass('selecteditem');
                menu.byId('salesinventorylink').removeStyleClass('selecteditem');
                menu.byId('changereqlink').addStyleClass('selecteditem');
                break;
            case 'mc.ccp.forecast.Forecast':
                var menu = sap.ui.getCore().byId('GlobalFrameId').getAggregation('menu')[0];
                menu.byId('orderMenuId').removeStyleClass('selecteditem');
                menu.byId('changereqlink').removeStyleClass('selecteditem');
                menu.byId('inventorylink').removeStyleClass('selecteditem');
                menu.byId('shipmentlink').removeStyleClass('selecteditem');
                menu.byId('salesinventorylink').removeStyleClass('selecteditem');
                menu.byId('forecastlink').addStyleClass('selecteditem');
                break;
            case 'mc.ccp.inventory.Inventory':
                var menu = sap.ui.getCore().byId('GlobalFrameId').getAggregation('menu')[0];
                menu.byId('orderMenuId').removeStyleClass('selecteditem');
                menu.byId('changereqlink').removeStyleClass('selecteditem');
                menu.byId('forecastlink').removeStyleClass('selecteditem');
                menu.byId('shipmentlink').removeStyleClass('selecteditem');
                menu.byId('salesinventorylink').removeStyleClass('selecteditem');
                menu.byId('inventorylink').addStyleClass('selecteditem');
                break;
            case 'mc.ccp.shipment.Shipment':
                var menu = sap.ui.getCore().byId('GlobalFrameId').getAggregation('menu')[0];
                menu.byId('orderMenuId').removeStyleClass('selecteditem');
                menu.byId('changereqlink').removeStyleClass('selecteditem');
                menu.byId('forecastlink').removeStyleClass('selecteditem');
                menu.byId('salesinventorylink').removeStyleClass('selecteditem');
                menu.byId('inventorylink').removeStyleClass('selecteditem');
                menu.byId('shipmentlink').addStyleClass('selecteditem');
                break;
            case 'mc.ccp.inventory.SalesAndInventory':
                var menu = sap.ui.getCore().byId('GlobalFrameId').getAggregation('menu')[0];
                menu.byId('orderMenuId').removeStyleClass('selecteditem');
                menu.byId('changereqlink').removeStyleClass('selecteditem');
                menu.byId('forecastlink').removeStyleClass('selecteditem');
                menu.byId('inventorylink').removeStyleClass('selecteditem');
                menu.byId('shipmentlink').removeStyleClass('selecteditem');
                menu.byId('salesinventorylink').addStyleClass('selecteditem');
                break;
            case 'mc.ccp.order.ImpExpOrder':
                var menu = sap.ui.getCore().byId('GlobalFrameId').getAggregation('menu')[0];
                menu.byId('changereqlink').removeStyleClass('selecteditem');
                menu.byId('forecastlink').removeStyleClass('selecteditem');
                menu.byId('inventorylink').removeStyleClass('selecteditem');
                menu.byId('shipmentlink').removeStyleClass('selecteditem');
                menu.byId('salesinventorylink').removeStyleClass('selecteditem');
                menu.byId('orderMenuId').addStyleClass('selecteditem');
                break;
            case 'mc.ccp.shipment.ShipmentsImpExp':
                var menu = sap.ui.getCore().byId('GlobalFrameId').getAggregation('menu')[0];
                menu.byId('changereqlink').removeStyleClass('selecteditem');
                menu.byId('forecastlink').removeStyleClass('selecteditem');
                menu.byId('inventorylink').removeStyleClass('selecteditem');
                menu.byId('shipmentlink').addStyleClass('selecteditem');
                menu.byId('salesinventorylink').removeStyleClass('selecteditem');
                menu.byId('orderMenuId').removeStyleClass('selecteditem');
                break;
        }
    },
    getServiceUrl: function(sServiceUrl) {
        if (window.location.hostname == "localhost") {
            return "proxy" + sServiceUrl;
        } else {
            return sServiceUrl;
        }
    },
    getAppConfigAsInt: function(key) {
        var value = this.getComponent().getModel('app').getProperty('/' + key);
        return value;
    },
    getAppConfigAsString: function(key) {
        var value = this.getComponent().getModel('app').getProperty('/' + key);
        return value;
    },
    getAppConfigAsBoolean: function(key) {
        var value = this.getComponent().getModel('app').getProperty('/' + key);
        return value;
    },
    getCurrentDate: function() {
        var today = new Date();
    	var currentDate = today.getDate() + "/" +( today.getMonth() + 1) + "/" + today.getFullYear();	
        return currentDate;
    },
    
    getFilterForSplashScreen: function() {
        return "ProcessType eq 'ZSPS'";
    },
    getFilterForMessagesScreen: function() {
        return "ProcessType eq 'ZMSG'";
    },

    getUnsubmittedCr: function() {
    	if(MCAPP.getCRcount() == ""){
    		return "0";
    	}else{
    		return MCAPP.getCRcount();
    	}
        
    },
    getFilterForInventoryWorkSheet: function(oSKU, oShipTo, oSourceId) {
        return "ShipToId eq '" + oShipTo + "' and SourceId eq '" + oSourceId + "' and SKU eq '" + oSKU + "'";
    },
    getFilterForInvShipScreen: function(oSKU, oStatusCode, oWeekNo) {
        var filterShipmentType = this.getImpExp("ShipmentTyp");
        if(filterShipmentType === "")
               return "(("+ MCAPP.getSelectedShiptoAsQryParam() +") and (Week_No eq '" + oWeekNo + "' and SKU eq '" + oSKU + "' and Status_Code eq '" + oStatusCode + "'))";
        else
               return "(("+ MCAPP.getSelectedShiptoAsQryParam() +") and (Week_No eq '" + oWeekNo + "' and " + this.getImpExp("ShipmentTyp") + " and SKU eq '" + oSKU + "' and Status_Code eq '" + oStatusCode + "'))";

    },
    getFilterForInventoryWSscreen: function(sourceid, shipto, sku) {
        return "ShipToId eq " + sku + " and SourceId eq " + shipto + " and SKU eq " + sourceid;
    },

    updateHeaderSetting: function(oContrllr) {
        jQuery.sap.byId('McTitleBarId').empty();
        if (sap.ui.getCore().byId('headerFragment')) {
            sap.ui.getCore().byId('headerFragment').destroy();
        }
        var viewName = oContrllr.getView().sViewName;
        var frgmntName = viewName.substring(0, viewName.lastIndexOf(".") + 1) + 'top.SettingHeader';
        var hdrFrag = sap.ui.jsfragment(frgmntName, oContrllr);
        var obj = sap.ui.getCore().createUIArea('McTitleBarId');
        obj.removeAllContent();
        obj.addContent(hdrFrag);
    },

    showApplicationError: function(param, error) {
        var msg = '';
        if (typeof param === 'object') {
            msg = this.getErrorMessage(param);
        } else {
            msg = param;
        }
        jQuery.sap.require("mc.ccp.control.McErrorDialog");
        var oDialog = new mc.ccp.control.McErrorDialog({
            modal: true,
            width: '100%',
            height: '100%',
            content: new sap.ui.commons.TextView({
                text: msg
            }),
            title: 'Application Error',
            showCloseButton: false            
        });

        oDialog.open();
        if (error) {
            this.setAppLoadError(error);
        }
    },

    getErrorMessage: function(oError) {
        var msg = '';
        switch (oError.response.statusCode) {
            case 401:
                msg = oError.response.statusText;
                break;
            case 500:
                msg = JSON.parse(oError.response.body).error.message.value;
                break;
            default:
            	msg = oError.response.statusText;
        }
        return msg;
    },

    getFilterForImportInventoryWorkSheet: function(oShipTo, oSourceId, oSKU) {
    	if (MCAPP.getDistributorType() == "I") {        	
        	return "ShipToId eq '"+ oShipTo +"' and SourceId eq '"+ oSourceId +"' and SKU eq '"+ oSKU +"' and DistributerType eq 'IMP'";
        }
        if (MCAPP.getDistributorType() == "E") {
            return "ShipToId eq '"+ oShipTo +"' and SourceId eq '"+ oSourceId +"' and SKU eq '"+ oSKU +"' and DistributerType eq 'EXP'";
        }    	
    },

    
    //setter for Editable Flag
    setEditableFlag: function(value) {
        sap.ui.getCore().AppContext.Editable_Flag = value;
    },
    //getter for Editable Flag
    getEditableFlag: function() {
        return sap.ui.getCore().AppContext.Editable_Flag;
    },
    refreshCurrentView: function() {
    	var currentView = this.getCurrentView();
    	var currentViewName ;
    	if(!currentView){
    		currentViewName = this.getCurrentViewName();
    	}else{
    		currentViewName = this.getCurrentView().getViewName();
    	}        
        sap.ui.getCore().byId('GlobalFrameId').destroyAggregation('content');
        var cloneView = sap.ui.view({
            viewName: currentViewName,
            type: sap.ui.core.mvc.ViewType.JS
        });
        cloneView._sOwnerId = MCAPP.getComponent().sId;
        sap.ui.getCore().byId('GlobalFrameId').addContent(cloneView);
        MCAPP.getComponent().getRouter()._oViews[MCAPP.getCurrentView().getViewName()] = cloneView;
    },

    setSelectedToggle: function(option) {
        sap.ui.getCore().AppContext.toggleOption = option;
    },

    getSelectedToggle: function() {
        return sap.ui.getCore().AppContext.toggleOption;
    },

    //setter for Sales And Inventory Filter value
    setSalesInvFilter: function(value) {
        sap.ui.getCore().AppContext.SalesInvFilter = value;
    },
    //getter for Sales And Inventory Filter value
    getSalesInvFilter: function() {
        return sap.ui.getCore().AppContext.SalesInvFilter;
    },

    updateHeaderSalesAndInv: function(oContrllr) {
        jQuery.sap.byId('McTitleBarId').empty();
        if (sap.ui.getCore().byId('headerFragment')) {
            sap.ui.getCore().byId('headerFragment').destroy();
        }
        var viewName = oContrllr.getView().sViewName;
        var frgmntName = viewName.substring(0, viewName.lastIndexOf(".") + 1) + 'top.SalesAndInventoryHeader';
        var hdrFrag = sap.ui.jsfragment(frgmntName, oContrllr);
        var obj = sap.ui.getCore().createUIArea('McTitleBarId');
        obj.removeAllContent();
        obj.addContent(hdrFrag);
    },

    getFilterForShipmentDomesticScreen: function() {
    	return "(" + MCAPP.getSelectedShiptoAsQryParam() + ")";
    },
    updateHeaderShipment: function(oContrllr) {
        jQuery.sap.byId('McTitleBarId').empty();
        if (sap.ui.getCore().byId('headerFragment')) {
            sap.ui.getCore().byId('headerFragment').destroy();
        }
        var viewName = oContrllr.getView().sViewName;
        var frgmntName = viewName.substring(0, viewName.lastIndexOf(".") + 1) + 'top.ShipmentHeader';
        var hdrFrag = sap.ui.jsfragment(frgmntName, oContrllr);
        var obj = sap.ui.getCore().createUIArea('McTitleBarId');
        obj.removeAllContent();
        obj.addContent(hdrFrag);
    },
    calculatePositionCurrentOrderWeek: function(oModel) {
        //Calculating the Position of Current Week as per the Inventory Data
        var position = 0;
        for (var i = 0; i < oModel.getData().InventoryItemsData.length; i++) {
            var currentWeekNo = oModel.getData().InventoryItemsData[i].Week_No;
            var currentOrderWeek = oModel.getData().InventoryItemsData[i].currentOrderWeek;
            if (currentWeekNo === currentOrderWeek) {
                position = i;
                break;
            }
        }
        this.setPositionCurrentOrderWeek(position);
    },
    getPositionCurrentOrderWeek: function() {
        return sap.ui.getCore().AppContext.positionCurrentOrderWeek;
    },
    setPositionCurrentOrderWeek: function(positionCurrentOrderWeek) {
        sap.ui.getCore().AppContext.positionCurrentOrderWeek = positionCurrentOrderWeek;
    },
    clearPositionCurrentOrderWeek: function() {
        sap.ui.getCore().AppContext.positionCurrentOrderWeek = 0;
    },

    getFilterForInvMainScreen: function() {
    	var selectedShipTos = this.getSelectedShiptoAsQryParam();
    	var filterDistributer = this.getImpExp("DistributerType");    	
    	//In case of Domestic filter is not returned and a blank string is passed
    	if(filterDistributer === ""){
    		return selectedShipTos;
    	}
    	else{
    		if(selectedShipTos !== "")
        		return "((" + selectedShipTos + ") and " + this.getImpExp("DistributerType") + ")";
        	else
        		return this.getImpExp("DistributerType");
    	}
    	
    },
    //Calculating the future week date Proj. DOI from current week date
    getProjectedDOIWeekDate: function(numOfDays) {
        var currentWeekDate = new Date();
        var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
            pattern: "MM/dd/yy"
        });
        currentWeekDate.setDate(currentWeekDate.getDate() + numOfDays);
        var newWeekDate = dateFormat.format(currentWeekDate);
        return newWeekDate;
    },

    getFilterImpExp: function() {
        if (MCAPP.getDistributorType() == "I") {
            return "ImpExpFlag eq 'IMP'";
        }
        if (MCAPP.getDistributorType() == "E") {
            return "ImpExpFlag eq 'EXP'";
        }
    },
    
    getImpExp: function(filterName) {
    	if (MCAPP.getDistributorType() === "D" || MCAPP.getDistributorType() === "I" && (sap.ui.getCore().byId("segmentedbuttonId").mAssociations.selectedButton) === "Domestic") {
        	//In case of Domestic No Filter needs to be passed
            return "";
        }
    	else if (MCAPP.getDistributorType() === "I" && (sap.ui.getCore().byId("segmentedbuttonId").mAssociations.selectedButton) === "Import") {
            return filterName + " eq 'IMP'";
        }
        else if (MCAPP.getDistributorType() == "E") {
            return filterName + " eq 'EXP'";
        }
    },
    
    updateSegmentedButton: function(distributorType, bValue) {
        if (distributorType == "I") {
            sap.ui.getCore().byId("segmentedbuttonId").setEnabled(bValue);
        }
    },
    
    updateHeaderShipmentsImpExp: function(oContrllr) {
        jQuery.sap.byId('McTitleBarId').empty();
        if (sap.ui.getCore().byId('headerFragment')) {
            sap.ui.getCore().byId('headerFragment').destroy();
        }
        var viewName = oContrllr.getView().sViewName;
        var frgmntName = viewName.substring(0, viewName.lastIndexOf(".") + 1) + 'top.ShipmentsImpExpHeader';
        var hdrFrag = sap.ui.jsfragment(frgmntName, oContrllr);
        var obj = sap.ui.getCore().createUIArea('McTitleBarId');
        obj.removeAllContent();
        obj.addContent(hdrFrag);
    },
    updateBreadcrumb: function(bValue) {
        if (bValue) {
            sap.ui.getCore().byId("GlobalFrameId").getAggregation("breadcrumb")[0].setText(MCAPP.getText('GBL_BREADCRUMB', this));
        } else {
            sap.ui.getCore().byId("GlobalFrameId").getAggregation("breadcrumb")[0].setText("");
        }
    },
    dataReadFail: function(oError, thisContext) {
        jQuery.sap.byId('ApploadingDivId').hide();
        jQuery.sap.byId('content').show();
        sap.ui.commons.MessageBox.show(MCAPP.getText('GBL_DATA_LOAD_ERROR', thisContext), sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', thisContext), [sap.ui.commons.MessageBox.Action.OK]);
    },
    setPaginatorTextValue: function(pageNo, id, thisContext, dataLength) {
    	if(dataLength > 0){
        thisContext.byId(id).setNumberOfPages(pageNo);
        thisContext.byId(id + "Bottom").setNumberOfPages(pageNo);
    }else{
          thisContext.byId(id).setNumberOfPages(1);
        thisContext.byId(id + "Bottom").setNumberOfPages(1);
    }
    thisContext.byId(id).setCurrentPage(1);
   thisContext.byId(id + "Bottom").setCurrentPage(1);
},

/***
 * helping function to calculate the projected DOI for each respective week column
 * @param oProjectedDOIModel
 * @param noOfWeeks
 */
projectedDOI: function(oProjectedDOIModel, noOfWeeks) {
	/*	for (var i = 0; i < noOfWeeks; i++) {
	var tempForecastQuantity = 0;
	var nextWeekForecast = 0;
	var compareWeeks = 0;
	var increment = 1;
	
	var beginningInventory = 0;
	var insOutsQuantity = 0;
	var currentOrderQuantity = 0;
	var changeRequestQuantity = 0;
	var plannedQty = 0;
	var transitQty = 0;
	var arrivedQty = 0;
    var forecastQuantity = 0;
    var confirmedQuantity = 0;
    var suggestedQuantity = 0;
    var orderedQuantity = 0;
    
    if(!isNaN(oProjectedDOIModel.getProperty('/results/' + i + '/beginningInventory'))){
    	beginningInventory = Number(oProjectedDOIModel.getProperty('/results/' + i + '/beginningInventory'));
    }
    if(!isNaN(oProjectedDOIModel.getProperty('/results/' + i + '/insOuts'))){
    	insOutsQuantity = Number(oProjectedDOIModel.getProperty('/results/' + i + '/insOuts'));
    }
    if(!isNaN(oProjectedDOIModel.getProperty('/results/' + i + '/currentOrderQuantity'))){
    	currentOrderQuantity = Number(oProjectedDOIModel.getProperty('/results/' + i + '/currentOrderQuantity'));
    }
    if(!isNaN(oProjectedDOIModel.getProperty('/results/' + i + '/crQuantity'))){
    	changeRequestQuantity = Number(oProjectedDOIModel.getProperty('/results/' + i + '/crQuantity'));
    }
	if(!isNaN(oProjectedDOIModel.getProperty('/results/' + i + '/plannedShipments'))){
		 plannedQty = Number(oProjectedDOIModel.getProperty('/results/' + i + '/plannedShipments'));
	}
	if(!isNaN(oProjectedDOIModel.getProperty('/results/' + i + '/intransitShipments'))){
		transitQty = Number(oProjectedDOIModel.getProperty('/results/' + i + '/intransitShipments'));
	}
	if(!isNaN(oProjectedDOIModel.getProperty('/results/' + i + '/arrivedQuantity'))){
		arrivedQty = Number(oProjectedDOIModel.getProperty('/results/' + i + '/arrivedQuantity'));
	}
	if(!isNaN(oProjectedDOIModel.getProperty('/results/' + i + '/forecastQuantity'))){
		forecastQuantity = Number(oProjectedDOIModel.getProperty('/results/' + i + '/forecastQuantity'));
	}
	if(!isNaN(oProjectedDOIModel.getProperty('/results/' + i + '/confirmedQuantity'))){
		confirmedQuantity = Number(oProjectedDOIModel.getProperty('/results/' + i + '/confirmedQuantity'));
	}
	if(!isNaN(oProjectedDOIModel.getProperty('/results/' + i + '/suggestedQuantity'))){
		suggestedQuantity = Number(oProjectedDOIModel.getProperty('/results/' + i + '/suggestedQuantity'));
	}
	if(!isNaN(oProjectedDOIModel.getProperty('/results/' + i + '/orderedQuantity'))){
		 orderedQuantity = Number(oProjectedDOIModel.getProperty('/results/' + i + '/orderedQuantity'));
	}
	
    var currentOrderedQuantity = 0;
    
    if (currentOrderQuantity !== 0) { // if current order present
        currentOrderedQuantity = currentOrderQuantity;
    	if(changeRequestQuantity !== 0){ // if Change Request present then ignore current order
        	currentOrderedQuantity = changeRequestQuantity;
        }
    }
    else if (changeRequestQuantity !== 0) { // if Change Request present
        currentOrderedQuantity = changeRequestQuantity;
    }
    else if (orderedQuantity !== 0) { // if Ordered present
        currentOrderedQuantity = orderedQuantity;
    }
    else if (confirmedQuantity !== 0) {
        currentOrderedQuantity = confirmedQuantity;
    }
    else {
        currentOrderedQuantity = suggestedQuantity;
    }

    var endingInventory = (beginningInventory + insOutsQuantity + currentOrderedQuantity + plannedQty + transitQty + arrivedQty) - forecastQuantity;
    oProjectedDOIModel.setProperty('/results/' + i + '/endingInventory', endingInventory);
    if( i !== noOfWeeks){
    	oProjectedDOIModel.setProperty('/results/' + (i + 1) + '/beginningInventory', endingInventory);
    }
	
	tempForecastQuantity = forecastQuantity;
	
	if(forecastQuantity > 0){
		compareWeeks = Math.ceil(beginningInventory/forecastQuantity);
		if(compareWeeks < 1){ // when forecastQuantity is more than beginningInventory
			compareWeeks = 1;
		}else if(compareWeeks < noOfWeeks){ // loop atleast noOfWeeks when compareWeeks is less than noOfWeeks
			compareWeeks = noOfWeeks;
		}
	} else if(forecastQuantity === 0){
		compareWeeks = noOfWeeks;
	}
	//check with next weeks forecast
	for (var k = i + 1; k <= i + compareWeeks; k++) {
		//current week forecast is greater than BegINV
		if(tempForecastQuantity >= beginningInventory && tempForecastQuantity != 0){
			var projectedDOI = 0;
	    	//console.log(increment +"   =BegINV= "+ beginningInventory +"  =SUM= "+ tempForecastQuantity);
			if((tempForecastQuantity > 0 && beginningInventory > 0) || (tempForecastQuantity < 0 && beginningInventory < 0)){
				projectedDOI =  (beginningInventory/tempForecastQuantity) * 7;
			}
	    	oProjectedDOIModel.setProperty('/results/' + i + '/projectedDOI', Math.round(projectedDOI));
	    	break;
	     } else {
	    	 //for Last week only
	    	 if(k === noOfWeeks){
	    		 for (var m = 1; m <= compareWeeks; m++) {
	    			 tempForecastQuantity = tempForecastQuantity + forecastQuantity; // 10week and onwards same quantity
			    	 if(tempForecastQuantity >= beginningInventory && nextWeekForecast != 0){
			    		 tempForecastQuantity = tempForecastQuantity - forecastQuantity;
			    		 nextWeekForecast = forecastQuantity;
			    		 var projectedDOI =  0;
			    		 if(((beginningInventory - tempForecastQuantity) > 0 && nextWeekForecast > 0) 
			    				 || ((beginningInventory - tempForecastQuantity) < 0 && nextWeekForecast < 0)){
			    			 projectedDOI =  increment * 7 + ((beginningInventory - tempForecastQuantity)/nextWeekForecast) * 7; 
			    		 }
			    		 oProjectedDOIModel.setProperty('/results/' + i + '/projectedDOI', Math.round(projectedDOI));
			    		 break;
			    	 }
			    	 increment ++;
	    		 }
	    	 }
	    	 
	    	 if(k >= noOfWeeks){
	    		 nextWeekForecast = Number(oProjectedDOIModel.getProperty('/results/' + (noOfWeeks -1) + '/forecastQuantity'));;
	    	 }else{
	    		 nextWeekForecast = Number(oProjectedDOIModel.getProperty('/results/' + k + '/forecastQuantity'));
	    	 }
	    	
	    	 tempForecastQuantity = tempForecastQuantity + nextWeekForecast;
	    	 
	    	 if(tempForecastQuantity >= beginningInventory && nextWeekForecast != 0){
	    		 tempForecastQuantity = tempForecastQuantity - nextWeekForecast;
	    		 var projectedDOI = 0;
	    		 if(((beginningInventory - tempForecastQuantity) > 0 && nextWeekForecast > 0) 
	    				 || ((beginningInventory - tempForecastQuantity) < 0 && nextWeekForecast < 0)){
	    			 projectedDOI =  increment * 7 + ((beginningInventory - tempForecastQuantity)/nextWeekForecast) * 7; 
	    		 }
	    		 oProjectedDOIModel.setProperty('/results/' + i + '/projectedDOI', Math.round(projectedDOI));
	    		 break;
	    	 }
	    	 increment++; 
	     }
	}
}
return oProjectedDOIModel;*/


console.log("noOfWeeks >> " + noOfWeeks);
for (var i = 0; i < noOfWeeks; i++) {
	var tempForecastQuantity = 0;
	var nextWeekForecast = 0;
	var compareWeeks = 0;
	var increment = 1;
	
	var beginningInventory = 0;
	var insOutsQuantity = 0;
	var currentOrderQuantity = 0;
	var changeRequestQuantity = 0;
	var plannedQty = 0;
	var transitQty = 0;
	var arrivedQty = 0;
    var forecastQuantity = 0;
    var confirmedQuantity = 0;
    var suggestedQuantity = 0;
    var orderedQuantity = 0;
    
    if(!isNaN(oProjectedDOIModel.getProperty('/results/' + i + '/beginningInventory'))){
    	beginningInventory = Number(oProjectedDOIModel.getProperty('/results/' + i + '/beginningInventory'));
    }
    if(!isNaN(oProjectedDOIModel.getProperty('/results/' + i + '/insOuts'))){
    	insOutsQuantity = Number(oProjectedDOIModel.getProperty('/results/' + i + '/insOuts'));
    }
    if(!isNaN(oProjectedDOIModel.getProperty('/results/' + i + '/currentOrderQuantity'))){
    	currentOrderQuantity = Number(oProjectedDOIModel.getProperty('/results/' + i + '/currentOrderQuantity'));
    }
    if(!isNaN(oProjectedDOIModel.getProperty('/results/' + i + '/crQuantity'))){
    	changeRequestQuantity = Number(oProjectedDOIModel.getProperty('/results/' + i + '/crQuantity'));
    }
	if(!isNaN(oProjectedDOIModel.getProperty('/results/' + i + '/plannedShipments'))){
		 plannedQty = Number(oProjectedDOIModel.getProperty('/results/' + i + '/plannedShipments'));
	}
	if(!isNaN(oProjectedDOIModel.getProperty('/results/' + i + '/intransitShipments'))){
		transitQty = Number(oProjectedDOIModel.getProperty('/results/' + i + '/intransitShipments'));
	}
	if(!isNaN(oProjectedDOIModel.getProperty('/results/' + i + '/arrivedQuantity'))){
		arrivedQty = Number(oProjectedDOIModel.getProperty('/results/' + i + '/arrivedQuantity'));
	}
	if(!isNaN(oProjectedDOIModel.getProperty('/results/' + i + '/forecastQuantity'))){
		forecastQuantity = Number(oProjectedDOIModel.getProperty('/results/' + i + '/forecastQuantity'));
	}
	if(!isNaN(oProjectedDOIModel.getProperty('/results/' + i + '/confirmedQuantity'))){
		confirmedQuantity = Number(oProjectedDOIModel.getProperty('/results/' + i + '/confirmedQuantity'));
	}
	if(!isNaN(oProjectedDOIModel.getProperty('/results/' + i + '/suggestedQuantity'))){
		suggestedQuantity = Number(oProjectedDOIModel.getProperty('/results/' + i + '/suggestedQuantity'));
	}
	if(!isNaN(oProjectedDOIModel.getProperty('/results/' + i + '/orderedQuantity'))){
		 orderedQuantity = Number(oProjectedDOIModel.getProperty('/results/' + i + '/orderedQuantity'));
	}
	
    var currentOrderedQuantity = 0;
   
    if (changeRequestQuantity !== 0) { // if CR present
        currentOrderedQuantity = changeRequestQuantity;
    } 
    else if (currentOrderQuantity !== 0) { // if current order present
        currentOrderedQuantity = currentOrderQuantity;
    }
    else if (confirmedQuantity !== 0) {
        currentOrderedQuantity = confirmedQuantity;
    }
    else if (orderedQuantity !== 0) { // if Ordered present
        currentOrderedQuantity = orderedQuantity;
    }
    else {
        currentOrderedQuantity = suggestedQuantity;
    }
    
//    if (currentOrderQuantity !== 0) { // if current order present
//        currentOrderedQuantity = currentOrderQuantity;
//    	if(changeRequestQuantity !== 0){ // if Change Request present then ignore current order
//        	currentOrderedQuantity = changeRequestQuantity;
//        }
//    }
//    else if (changeRequestQuantity !== 0) { // if Change Request present
//        currentOrderedQuantity = changeRequestQuantity;
//    }
//    else if (orderedQuantity !== 0) { // if Ordered present
//        currentOrderedQuantity = orderedQuantity;
//    }
//    else if (confirmedQuantity !== 0) {
//        currentOrderedQuantity = confirmedQuantity;
//    }
//    else {
//        currentOrderedQuantity = suggestedQuantity;
//    }
    
    if(beginningInventory < 0){
    	beginningInventory = 0;
    }
    var endingInventory = (beginningInventory + insOutsQuantity + currentOrderedQuantity + plannedQty + transitQty + arrivedQty) - forecastQuantity;
    
    if(endingInventory < 0){
    	endingInventory = 0;
    }
    console.log("i week ==" + i + " beginningInventory "  + beginningInventory + " insOutsQuantity " + insOutsQuantity  
    		+ " || currentOrderQuantity " + currentOrderQuantity + " changeRequestQuantity " + changeRequestQuantity 
    		+ " confirmedQuantity " + confirmedQuantity + " orderedQuantity " + orderedQuantity + " suggestedQuantity " + suggestedQuantity
    		+ " << plannedQty " + plannedQty + " transitQty " + transitQty + " arrivedQty " + arrivedQty
    		+ " >> || Quantity " + currentOrderedQuantity + " forecastQuantity " + forecastQuantity + " endingInventory " + endingInventory);
    
    oProjectedDOIModel.setProperty('/results/' + i + '/endingInventory', endingInventory);
    if( i !== noOfWeeks){
    	oProjectedDOIModel.setProperty('/results/' + (i + 1) + '/beginningInventory', endingInventory);
    }
	
	tempForecastQuantity = forecastQuantity;
	
	if(forecastQuantity > 0){
		compareWeeks = Math.ceil(beginningInventory/forecastQuantity);
		if(compareWeeks < 1){ // when forecastQuantity is more than beginningInventory
			compareWeeks = 1;
		}else if(compareWeeks < noOfWeeks){ // loop atleast noOfWeeks when compareWeeks is less than noOfWeeks
			compareWeeks = noOfWeeks;
		}
	} else if(forecastQuantity === 0){
		compareWeeks = noOfWeeks;
	}
	console.log("loop for no of weeks >> " + compareWeeks);
	
	//check with next weeks forecast
	for (var k = i + 1; k <= i + compareWeeks; k++) {
		//current week forecast is greater than BegINV
		if(tempForecastQuantity >= beginningInventory && tempForecastQuantity != 0){
			var projectedDOI = 0;
	    	//console.log(increment +"   =BegINV= "+ beginningInventory +"  =SUM= "+ tempForecastQuantity);
			if((tempForecastQuantity > 0 && beginningInventory > 0) || (tempForecastQuantity < 0 && beginningInventory < 0)){
				projectedDOI =  (beginningInventory/tempForecastQuantity) * 7;
			}
	    	console.log("cond if projectedDOI : " + Math.round(projectedDOI));
	    	oProjectedDOIModel.setProperty('/results/' + i + '/projectedDOI', Math.round(projectedDOI));
	    	break;
	     } else {
	    	 //for Last week only
	    	 if((i + 1) === noOfWeeks){
	    		 for (var m = 1; m <= compareWeeks; m++) {
	    			 console.log(" loop for no of weeks for last week >> " + compareWeeks);
	    			 tempForecastQuantity = tempForecastQuantity + forecastQuantity; // 10week and onwards same quantity
	    			 nextWeekForecast = forecastQuantity;
			    	 if(tempForecastQuantity >= beginningInventory && nextWeekForecast != 0){
			    		 tempForecastQuantity = tempForecastQuantity - forecastQuantity;
			    		 var projectedDOI =  0;
			    		 //console.log(increment +"   =BegINV= "+ beginningInventory +"  =SUM= "+ tempForecastQuantity +"  =NextForecast= "+ nextWeekForecast);
			    		 if(((beginningInventory - tempForecastQuantity) > 0 && nextWeekForecast > 0) 
			    				 || ((beginningInventory - tempForecastQuantity) < 0 && nextWeekForecast < 0)){
			    			 projectedDOI =  increment * 7 + ((beginningInventory - tempForecastQuantity)/nextWeekForecast) * 7; 
			    		 }
			    		 console.log("cond else 9 projectedDOI : " + Math.round(projectedDOI));
			    		 oProjectedDOIModel.setProperty('/results/' + i + '/projectedDOI', Math.round(projectedDOI));
			    		 break;
			    	 }
			    	 increment ++;
	    		 }
	    		 return oProjectedDOIModel;
	    	 }
	    	 
	    	 if(k >= noOfWeeks){
	    		 nextWeekForecast = Number(oProjectedDOIModel.getProperty('/results/' + (noOfWeeks -1) + '/forecastQuantity'));
	    	 }else{
	    		 nextWeekForecast = Number(oProjectedDOIModel.getProperty('/results/' + k + '/forecastQuantity'));
	    	 }
	    	
	    	 tempForecastQuantity = tempForecastQuantity + nextWeekForecast;
	    	 
	    	 if(tempForecastQuantity >= beginningInventory && nextWeekForecast != 0){
	    		 tempForecastQuantity = tempForecastQuantity - nextWeekForecast;
	    		 //console.log(increment +"   =BegINV= "+ beginningInventory +"  =SUM= "+ tempForecastQuantity +"  =NextForecast= "+ nextWeekForecast);
	    		 var projectedDOI = 0;
	    		 if(((beginningInventory - tempForecastQuantity) > 0 && nextWeekForecast > 0) 
	    				 || ((beginningInventory - tempForecastQuantity) < 0 && nextWeekForecast < 0)){
	    			 projectedDOI =  increment * 7 + ((beginningInventory - tempForecastQuantity)/nextWeekForecast) * 7; 
	    		 }
	    		 console.log("cond else projectedDOI : " + Math.round(projectedDOI));
	    		 oProjectedDOIModel.setProperty('/results/' + i + '/projectedDOI', Math.round(projectedDOI));
	    		 break;
	    	 }
	    	 increment++; 
	     }
	}
}
return oProjectedDOIModel;
},

getFilterForShipmentImpExpScreen: function() {
	if (MCAPP.getDistributorType() == "I") {
		return "(" + MCAPP.getSelectedShiptoAsQryParam() + ") and (ShipmentTyp eq 'IMP')";
	} else {
		return "(" + MCAPP.getSelectedShiptoAsQryParam() + ") and (ShipmentTyp eq 'EXP')";
	}
},

getExpandState : function (){
	return sap.ui.getCore().AppContext.isExpand;
},

setExpandState : function(bValue){
	sap.ui.getCore().AppContext.isExpand = bValue;
},
isImportDistributor : function(){
    if(MCAPP.getDistributorType() === "I"){
           return true;
    }else{
           return false;
    }
},
isExportDistributor : function(){
    if(MCAPP.getDistributorType() === "E"){
           return true;
    }else{
           return false;
    }
},
isDomesticDistributor : function(){
    if(MCAPP.getDistributorType() === "D"){
           return true;
    }else{
           return false;
    }
},

isReadOnlyState: function() {
	if (MCAPP.getCutOffTime() != 'X') {
        return false;
    }else{
    	return true;
    }
},

isReadOnlyCRState: function() {
	if (MCAPP.getCRCutOffTime() != 'X') {
        return false;
    }else{
    	return true;
    }
},
isReadOnlyRole : function(){
	if (MCAPP.getEditableFlag() == 'X') {
        return false;
    }else{
    	return true;
    }
}
};
//Create an alias name for easiness..
var MCAPP = mc.ccp.util.Application;