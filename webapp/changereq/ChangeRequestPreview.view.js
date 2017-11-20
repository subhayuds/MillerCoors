/***
 * @Author DS05
 * @Date 10/13/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is ChangeRequestPreview view
 */
sap.ui.jsview("mc.ccp.changereq.ChangeRequestPreview", {
    /** Specifies the Controller belonging to this View. 
     * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
     * @memberOf changereq.ChangeRequestPreview
     */
    getControllerName: function() {
        return "mc.ccp.changereq.ChangeRequestPreview";
    },
    
    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf changereq.ChangeRequestPreview
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
        jQuery.sap.require("mc.ccp.control.McDialog");
        //********************************Reason Combo Box items******************************************     
        var oItemList = this._createReasonItemList(oController);
        //********************************ROW 1***********************************************************              
        var oTopControlsRow = this._createPageControlsRow(oController, "");
        //********************************ROW 2***********************************************************       
        var oCRPreviewTable = this._createCRPreviewTableRow(oController, oItemList);
        //********************************ROW 3***********************************************************       
        var oBottomPaginatorRow = this._createPageControlsRow(oController, "Bottom");
        var oLayout = new sap.ui.layout.VerticalLayout({
            content: [oTopControlsRow, oCRPreviewTable, oBottomPaginatorRow]
        });
        return oLayout;
    },
    
    /** This  prepares top and bottom controls of the page. Controls include Total number of records,combox box and paginator
     * @memberOf changereq.ChangeRequestPreview
     * @param oController
     */
    _createPageControlsRow: function(oController, id) {
        var oTotalText = new sap.ui.commons.TextView(this.createId('totalTxtId' + id)).addStyleClass('orderVwlabels');
        var oPerPage = new sap.ui.commons.TextView(this.createId('perPage' + id)).addStyleClass('McCcpVwlabel');
        var oComboBox = new mc.ccp.control.McComboBox(this.createId('comboBoxIdCrPreview' + id), {
            width: "85px",
            height: "35px",
            selectedKey: "10",
            editable: true,
        });
        oComboBox.attachChange(oController.onChangeDropdown, oController);
        var oPaginator = new mc.ccp.control.McPaginator(this.createId('paginatorCrPreview' + id), {
            showSave: true
        });
        oPaginator.attachPage(oController.onPageSaveAndNavigate, oController);
        var oTopControlsRow = new mc.ccp.control.McHorizontalLayout(this.createId("idComboPaginatorRow" + id), {
            height: "50px",
            width: "100%",
            ptop: "5px",
            widths: ["6%", "8%", "5%", "15%", "66%"],
            content: [oTotalText, oComboBox, oPerPage, new sap.ui.core.HTML(), oPaginator]
        });
        return oTopControlsRow;
    },
    
    /** This  prepares the list item containing reason code and reason text/desc.
     * @memberOf changereq.ChangeRequestPreview
     */
    _createReasonItemList: function() {
        var oItemTemplate = new sap.ui.core.ListItem(this.createId("idReasonList"), {
            text: "{reasonsModel>Reason_Text}",
            key: "{reasonsModel>Reason_Code}",
        });
        return oItemTemplate;
    },
    
    /** This  prepares CR preview table .This table displays DistSKU,SKU,SKU_Desc,Sales_Ord_No,ShipToId,SourceName,Confirmed_Qty
     * @memberOf changereq.ChangeRequestPreview
     * @param oController
     * @param oItemTemplate
     */
    _createCRPreviewTableRow: function(oController, oItemTemplate) {
    	var readOnlyFlag = this.oController.getReadOnlyFlag();
    	if( readOnlyFlag === false){
    		readOnlyFlag = true;
    	}else{
    		readOnlyFlag = false;
    	}
        var oTable = new mc.ccp.control.McTable(this.createId("CRPreviewTable"), {
            width: '100%',
            selectionMode: sap.ui.table.SelectionMode.None,
            navigationMode: sap.ui.table.NavigationMode.Paginator,
        });
        oTable.addStyleClass("changeReqPreviewTable");
        //Define the columns and the control templates to be used
        this._createColumnCrPreview(oTable, "idDistSKUCol", "TextView", "Dist_SKU", "6%", "VW_CR_DIST_SKU", oController);
        this._createColumnCrPreview(oTable, "idSKUCol", "TextView", "SKU", "6%", "VW_CR_SKU", oController);
        this._createColumnCrPreview(oTable, "idDescCol", "TextView", "SKU_Desc", "12%", "VW_CR_DESC", oController);
        this._createColumnCrPreview(oTable, "idSOCol", "TextView", "Sales_Ord_No", "7%", "VW_CR_PRW_SO", oController);
        this._createColumnCrPreview(oTable, "idCustomPOCol", "TextView", "Custom_PO", "9%", "VW_CR_PRW_CUSTOM_ID_PO", oController);
        this._createColumnCrPreview(oTable, "idShipToCol", "TextView", "ShipToId", "7%", "VW_CR_SHIP_TO", oController);
        this._createColumnCrPreview(oTable, "idSourceCol", "TextView", "SourceName", "8%", "VW_CR_SOURCE", oController);
        this._createColumnCrPreview(oTable, "idConfirmedCol", "TextView", "Confirmed_Qty", "9%", "VW_CR_PRW_CONFIRMED", oController);
        this._createColumnCrPreview(oTable, "idCRQtyCol", "ArrowTextField", "Change_Req_Qty", "11%", "VW_CR_CRLABEL", oController);
        var oComboBox = new sap.ui.commons.ComboBox({
            helpId: "reasonComboBox",
            selectedKey: {
                path: "Reason_Code",
                formatter: function(fValue) {
                    if (fValue !== "undefined" && fValue !== "" && fValue !== null) {
                        return fValue;
                    } else {
                        return MCAPP.getText('VW_CR_PRW_SELECT', this);
                    }
                },
            },
            enabled :readOnlyFlag,
            items: {
                path: "reasonsModel>/results",
                template : oItemTemplate
                }
        }).attachChange(oController.onChangeUpdateModelForReason, oController);
        oTable.addColumn(new mc.ccp.control.McColumn(this.createId("idReasonCol"), {
            label: new sap.ui.commons.Label({
                text: "{i18n>VW_CR_REASON}"
            }),
            template: oComboBox,
            width: "14%",
            resizable: false,
            hAlign: "Center",
            vAlign: "Center"
        }));
        oTable.addColumn(new mc.ccp.control.McColumn(this.createId("idCommentCol"), {
            label: new sap.ui.commons.Label({
                text: "{i18n>VW_CR_COMMENT}"
            }),
            template: new sap.ui.commons.Link({
                text: {
                    path: "Dist_Comment_Text",
                    formatter: function(fValue) {
                    	if(readOnlyFlag === true){
                    		if (fValue !== "undefined" && fValue !== "") {
                                return MCAPP.getText('VW_CR_PRW_EDIT', this);
                            } else {
                                return MCAPP.getText('VW_CR_PRW_ADD', this);
                            }
                    	}else{
                    		return "";
                    	}
                    },
                }
            }).attachPress(oController.onPressOpenAddEditDialog, oController),
            width: "8%",
            resizable: false,
            hAlign: "Left",
            vAlign: "Left"
        }));
        oTable.addColumn(new mc.ccp.control.McColumn(this.createId("idDeleteCol"), {
            label: new sap.ui.commons.Label({
                text: ""
            }),
            template: new sap.ui.commons.Image(this.createId("idCrossImage"),{
                src: 'image/cross.png'
            }).attachPress(oController.onPressRemoveLineItem, oController),
            width: "2%",
            resizable: false,
        }));
        oTable.bindRows('/results');
        oTable.attachSort(oController.onSortColumn, oController);
        oTable.attachFilter(oController.onFilterColumn, oController);
        return oTable;
    },
    
    /** This  prepares columns for table as per their template type.
     * @memberOf changereq.ChangeRequestPreview
     * @param oTable
     * @param colId
     * @param template
     * @param jsonField
     * @param resBundleVal
     * @param oController
     */
    _createColumnCrPreview: function(oTable, colId, template, jsonField, width, resBundleVal, oController) {
    	var readOnlyFlag = this.oController.getReadOnlyFlag();
        var newTemplate = "";
        if (template === "TextView") {
            newTemplate = new sap.ui.commons.TextView().bindProperty("text", jsonField);
        } else if (template === "ArrowTextField") {
            newTemplate = new mc.ccp.control.McArrowTextField({
                arrows: true,
                height: "30px",
                readOnly : readOnlyFlag
            }).bindProperty("value", jsonField);
            newTemplate.attachChange(oController.onChangeValidateQty, oController);
            newTemplate.bindProperty("pallet", "PalletValue");
            newTemplate.getAggregation("textField").setMaxLength(15);
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