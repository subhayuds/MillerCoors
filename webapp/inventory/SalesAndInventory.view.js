/***
 * @Author DS05
 * @Date 11/19/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is SalesAndInventory view
 */
sap.ui.jsview("mc.ccp.inventory.SalesAndInventory", {
	
    /** Specifies the Controller belonging to this View. 
     * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
     * @memberOf inventory.Salesandinventory
     */
    getControllerName: function() {
        return "mc.ccp.inventory.SalesAndInventory";
    },
    
    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf inventory.Salesandinventory
     * @param oController
     */
    createContent: function(oController) {
        //Required Library
        jQuery.sap.require("mc.ccp.control.McHorizontalLayout");
        jQuery.sap.require("mc.ccp.control.McPaginator");
        jQuery.sap.require("mc.ccp.control.McComboBox");
        jQuery.sap.require("mc.ccp.control.McArrowTextField");
        jQuery.sap.require("mc.ccp.control.McTable");
        jQuery.sap.require("mc.ccp.control.McColumn");
        //********************************Beginning Inventory week****************************************
        var oBeginningInventoryWeek = this._getSalesAndBegInventoryWeekDate(0);
        //********************************Sales week******************************************************
        var oSalesWeek = this._getSalesAndBegInventoryWeekDate(7);
        //********************************ROW 1***********************************************************
        //blank paginator id will be used to identify the Top paginator, hence "" string would be passed.
        var oTopControlsRow = this._createPageControlsRow(oController, "");
        //********************************ROW 2***********************************************************       
        var oSalesAndInventoryTable = this._createSalesAndInventoryTableRow(oController, oSalesWeek, oBeginningInventoryWeek);
        //********************************ROW 3***********************************************************       
        var oBottomPaginatorRow = this._createPageControlsRow(oController, "Bottom");
        oBottomPaginatorRow.addStyleClass('salesAndInventoryRowPadding');
        var oBlankSpaceLayout = new mc.ccp.control.McHorizontalLayout({
            height: "1px",
            width: "100%",
            widths: ["100%"],
            content: [new sap.ui.core.HTML()]
        });
        var oVerticalLayout = new sap.ui.layout.VerticalLayout({
            content: [oTopControlsRow, oSalesAndInventoryTable, oBlankSpaceLayout, oBottomPaginatorRow]
        });
        return oVerticalLayout;
    },
    
    /** Is used to calculate current week and previous week.
     * @memberOf inventory.Salesandinventory
     * @param numOfDays
     */
    _getSalesAndBegInventoryWeekDate: function(numOfDays) {
        /*var currentWeekDate = MCAPP.getCurrentweek();
        var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
            pattern: "MM/dd/yyyy"
        });
        var standardDateFormat = dateFormat.parse(currentWeekDate);
        standardDateFormat.setDate(standardDateFormat.getDate() - numOfDays);
        var newWeekDate = dateFormat.format(standardDateFormat);
        return newWeekDate;*/
    	 var currentWeekDate = MCAPP.getCurrentweek();
         
         var standardDateFormat = new Date(currentWeekDate);
         standardDateFormat.setDate(standardDateFormat.getDate() - numOfDays);
         var dd = standardDateFormat.getDate();
         var mm = standardDateFormat.getMonth()+1; //January is 0!

         if(dd<10){
             dd='0'+dd;
         } 
         if(mm<10){
             mm='0'+mm;
         } 
         
         var dateString = mm + "/" + dd + "/" + standardDateFormat.getFullYear().toString().substr(2,2);

         return dateString;
    	
    },
    
    /** This  prepares top and bottom controls of the page. Controls include Total number of records,combo box and paginator
     * @memberOf inventory.Salesandinventory
     * @param oController
     * @param id
     */
    _createPageControlsRow: function(oController, id) {
    	var enableFlag = false;
        if(MCAPP.isReadOnlyRole() !== true){
        	enableFlag = true;
        }
        var oTotalText = new sap.ui.commons.TextView(this.createId('totalTxtId' + id)).addStyleClass('orderVwlabels');
        var oComboBox = new mc.ccp.control.McComboBox(this.createId('comboBoxIdSalesAndInv' + id), {
            width: "85px",
            height: "35px",
            selectedKey: "10",
            editable: true,
        });
        oComboBox.attachChange(oController.onChangeDropdown, oController);
        var oPaginator = new mc.ccp.control.McPaginator(this.createId(this.createId('paginatorSalesAndInv' + id), {
            showSave: true
        }));
        oPaginator.attachPage(oController.onPageSaveAndNavigate, oController);
        var oCancelButton = new sap.ui.commons.Button(this.createId("idCancelBtn" + id), {
            text: "{i18n>GBL_CANCEL}",
            height: "35px",
            width: "90px"
        });
        oCancelButton.attachPress(oController.onPressCancel, oController);
        var oSaveButton = new sap.ui.commons.Button(this.createId("idSaveBtn" + id), {
            text: "{i18n>GBL_SAVE}",
            height: "35px",
            width: "90px",
            enabled : enableFlag
        });
        oSaveButton.attachPress(oController.onPressSave, oController);
        var oLayout = new mc.ccp.control.McHorizontalLayout(this.createId("idComboPaginatorRow" + id), {
            height: "50px",
            width: "100%",
            ptop: "5px",
            widths: ["10%", "10%", "10%", "35%", "15%", "10%", "10%"],
            content: [oComboBox, oTotalText, new sap.ui.core.HTML(), oPaginator, new sap.ui.core.HTML(), oCancelButton, oSaveButton]
        });
        return oLayout;
    },
    
    /** This  prepares Sales And Inventory table .This table displays DistSKU,SKU,SKU_Desc,ShipToId,SourceName,Sales of and Beg Inv
     * @memberOf inventory.Salesandinventory
     * @param oController
     * @param oSalesWeek
     * @param oBeginningInventoryWeek
     */
    _createSalesAndInventoryTableRow: function(oController, oSalesWeek, oBeginningInventoryWeek) {
        var oTable = new mc.ccp.control.McTable(this.createId("SalesAndInvTable"), {
            width: '100%',
            selectionMode: sap.ui.table.SelectionMode.None,
            navigationMode: sap.ui.table.NavigationMode.Paginator,
        });
        oTable.addStyleClass("salesAndInventoryTable");
        //Define the columns and the control templates to be used
        this._createColumnSalesAndInventory(oTable, "idDistSKUCol", "TextView", "Dist_SKU", "10%", "VW_SI_DIST_SKU");
        this._createColumnSalesAndInventory(oTable, "idSKUCol", "TextView", "SKU", "15%", "VW_SI_SKU");
        this._createColumnSalesAndInventory(oTable, "idDescCol", "TextView", "SKU_Desc", "30%", "VW_SI_DESC");
        this._createColumnSalesAndInventory(oTable, "idShipToCol", "TextView", "ShipToId", "10%", "VW_SI_SHIP_TO");
        this._createColumnSalesAndInventory(oTable, "idSourceCol", "TextView", "SourceName", "15%", "VW_SI_SOURCE");
        oTable.addColumn(new mc.ccp.control.McColumn(this.createId("idSalesCol"), {
            label: new sap.ui.commons.Label({
                text: MCAPP.getText('VW_SI_SALES', this) + oSalesWeek,
                wrapping: true,
            }).addStyleClass("sapUiLbl"),
            template: new mc.ccp.control.McArrowTextField({
                value: "{LastWeekSales}",
                arrows: false,
                readOnly: {
                    path: "readOnly",
                    formatter: function(fValue) {
                        if (fValue === true) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
            }).attachChange(oController.onChangeValidateQty, oController),
            width: "10%",
            resizable : false,
            hAlign: "Center",
            vAlign: "Center",
            sortProperty: "LastWeekSales",
            filterProperty: "LastWeekSales"
        }));
        this.byId('idSalesCol').getAggregation('template').getAggregation("textField").setMaxLength(20);
        oTable.addColumn(new mc.ccp.control.McColumn(this.createId("idBegInvCol"), {
            label: new sap.ui.commons.Label({
                text: MCAPP.getText('VW_SI_BEG_INV', this) + oBeginningInventoryWeek,
                wrapping: true,
            }).addStyleClass("sapUiLbl"),
            template: new mc.ccp.control.McArrowTextField({
                value: "{BegINV}",
                arrows: false,
                readOnly: {
                    path: "readOnly",
                    formatter: function(fValue) {
                        if (fValue === true) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
            }).attachChange(oController.onChangeValidateQty, oController),
            width: "10%",
            hAlign: "Center",
            vAlign: "Center",
            resizable : false,
            sortProperty: "BegINV",
            filterProperty: "BegINV"
        }));
        this.byId('idBegInvCol').getAggregation('template').getAggregation("textField").setMaxLength(20);
        oTable.bindRows('/results');
        oTable.attachSort(oController.onSortColumn, oController);
        oTable.attachFilter(oController.onFilterColumn, oController);
        return oTable;
    },
    
    /** This  prepares columns for table as per their template type.
     * @memberOf inventory.Salesandinventory
     * @param oTable
     * @param colId
     * @param template
     * @param jsonField
     * @param resBundleVal
     * @param oController
     */
    _createColumnSalesAndInventory: function(oTable, colId, template, jsonField, width, resBundleVal) {
        var newTemplate = "";
        if (template === "TextView") {
            newTemplate = new sap.ui.commons.TextView().bindProperty("text", jsonField);
        } 
        //creating column and adding to oTable
        oTable.addColumn(new mc.ccp.control.McColumn(this.createId(colId), {
            label: new sap.ui.commons.Label({
                text: MCAPP.getText(resBundleVal, this),
            }), 
            template: newTemplate,
            width: width,
            hAlign: "Center",
            vAlign: "Center",
            resizable: false,
            sortProperty: jsonField,
            filterProperty: jsonField
        }));
    },
});