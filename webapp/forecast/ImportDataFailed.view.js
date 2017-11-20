/***
 * @Author so97
 * @Date 11/13/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is ImportData Failed view
 */
sap.ui.jsview("mc.ccp.forecast.ImportDataFailed", {
    /** Specifies the Controller belonging to this View. 
     * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
     * @memberOf forecast.ImportDataFailed
     * @returns mc.ccp.forecast.ImportDataFailed
     */
    getControllerName: function() {
        return "mc.ccp.forecast.ImportDataFailed";
    },
    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf forecast.ImportDataFailed
     * @param oController
     * @returns sap.ui.layout.VerticalLayout
     */
    createContent: function(oController) {
        var oTextView = new sap.ui.commons.TextView({
            text: MCAPP.getText('VW_IDF_IMPORT_ERROR_DESC', this),
            width: '100%',
        });
        var oTextError = new sap.ui.commons.TextView(this.createId("errorcount"),{
            width: '100%',
        });
        var oTable = new mc.ccp.control.McTable(this.createId("idFileUploadFailed"), {            
            selectionMode: sap.ui.table.SelectionMode.None,
            visibleRowCount : 8
            //navigationMode: sap.ui.table.NavigationMode.Paginator,
        });
        oTable.attachSort(oController.onSortColumn, oController);
        oTable.attachFilter(oController.onFilterColumn, oController);
      //Define the columns and the control templates to be used
        this._createColumnImportFailed(oTable, "idDistSKUCol","TextView", "zdsku", "10%", "VW_IDF_DIST_SKU");
        this._createColumnImportFailed(oTable,"idSKUCol", "TextView", "zosku", "10%", "VW_IDF_SKU");
        this._createColumnImportFailed(oTable,"idSourceCol", "TextView", "zsourceid", "12%", "VW_IDF_SOURCE");
        this._createColumnImportFailed(oTable, "idShipToCol", "TextView", "zshipto", "10%", "VW_IDF_SHIP_TO");
        this._createColumnImportFailed(oTable,"idConfirmedCol", "TextView", "zdist_fcst1", "15%", "VW_IDF_QTY");   
        this._createColumnImportFailed(oTable,"idDescCol", "TextView", "zsku_desc", "15%", "VW_IDF_DESC");
        this._createColumnImportFailed(oTable,"idErrorCol", "TextView", "zerror_msg", "13%", "VW_IDF_ERROR");
        oTable.bindRows("/results");
        var oVerticalLayoutLayout = new sap.ui.layout.VerticalLayout({
            content: [oTextView, oTextError, oTable]
        });
        return oVerticalLayoutLayout;
    },
    /** This  prepares columns for table as per their template type.
     * @memberOf inventory.ImportDataFailed
     * @param oTable
     * @param colId
     * @param template
     * @param jsonField
     * @param resBundleVal
     */
    _createColumnImportFailed: function(oTable,colId, template, jsonField, width, resBundleVal) {
        var newTemplate = "";
        var week = "";
        if (template === "TextView") {
            newTemplate = new sap.ui.commons.TextView().bindProperty("text", jsonField);
        }
        if (template === "Label") {
            newTemplate = new sap.ui.commons.Label().bindProperty("text", jsonField);
        }
        if(resBundleVal === "VW_IDF_QTY" && jsonField === "zzsales"){
        	week = this._getSalesAndBegInventoryWeekDate(7);
        }
        if(resBundleVal === "VW_IDF_QTY" && jsonField === "zzinventory"){
        	week = this._getSalesAndBegInventoryWeekDate(0);
        }
        //creating column and adding to oTable
        oTable.addColumn(new mc.ccp.control.McColumn(this.createId(colId), {
            label: new sap.ui.commons.Label({
                text: week + MCAPP.getText(resBundleVal, this),
            }),
            template: newTemplate,
            width: width,
            hAlign: "Center",
            vAlign: "Center",
            resizable: false,
            sortProperty: jsonField,
            filterProperty: jsonField
        }));
    }
});