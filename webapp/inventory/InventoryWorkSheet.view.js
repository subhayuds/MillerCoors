/***
 * @Author RA03
 * @Date 14-10-2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is the Inventory WorkSheet View.
 */
sap.ui.jsview("mc.ccp.inventory.InventoryWorkSheet", {
    /** Specifies the Controller belonging to this View. 
     * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
     * @memberOf inventory.InventoryWorkSheet
     */
    getControllerName: function() {
        return "mc.ccp.inventory.InventoryWorkSheet";
    },
    
    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf inventory.InventoryWorkSheet
     */
    createContent: function(oController) {
        //Including Required Libraries of custom control
        jQuery.sap.require("mc.ccp.inventory.control.InventoryWSItemTable");
        jQuery.sap.require("mc.ccp.inventory.control.InventoryAnalyticsTable");
        jQuery.sap.require("mc.ccp.control.McHorizontalLayout");
        jQuery.sap.require("mc.ccp.control.McPaginator");
        jQuery.sap.require("mc.ccp.control.McDateHeader");
        //Creating header control row at header of custom table
        var oHeaderControlsRow = this._createHeaderControlsRow(oController);
        //Creating enable change request row at header of custom table
        var oEnableCRControlRow = this._createEnableCRControlRow(oController);
        //Creating date header to render the required number of weeks passed in columnCount property in a row.
        var oDateHeaderControl = new mc.ccp.control.McDateHeader({
            collectionName: "InventoryItemsData",
            firstColumnWidth: "14.6",
            columnCount: 9,
            columnColor: 4
        });
        //Creating row repeater control to show the week wise data
        var oRowRepeater = this._createRowRepeaterControlRow(this.createId('rowRepeaterId'), oController);
        //Creating analytics table control row to create Custom table.
        var oShowAnalyticsTable = this._createInventoryAnalyticsTableControlRow(oController);
        //Hide Standard  Features like sort and paginator ect.
        oRowRepeater.onAfterRendering = function() {
            jQuery.sap.byId(this.getId()).find('.sapUiRrPtb').hide();
            jQuery.sap.byId(this.getId()).find('.sapUiRrStb').hide();
            jQuery.sap.byId(this.getId()).find('.sapUiTbCont').hide();
            jQuery.sap.byId(this.getId()).find('.sapUiRrFtr').hide();
        };
        var oVerticalLayout = new sap.ui.layout.VerticalLayout({
            width: "100%",
            content: [oHeaderControlsRow, oEnableCRControlRow, oDateHeaderControl, oRowRepeater, oShowAnalyticsTable]
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
//        var oMatrixLayout = new sap.ui.commons.layout.MatrixLayout("headerRowMatrix").addStyleClass("invMatrixLabel");
        
        var oMatrixLayout = new sap.ui.commons.layout.MatrixLayout(this.createId("headerRowMatrix"), {
           widths: ["2%", "15%", "15%", "30%", "10%", "13%","15%"],
        }).addStyleClass("invMatrixLabel");
        
        oMatrixLayout.createRow(oInventoryWSLabel);
        oMatrixLayout.createRow(null, oDistSkuLabel, oInvWSLabel, oInvDescLabel, oInvShipToLabel, oInvSourceLabel, oInvEstdTransitTimeLabel);
        oMatrixLayout.createRow(null, oInvDistSkuValueLabel, oInvSkuValueLabel, oInvSkuDesValueLabel, oInvShipToValueLabel, oInvSourceValueLabel, oInvEstdTransitTimeValueLabel);
        return oMatrixLayout;
    },
    
    /**
     * method to create the UnsubmitedCR,EnablechangeCR & Previous&Submit row in the Inventory WorkSheet
     * @param id
     * @param oController
     * @returns {sap.ui.commons.layout.HorizontalLayout}
     */
    _createEnableCRControlRow: function(oController) {
        var oInvUnSubmittCRValue = new sap.ui.commons.Label({
            text: MCAPP.getUnsubmittedCr()
        });
        var oInvUnSubmittCRLabel = new sap.ui.commons.Label({
            text: MCAPP.getText("VW_INV_WORK_SHEET_UNSUBMITTED_CRS")
        }).addStyleClass("invUnsubmitedvalue");
        var oPreviewSubmitLink = new sap.ui.commons.Link(this.createId("previewAndSubmitCR"),{
            text: MCAPP.getText('VW_INV_WORK_SHEET_PREV_SUBMIT'),
            tooltip: MCAPP.getText('VW_INV_WORK_SHEET_PREV_SUBMIT')
        }).addStyleClass("invPrevSubLink");
        oPreviewSubmitLink.attachPress(oController.onPressPreviewAndSubmitCR, oController);
        var oEnableChangeRequestLink = new sap.ui.commons.Link(this.createId("enableCRLink"),{
            text: MCAPP.getText('VW_INV_WORK_SHEET_ENABLE_CHANGE_REQUEST'),
            tooltip: MCAPP.getText('VW_INV_WORK_SHEET_ENABLE_CHANGE_REQUEST')
        }).addStyleClass("invEnableChange");
        oEnableChangeRequestLink.attachPress(oController.onPressEnableChangeRequest, oController);
        var oHorizontalLayout = new sap.ui.commons.layout.HorizontalLayout({
            content: [oInvUnSubmittCRValue, oInvUnSubmittCRLabel, oPreviewSubmitLink, oEnableChangeRequestLink]
        }).addStyleClass("invSecondRowLink");
        return oHorizontalLayout;
    },
    
    /**
     * method to create the row repeater row in the Inventory WorkSheet
     * @param id
     * @param oController
     * @returns {sap.ui.commons.RowRepeater}
     */
    _createRowRepeaterControlRow: function(id, oController) {
        var oInvWSCustomTable = new mc.ccp.inventory.control.InventoryWSItemTable();
        oInvWSCustomTable.bindProperty("expand", "expand");
        oInvWSCustomTable.bindProperty("dirtyState", "dirtyState");
        oInvWSCustomTable.bindProperty("errorState", "errorState");
        oInvWSCustomTable.bindProperty("readOnly", "readOnly");
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
     * @param id
     * @param oController
     * @returns {sap.ui.commons.RowRepeater}
     */
    _createInventoryAnalyticsTableControlRow: function(oController) {
        var oAnalyticsTable = new mc.ccp.inventory.control.InventoryAnalyticsTable();
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