/***
 * @Author UR09
 * @Date 12/04/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is inventory main page view.
 */
sap.ui.jsview("mc.ccp.inventory.Inventory", {
	
    /*** Specifies the Controller belonging to this View. 
     * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
     * @memberOf inventory.Inventory
     * @param oController
     * @returns {sap.ui.layout.VerticalLayout}
     */
    getControllerName: function() {
        return "mc.ccp.inventory.Inventory";
    },
    
    /*** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf inventory.Inventory
     */
    createContent: function(oController) {
        //Required Library
        jQuery.sap.require("mc.ccp.control.McHorizontalLayout");
        jQuery.sap.require("mc.ccp.control.McPaginator");
        jQuery.sap.require("mc.ccp.control.McComboBox");
        jQuery.sap.require("mc.ccp.control.McTable");
        jQuery.sap.require("mc.ccp.control.McColumn");
        jQuery.sap.require("mc.ccp.control.McDialog");
        //Creating top page control row will be create total text, dropdown, blank space paginator
        //		********************************ROW 1***********************************************************		
        var oPageControlsTopRow = this._createPageControlsRow(oController, "");
        //		********************************ROW 2***********************************************************	
        var oInventoryTable = this._createInventoryTableControlsRow(this.createId("idInventoryTable"), oController);
        var oInventoryTableInv = this._createInventoryTableControlsRow1(this.createId("idInventoryTableInv"), oController);
        //Creating bottom page control row will be create total text, dropdown, blank space paginator
        //		********************************ROW 3***********************************************************	
        var oPageControlsBottomRow = this._createPageControlsRow(oController, "Bottom");
        oPageControlsBottomRow.addStyleClass('mcCcpInvBottomRowPadding');
        //      ************************************************************************************************
        var oBlankSpaceLayout = new mc.ccp.control.McHorizontalLayout({
            height: "1px",
            width: "100%",
            widths: ["100%"],
            content: [new sap.ui.core.HTML()]
        });
        var oVerticalLayout = new sap.ui.layout.VerticalLayout({
            content: [oPageControlsTopRow, oInventoryTable, oInventoryTableInv, oBlankSpaceLayout, oPageControlsBottomRow]
        });
        return oVerticalLayout;
    },
    
    /***
     * method to create the page controls row in the inventory main page
     * @param oController
     * @param id
     * @returns {mc.ccp.control.McHorizontalLayout}
     */
    _createPageControlsRow: function(oController, id) {
        var oTotalTxt = new sap.ui.commons.TextView(this.createId('totalTxtId' + id)).addStyleClass('mcCcpInvViewLabels');
        var oComboBox = new mc.ccp.control.McComboBox(this.createId('comboBoxIdInventory' + id), {
            width: "85px",
            height: "35px",
            selectedKey: "10",
            editable: true,
        });
        oComboBox.attachChange(oController.onChangeDropdown, oController);
        var oPaginator = new mc.ccp.control.McPaginator(this.createId('paginatorInventory' + id), {
            showSave: false
        });
        oPaginator.attachPage(oController.onPage, oController);
        var oTopContrlsRow = new mc.ccp.control.McHorizontalLayout({
            height: "50px",
            width: "100%",
            ptop: "5px",
            widths: ["10%", "10%", "15%", "65%"],
            content: [oComboBox, oTotalTxt, new sap.ui.core.HTML(), oPaginator]
        });
        return oTopContrlsRow;
    },
    
    /***
     * method to create the column header and row in the inventory main page
     * @param id
     * @param oController
     * @returns {mc.ccp.control.McTable}
     */
    _createInventoryTableControlsRow: function(id, oController) {
        var oTable = new mc.ccp.control.McTable(this.createId(id), {
            width: '100%',
            selectionMode: sap.ui.table.SelectionMode.None,
            navigationMode: sap.ui.table.NavigationMode.Paginator,
        });
        oTable.addStyleClass("inventortyTable");
        //Define the columns and the control templates to be used
        this._createColumnInventory(oTable, "idDistSkuCol", "TextView", "Dist_SKU", "12%", "VW_INV_DIST_SKU");
        oTable.addColumn(new mc.ccp.control.McColumn(this.createId('idSkuCol'), {
            label: new sap.ui.commons.Label({
                text: MCAPP.getText("VW_INV_SKU", this),
            }),
            template: new sap.ui.commons.Link({
                text: {
                    parts: ['SKU'],
                    formatter: function(skuValue) {
                        if (skuValue) return skuValue;
                        else return "";
                    }
                }
            }).attachPress(oController.onPressSKULink, oController),
            sortProperty: "SKU",
            filterProperty: "SKU",
            width: "10%",
            resizable: false,
            hAlign: "Center",
            vAlign: "Center"
        }));
        this._createColumnInventory(oTable, "idSkuDescCol", "TextView", "SKU_Desc", "38%", "VW_INV_DESCRIPTION");
        this._createColumnInventory(oTable, "idShipToCol", "TextView", "ShipToId", "9%", "VW_INV_SHIP_TO");
        this._createColumnInventory(oTable, "idSourceCol", "TextView", "SourceName", "9%", "VW_INV_SOURCE");
        this._createColumnInventory(oTable, "idEstTransitTimeCol", "TextView", "EstdTransitDays", "8%", "VW_INV_EST_TRANSIT_TIME");
        oTable.bindRows("/results");
        oTable.attachSort(oController.onSortColumn, oController);
        oTable.attachFilter(oController.onFilterColumn, oController);
        return oTable;
    },
    
    /***
     * method to create the column header and row in the inventory main page
     * @param id
     * @param oController
     * @returns {mc.ccp.control.McTable}
     */
    _createInventoryTableControlsRow1: function(id, oController) {
        var oTable = new mc.ccp.control.McTable(this.createId(id), {
            width: '100%',
            selectionMode: sap.ui.table.SelectionMode.None,
            navigationMode: sap.ui.table.NavigationMode.Paginator,
        });
        oTable.addStyleClass("inventortyTable");
        //Define the columns and the control templates to be used
        this._createColumnInventory(oTable, "idDistSkuCol1", "TextView", "Dist_SKU", "5%", "VW_INV_DIST_SKU");
        oTable.addColumn(new mc.ccp.control.McColumn(this.createId('idSkuCol1'), {
            label: new sap.ui.commons.Label({
                text: MCAPP.getText("VW_INV_SKU", this),
            }),
            template: new sap.ui.commons.Link({
                text: {
                    parts: ['SKU'],
                    formatter: function(skuValue) {
                        if (skuValue) return skuValue;
                        else return "";
                    }
                }
            }).attachPress(oController.onPressSKULink, oController),
            sortProperty: "SKU",
            filterProperty: "SKU",
            width: "7%",
            resizable: false,
            hAlign: "Center",
            vAlign: "Center"
        }));
        this._createColumnInventory(oTable, "idSkuDescCol1", "TextView", "SKU_Desc", "24%", "VW_INV_DESCRIPTION");
        this._createColumnInventory(oTable, "idShipToCol1", "TextView", "ShipToId", "7%", "VW_INV_SHIP_TO");
        this._createColumnInventory(oTable, "idSourceCol1", "TextView", "SourceName", "7%", "VW_INV_SOURCE");
        this._createColumnInventory(oTable, "idEstTransitTimeCol1", "TextView", "EstdTransitDays", "8%", "VW_INV_EST_TRANSIT_TIME");
        oTable.bindRows("/results");
        oTable.attachSort(oController.onSortColumn, oController);
        oTable.attachFilter(oController.onFilterColumn, oController);
        return oTable;
    },
    
    /** This  prepares columns for table as per their template type.
     * @memberOf inventory.Inventory
     * @param oTable
     * @param colId
     * @param template
     * @param jsonField
     * @param resBundleVal
     */
    _createColumnInventory: function(oTable, colId, template, jsonField, width, resBundleVal) {
        var newTemplate = "";
        if (template === "TextView" ) {
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