/***
 * @Author DS05
 * @Date 10/13/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is ChangeRequestDetail view controller
 */
sap.ui.controller("mc.ccp.changereq.ChangeRequestDetail", {
	
    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf changereq.ChangeRequestDetail
     */
    onInit: function() {
        // Get the Service MetaData File
       /* var oDataModel = new sap.ui.model.odata.ODataModel(MCAPP.getServiceUrl(MCAPP.getComponent().getModel('service').getProperty('/CRPreviewDetailService')));
        this.getView().data('oDataModel', oDataModel);
        var thisContext = this;
        oDataModel.read('ZCCP_CH_REQ_HEADSet', null, {
            "$expand": "ZCCP_CH_REQ_HEAD_ITEM_NAV",
            "$format": "json",
            "$filter": MCAPP.getFilterForCRDetailScreen()
        }, false, function(oData, oResponse) {
            thisContext._dataLoadSuccess(oData, oResponse);
        }, function() {
        	MCAPP.dataReadFail(oError, this);
        });*/
    	
    	var oDataModel = new sap.ui.model.json.JSONModel();
        this.getView().data('oDataModel', oDataModel);
        var thisContext = this;
        oDataModel.attachRequestCompleted(thisContext._dataLoadSuccess,this);
        oDataModel.loadData("json/CRDetailService.json",{},false);
		var thisContext = this;
        //updates label for the total number of CR
        var dataLength = thisContext.getView().getModel().getData().results.length;
        if(dataLength == 0){
        	thisContext.byId("idComboPaginatorRow").setVisible(false);
        	thisContext.byId("idComboPaginatorRowBottom").setVisible(false);
        }else{
        	thisContext.byId("totalTxtId").setText(MCAPP.getText('GBL_TOTAL_OF', this) + ' ' + dataLength);
        	thisContext.byId("totalTxtIdBottom").setText(MCAPP.getText('GBL_TOTAL_OF', this) + ' ' + dataLength);
        	thisContext.byId("perPage").setText(MCAPP.getText('GBL_PER_PAGE'));
        	thisContext.byId("perPageBottom").setText(MCAPP.getText('GBL_PER_PAGE'));
            //set the initial page control values i.e, paginator, rowrepeater etc
        	thisContext.onChangeDropdown();
        }
        this.onChangeDropdown();
    },
    
    /***
     * This method is called when data load is successful in onInit method.
     * It will parse the JSON response and put the index, dirtyState, expand and readOnly flags in the parsed JSON response
     * and set the model to the current view and also creates a backup model and set it to view.
     * @param oData
     * @param oResponse
     */
    _dataLoadSuccess: function(evt) {
        var readOnly = MCAPP.isReadOnlyState();
        //Add State related properties (expand, dirty)
        var obj = evt.getSource().getData();
        oData = {};
        oData.results = obj.d.results;
        $.each(oData.results, function(i, item) {
            item.index = i + 1;
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
        MCAPP.updateSegmentedButton(MCAPP.getDistributorType(), false);
    },
    
    /**
     * onPageDoPaging is used for pagination in the table.
     * @memberOf changereq.ChangeRequestDetailDetail
     */
    onPageDoPaging: function(oEvent) {
        var oTable = this.byId("CRDetailTable");
        var currentPage = parseInt(oEvent.mParameters.targetPage);
        var srcPage = parseInt(oEvent.mParameters.srcPage);
        var id = oEvent.getSource().getId();
        if (id.indexOf("paginatorCrDetail") > 0 && id.indexOf("Bottom") <= -1)
        	this.byId("paginatorCrDetailBottom").setCurrentPage(currentPage);
        else 
        	this.byId("paginatorCrDetail").setCurrentPage(currentPage);
        oTable._oPaginator.setCurrentPage(currentPage);
        oTable._oPaginator.firePage({
            srcPage: srcPage,
            targetPage: currentPage,
            type: 'GoTo'
        });
    },
    
    /**
     * onChangeDropdown is used to set the rows per page.
     * @memberOf changereq.ChangeRequestDetailDetail
     */
    onChangeDropdown: function(oEvent) {
        var oComboBox = "";
        var oTable = this.byId("CRDetailTable");
        //This will work when page is getting loaded
        if (oEvent === undefined) {
            oComboBox = this.byId("comboBoxIdCrDetail");
        }
        else { // This will work when the combo value will be changed
            oComboBox = this.byId(oEvent.getSource().getId());
        }
        var dataLength = this.getView().getModel().getData().results.length;
        var oPerPage = oComboBox.getSelectedKey();
        var noOfPage = Math.floor(dataLength / oPerPage);
        var remainPage = dataLength % oPerPage;
        if (remainPage > 0) noOfPage = noOfPage + 1;
        if (oComboBox.sId.indexOf("comboBoxIdCrDetail") > 0 && oComboBox.sId.indexOf("Bottom") <= -1) 
        	this.byId("comboBoxIdCrDetailBottom").setValue(parseInt(oPerPage));
        else if (oComboBox.sId.indexOf("comboBoxIdCrDetailBottom") > 0) 
        	this.byId("comboBoxIdCrDetail").setValue(parseInt(oPerPage));
        // setting the visible rows of table
        if(dataLength !== 0){
             if(oPerPage > dataLength){
              oTable.setVisibleRowCount(parseInt(dataLength));
            }else{
              oTable.setVisibleRowCount(parseInt(oPerPage));
            }
        }
        //setting the paginator values
        MCAPP.setPaginatorTextValue(noOfPage, "paginatorCrDetail", this, dataLength);
        oTable.rerender();

    },
    
    /**
     * onPressOpenViewCommentDialog is used to open the View Comment Dialog Box.
     * @memberOf changereq.ChangeRequestDetailDetail
     */
    onPressOpenViewCommentDialog: function(oEvent) {
        var viewData = [];
        viewData.push(oEvent.getSource().getProperty("text"));
        viewData.push(oEvent.getSource().getBindingContext());
        //including the ChangeRequestComment view to display the View dialog
        new sap.ui.view({
            type: sap.ui.core.mvc.ViewType.JS,
            viewName: "mc.ccp.changereq.ChangeRequestComment",
            viewData: viewData
        });
    },
    
    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     * @memberOf changereq.ChangeRequestDetail
     */
    onAfterRendering: function() {
    	MCAPP.setBusy(false);
        // Removing onLoading Image and show the Application
        jQuery.sap.byId('ApploadingDivId').hide();
        jQuery.sap.byId('content').show();
        //Update the Header Selection
        MCAPP.updateHeaderCRDetail(this);
        MCAPP.menuSelection(this);
        MCAPP.updateSegmentedButton(MCAPP.getDistributorType(), false);
    },
    /**
     * Called when user tries to filter the records in the CR Detail table
     * changing all the numeric fields to Strings in oModel before the standard SAP UI 5 filter event gets applied.
     * @memberOf changereq.ChangeRequestDetail
     * @Param evt
     */
    onFilterColumn: function(evt) {
    	var oData = this.getView().getModel().getData();
    	 $.each(oData.results, function(i, item) {
             item.SKU = "" + item.SKU;
             item.ShipToId = "" + item.ShipToId;
             item.Confirmed_Qty = "" + item.Confirmed_Qty;
             item.Change_Req_Qty = "" + item.Change_Req_Qty;
         });
    },
    
    /***
     * Called when user tries to sort the records in the CR Detail table
     * all the numeric fields which are coming as String from oData, 
     * changing them to Strings in oModel before the standard SAP UI 5 sort event gets applied.
     * @memberOf changereq.ChangeRequestDetail
     * @Param evt
     */
    onSortColumn: function(evt) {
            var oData = this.getView().getModel().getData();
            $.each(oData.results, function(i, item) {
                item.SKU = parseInt(item.SKU);
                item.ShipToId = parseInt(item.ShipToId);
                item.Confirmed_Qty = parseInt(item.Confirmed_Qty);
                item.Change_Req_Qty = parseInt(item.Change_Req_Qty);
            });
    },
    
});