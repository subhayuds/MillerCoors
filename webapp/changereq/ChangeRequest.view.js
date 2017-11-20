/***
 * @Author OD79
 * @Date 10/13/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is responsible to create the Change Request View.
 */
sap.ui.jsview("mc.ccp.changereq.ChangeRequest", {
    /** Specifies the Controller belonging to this View. 
     * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
     * @memberOf changereq.ChangeRequest
     */
    getControllerName: function() {
        return "mc.ccp.changereq.ChangeRequest";
    },
    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf changereq.ChangeRequest
     */
    createContent: function(oController) {
        //Including Required Libraries of custom control
        jQuery.sap.require("mc.ccp.changereq.control.ChangeRequestItemTable");
        jQuery.sap.require("mc.ccp.control.McDateHeader");
        jQuery.sap.require("mc.ccp.control.McHorizontalLayout");
        jQuery.sap.require("mc.ccp.control.McPaginator");
        jQuery.sap.require("mc.ccp.control.McComboBox");
        jQuery.sap.require("mc.ccp.control.McTable");
        jQuery.sap.require("mc.ccp.control.McColumn");
        //Creating row for proper spacing at the top after fragment
        var oRowForSpace = new mc.ccp.control.McHorizontalLayout({
            height: "25px",
            width: "100%",
            ptop: "5px",
            widths: ["100%"],
            content: [new sap.ui.core.HTML()]
        });
        //Creating page control row to create Expand Collapse Link, Total Text Label, ComboBox, Paginator, Cancel Button, Save Button at header. 
        var oPageControlsRow = this._createPageControlsRow("expandCollapseLinkId", "totalTxtId", "comboBoxId", "paginatorId", "idTopControlsRow", "perPage", oController);
        //Creating date header to render the required number of weeks passed in columnCount property in a row.			
        var oDateHeader = new mc.ccp.control.McDateHeader(this.createId("idDateHeader"),{
            collectionName: "ZCCP_CH_REQ_HEAD_ITEM_NAV",
            columnCount: 9,
            columnColor: 3
        });
        //Creating column header control row to create standard table with 0 row count.		
        var oColumnHeaders = this._createColumnHeaderControlRow('columnHeaderId', oController);
        //Creating row repeater control to show the week wise data	
        var oRowRepeater = this._createRowRepeaterControlRow('rowRepeaterId', oController);
        //Creating row for proper spacing between row repeater control & footer page controls row.
        var oRowForBottomSpace = new mc.ccp.control.McHorizontalLayout({
            height: "25px",
            width: "100%",
            ptop: "5px",
            widths: ["100%"],
            content: [new sap.ui.core.HTML()]
        });
        //Creating page control row to create Expand Collapse Link, Total Text Label, ComboBox, Paginator, Cancel Button, Save Button at footer.
        var oPageControlsRowClone = this._createPageControlsRow("expandCollapseLinkIdCl", "totalTxtIdCl", "comboBoxIdCl", "paginatorIdCl", "idTopControlsRowCl", "perPageCl", oController);
        var oVerticalLayout = new sap.ui.layout.VerticalLayout({
            width: "100%",
            content: [oRowForSpace, oPageControlsRow, oDateHeader, oColumnHeaders, oRowRepeater, oRowForBottomSpace, oPageControlsRowClone]
        });
        //Hide Some Features
        oRowRepeater.onAfterRendering = function() {
        	//logic to set the Expand All /  collapse All text
        	// Step 1 : calculate the number of visible rows
        	var list = this.getParent().getParent().getController()._getVisibleRows();
        	var expandFlag = true;
        	// step 2 : looping on the list to see if any single record has expanded false
        	for (var i = 0; i < list.length; i++) {
				if(list[i].getExpand() === false){
					expandFlag = false;
					break;
				}
			}
        	if(expandFlag === true){
        		// set collapse all
        		this.getParent().getParent().byId('expandCollapseLinkId').setProperty('text', MCAPP.getText('GBL_COLLAPSE_ALL', this));
        		this.getParent().getParent().byId('expandCollapseLinkIdCl').setProperty('text', MCAPP.getText('GBL_COLLAPSE_ALL', this));
        	}else{
        		// set expand all
        		this.getParent().getParent().byId('expandCollapseLinkId').setProperty('text', MCAPP.getText('GBL_EXPAND_ALL', this));
        		this.getParent().getParent().byId('expandCollapseLinkIdCl').setProperty('text', MCAPP.getText('GBL_EXPAND_ALL', this));
        	}
            jQuery.sap.byId(this.getId()).find('.sapUiRrPtb').hide();
            jQuery.sap.byId(this.getId()).find('.sapUiRrStb').hide();
            jQuery.sap.byId(this.getId()).find('.sapUiTbCont').hide();
            jQuery.sap.byId(this.getId()).find('.sapUiRrFtr').hide();
        };
        return oVerticalLayout;
    },
    
    /**
     * method to create the page controls row in the change request page
     * @param expandCollapseLinkId
     * @param totalTxtId
     * @param comboBoxId
     * @param paginatorId
     * @param oController
     * @returns {mc.ccp.control.McHorizontalLayout}
     */
    _createPageControlsRow: function(expandCollapseLinkId, totalTxtId, comboBoxId, paginatorId, idTopControlsRow, idPerPage, oController) {
        var oLinkExpandCollapse = new sap.ui.commons.Link(this.createId(expandCollapseLinkId), {
            text: "{i18n>GBL_EXPAND_ALL}"
        });
        oLinkExpandCollapse.attachPress(oController.onPressExpandCollapseAll, oController);
        var oTextViewTotalText = new sap.ui.commons.TextView(this.createId(totalTxtId)).addStyleClass('McCcpVwlabel');
        var oPerPage = new sap.ui.commons.TextView(this.createId(idPerPage)).addStyleClass('McCcpVwlabel');
        var oComboBox = new mc.ccp.control.McComboBox(this.createId(comboBoxId), {
            width: "85px",
            height: "35px",
            selectedKey: "10",
            editable: true,
        });
        oComboBox.attachChange(oController.onChangeDropdown, oController);
        var oPaginator = new mc.ccp.control.McPaginator(this.createId(paginatorId));
        oPaginator.attachPage(oController.onPageNextAndPreviousLink, oController);
        var oCancelButton = new sap.ui.commons.Button({
            text: "{i18n>GBL_CANCEL}",
            height: "35px",
            width: "90px"
        });
        oCancelButton.attachPress(oController.onPressCancel, oController);
        var oSaveButton = new sap.ui.commons.Button({
            text: "{i18n>GBL_SAVE}",
            height: "35px",
            width: "90px"
        });
        oSaveButton.attachPress(oController.onPressSave, oController);
        var oTopControlsRow = new mc.ccp.control.McHorizontalLayout(this.createId(idTopControlsRow),{
            height: "50px",
            width: "100%",
            widths: ["10%", "6%", "8%","5%", "51%", "10%", "10%"],
            content: [oLinkExpandCollapse, oTextViewTotalText, oComboBox, oPerPage, oPaginator, oCancelButton, oSaveButton]
        });
        return oTopControlsRow;
    },
    
    /**
     * method to create the column header row in the change request page
     * @param id
     * @param oController
     * @returns {mc.ccp.control.McTable}
     */
    _createColumnHeaderControlRow: function(id, oController) {
        var oTable = new mc.ccp.control.McTable(this.createId(id), {
            visibleRowCount: 0,
            selectionMode: sap.ui.table.SelectionMode.None,
            columnHeaderVisible: true,
            width: '100%',
        });
        oTable.addStyleClass('dateTable');
        var oColumnEmpty = new mc.ccp.control.McColumn(this.createId('empty'), {
            width: "19%",
            resizable: false,
        });
        oTable.addColumn(oColumnEmpty);
        var oColumnDistSKU = new mc.ccp.control.McColumn(this.createId("distSKUColmId"), {
            label: new sap.ui.commons.Label({
                text: "{i18n>VW_CR_DIST_SKU}"
            }),
            width: "9%",
            resizable: false,
            sortProperty: "Dist_SKU",
            filterProperty: "Dist_SKU"
        });
        oTable.addColumn(oColumnDistSKU);
        var oColumnSKU = new mc.ccp.control.McColumn(this.createId("skUColmId"), {
            label: new sap.ui.commons.Label({
                text: "{i18n>VW_CR_SKU}"
            }),
            width: "9%",
            resizable: false,
            sortProperty: "SKU",
            filterProperty: "SKU"
        });
        oTable.addColumn(oColumnSKU);
        var oColumnDescription = new mc.ccp.control.McColumn(this.createId("skuDescColmId"), {
            label: new sap.ui.commons.Label({
                text: "{i18n>VW_CR_DESC}"
            }),
            width: "18%",
            resizable: false,
            sortProperty: "SKU_Desc",
            filterProperty: "SKU_Desc"
        });
        oTable.addColumn(oColumnDescription);
        var oColumnSalesOrder = new mc.ccp.control.McColumn(this.createId("salesOrdNoColmId"), {
            label: new sap.ui.commons.Label({
                text: "{i18n>VW_CR_SO}"
            }),
            width: "9%",
            resizable: false,
            sortProperty: "Sales_Ord_No",
            filterProperty: "Sales_Ord_No"
        });
        oTable.addColumn(oColumnSalesOrder);
        var oColumnCustomPO = new mc.ccp.control.McColumn(this.createId("customPoColmId"), {
            label: new sap.ui.commons.Label({
                text: "{i18n>VW_CR_CUST_ID}",
                wrapping: true
            }).addStyleClass("sapUiLbl"),
            width: "9%",
            resizable: false,
            sortProperty: "Custom_PO",
            filterProperty: "Custom_PO"
        });
        oTable.addColumn(oColumnCustomPO);
        var oColumnShipTo = new mc.ccp.control.McColumn(this.createId("shipToColmId"), {
            label: new sap.ui.commons.Label({
                text: "{i18n>VW_CR_SHIP_TO}"
            }),
            width: "9%",
            resizable: false,
            sortProperty: "ShipToId",
            filterProperty: "ShipToId"
        });
        oTable.addColumn(oColumnShipTo);
        var oColumnSource = new mc.ccp.control.McColumn(this.createId("sourceNameColmId"), {
            label: new sap.ui.commons.Label({
                text: "{i18n>VW_CR_SOURCE}"
            }),
            width: "9%",
            resizable: false,
            sortProperty: "SourceName",
            filterProperty: "SourceName"
        });
        oTable.addColumn(oColumnSource);
        var oColumnEstTransitDays = new mc.ccp.control.McColumn(this.createId("EstdTransitDaysColmId"), {
            label: new sap.ui.commons.Label({
                text: "{i18n>VW_CR_EST_TRANSIT}"
            }),
            width: "9%",
            resizable: false,
            sortProperty: "EstdTransitDays",
            filterProperty: "EstdTransitDays"
        });
        oTable.addColumn(oColumnEstTransitDays);
        oTable.bindRows('/Items');
        oTable.attachSort(oController.onSortColumn, oController);
        oTable.attachFilter(oController.onFilterColumn, oController);
        return oTable;
    },
    
    /**
     * method to create the data rows in the change request page
     * @param id
     * @param oController
     * @returns {sap.ui.commons.RowRepeater}
     */
    _createRowRepeaterControlRow: function(id, oController) {
        var oChangeRequestCustomTable = new mc.ccp.changereq.control.ChangeRequestItemTable();
        oChangeRequestCustomTable.bindProperty("expand", "expand");
        oChangeRequestCustomTable.bindProperty("dirtyState", "dirtyState");
        oChangeRequestCustomTable.bindProperty("readOnly", "readOnly");
        oChangeRequestCustomTable.bindProperty("readOnlyRole", "readOnlyRole");
        oChangeRequestCustomTable.attachChange(oController.onChangeRecord, oController);
        oChangeRequestCustomTable.attachCollapse(oController.onCollapseRow, oController);
        oChangeRequestCustomTable.attachExpand(oController.onExpandRow, oController);
        oChangeRequestCustomTable.attachPress(oController.onPressSkuLink, oController);
        var oRowRepeater = new sap.ui.commons.RowRepeater(this.createId(id), {
            design: "Standard",
            numberOfRows: 2,
            currentPage: 1,
            rows: {
                path: "/results",
                template: oChangeRequestCustomTable
            }
        });
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("distSKUColmId-Asc"), {
            sorter: new sap.ui.model.Sorter("Dist_SKU", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("distSKUColmId-Dsc"), {
            sorter: new sap.ui.model.Sorter("Dist_SKU", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("skUColmId-Asc"), {
            sorter: new sap.ui.model.Sorter("SKU", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("skUColmId-Dsc"), {
            sorter: new sap.ui.model.Sorter("SKU", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("skuDescColmId-Asc"), {
            sorter: new sap.ui.model.Sorter("SKU_Desc", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("skuDescColmId-Dsc"), {
            sorter: new sap.ui.model.Sorter("SKU_Desc", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("salesOrdNoColmId-Asc"), {
            sorter: new sap.ui.model.Sorter("Sales_Ord_No", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("salesordNoColmId-Dsc"), {
            sorter: new sap.ui.model.Sorter("Sales_Ord_No", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("customPoColmId-Asc"), {
            sorter: new sap.ui.model.Sorter("Custom_PO", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("customPoColmId-Dsc"), {
            sorter: new sap.ui.model.Sorter("Custom_PO", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("shipToColmId-Asc"), {
            sorter: new sap.ui.model.Sorter("ShipToId", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("shipToColmId-Dsc"), {
            sorter: new sap.ui.model.Sorter("ShipToId", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("sourceNameColmId-Asc"), {
            sorter: new sap.ui.model.Sorter("SourceName", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("sourceNameColmId-Dsc"), {
            sorter: new sap.ui.model.Sorter("SourceName", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("EstdTransitDaysColmId-Asc"), {
            sorter: new sap.ui.model.Sorter("EstdTransitDays", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("EstdTransitDaysColmId-Dsc"), {
            sorter: new sap.ui.model.Sorter("EstdTransitDays", true)
        }));
        return oRowRepeater;
    }
});