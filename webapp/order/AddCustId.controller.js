/**
 * @Author MS34
 * @Date 21/11/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is AddCustId view controller
 */
sap.ui.controller("mc.ccp.order.AddCustId", {
	/**
	 * Called when a controller is instantiated and its View
	 * controls (if available) are already created. Can be used
	 * to modify the View before it is displayed, to bind event
	 * handlers and do other one-time initialization.
	 * @memberOf order.AddCustId
	 */
	onInit : function() {
		var thisContext = this;
		var sFilterRepOrdString = thisContext._createRepOrdFilter();

		// Get the Order List
		var oDataModel = new sap.ui.model.odata.ODataModel(
		MCAPP.getServiceUrl(MCAPP.getComponent().getModel('service').getProperty('/OrderService')));
		this.getView().data('oDataModel', oDataModel);

		oDataModel.read('ZCCP_ORD_CPOID_SET', null, {
			"$format" : "json",
			"$filter" : sFilterRepOrdString
		}, false, function(oData, oResponse) {
			thisContext._dataLoadSuccess(oResponse);
		}, function(oError) {
			thisContext._dataLoadFail();
		});	
		this._setTableRows();
	},
	
	/**
	 * Called to create number of rows based on oData modal response.
	 * @memberOf order.AddCustId
	 */
	
	_setTableRows : function(){
		//var dataLength = this.getView().getModel().getData().results.length;
		//this.byId("addcustomId").setVisibleRowCount(parseInt(dataLength));
	},

	/**
	 * Called to create the filter string for distinct RepOrdNo from matching Current Week
	 * @returns string
	 * @memberOf order.AddCustId
	 */
	_createRepOrdFilter : function (){
		var oOrderView = mc.ccp.util.Application.getCurrentView();
		var oOrderModel = oOrderView.getModel();
		var oOrderData = oOrderModel.getData().results;
		var oRepoArr = [];
		var sFilterRepOrdString = "";
		var i = 0;
		if(MCAPP.getDistributorType() == 'I'){
			var selectedButton = sap.ui.getCore().byId("segmentedbuttonId").getAssociation("selectedButton");
        	if (selectedButton == MCAPP.getText('DH_IMPORT', this) && sap.ui.getCore().byId("segmentedbuttonId").getVisible() === true) {
        		oRepoArr = this._getReplenishmentOrders(oOrderData, true);
        	}else{
        		oRepoArr = this._getReplenishmentOrders(oOrderData, false);
        	}
		}
		else if(MCAPP.getDistributorType() == 'E'){
			oRepoArr = this._getReplenishmentOrders(oOrderData, true);
		}
		else{
			oRepoArr = this._getReplenishmentOrders(oOrderData, false);
		}
		
		var uniqueRepoArr = oRepoArr.filter(function(item, i, ar) {
			return ar.indexOf(item) === i;
		});
		
		if(uniqueRepoArr.length > 0){
			for (i = 0; i < uniqueRepoArr.length; i++) {
				if (i !== uniqueRepoArr.length - 1)
					sFilterRepOrdString += "Repl_Ord_No eq '" + uniqueRepoArr[i] + "' or ";
				else
					sFilterRepOrdString += "Repl_Ord_No eq '" + uniqueRepoArr[i] + "'";
			}
		}
		else{
		}
		return sFilterRepOrdString;
	},
	
	_getReplenishmentOrders: function(oOrderData, bFlag){
		var i;
		var j;
		var oCurrentWeek = mc.ccp.util.Application.getCurrentweek();
		var oCurrentRow;
		var oCurrentWeeksAndQty;
		var oWeeksAndQtyRow;
		var oCurrentWeekNo;
		var oCurrentRepOrdNo;
		var oRepoArr = [];
		for (i = 0; i < oOrderData.length; i++) {
			oCurrentRow = oOrderData[i];
			if(bFlag === true){
				oWeeksAndQtyRow = oCurrentRow.ZCCP_ORD_CR_HEAD_ITM_NAV.results;
			}else{
				oWeeksAndQtyRow = oCurrentRow.ZCCP_WEEKSANDQTY_NAV.results;
			}
			
			for (j = 0; j < oWeeksAndQtyRow.length; j++) {
				oCurrentWeeksAndQty = oWeeksAndQtyRow[j];
				oCurrentWeekNo = oCurrentWeeksAndQty.Week_No;
				if(bFlag === true){
					oCurrentRepOrdNo = oCurrentWeeksAndQty.Rep_Ord_No;
				}
				else{
					oCurrentRepOrdNo = oCurrentWeeksAndQty.Repl_Ord_No;
				}
				
				if (oCurrentWeekNo === oCurrentWeek) {
					oRepoArr.push(oCurrentRepOrdNo);
				}
			}
		}
		return oRepoArr;
	},
	/**
	 * This method is called when data load is successful in
	 * onInit method. It will parse the JSON response and put
	 * the index, dirtyState and readOnly flags in the
	 * parsed JSON response and set the model to the current
	 * view and also creates a backup model and set it to view.
	 * @param data
	 * @param oResponse
	 * @memberOf order.AddCustId
	 */
	_dataLoadSuccess : function(oResponse) {
		var readOnly;
		if(MCAPP.isReadOnlyRole() === true){
			readOnly = true;
		}else {
			if(MCAPP.isReadOnlyState() === true){
				readOnly = true;
			}else{
				readOnly = false;
			}
		}
		//var readOnly = MCAPP.isReadOnlyState();
		// Add State related properties (dirty)
		var obj = JSON.parse(oResponse.body);
		var oData = {};
		oData.results = obj.d.results;
		$.each(oData.results, function(i, item) {
			item.index = i + 1;
			item.dirtyState = false;
			item.readOnly = !readOnly;
		});
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData(oData);
		this.getView().setModel(oModel);
		// Get Copy of Original Data
		var oCopyOfData = JSON.parse(JSON.stringify(oData));
		var oModelBackup = new sap.ui.model.json.JSONModel();
		oModelBackup.setData(oCopyOfData);
		this.getView().setModel(oModelBackup, "backup");
	},

	/**
	 * This method is called when data load is Failed in onInit
	 * method. removes the onload image and show the application
	 * and displays the error message box in case of failure.
	 * @param oError
	 * @memberOf order.AddCustId
	 */
	_dataLoadFail : function() {
		// Removing On loading Image and show the Application
		jQuery.sap.byId('ApploadingDivId').hide();
		jQuery.sap.byId('content').show();
		MCAPP.setBusy(false);
		sap.ui.commons.MessageBox.show(MCAPP.getText(
				'GBL_DATA_LOAD_ERROR', this),
				sap.ui.commons.MessageBox.Icon.ERROR, MCAPP
				.getText('GBL_ERROR', this),
				[ sap.ui.commons.MessageBox.Action.OK ]);
	},

	/**
	 * Event Handler for Cancel Button. This will display a
	 * confirmation message box for user to revert his changes.
	 *  _callbackCancel is called upon confirmation
	 * @param
	 * @memberOf order.AddCustId
	 */
	onPressCancel : function() {
		var that = this;
		if (MCAPP.getDirtyFlag() === true) {
			new sap.ui.commons.MessageBox.confirm(
					MCAPP.getText('GBL_CANCEL_CONFIRM'),
					function(bResult) {
						that._callbackCancel(bResult);
					}, MCAPP.getText('GBL_CONFIRM')).addStyleClass('McCcpCustomDialog');
		} else {
			MCAPP.clearDirtyFlag();
			this.getView().getParent().close();
			MCAPP.setBusy(false);
		}
	},
	
	/**
	 * Call back method to cancel the changes and close the window.
	 * @param bResult
	 * @memberOf order.AddCustId
	 */
	 _callbackCancel: function(bResult) {
	        if (bResult) {
	            var rows = this.byId("addcustomId").getRows();
	            var dirtyState = false;
	            var changedModel = this.getView().getModel().getData();
				var originalModel = this.getView().getModel('backup').getData();
	            for (var i = 0; i < rows.length; i++) {
	                dirtyState = this.getView().getModel().getProperty('/results/' + i + '/dirtyState');
	                if (dirtyState) {
	                	changedModel.results[i].Custom_PO = originalModel.results[i].Custom_PO;
	                    var cells = rows[i].getAggregation("cells");
	                    cells[2].setProperty("value", originalModel.results[i].Custom_PO); 
	                }
	            }
	            MCAPP.clearDirtyFlag();
	        }
	    },
	
	/**
	 * Called when to save changed Cust PO/ID for each row in
	 * the Custom ID/OP table.
	 * @param oEvent
	 * @memberOf order.AddCustId
	 */
	onPressSave : function(oEvent) {
		var that = this;		
		MCAPP.setBusy(true);
		var changedRecords = this._getChangedRecords(); 
		//removing the index and other custom parameters
		this._removeFlagFromChangedRecords(changedRecords);

		if (changedRecords.length <= 0) {
			MCAPP.setBusy(false);
			oEvent.getSource().getParent().close();
			return;
		}

		var oDataModel = this.getView().data('oDataModel');
		var dummyHeader = {};
		dummyHeader.ZCCP_CUSTIDPO_NAV = {};
		dummyHeader.ZCCP_CUSTIDPO_NAV.results = changedRecords;
		// Save the data with the Post Service
		oDataModel.create('/ZCCP_CPOID_HDR_SET', dummyHeader, null, function(
				oData, response) {
			that._dataSaveSuccess();
		}, function(oError) {
			that._dataSaveFail();
		});		
	},

	/**
	 * Called upon successful save at back end. This method will
	 * update the backup model as well.
	 * @param oData
	 * @param response
	 * @memberOf order.AddCustId
	 */
	_dataSaveSuccess : function() {
		
		var changedData = JSON.parse(JSON.stringify(this.getView().getModel().getData()));
		this.getView().getModel('backup').setData(changedData);
		sap.m.MessageToast.show(MCAPP.getText('GBL_DATA_SAVE_MSG', this), {
            duration: MCAPP.getAppConfigAsInt('MsgToastDurationOnNavigation')
        });
		MCAPP.clearDirtyFlag();
		MCAPP.setBusy(false);
		this.getView().getParent().close();
	},
	
	/**
	 * called upon save failure. This will display the error
	 * message to User in case of failure. call any callback
	 * method(fnCall) in case of navigation with out save
	 * @param oError
	 * @memberOf order.AddCustId
	 */
	_dataSaveFail : function() {
		MCAPP.setBusy(false);
		sap.ui.commons.MessageBox.show(MCAPP.getText(
				'GBL_DATA_SAVE_ERROR', this),
				sap.ui.commons.MessageBox.Icon.ERROR,
				MCAPP.getText('GBL_ERROR', this),
				[ sap.ui.commons.MessageBox.Action.OK ]);
	},

	/**
	 * Is called on change of cust id/po. Setting the dirty
	 * state of changed record to true.
	 * @param oEvent
	 * @memberOf order.AddCustId
	 */
	handleChangeCustomIDPO : function(oEvent) {
		var changedData = oEvent.getSource().mProperties.value;
		var originalModel = this.getView().getModel().getData();
		var originalData;
		var backUpModel = this.getView().getModel('backup');
		if (backUpModel) {
			originalData = oEvent.getSource().mProperties.originalValue;
			var sPath = (oEvent.oSource.oParent.oBindingContexts.undefined.sPath);
			var index = sPath.split("/")[2];
			if (originalData !== changedData){
				originalModel.results[index].dirtyState = true;
			}else if (originalData === changedData){
				originalModel.results[index].dirtyState = false;
			}
			this._checkDirtyFlag(sPath);
		}
	},

	/**
     * _checkDirtyFlag is used to check the dirtyState of each row. If dirtyState is true, dirtyFlag will be set to true.
     * @memberOf handleChangeCustomIDPO
     * @param sPath
     */
    _checkDirtyFlag: function(sPath) {
        var oTable = this.byId("addcustomId");
        var rows = oTable.getRows();
        var oModel = this.getView().getModel();
        var count = 0;
        for (var i = 0; i < rows.length; i++) {
            var dirtyState = oModel.getProperty(sPath + "/dirtyState");
            if (dirtyState === true) {
                count++;
                break;
            }
        }
        if (count > 0) {
            MCAPP.setDirtyFlag(true);
        } else {
            MCAPP.clearDirtyFlag();
        }
    },
	/**
	 * This method returns changed records in the current view
	 * by comparing the original model and backup model.
	 * @returns {Array}
	 * @memberOf order.AddCustId
	 */
	_getChangedRecords : function() {
		var rows = this.getView().byId(this.getView().getId() + "--" + "addcustomId").getRows();

		var originalModel = this.getView().getModel('backup');
		var changedDModel = this.getView().getModel();
		var changedRecords = [];
		for ( var i = 0; i < originalModel.getData().results.length; i++) {
			if (rows[i] !== undefined) {
				if (originalModel.getProperty(rows[i].getBindingContext().sPath	+ '/Custom_PO') != changedDModel.getProperty(rows[i].getBindingContext().sPath	+ '/Custom_PO')) {
					changedRecords.push(changedDModel.getData().results[i]);
				}
			}
		}
		return changedRecords;
	},
	
	/**
	 * This function is used to delete the dirtyState, Index,
	 * and readOnly flags from the records which need to be saved.
	 * @param changedRecords
	 * @memberOf order.AddCustId
	 */
	_removeFlagFromChangedRecords: function(changedRecords) {
		for (var i = 0; i < changedRecords.length; i++) {
			delete changedRecords[i].dirtyState;
			delete changedRecords[i].index;
			delete changedRecords[i].readOnly;
		}
	},
    /***
     * Event Handler for Filter Option
     * @param event
     */
    onFilterColumn: function() {
        if (MCAPP.getDirtyFlag() === true) {
            sap.ui.commons.MessageBox.alert(MCAPP.getText('GBL_SAVE_PROMP_FILTER', this));
            return;
        }
    },

});