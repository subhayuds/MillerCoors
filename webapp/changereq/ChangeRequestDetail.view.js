/***
 * @Author DS05
 * @Date 10/13/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is ChangeRequest Detail view
 */
sap.ui.jsview("mc.ccp.changereq.ChangeRequestDetail", {
    /** Specifies the Controller belonging to this View. 
     * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
     * @memberOf changereq.ChangeRequestDetail
     */
    getControllerName: function() {
        return "mc.ccp.changereq.ChangeRequestDetail";
    },
    
    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf changereq.ChangeRequestDetail
     */
    createContent: function(oController) {
        //Required Library
        jQuery.sap.require("mc.ccp.control.McHorizontalLayout");
        jQuery.sap.require("mc.ccp.control.McPaginator");
        jQuery.sap.require("mc.ccp.control.McComboBox");
        jQuery.sap.require("mc.ccp.control.McTable");
        jQuery.sap.require("mc.ccp.control.McColumn");
        //********************************ROW 1***********************************************************		
        var oPageControlsRow = this._createPageControlsRow(oController, "");
        //********************************ROW 2***********************************************************	
        var oCRDetailTable = this._createTableControlRow("CRDetailTable", oController);
        //********************************ROW 3***********************************************************	
        var oBottomPaginatorRow = this._createPageControlsRow(oController, "Bottom");
        oBottomPaginatorRow.addStyleClass('changeReqBottomRowPadding');
        var oBlackSpaceLayout = new mc.ccp.control.McHorizontalLayout({
            height: "1px",
            width: "100%",
            widths: ["100%"],
            content: [new sap.ui.core.HTML()]
        });
        var oVerticalLayout = new sap.ui.layout.VerticalLayout({
            content: [oPageControlsRow, oCRDetailTable, oBlackSpaceLayout, oBottomPaginatorRow]
        });
        return oVerticalLayout;
    },
    
    /**
     * method to create the page controls row in the ChangeRequest Detail page
     * @param oController
     *  @param id
     * @returns {mc.ccp.control.McHorizontalLayout}
     */
    _createPageControlsRow: function(oController, id) {
        var oTotalText = new sap.ui.commons.TextView(this.createId('totalTxtId' + id)).addStyleClass('orderVwlabels');
        var oPerPage = new sap.ui.commons.TextView(this.createId('perPage' + id)).addStyleClass('McCcpVwlabel');
        var oComboBox = new mc.ccp.control.McComboBox(this.createId('comboBoxIdCrDetail' + id), {
            width: "85px",
            height: "35px",
            selectedKey: "10",
            editable: true,
        });
        oComboBox.attachChange(oController.onChangeDropdown, oController);
        var oPaginator = new mc.ccp.control.McPaginator(this.createId('paginatorCrDetail' + id), {
            showSave: false
        });
        oPaginator.attachPage(oController.onPageDoPaging, oController);
        var oTopControlsRow = new mc.ccp.control.McHorizontalLayout(this.createId('idComboPaginatorRow' + id),{
            height: "50px",
            width: "100%",
            ptop: "5px",
            widths: ["6%", "8%", "5%", "15%", "66%"],
            content: [oTotalText, oComboBox, oPerPage, new sap.ui.core.HTML(), oPaginator]
        });
        return oTopControlsRow;
    },
    
    /**
     * method to create the column header row in the ChangeRequestDetail page
     * @param id
     * @param oController
     * @returns {mc.ccp.control.McTable}
     */
    _createTableControlRow: function(id, oController) {
        var oTable = new mc.ccp.control.McTable(this.createId(id), {
            width: '100%',
            selectionMode: sap.ui.table.SelectionMode.None,
            navigationMode: sap.ui.table.NavigationMode.Paginator,
        });
        oTable.addStyleClass("changeReqDdetailTable");
        //Define the columns and the control templates to be used
        this._createColumnCrDetail(oTable, "idCRCol", "TextView", "Change_Req_No", "7%", "VW_CR_CRLABEL");
        this._createColumnCrDetail(oTable, "idStatusCol", "TextView", "Status_Text", "8%", "VW_CR_DETAIL_STATUS");
        this._createColumnCrDetail(oTable, "idDistSkuCol", "TextView", "Dist_SKU", "8%", "VW_CR_DIST_SKU");
        this._createColumnCrDetail(oTable, "idSKUCol", "TextView", "SKU", "7%", "VW_CR_SKU");
        this._createColumnCrDetail(oTable, "idDescCol", "TextView", "SKU_Desc", "11%", "VW_CR_DESC");
        this._createColumnCrDetail(oTable, "idShipToCol", "TextView", "ShipToId", "8%", "VW_CR_SHIP_TO");
        this._createColumnCrDetail(oTable, "idSourceCol", "TextView", "SourceName", "7%", "VW_CR_SOURCE");
        this._createColumnCrDetail(oTable, "idDateCol", "TextView", "CR_Submit_Date", "9%", "VW_CR_DETAIL_DATE_SUBMITTED");
        this._createColumnCrDetail(oTable, "idConfirmedCol", "TextView", "Confirmed_Qty", "9%", "VW_CR_DETAIL_CONFIRMED");
        this._createColumnCrDetail(oTable, "idCRQtyCol", "TextView", "Change_Req_Qty", "5%", "VW_CR_CRLABEL");
        this._createColumnCrDetail(oTable, "idReasonCol", "TextView", "Reason_Text", "13%", "VW_CR_REASON");
        var oCommentLink;
        oTable.addColumn(new mc.ccp.control.McColumn(this.createId("idCmtCol"), {
            label: new sap.ui.commons.Label({
                text: MCAPP.getText("VW_CR_COMMENT", this),
            }),
            template: new sap.ui.commons.layout.HorizontalLayout({
                content: [
                    oCommentLink = new sap.ui.commons.Link({
                        text: {
                            parts: ['Dist_Comment_Text','MC_Comment_Text'],
                            formatter: function(fValue, fValue1) {
                                if (fValue || fValue1) return MCAPP.getText("VW_CR_DETAIL_VIEW", this);
                                else return;
                            }
                        }
                    }),
                    oCommentLink.attachPress(oController.onPressOpenViewCommentDialog, oController),
                ]
            }),
            width: "9%",
            resizable: false,
            hAlign: "Left",
            vAlign: "Left"
        }));
        oTable.bindRows('/results');
        oTable.attachSort(oController.onSortColumn, oController);
        oTable.attachFilter(oController.onFilterColumn, oController);
        return oTable;
    },
    
    /** This  prepares columns for table as per their template type.
     * @memberOf changereq.ChangeRequestDetail
     * @param oTable
     * @param colId
     * @param template
     * @param jsonField
     * @param resBundleVal
     */
    _createColumnCrDetail: function(oTable, colId, template, jsonField, width, resBundleVal) {
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