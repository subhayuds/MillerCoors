/***
 * @Author UR09
 * @Date 12/04/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is inventory main page controller.
 */
sap.ui.controller("mc.ccp.inventory.Inventory", {
	
    /***
     * Called when a controller is instantiated and its View controls
     * (if available) are already created. Can be used to modify the
     * View before it is displayed, to bind event handlers and do other
     * one-time initialization.
     * @memberOf inventory.Inventory
     */
    onInit: function() {
        // Get the Service MetaData File
        this.distType = MCAPP.getDistributorType();
        if ((this.distType === "D") || ((this.distType === "I") && (sap.ui.getCore().byId("segmentedbuttonId").mAssociations.selectedButton) === "Domestic")) {
//            var oDataModel = new sap.ui.model.odata.ODataModel(MCAPP.getServiceUrl(MCAPP.getComponent().getModel('service').getProperty('/InventoryService')));
        	var oDataModel = new sap.ui.model.json.JSONModel();
            this.getView().data('oDataModel', oDataModel);
            var thisContext = this;
            oDataModel.attachRequestCompleted(thisContext._dataLoadSuccess,this);
            oDataModel.loadData("json/InventoryService.json",{},false);
           /* this.getView().data('oDataModel', oDataModel);
            thisContext = this;
            oDataModel.read('ZCCP_DOI_SUMMARY_SET', null, {
                "$format": "json",
                "$filter": MCAPP.getFilterForInvMainScreen()
            }, false, function(oData, oResponse) {
                thisContext._dataLoadSuccess(oData, oResponse);
            }, function() {
                MCAPP.dataReadFail(oError, this);
            });*/
        }
        else if ((this.distType === "I") && ((sap.ui.getCore().byId("segmentedbuttonId").mAssociations.selectedButton) === "Import")
        		|| (this.distType === "E")) {
            var oDataModel = new sap.ui.model.odata.ODataModel(MCAPP.getServiceUrl(MCAPP.getComponent().getModel('service').getProperty('/ImportInventoryService')));
            this.getView().data('oDataModel', oDataModel);
            thisContext = this;
            oDataModel.read('ZCCP_IMP_INV_DOI_SUMMARY_SET', null, {
                "$format": "json",
                "$filter": MCAPP.getFilterForInvMainScreen()
            }, false, function(oData, oResponse) {
                thisContext._dataLoadSuccess(oData, oResponse);
            }, function(oError) {
                MCAPP.dataReadFail(oError, this);
            });
        }
        //Update the lable on the view top
        var dataLength = this.getView().getModel().getData().results.length;
        this.byId("totalTxtId").setText(MCAPP.getText('GBL_TOTAL_OF', this) + ' ' + dataLength);
        this.byId("totalTxtIdBottom").setText(MCAPP.getText('GBL_TOTAL_OF', this) + ' ' + dataLength);
        //set the initial page control values
        this.oTable = this.getView().byId("idInventoryTableInv");
        this.onChangeDropdown();
    },
    
    /***
     * This method is called when data load is successful in onInit method.
     * It will parse the JSON response and put the index, dirtyState, expand and readOnly flags in the parsed JSON response
     * and set the model to the current view and also creates a backup model and set it to view.
     * @memberOf inventory.Inventory
     * @param oData
     * @param oResponse
     */
    _dataLoadSuccess: function(evt) {
    	var readOnly = MCAPP.isReadOnlyState();
        //Add State related properties (expand, dirty)
        var obj =  evt.getSource().getData();//JSON.parse(oResponse.body);
        var oData = {};
        oData.results = obj.d.results;
        $.each(oData.results, function(i, item) {
        	if (item.EstdTransitDays !== ""){
              item.EstdTransitDays = item.EstdTransitDays + " " + MCAPP.getText("VW_INV_DAYS", this);
        	}
            item.index = i + 1;            
            item.dirtyState = false;
            item.readOnly = readOnly;
        });
        var oModel = new sap.ui.model.json.JSONModel();
        oModel.setData(oData);
        this.getView().setModel(oModel);
        //Call this method to create additional Proj. DOI week columns
        this._displayAdditionalWeeksData();
        //Get Copy of Original Data
        var oCopyOfData = JSON.parse(JSON.stringify(oData));
        var oModelBackup = new sap.ui.model.json.JSONModel();
        oModelBackup.setData(oCopyOfData);
        this.getView().setModel(oModelBackup, "backupInventory");
        MCAPP.updateSegmentedButton(MCAPP.getDistributorType(), true);

    },
    
    /***
     * This method is used to set the number of Proj. DOI column in the inventory main page.
     * @memberOf inventory.Inventory
     * @param oEvent
     */
    _displayAdditionalWeeksData: function(oEvent) {
        this.projDOI = ["ProjDOICurrent", "ProjDOINext", "ProjDOI_WeekOne", "ProjDOI_WeekTwo", "ProjDOI_WeekThree", "ProjDOI_WeekFour", "ProjDOI_WeekFive", "ProjDOI_WeekSix", "ProjDOI_WeekSeven", "ProjDOI_WeekEight"];
        this.targDOI = ["TargDOICurrent", "TargDOINext", "TargDOI_WeekOne", "TargDOI_WeekTwo", "TargDOI_WeekThree", "TargDOI_WeekFour", "TargDOI_WeekFive", "TargDOI_WeekSix", "TargDOI_WeekSeven", "TargDOI_WeekEight"];
        var skuMaxWeekCol;
        var x;
        if ((this.distType === "D") || ((this.distType === "I") && (sap.ui.getCore().byId("segmentedbuttonId").mAssociations.selectedButton) === "Domestic")) {
	        //First two element of an array projDOI is fixed for domestic 
	        x = 0;
	        //Number of Proj. DOI column is fixed for domestic 
	        skuMaxWeekCol = 2;
	        this.colWidht = 7;
	        this.oTable = this.getView().byId("idInventoryTable");
	        this.getView().byId("idInventoryTable").setVisible(true);
	        this.getView().byId("idInventoryTableInv").setVisible(false);
        }
        if ((this.distType === "I") && ((sap.ui.getCore().byId("segmentedbuttonId").mAssociations.selectedButton) === "Import")
        		|| (this.distType === "E")) {
        	x = 2;        	
        	if(this.getView().getModel().getData().results.length > 0){
        		skuMaxWeekCol = parseInt(this.getView().getModel().getData().results[0].MaxNoOfWeeks) + 2;
        	}
        	else{
        		//default value for Max Week is kept as 8 (6 + 2)
        		skuMaxWeekCol = 8;
        	}
        	this.colWidht = 42/(skuMaxWeekCol - 2);
        	this.oTable = this.getView().byId("idInventoryTableInv");
        	this.getView().byId("idInventoryTable").setVisible(false);
            this.getView().byId("idInventoryTableInv").setVisible(true);            
        }
        var numOfDays = 0;
       /* if((x != undefined || x != null)&& (skuMaxWeekCol != undefined || skuMaxWeekCol != null))
        {
        	for (var i = x; i < skuMaxWeekCol; i++) {
                numOfDays = numOfDays + 7;
                this.oTable.addColumn(new mc.ccp.control.McColumn({
                    label: new sap.ui.commons.Label({
                        text: MCAPP.getProjectedDOIWeekDate(numOfDays) + " " + MCAPP.getText("VW_INV_PROJ_DOI", this),
                    }),
                    template: new sap.ui.commons.TextView().bindText({
                        parts: [{
                            path: this.projDOI[i],
                            type: new sap.ui.model.type.String()
                        }, {
                            path: this.targDOI[i],
                            type: new sap.ui.model.type.String()
                        }],
                        formatter: function(projDOI, targDOI) {
                            this.removeStyleClass('mcCcpImpInvProjectedDoiColor');
                            var absDays = Math.abs(projDOI - targDOI);
                            var diffDays = absDays - 5;
                            if (diffDays > 0) {
                                this.addStyleClass('mcCcpImpInvProjectedDoiColor');
                            }
                            return projDOI;
                        }
                    }),
                    sortProperty: this.projDOI[i],
                    filterProperty: this.projDOI[i],
                    width: this.colWidht + "%",
                    hAlign: "Center",
                    vAlign: "Center"
                }));
            }
        }*/
        
        
    },
    
    /***
     * Called when the View has been rendered (so its HTML is part of
     * the document). Post-rendering manipulations of the HTML could be
     * done here. This hook is the same one that SAPUI5 controls get
     * after being rendered.
     * @memberOf inventory.Inventory
     */
    onAfterRendering: function() {
    	MCAPP.setBusy(false);
        //Removing Onloading Image to show the Application and updating the header
        jQuery.sap.byId('ApploadingDivId').hide();
        jQuery.sap.byId('content').show();
        MCAPP.updateHeader(this);
        MCAPP.menuSelection(this);
    },
    
    /***
     * Event Handler for Paginator Control
     * @memberOf inventory.Inventory
     * @param oEvent
     */
    onPage: function(oEvent) {
        var currentPage = parseInt(oEvent.mParameters.targetPage);
        var srcPage = parseInt(oEvent.mParameters.srcPage);
        var id = oEvent.getSource().getId();
        if (id.indexOf("paginatorInventory") > 0 && id.indexOf("Bottom") <= -1) this.byId("paginatorInventoryBottom").setCurrentPage(currentPage);
        else this.byId("paginatorInventory").setCurrentPage(currentPage);
        this.oTable._oPaginator.setCurrentPage(currentPage);
        this.oTable._oPaginator.firePage({
            srcPage: srcPage,
            targetPage: currentPage,
            type: 'GoTo'
        });
    },
    
    /***
     * Event Handler for Dropdown Control. Whenever user change the records per page from combo box,
     * no of pages will be calculated accordingly and paginator will be set accordingly.
     * @memberOf inventory.Inventory
     * @param oEvent
     */
    onChangeDropdown: function(oEvent) {
    	var oComboBox = "";
        //This will work when page is getting loaded
        if (oEvent === undefined) {
            oComboBox = this.byId("comboBoxIdInventory");
        }
        else { // This will work when the combo value will be changed
            oComboBox = this.byId(oEvent.getSource().getId());
        }
        this.oTable.setFirstVisibleRow(0);
        
        var dataLength = this.getView().getModel().getData().results.length;
        var oPerPage = oComboBox.getSelectedKey();
        var noOfPage = Math.floor(dataLength / oPerPage);
        var remainPage = dataLength % oPerPage;
        if (remainPage > 0) noOfPage = noOfPage + 1;
        if (oComboBox.sId.indexOf("comboBoxIdInventory") > 0 && oComboBox.sId.indexOf("Bottom") <= -1) 
              this.byId("comboBoxIdInventoryBottom").setValue(parseInt(oPerPage));
        else if (oComboBox.sId.indexOf("comboBoxIdInventoryBottom") > 0) 
              this.byId("comboBoxIdInventory").setValue(parseInt(oPerPage));
        // setting the visible rows of table
        if(dataLength !== 0){
             if(oPerPage > dataLength){
            	 this.oTable.setVisibleRowCount(parseInt(dataLength));
            }else{
            	this.oTable.setVisibleRowCount(parseInt(oPerPage));
            }
        }
        //setting the paginator values
        MCAPP.setPaginatorTextValue(noOfPage, "paginatorInventory", this, dataLength);
        this.oTable.rerender();
    },
    
    /***
     * Called when user tries to filter the records in the Inventory (DOI Summary) table
     * changing all the numeric fields to Strings in oModel before the standard SAP UI 5 filter event gets applied.
     * @memberOf inventory.Inventory
     * @Param evt
     */
    onFilterColumn: function(evt) {
        var oData = this.getView().getModel().getData();
        $.each(oData.results, function(i, item) {
            item.Dist_SKU = "" + item.Dist_SKU;
            item.SKU = "" + item.SKU;
            item.ShipToId = "" + item.ShipToId;
            item.EstdTransitDays = "" + item.EstdTransitDays;
            item.ProjDOICurrent = "" + item.ProjDOICurrent;
            item.ProjDOINext = "" + item.ProjDOINext;
            item.ProjDOI_WeekOne = "" + item.ProjDOI_WeekOne;
            item.ProjDOI_WeekTwo = "" + item.ProjDOI_WeekTwo;
            item.ProjDOI_WeekThree = "" + item.ProjDOI_WeekThree;
            item.ProjDOI_WeekFour = "" + item.ProjDOI_WeekFour;
            item.ProjDOI_WeekFive = "" + item.ProjDOI_WeekFive;
            item.ProjDOI_WeekSix = "" + item.ProjDOI_WeekSix;
            item.ProjDOI_WeekSeven = "" + item.ProjDOI_WeekSeven;
            item.ProjDOI_WeekEight = "" + item.ProjDOI_WeekEight;
        });
    },
    
    /***
     * Called when user tries to sort the records in the Inventory (DOI Summary) table
     * all the numeric fields which are coming as String from oData,
     * changing them to Strings in oModel before the standard SAP UI 5 sort event gets applied.
     * @memberOf inventory.Inventory
     * @Param evt
     */
    onSortColumn: function(evt) {
                  
    	var oData = this.getView().getModel().getData();
        $.each(oData.results, function(i, item) { 
            if (item.SKU !== "")
                  item.SKU = parseInt(item.SKU);
            
            if (item.ShipToId !== "")
                 item.ShipToId = parseInt(item.ShipToId);
            
            if (item.ProjDOICurrent !== "")
                  item.ProjDOICurrent = parseInt(item.ProjDOICurrent);
            
            if (item.ProjDOINext !== "")
                  item.ProjDOINext = parseInt(item.ProjDOINext);
            
            if (item.ProjDOI_WeekOne !== "")
                  item.ProjDOI_WeekOne = parseInt(item.ProjDOI_WeekOne);
            
        	if (item.ProjDOI_WeekTwo !== "")
                item.ProjDOI_WeekTwo = parseInt(item.ProjDOI_WeekTwo);
	
            if (item.ProjDOI_WeekThree !== "")
                  item.ProjDOI_WeekThree = parseInt(item.ProjDOI_WeekThree);
            
            if (item.ProjDOI_WeekFour !== "")
                  item.ProjDOI_WeekFour = parseInt(item.ProjDOI_WeekFour);
            
            if (item.ProjDOI_WeekFive !== "")
                  item.ProjDOI_WeekFive = parseInt(item.ProjDOI_WeekFive);
            
            if (item.ProjDOI_WeekSix !== "")
                  item.ProjDOI_WeekSix = parseInt(item.ProjDOI_WeekSix);
            
            if (item.ProjDOI_WeekSeven !== "")
                  item.ProjDOI_WeekSeven = parseInt(item.ProjDOI_WeekSeven);
            
            if (item.ProjDOI_WeekEight !== "")
                  item.ProjDOI_WeekEight = parseInt(item.ProjDOI_WeekEight);     
        });
    },
    
    /***
     * This method is used to open the Dialog Box which containing domestic/import InventoryWorkSheet Page.
     * @memberOf inventory.Inventory
     * @param oEvent
     */
    onPressSKULink: function(oEvent) {
    	var oSkuValue, oShipToValue, oSourceIdValue;
        var oDistSkuValue = this.getView().getModel().getProperty(oEvent.getSource().getBindingContext() + '/Dist_SKU');
        var oSkuDescription = this.getView().getModel().getProperty(oEvent.getSource().getBindingContext() + '/SKU_Desc');
        //Check if the variable is string or not, then only use the trim function
        //The variable type get changed after sort function
        if(typeof(this.getView().getModel().getProperty(oEvent.getSource().getBindingContext() + '/SKU')) == "string"){
        	oSkuValue = parseInt(this.getView().getModel().getProperty(oEvent.getSource().getBindingContext() + '/SKU').trim());
    	}
        else{
        	oSkuValue = this.getView().getModel().getProperty(oEvent.getSource().getBindingContext() + '/SKU');
    	}
        if(typeof(this.getView().getModel().getProperty(oEvent.getSource().getBindingContext() + '/ShipToId')) == "string"){
        	oShipToValue = parseInt(this.getView().getModel().getProperty(oEvent.getSource().getBindingContext() + '/ShipToId').trim());
		}
        else{
        	oShipToValue = this.getView().getModel().getProperty(oEvent.getSource().getBindingContext() + '/ShipToId');
		}
        if(typeof(this.getView().getModel().getProperty(oEvent.getSource().getBindingContext() + '/SourceId')) == "string"){
        	oSourceIdValue = this.getView().getModel().getProperty(oEvent.getSource().getBindingContext() + '/SourceId').trim();
		}
        else{
        	oSourceIdValue = this.getView().getModel().getProperty(oEvent.getSource().getBindingContext() + '/SourceId');
		}
        var oEsdTransitValue = this.getView().getModel().getProperty(oEvent.getSource().getBindingContext() + '/EstdTransitDays');
        var skuArray = [];
        var oModel = this.getView().getModel();
        var rows = this.byId("idInventoryTable").getRows();
        for (var i = 0; i < rows.length; i++) {
        	if(rows[i].getBindingContext()!==undefined)
        		{
            var data = oModel.getProperty(rows[i].getBindingContext().sPath + '/SKU') + "::" + oModel.getProperty(rows[i].getBindingContext().sPath + '/ShipToId') + "::" + oModel.getProperty(rows[i].getBindingContext().sPath + '/SourceId') + "::" + oModel.getProperty(rows[i].getBindingContext().sPath + '/Dist_SKU') + "::" + oModel.getProperty(rows[i].getBindingContext().sPath + '/Sku_Desc') + "::" + oModel.getProperty(rows[i].getBindingContext().sPath + '/EstdTransitDays');
            skuArray.push(data);
        		}
        }
        var inventorySkuIndex = oEvent.getSource().getBindingContext().sPath.split("/")[2];
        if ((this.distType === "D") || ((this.distType === "I") && (sap.ui.getCore().byId("segmentedbuttonId").mAssociations.selectedButton) === "Domestic")) {
            var oSkuDetailView = new sap.ui.view({
                type: sap.ui.core.mvc.ViewType.JS,
                viewName: "mc.ccp.inventory.InventoryWorkSheet",
                viewData: [oDistSkuValue, oSkuValue, oSkuDescription, oShipToValue, oSourceIdValue, oEsdTransitValue, skuArray, inventorySkuIndex]
            });
            this.dataLength = this.getView().getModel().getData().results.length;
            var oPaginator = new mc.ccp.control.McPaginator({
                height: "34px"
            }).addStyleClass('invPaginator');
            oPaginator.setNumberOfPages(parseInt(this.dataLength));
            oPaginator.setCurrentPage(parseInt(inventorySkuIndex) + 1);
            oPaginator.getAggregation("prevLink").attachPress(oSkuDetailView.getController().onPressPreviousSku);
            oPaginator.getAggregation("nextLink").attachPress(oSkuDetailView.getController().onPressNextSku);
            //override the onsapenter function of paginator custom control to get the particular SKU inventory WS page when the user changes current page value of paginator
            oPaginator.onsapenter = function(oEvent) {
                var tmp = parseInt(oEvent.target.value);
                if (isNaN(tmp) || (tmp < 1 || tmp > this.getNumberOfPages())) {
                    var errorDialog = new sap.ui.commons.Dialog({
                        modal: true,
                        width: '300px',
                        height: '200px',
                        title: 'Error',
                        content: [new sap.ui.commons.TextView({
                            text: MCAPP.getText("GBL_PAGINATOR_INVALID_PAGE")
                        })],
                        buttons: [new sap.ui.commons.Button({
                            text: MCAPP.getText("GBL_OK"),
                            press: function() {
                                errorDialog.close();
                            }
                        })],
                        closed: function(oEvent) {
                            this.destroy();
                        }
                    }).addStyleClass('McCcpCustomDialog');
                    errorDialog.open();
                    return;
                }
                var oInventoryWorkSheet = this.getParent().getParent().getAggregation("content")[0];
                var oInventoryWSController = oInventoryWorkSheet.getController();
                oInventoryWSController.onChangePaginatorValue(oEvent);
            };
            var oCancelLink = new sap.ui.commons.Link({
                width: "50px",
                text: MCAPP.getText('GBL_CANCEL'),
                tooltip: MCAPP.getText('GBL_CANCEL')
            });
            oCancelLink.attachPress(oSkuDetailView.getController().onPressCancel);
            var oSaveButton = new sap.ui.commons.Button({
                text: MCAPP.getText("GBL_SAVE"),
                width: "70px"
            });
            oSaveButton.attachPress(oSkuDetailView.getController().onPressSave);
            var oHorizontalLayout = new mc.ccp.control.McHorizontalLayout({
                height: "100%",
                width: "100%",
                widths: ["75%", "10%", "15%"],
                content: [oPaginator, oCancelLink, oSaveButton]
            });
            
            var oSkuDialog = new mc.ccp.control.McDialog({
            	dirtyDependent : true,
                modal: true,
                width: '85%',
                height: '72%',
                title: this.getView().getModel('i18n').getProperty('VW_INV_WORK_SHEET_INVE_WORK_SHEET'),
                content: [oSkuDetailView],
                buttons: [oHorizontalLayout],
                closed: function(oEvent) {
                    this.destroy();
                }
            }).addStyleClass('invShowDialog');
            oSkuDialog.setModel(this.getView().getModel());
            oSkuDialog.attachCloseClicked(oSkuDetailView.getController().onPressCancel, oSkuDetailView.getController());
            oSkuDialog.open();
        }
        else if ((this.distType === "I") && ((sap.ui.getCore().byId("segmentedbuttonId").mAssociations.selectedButton) === "Import")
        		|| (this.distType === "E")) {
        	var titleWS =  "";
        	if(this.distType === "I"){
        		titleWS =  MCAPP.getText('VW_IMPORT_INVENTORY_INV_WORK_SHEET');
        	}
        	else if(this.distType === "E"){
        		titleWS =  MCAPP.getText('VW_EXPORT_INVENTORY_INV_WORK_SHEET');
        	}
            //Code for Import Inventory WS
            var currentOrderedWeek = this.getView().getModel().getProperty(oEvent.getSource().getBindingContext() + '/EditableWeek');
            var oSkuDetailViewImport = new sap.ui.view({
                type: sap.ui.core.mvc.ViewType.JS,
                viewName: "mc.ccp.inventory.ImportInventoryWS",
                viewData: [oDistSkuValue, oSkuValue, oSkuDescription, oShipToValue, oSourceIdValue, oEsdTransitValue, skuArray, inventorySkuIndex, currentOrderedWeek]
            });
            //End Code for Import Inventory WS
            this.dataLength = this.getView().getModel().getData().results.length;
            var oPaginator = new mc.ccp.control.McPaginator({
                height: "34px"
            }).addStyleClass('invPaginator');
            oPaginator.setNumberOfPages(parseInt(this.dataLength));
            oPaginator.setCurrentPage(parseInt(inventorySkuIndex) + 1);
            oPaginator.getAggregation("prevLink").attachPress(oSkuDetailViewImport.getController().onPressPreviousSku);
            oPaginator.getAggregation("nextLink").attachPress(oSkuDetailViewImport.getController().onPressNextSku);
            //override the onsapenter function of paginator custom control to get the particular SKU import inventory WS page when the user changes current page value of paginator
            oPaginator.onsapenter = function(oEvent) {
                var tmp = parseInt(oEvent.target.value);
                if (isNaN(tmp) || (tmp < 1 || tmp > this.getNumberOfPages())) {
                    var errorDialog = new sap.ui.commons.Dialog({
                        modal: true,
                        width: '300px',
                        height: '200px',
                        title: 'Error',
                        content: [new sap.ui.commons.TextView({
                            text: MCAPP.getText("GBL_PAGINATOR_INVALID_PAGE")
                        })],
                        buttons: [new sap.ui.commons.Button({
                            text: MCAPP.getText("GBL_OK"),
                            press: function() {
                                errorDialog.close();
                            }
                        })],
                        closed: function(oEvent) {
                            this.destroy();
                        }
                    }).addStyleClass('McCcpCustomDialog');
                    errorDialog.open();
                    return;
                }
                var oImportInventoryWorkSheet = this.getParent().getParent().getAggregation("content")[0];
                var oImportInventoryWSController = oImportInventoryWorkSheet.getController();
                oImportInventoryWSController.onChangePaginatorValue(oEvent);
            };
            var oCancelLink = new sap.ui.commons.Link({
                width: "50px",
                text: MCAPP.getText('GBL_CANCEL'),
                tooltip: MCAPP.getText('GBL_CANCEL')
            });
            oCancelLink.attachPress(oSkuDetailViewImport.getController().onPressCancel);
            var oSaveButton = new sap.ui.commons.Button({
                text: MCAPP.getText("GBL_SAVE"),
                width: "70px"
            });
            oSaveButton.attachPress(oSkuDetailViewImport.getController().onPressSave);
            var oHorizontalLayout = new mc.ccp.control.McHorizontalLayout({
                height: "100%",
                width: "100%",
                widths: ["75%", "10%", "15%"],
                content: [oPaginator, oCancelLink, oSaveButton]
            });
            //Code for Import Inventory WS - Changed from Dialog to McDialog
            var oSkuDialogImport = new mc.ccp.control.McDialog({
                dirtyDependent: true,
                modal: true,
                width: '98%',
                height: '80%',
                title: titleWS,
                content: [oSkuDetailViewImport],
                buttons: [oHorizontalLayout],
                closed: function(oEvent) {
                    MCAPP.setBusy(false);
                    this.destroy();
                }
            }).addStyleClass('impInvShowDialog');
            oSkuDialogImport.setModel(this.getView().getModel());
            oSkuDialogImport.attachCloseClicked(oSkuDetailViewImport.getController().onPressCancel, oSkuDetailViewImport.getController());
            oSkuDialogImport.open();
            //End Code for Import Inventory WS
        }
    }
});