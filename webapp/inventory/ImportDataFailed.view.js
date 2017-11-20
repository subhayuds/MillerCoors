/***
 * @Author SO97
 * @Date 11/13/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is ImportData Failed view
 */
sap.ui.jsview("mc.ccp.inventory.ImportDataFailed", {
	
    /** Specifies the Controller belonging to this View. 
     * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
     * @memberOf inventory.ImportDataFailed
     */
    getControllerName: function() {
        return "mc.ccp.inventory.ImportDataFailed";
    },
    
    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf inventory.ImportDataFailed
     * @param oController
     * @returns sap.ui.layout.VerticalLayout   
     */
    createContent: function(oController) {
        var oText = new sap.ui.commons.TextView({
            text: MCAPP.getText("IMPORT_ERROR_DESC",this),
            width: '100%',
        });
        var oTextError = new sap.ui.commons.TextView({
            id: "errorcount",
            width: '100%',
        });
        var oTable = new sap.ui.table.Table("idFileUploadFailedTable", {
            selectionMode: sap.ui.table.SelectionMode.None,
            navigationMode: sap.ui.table.NavigationMode.Paginator,
        });
        //Define the columns and the control templates to be used
        this._createColumnImportFailed(oTable, "TextView", "zzdsku", "10%", "VW_IDF_DIST_SKU");
        this._createColumnImportFailed(oTable, "TextView", "zzsku", "10%", "VW_IDF_SKU");
        this._createColumnImportFailed(oTable, "TextView", "zzsourcename", "12%", "VW_IDF_SOURCE");
        this._createColumnImportFailed(oTable, "TextView", "zzkunnr", "10%", "VW_IDF_SHIP_TO");
        this._createColumnImportFailed(oTable, "TextView", "zzsales", "15%", "VW_IDF_QTY");
        this._createColumnImportFailed(oTable, "TextView", "zzinventory", "15%", "VW_IDF_QTY");
        this._createColumnImportFailed(oTable, "TextView", "zzsku_desc", "15%", "VW_IDF_DESC");
        this._createColumnImportFailed(oTable, "TextView", "zzerror_msg", "13%", "VW_IDF_ERROR");
        oTable.bindRows("/results");
        var oLayout = new sap.ui.layout.VerticalLayout({
            content: [oText, oTextError, oTable]
        });
        return oLayout;
    },
    
    /** This  prepares columns for table as per their template type.
     * @memberOf inventory.ImportDataFailed
     * @param oTable
     * @param colId
     * @param template
     * @param jsonField
     * @param resBundleVal
     */
    _createColumnImportFailed: function(oTable, template, jsonField, width, resBundleVal) {
        var newTemplate = "";
        var week = "";
        if (template === "TextView") {
            newTemplate = new sap.ui.commons.TextView().bindProperty("text", jsonField);
        }
        if(resBundleVal === "VW_IDF_QTY" && jsonField === "zzsales"){
        	week = this._getSalesAndBegInventoryWeekDate(7);
        }
        if(resBundleVal === "VW_IDF_QTY" && jsonField === "zzinventory"){
        	week = this._getSalesAndBegInventoryWeekDate(0);
        }
        //creating column and adding to oTable
        oTable.addColumn(new mc.ccp.control.McColumn({
            label: new sap.ui.commons.Label({
                text: week + MCAPP.getText(resBundleVal, this),
            }),
            template: newTemplate,
            width: width,
            hAlign: "Center",
            vAlign: "Center",
        }));
    },
    
    /** Is used to calculate current week and previous week.
     * @memberOf inventory.ImportDataFailed
     * @param numOfDays
     */
    _getSalesAndBegInventoryWeekDate: function(numOfDays) {
        var currentWeekDate = MCAPP.getCurrentweek();
        var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
            pattern: "MM/dd/yyyy"
        });
        var standardDateFormat = dateFormat.parse(currentWeekDate);
        standardDateFormat.setDate(standardDateFormat.getDate() - numOfDays);
        var newWeekDate = dateFormat.format(standardDateFormat).slice(0,5);
        newWeekDate = newWeekDate +" ";
        return newWeekDate;
    },
});