/***
 * @Author II84
 * @Date 03-12-2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is view for Import Inventory WorkSheet.
 */
sap.ui.jsview("mc.ccp.inventory.ImportInventoryWS", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf inventory.ImportInventoryWS
	*/ 
	getControllerName : function() {
		return "mc.ccp.inventory.ImportInventoryWS";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf inventory.ImportInventoryWS
	*/ 
	createContent : function(oController) {
		//Including Required Libraries of custom control
        jQuery.sap.require("mc.ccp.inventory.control.ImportInventoryWSItemTable");
        jQuery.sap.require("mc.ccp.inventory.control.ImportInventoryAnalyticsTable");
        jQuery.sap.require("mc.ccp.control.McHorizontalLayout");
        jQuery.sap.require("mc.ccp.control.McPaginator");
        jQuery.sap.require("mc.ccp.control.McDateHeader");
        //Creating header control row at header of custom table
        var oHeaderControlsRow = this._createHeaderControlsRow(oController);        
        //Creating date header to render the required number of weeks passed in columnCount property in a row.
        var oDateHeaderControl = new mc.ccp.control.McDateHeader(this.createId('dateHeaderId'), {
            collectionName: "InventoryItemsData",
            columnCount: 15,
            columnColor: 8,			//Set Default Value
            firstColumnWidth: "10"
        });
        //Creating row repeater control to show the week wise data
        var oRowRepeater = this._createRowRepeaterControlRow(this.createId('rowRepeaterId'), oController);
        //Creating analytics table control row to create Custom table.
        var oShowAnalyticsTable = this._createImportInventoryAnalyticsTableControlRow(oController);
        //Hide Standard  Features like sort and paginator etc
        oRowRepeater.onAfterRendering = function() {
            jQuery.sap.byId(this.getId()).find('.sapUiRrPtb').hide();
            jQuery.sap.byId(this.getId()).find('.sapUiRrStb').hide();
            jQuery.sap.byId(this.getId()).find('.sapUiTbCont').hide();
            jQuery.sap.byId(this.getId()).find('.sapUiRrFtr').hide();
        };
        var oVerticalLayout = new sap.ui.layout.VerticalLayout({
            width: "100%",
            content: [oHeaderControlsRow, oDateHeaderControl, oRowRepeater, oShowAnalyticsTable]
        });
        return oVerticalLayout;
		
	},
	
	/**
     * method to create the header labels row in the Inventory Worksheet
     * @param id
     * @param oController
     * @returns {sap.ui.commons.layout.MatrixLayout}
     */
    _createHeaderControlsRow: function(oController) {
        var oInventoryWSLabel = new sap.ui.commons.Label();
        var oDistSkuLabel = new sap.ui.commons.Label({
            text: MCAPP.getText("VW_INV_WORK_SHEET_DIST_SKU"),
            design: sap.ui.commons.LabelDesign.Bold
        });
        var oInvWSLabel = new sap.ui.commons.Label({
            text: MCAPP.getText("VW_INV_WORK_SHEET_SKU"),
            design: sap.ui.commons.LabelDesign.Bold
        });
        var oInvDescLabel = new sap.ui.commons.Label({
            text: MCAPP.getText("VW_INV_WORK_SHEET_DESC"),
            design: sap.ui.commons.LabelDesign.Bold
        });
        var oInvShipToLabel = new sap.ui.commons.Label({
            text: MCAPP.getText("VW_INV_WORK_SHEET_SHIP_TO"),
            design: sap.ui.commons.LabelDesign.Bold
        });
        var oInvSourceLabel = new sap.ui.commons.Label({
            text: MCAPP.getText("VW_INV_WORK_SHEET_SOURCE"),
            design: sap.ui.commons.LabelDesign.Bold
        });
        var oInvEstdTransitTimeLabel = new sap.ui.commons.Label({
            text: MCAPP.getText("VW_INV_WORK_SHEET_EST_TRANS_TIME"),
            design: sap.ui.commons.LabelDesign.Bold
        });
        var oInvDistSkuValueLabel = new sap.ui.commons.Label(this.createId("distSKUId"));
        oInvDistSkuValueLabel.setProperty("text", this.getViewData()[0]);
        var oInvSkuValueLabel = new sap.ui.commons.Label(this.createId("SKUId"));
        oInvSkuValueLabel.setProperty("text", this.getViewData()[1]);
        var oInvSkuDesValueLabel = new sap.ui.commons.Label(this.createId("distSKUDescId"));
        oInvSkuDesValueLabel.setProperty("text", this.getViewData()[2]);
        var oInvShipToValueLabel = new sap.ui.commons.Label(this.createId("shipToId"));
        oInvShipToValueLabel.setProperty("text", this.getViewData()[3]);
        var oInvSourceValueLabel = new sap.ui.commons.Label(this.createId("sourceId"));
        oInvSourceValueLabel.setProperty("text", this.getViewData()[4]);
        var oInvEstdTransitTimeValueLabel = new sap.ui.commons.Label(this.createId("transTimeId"));
        oInvEstdTransitTimeValueLabel.setProperty("text", this.getViewData()[5]);
        var oMatrixLayout = new sap.ui.commons.layout.MatrixLayout(this.createId("headerRowMatrix"), {
           widths: ["2%", "15%", "15%", "30%", "10%", "13%","15%"],
        }).addStyleClass("impInvHeaderMatrixLayout");
        oMatrixLayout.createRow(oInventoryWSLabel);
        oMatrixLayout.createRow(null, oDistSkuLabel, oInvWSLabel, oInvDescLabel, oInvShipToLabel, oInvSourceLabel, oInvEstdTransitTimeLabel);
        oMatrixLayout.createRow(null, oInvDistSkuValueLabel, oInvSkuValueLabel, oInvSkuDesValueLabel, oInvShipToValueLabel, oInvSourceValueLabel, oInvEstdTransitTimeValueLabel);
        return oMatrixLayout;
    },
    
    /**
     * method to create the row repeater row in the Inventory WorkSheet
     * @param id
     * @param oController
     * @returns {sap.ui.commons.RowRepeater}
     */
    _createRowRepeaterControlRow: function(id, oController) {
        var oInvWSCustomTable = new mc.ccp.inventory.control.ImportInventoryWSItemTable();
        oInvWSCustomTable.bindProperty("expand", "expand");
        oInvWSCustomTable.bindProperty("dirtyState", "dirtyState");
        oInvWSCustomTable.bindProperty("errorState", "errorState");
        //Changed - Bhargav - 16-12-2014
        oInvWSCustomTable.bindProperty("readOnly", "readOnly");
        //End
        var oRowRepeater = new sap.ui.commons.RowRepeater(this.createId(id), {
            design: "Standard",
            numberOfRows: 1,
            currentPage: 1,
            rows: {
                path: "/InventoryItemsData",
                template: oInvWSCustomTable
            }
        });
        return oRowRepeater;
    },
    
    /**
     * method to create the Analytics table row in the Inventory WorkSheet
     * @param oController
     * @returns {sap.ui.commons.Accordion}
     */
    _createImportInventoryAnalyticsTableControlRow: function(oController) {
        var oAnalyticsTable = new mc.ccp.inventory.control.ImportInventoryAnalyticsTable();
        var oAccordionMatrixLayout = new sap.ui.commons.layout.MatrixLayout({
            columns: 3,
            widths: ["25%", "50%", "25%"],
        });
        oAccordionMatrixLayout.createRow(null, oAnalyticsTable, null);
        //Create the Accordion control
        var oAccordion = new sap.ui.commons.Accordion();
        oAccordion.attachSectionOpen(oController.onPressHideAnalytics, oController);
        oAccordion.attachSectionClose(oController.onPressShowAnalytics, oController);
        var oAccordionSection = new sap.ui.commons.AccordionSection(this.createId('sectionAnalytics'), {
            collapsed: true
        });
        oAccordionSection.setTitle(MCAPP.getText("VW_INV_WORK_SHEET_SHOW_ANALYTICS"));
        oAccordionSection.setTooltip(MCAPP.getText("VW_INV_WORK_SHEET_SHOW_ANALYTICS"));
        oAccordionSection.addContent(oAccordionMatrixLayout);
        oAccordion.addSection(oAccordionSection);
        oAccordion.setWidth("100%");
        
        oAccordion.onAfterRendering = function() {
            var originalFn = sap.ui.commons.Accordion.prototype.onAfterRendering;
            sap.ui.commons.Accordion.prototype.onAfterRendering.apply(this, arguments);
            oAccordion.closeOpenedSections();               
            this.onAfterRendering = originalFn;             
        };
        return oAccordion;
    },

});
