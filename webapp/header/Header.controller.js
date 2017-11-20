/***
 * @Author AF80
 * @Date 10/07/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is Header view controller
 */
sap.ui.controller("mc.ccp.header.Header", {
	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * Getting oData model for Ship To's , messages and alerts
	 * @memberOf header.Header
	 */
	onInit: function() {
		//Get the oData Model for Ship To's. Calling data load success and fail methods
//		var oDataModel = new sap.ui.model.odata.ODataModel(MCAPP.getServiceUrl(MCAPP.getComponent().getModel('service').getProperty('/DashboardShipTosService')));
		var oDataModel = new sap.ui.model.json.JSONModel();
		this.getView().data('oDataModel', oDataModel);
		var thisContext = this;
		/*oDataModel.read('ZCCP_SHIPTO_HDR_SET(\'\')', null, {
			"$expand": "ZCCP_SHIPTO_HDR_ITM_NAV",
			"$format": "json"
		}, false, function(oData, oResponse) {
			thisContext._dataLoadSuccess(oData, oResponse);
		}, function(oError) {
			thisContext._dataLoadFail(oError);
		}); */       
		oDataModel.attachRequestCompleted(thisContext._dataLoadSuccess,this);
		oDataModel.loadData("json/DashboardShipTosService.json",{},false);
		
		if(MCAPP.getAppLoadError()){
			return;
		}
		//Get the oData Model for Messages. Calling data load success and fail methods
//		var oMsgModel = new sap.ui.model.odata.ODataModel(MCAPP.getServiceUrl(MCAPP.getComponent().getModel('service').getProperty('/MessageandalertService')));
		var oMsgModel = new sap.ui.model.json.JSONModel();
		this.getView().data('oMsgModel', oMsgModel);
		/*oMsgModel.read('ZCCP_DSHBOARD_MSG_SET', null, {
			"$format": "json",
			"$filter": MCAPP.getFilterForMessagesScreen()
		}, false, function(mData, mResponse) {
			thisContext._msgDataLoadSuccess(mData, mResponse);
		}, function(mError) {
			thisContext._msgDataLoadFail(mError);
		});*/
		
		oMsgModel.attachRequestCompleted(thisContext._msgDataLoadSuccess,this);
		oMsgModel.loadData("json/DashboardShipTosServiceMSGSet.json",{},false);
	
		oMsgModel.attachRequestCompleted(thisContext._alertDataLoadSuccess,this);
		oMsgModel.loadData("json/DashboardShipTosServiceMSG.json",{},false);
		
		
		//Get Alert oData Model. Calling data load success and fail methods
		/*oMsgModel.read('ZCCP_DSHBOARD_MSG_SET', null, {
			"$format": "json",
			"$filter": MCAPP.getFilterForSplashScreen()
		}, false, function(sData, sResponse) {
			thisContext._alertDataLoadSuccess(sData, sResponse);
		}, function(sError) {
			thisContext._alertDataLoadFail(sError);
		});*/
	},
	/***
	 * This method is called to calculate the unread messages count and set it to the count on the dashboard header
	 * @param msgData
	 */
	_calculateUnreadMessageCount: function(msgData) {
		var unreadCount = 0;
		for (var i = 0; i < msgData.length; i++) {
			if (msgData[i].IsRead !== 'X') {
				unreadCount++;
			}
		}
		//Changed the Header - for 0 unread messages
		if (unreadCount !== 0) {
			this.byId('countCarrier').setContent("<div align='center' class='mcCustControlMsgCount'>" + unreadCount + "</div>");
		}
		else{
			this.byId('countCarrier').setContent("");
		}		
	},
	/***
	 * This method is called when data load is successful in onInit method
	 * @param oData
	 * @param oResponse
	 */
	_dataLoadSuccess: function(evt) {
		//Add State related properties (expand, dirty)
		var obj = evt.getSource().getData().d;//JSON.parse(oResponse.body).d;
		//setting import flag globally
		MCAPP.setDistributorType(obj.Import);
		// setting currentweek globally. 	      
		MCAPP.setCurrentweek(obj.Week_No);
		// setting crcount globally.
		MCAPP.setCRcount(obj.ChangeRequestCount);
		//setting CutOffTime globally
		MCAPP.setCutOffTime(obj.CutOffTime);		
		//setting CR CutOffTime globally
		MCAPP.setCRCutOffTime(obj.CRCutOffTime);
		// setting Editable_Flag globally
		MCAPP.setEditableFlag(obj.Editable_Flag);
		// setting distributor id
		MCAPP.setDistributorId(obj.DistributorId);
		// setting distributor name
		MCAPP.setDistributorName(obj.DistributorName);
		// setting shipto object globally.
		var shipTodetails = obj.ZCCP_SHIPTO_HDR_ITM_NAV.results;
		for (var i = 0; i < shipTodetails.length; i++) {
			shipTodetails[i].selectFlagBkup = true;
			shipTodetails[i].selectFlag = true;
		}
		// Checking if necessary parameters are not coming from oData
		if(shipTodetails.length == 0){
			jQuery.sap.byId('ApploadingDivId').hide();
			jQuery.sap.byId('content').show();
			var sError = MCAPP.getText('VW_HEADER_SHIPTO_ERROR', this);
			MCAPP.showApplicationError(sError,true);
		}else if(MCAPP.getCurrentweek() == ""){
			jQuery.sap.byId('ApploadingDivId').hide();
			jQuery.sap.byId('content').show();
			var sError =  MCAPP.getText('VW_HEADER_WEEK_ERROR', this);
			MCAPP.showApplicationError(sError,true);
		}
		else if(MCAPP.getDistributorType() ==""){
			jQuery.sap.byId('ApploadingDivId').hide();
			jQuery.sap.byId('content').show();
			var sError = MCAPP.getText('VW_HEADER_DIST_ERROR', this);
			MCAPP.showApplicationError(sError,true);
		}
		else{
			MCAPP.setShipTos(shipTodetails);
			this.byId('shiptolink').mProperties.text = shipTodetails.length + ' of ' + shipTodetails.length;

			if(MCAPP.isImportDistributor() === false){
				sap.ui.getCore().byId("segmentedbuttonId").setVisible(false);
			}
			if(MCAPP.isDomesticDistributor() === false){
				MCAPP.getComponent().getRouter()._oRoutes.Empty._oConfig.view = 'ImpExpOrder';
				MCAPP.getComponent().getRouter()._oRoutes.Empty._oConfig.viewPath = 'mc.ccp.order';
			}

			if(MCAPP.isImportDistributor() === true){
				MCAPP.getComponent().getRouter()._oRoutes.Empty._oConfig.view = 'Order';
				MCAPP.getComponent().getRouter()._oRoutes.Empty._oConfig.viewPath = 'mc.ccp.order';
			}
		}
	},
	/***
	 * This method is called when data load is Failed in onInit method
	 * @param oData
	 * @param oResponse
	 */
	_dataLoadFail: function(oError) {    	
		jQuery.sap.byId('ApploadingDivId').hide();
		jQuery.sap.byId('content').show();
		MCAPP.showApplicationError(oError,true);    	
	},
	/***
	 * This method is called when Message data load is successful in onInit method.
	 * It will parse the JSON response and put the isRead flag in the parsed JSON response
	 * @param mData
	 * @param mResponse
	 */
	_msgDataLoadSuccess: function(evt) {
		var msgObj = evt.getSource().getData();//JSON.parse(mResponse.body);
		var msgData = {};
		msgData.results = msgObj.d.results;
		$.each(msgData.results, function(i, item) {
			if (item.IsRead === 'X') {
				item.isReadFlag = true;
			}
			else {
				item.isReadFlag = false;
			}
		});
		//set the model to this view
		var mModel = new sap.ui.model.json.JSONModel();
		mModel.setData(msgData);
		this.getView().setModel(mModel, 'message');
		this._calculateUnreadMessageCount(msgData.results);
	},
	/***
	 * This method is called when Message data load is Failed in onInit method.
	 * displays the error message box in case of failure.
	 * @param mError
	 */
	_msgDataLoadFail: function(mError) {
		sap.ui.commons.MessageBox.show(MCAPP.getText('GBL_DATA_LOAD_ERROR', this), sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', this), [sap.ui.commons.MessageBox.Action.OK]);
	},
	/***
	 * This method is called when Alert data load is successful in onInit method.
	 * It will parse the JSON response and put the isRead flag in the parsed JSON response
	 * @param sData
	 * @param sResponse
	 */
	_alertDataLoadSuccess: function(evt) {
		var aObj = evt.getSource().getData();//JSON.parse(sResponse.body);
		var aData = {};
		aData.results = aObj.d.results;	
		var aSplashData = {"results" : []};
		$.each(aData.results, function(i, item) {
			if (aData.results[i].IsRead === 'X') {
				item.isReadFlag = true;
			}
			else {
				item.isReadFlag = false;
				aSplashData.results.push(item);
			}
		});
		//set the model to this view
		var aModel = new sap.ui.model.json.JSONModel();
		aModel.setData(aData);
		this.getView().setModel(aModel, 'alert');
		
		var aSplashModel = new sap.ui.model.json.JSONModel();
		aSplashModel.setData(aSplashData);
		this.getView().setModel(aSplashModel, 'alertFirst');	//alert at the first time of screen load
	},
	/***
	 * This method is called when Alert data load is Failed in onInit method.
	 * displays the error message box in case of failure.
	 * @param sError
	 */
	_alertDataLoadFail: function(sError) {
		sap.ui.commons.MessageBox.show(MCAPP.getText('GBL_DATA_LOAD_ERROR', this), sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', this), [sap.ui.commons.MessageBox.Action.OK]);
	},
	/***
	 *  This method is called when the toggle button are selected(Domestic or Import)
	 * @param oEvent
	 */
	onSelectDomesticOrImport: function(oEvent) {
		var selectedbutton = oEvent.getParameters().selectedButtonId;
		var menuBarObject = sap.ui.getCore().byId("GlobalFrameId").getAggregation("menu")[0];
		if (selectedbutton == MCAPP.getText('DH_IMPORT', this)) {
			// sap.ui.getCore().byId("crlink").setVisible(false); 
			// disabling CR
			menuBarObject.byId("changereqlink").addStyleClass('menu_itemDisable');
			sap.ui.getCore().byId("crlink").getAggregation('content')[0].setEnabled(false);
			// disabling  Forecast
			menuBarObject.byId("forecastlink").setEnabled(false);
			menuBarObject.byId("forecastlink").addStyleClass('menu_itemDisable');
			// disabling Sales & Inventory
			menuBarObject.byId("salesinventorylink").setEnabled(false);
			menuBarObject.byId("salesinventorylink").addStyleClass('menu_itemDisable');

			var currentViewName = MCAPP.getCurrentView().getProperty('viewName'); 
			var currentViewsCounterpart = MCAPP.getComponent().getModel('togglePages').getProperty('/'+currentViewName);
			sap.ui.getCore().byId('GlobalFrameId').destroyAggregation('content');
			var cloneView = sap.ui.view({viewName:currentViewsCounterpart, type:sap.ui.core.mvc.ViewType.JS});        
			sap.ui.getCore().byId('GlobalFrameId').addContent(cloneView);
			MCAPP.getComponent().getRouter()._oViews[MCAPP.getCurrentView().getViewName()] = cloneView;
		}
		else {         
			// enabling Orders
			menuBarObject.byId("orderMenuId").setEnabled(true);
			menuBarObject.byId("orderMenuId").addStyleClass('menu_item');
			// enabling CR
			menuBarObject.byId("changereqlink").removeStyleClass('menu_itemDisable');
			menuBarObject.byId("changereqlink").addStyleClass('menu_item');
			sap.ui.getCore().byId("crlink").getAggregation('content')[0].setEnabled(true);
			// enabling  Forecast
			menuBarObject.byId("forecastlink").removeStyleClass('menu_itemDisable');
			menuBarObject.byId("forecastlink").setEnabled(true);
			menuBarObject.byId("forecastlink").addStyleClass('menu_item');
			//enabling Inventory
			menuBarObject.byId("inventorylink").setEnabled(true);
			menuBarObject.byId("inventorylink").addStyleClass('menu_item');
			//enabling Shipment
			menuBarObject.byId("shipmentlink").setEnabled(true);
			menuBarObject.byId("shipmentlink").addStyleClass('menu_item');
			// enabling Sales & Inventory
			menuBarObject.byId("salesinventorylink").removeStyleClass('menu_itemDisable');
			menuBarObject.byId("salesinventorylink").setEnabled(true);
			menuBarObject.byId("salesinventorylink").addStyleClass('menu_item');

			var currentViewName = MCAPP.getCurrentView().getProperty('viewName'); 
			var currentViewsCounterpart = MCAPP.getComponent().getModel('togglePages').getProperty('/'+currentViewName);
			sap.ui.getCore().byId('GlobalFrameId').destroyAggregation('content');
			var cloneView = sap.ui.view({viewName:currentViewsCounterpart, type:sap.ui.core.mvc.ViewType.JS});        
			sap.ui.getCore().byId('GlobalFrameId').addContent(cloneView);
			MCAPP.getComponent().getRouter()._oViews[MCAPP.getCurrentView().getViewName()] = cloneView;
		}
		var CRcount = MCAPP.getCRcount();
		if((CRcount === "0" || CRcount === '')){
    		sap.ui.getCore().byId("item1-1-4").setVisible(false);
    		sap.ui.getCore().byId("crlink").getContent()[1].setVisible(false);
    	}
    	else{
    		if((MCAPP.getDistributorType() === "D") || ((MCAPP.getDistributorType() === "I") && (sap.ui.getCore().byId("segmentedbuttonId").mAssociations.selectedButton) === "Domestic")){
    			sap.ui.getCore().byId("item1-1-4").setVisible(true);
        		sap.ui.getCore().byId("crlink").getContent()[1].setVisible(true);
    		}
    		else{
    			sap.ui.getCore().byId("item1-1-4").setVisible(false);
        		sap.ui.getCore().byId("crlink").getContent()[1].setVisible(false);
    		}
    	}
	},
	/***
	 * This method is called when the shipto link clicked to open Ship to location dialogbox.
	 */
	onPressShipToLocation: function() {

		if (MCAPP.getDirtyFlag() === true) {
			sap.ui.commons.MessageBox.alert(MCAPP.getText('GBL_SAVE_PROMP_SHIPTO', this));
			return;
		}
		var oShipToView;
		oShipToView = new sap.ui.view({
			type: sap.ui.core.mvc.ViewType.JS,
			viewName: "mc.ccp.header.ShipTo"
		});
		var oCancelButton = new sap.ui.commons.Button({
			text: MCAPP.getText('GBL_CANCEL', this),
			width: "90px",
			height: '30px'
		});
		oCancelButton.attachPress(oShipToView.getController().onPressCancel, oShipToView.getController());
		var oSaveButton = new sap.ui.commons.Button({
			text: MCAPP.getText('GBL_SAVE', this),
			width: "90px",
			height: '30px',
		});
		oSaveButton.attachPress(oShipToView.getController().onPressSave, oShipToView.getController());
		this.getView().shipToDailog = new mc.ccp.control.McDialog({
			modal: true,
			title: MCAPP.getText('ST_LBL_SHIPTO', this),
			preventEscape: true,				
			content: [oShipToView],
			buttons: [oCancelButton, oSaveButton]
		}).addStyleClass('McCcpCustomDialog');
		//Changed
		this.getView().shipToDailog.attachCloseClicked(oShipToView.getController().onPressCancel, oShipToView.getController());
		this.getView().shipToDailog.open();
	
	},
	/***
	 * Event handler for on Press Alert custom control. Initial checks for Model and Data not null and opening Alert dialog box
	 * @param aEvent
	 */
	onPressSplashMessages: function(aEvent) {
		var alertModel = this.getView().getModel('alert');
		if (!alertModel) {
			sap.ui.commons.MessageBox.show(MCAPP.getText('GBL_DATA_LOAD_ERROR', this), sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', this), [sap.ui.commons.MessageBox.Action.OK]);
			return;
		}
		var alertData = alertModel.getData();
		if (alertData.length === 0) {
			sap.ui.commons.MessageBox.show(MCAPP.getText('GBL_DATA_LOAD_ERROR', this), sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', this), [sap.ui.commons.MessageBox.Action.OK]);
			return;
		}
		if (this.getView().oAlertDialog === null) {
			var isCalledFromComponent = false;
			var oAlertView = new sap.ui.view({
				type: sap.ui.core.mvc.ViewType.JS,
				viewName: "mc.ccp.header.Alert",
				viewData: [isCalledFromComponent]
			});
			var oCloseButton = new sap.ui.commons.Button('closeButtonId', {
				text: MCAPP.getText('GBL_CLOSE', this),
				enabled: false
			}).addStyleClass('McCcpMsgAlertclose');
			oCloseButton.attachPress(oAlertView.getController().onPressClose, oAlertView.getController());
			var results = alertData.results.length;
			this.getView().oAlertDialog = new mc.ccp.control.McDialog('alertdialog', {
				preventEscape : true,
				modal: true,
				width: '40%',
	            height: '50%',
				title: MCAPP.getText('SPLASH_SCREEN', this)+" ( 1 "+ MCAPP.getText('GBL_OF', this) + " " + results + " )",
				content: [oAlertView],
				buttons: [oCloseButton],
			}).addStyleClass('McCcpCustomDialog');	
			this.getView().oAlertDialog.attachCloseClicked(oAlertView.getController().onPressEscape, oAlertView.getController());
			this.getView().oAlertDialog.addStyleClass('McCcpHeaderDialogClose');
			this.getView().oAlertDialog.open();
		}
		else {
			//Model Has to be updated
			this.getView().oAlertDialog.getAggregation("content")[0].setModel(alertModel);
			sap.ui.getCore().byId("alertdialog").setTitle(MCAPP.getText('SPLASH_SCREEN', this)+" ( 1 "+ MCAPP.getText('GBL_OF', this) + " " + alertModel.getData().results.length + " )");
			this.getView().oAlertDialog.open();
			
		}
	},
	/***
	 * Event handler for on Press Message custom control.Initial checks for Model and Data not null and opening Alert dialog box
	 * @param mEvent
	 */
	onPressMessage: function(mEvent) {
		var alertModel = this.getView().getModel('message');
		if (!alertModel) {
			sap.ui.commons.MessageBox.show(MCAPP.getText('GBL_DATA_LOAD_ERROR', this), sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', this), [sap.ui.commons.MessageBox.Action.OK]);
			return;
		}
		var alertData = alertModel.getData();
		if (alertData.length === 0) {
			sap.ui.commons.MessageBox.show(MCAPP.getText('GBL_NO_MESSAGES', this), sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', this), [sap.ui.commons.MessageBox.Action.OK]);
			return;
		}
		if (this.getView().oMessageDialog === null) {
			var oMessageView = new sap.ui.view('MessageViewId', {
				type: sap.ui.core.mvc.ViewType.JS,
				viewName: "mc.ccp.header.Message"
			});
			var oCloseButton = new sap.ui.commons.Button({
				text: MCAPP.getText('GBL_CLOSE', this),
				enabled: true
			}).addStyleClass('McCcpMsgAlertclose');
			oCloseButton.attachPress(oMessageView.getController().onPressClose, oMessageView.getController());
			var results = alertData.results.length;
			this.getView().oMessageDialog = new mc.ccp.control.McDialog('messagedialog', {
				modal: true,
				title: MCAPP.getText('MESSAGES', this) + " ( 1 "+ MCAPP.getText('GBL_OF', this) + " " + results + " )",
				content: [oMessageView],
				buttons: [oCloseButton],
			}).addStyleClass('McCcpCustomDialog');
			this.getView().oMessageDialog.addStyleClass('McCcpHeaderDialogClose');
			this.getView().oMessageDialog.attachClosed(oMessageView.getController().onCloseUpdCount, oMessageView.getController());
			this.getView().oMessageDialog.open();
		}
		else {
			this.getView().oMessageDialog.open();
		}
	},
	/***
	 * This function is used to navigate view mc.ccp.setting.Setting 
	 * @param oEvent
	 */
	onPressSettings: function(oEvent) {
		MCAPP.navigateTo("Setting", {}, this, false, null);
	}

});