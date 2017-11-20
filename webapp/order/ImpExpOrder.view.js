/***
 * @Author OD79
 * @Date 11/20/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is responsible to create the Import / Export Order View.
 */
sap.ui.jsview("mc.ccp.order.ImpExpOrder", {
    /** Specifies the Controller belonging to this View. 
     * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
     * @memberOf order.ImpExpOrder
     */
    getControllerName: function() {
        return "mc.ccp.order.ImpExpOrder";
    },
    
    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf order.ImpExpOrder
     */
    createContent: function(oController) {
        //Including Required Libraries of custom control
        jQuery.sap.require("mc.ccp.order.control.ImpExpOrderItemTable");
        jQuery.sap.require("mc.ccp.control.McDateHeader");
        jQuery.sap.require("mc.ccp.control.McHorizontalLayout");
        jQuery.sap.require("mc.ccp.control.McPaginator");
        jQuery.sap.require("mc.ccp.control.McComboBox");
        jQuery.sap.require("mc.ccp.control.McTable");
        jQuery.sap.require("mc.ccp.control.McColumn");
        jQuery.sap.require("mc.ccp.control.McDialog");
        //Creating vehicle estimator link & custom ID/PO row		
        var oVehicleCustomIdRow = this._createVehicleCustomIdRow(oController);
        //Creating page control row to create Expand Collapse Link, Total Text Label, ComboBox, Paginator, Cancel Button, Save Button at top.		
        var oPageControlsTopRow = this._createPageControlsRow(oController, 'Top');
        //Creating date header to render the required number of weeks passed in columnCount property in a row.			
        var oDateHeader = new mc.ccp.control.McDateHeader(this.createId("idDateHeader"),{
            collectionName: "ZCCP_ORD_CR_HEAD_ITM_NAV",
            columnColor: 15,
            columnCount: 13,
            firstColumnWidth: "7"
        });
        //Creating column header control row to create Mc table with 0 row count.			
        var oColumnHeader = this._createColumnHeaderControlRow('columnHeaderId', oController);
        //Creating row repeater control to show the week wise data	
        var oRowRepeater = this._createRowRepeaterControlRow('rowRepeaterId', oController);
        //Hide Standard  Features like sort and paginator etc
        oRowRepeater.onAfterRendering = function() {
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
        		this.getParent().getParent().byId('expandCollapseLinkIdTop').setProperty('text', MCAPP.getText('GBL_COLLAPSE_ALL', this));
        		this.getParent().getParent().byId('expandCollapseLinkIdBottom').setProperty('text', MCAPP.getText('GBL_COLLAPSE_ALL', this));
        	}else{
        		// set expand all
        		this.getParent().getParent().byId('expandCollapseLinkIdTop').setProperty('text', MCAPP.getText('GBL_EXPAND_ALL', this));
        		this.getParent().getParent().byId('expandCollapseLinkIdBottom').setProperty('text', MCAPP.getText('GBL_EXPAND_ALL', this));
        	}
            jQuery.sap.byId(this.getId()).find('.sapUiRrPtb').hide();
            jQuery.sap.byId(this.getId()).find('.sapUiRrStb').hide();
            jQuery.sap.byId(this.getId()).find('.sapUiTbCont').hide();
            jQuery.sap.byId(this.getId()).find('.sapUiRrFtr').hide();
            MCAPP.setBusy(false);
        };
        //Creating page control row to create Expand Collapse Link, Total Text Label, ComboBox, Paginator, Cancel Button, Save Button at bottom.		
        var oPageControlsBottomRow = this._createPageControlsRow(oController, 'Bottom');
        //Creating vertical layout to add all the rows object as its content created above.			
        var oVerticalLayout = new sap.ui.layout.VerticalLayout({
            content: [oVehicleCustomIdRow, oPageControlsTopRow, oDateHeader, oColumnHeader, oRowRepeater, oPageControlsBottomRow]
        });
        return oVerticalLayout;
    },
    
    /**
     * method to create the links row in the order page
     * @param oController
     * @returns {mc.ccp.control.McHorizontalLayout}
     */
    _createVehicleCustomIdRow: function(oController) {
        var oVehicleEstimatorLink = new sap.ui.commons.Link({
            text: "{i18n>VW_IMPORT_ORD_SEE_CURRENT_VEHICLE_ESTIMATOR}",
            tooltip: "{i18n>VW_IMPORT_ORD_SEE_CURRENT_VEHICLE_ESTIMATOR}",
        });
        oVehicleEstimatorLink.attachPress(oController.onPressVehicleEstimator, oController);
        var oCustomIdPoLink = new sap.ui.commons.Link({
            text: "{i18n>VW_IMPORT_ORD_ADD_CUSTOM_ID_PO}",
            tooltip: "{i18n>VW_IMPORT_ORD_ADD_CUSTOM_ID_PO}"
        });
        oCustomIdPoLink.attachPress(oController.onPressAddCustomIdPO, oController);
        var oLinksRow = new mc.ccp.control.McHorizontalLayout(this.createId("idVehicleCustIdRow"),{
            height: "25px",
            width: "100%",
            ptop: "5px",
            widths: ["50%", "30%", "20%"],
            content: [new sap.ui.core.HTML(), oVehicleEstimatorLink, oCustomIdPoLink]
        });
        return oLinksRow;
    },
    
    /**
     * method to create the page controls row in the order page
     * @param oController
     * @param position
     * @returns {mc.ccp.control.McHorizontalLayout}
     */
    _createPageControlsRow: function(oController, position) {
        var oExpandCollapseLink = new sap.ui.commons.Link(this.createId('expandCollapseLinkId' + position), {
            text: "{i18n>GBL_EXPAND_ALL}"
        });
        oExpandCollapseLink.attachPress(oController.onPressExpandCollapseAll, oController);
        var oTotalText = new sap.ui.commons.TextView(this.createId('totalTxtId' + position)).addStyleClass('McCcpVwlabel');
        var oPerPage = new sap.ui.commons.TextView(this.createId('perPage' + position)).addStyleClass('McCcpVwlabel');
        var oComboBox = new mc.ccp.control.McComboBox(this.createId('comboBoxId' + position), {
            width: "85px",
            height: "35px",
            selectedKey: "10",
            editable: true,
        });
        oComboBox.attachChange(oController.onChangeDropdown, oController);
        var oPaginator = new mc.ccp.control.McPaginator(this.createId('paginatorId' + position), {
            showSave: true
        });
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
        var oTopControlsRow = new mc.ccp.control.McHorizontalLayout(this.createId('idPageControlsRow' + position),{
            height: "50px",
            width: "100%",
            ptop: "5px",
            widths: ["10%", "6%", "8%", "11%", "45%", "10%", "10%"],
            content: [oExpandCollapseLink, oTotalText,oComboBox, oPerPage, oPaginator, oCancelButton, oSaveButton]
        });
        return oTopControlsRow;
    },
    
    /**
     * method to create the row repeater row in the order page
     * @param id
     * @param oController
     * @returns {sap.ui.commons.RowRepeater}
     */
    _createRowRepeaterControlRow: function(id, oController) {
        var oImpExpOrderItemTable = new mc.ccp.order.control.ImpExpOrderItemTable();
        oImpExpOrderItemTable.bindProperty("expand", "expand");
        oImpExpOrderItemTable.bindProperty("dirtyState", "dirtyState");
        oImpExpOrderItemTable.bindProperty("readOnly", "readOnly");
        oImpExpOrderItemTable.bindProperty("readOnlyRole", "readOnlyRole");
        oImpExpOrderItemTable.attachChange(oController.onChangeRecord, oController);
        oImpExpOrderItemTable.attachExpand(oController.onExpandRow, oController);
        oImpExpOrderItemTable.attachCollapse(oController.onCollapseRow, oController);
        oImpExpOrderItemTable.attachPress(oController.onPressSkuLink, oController);
        var oRowRepeater = new sap.ui.commons.RowRepeater(this.createId(id), {
            design: "Standard",
            numberOfRows: 2,
            currentPage: 1,
            rows: {
                path: "/results",
                template: oImpExpOrderItemTable
            }
        });
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("distSkuColIdIo-Asc"), {
            sorter: new sap.ui.model.Sorter("Dist_SKU", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("distSkuColIdIo-Dsc"), {
            sorter: new sap.ui.model.Sorter("Dist_SKU", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("skuColIdIo-Asc"), {
            sorter: new sap.ui.model.Sorter("SKU", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("skuColIdIo-Dsc"), {
            sorter: new sap.ui.model.Sorter("SKU", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("descColIdIo-Asc"), {
            sorter: new sap.ui.model.Sorter("SKU_Desc", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("descColIdIo-Dsc"), {
            sorter: new sap.ui.model.Sorter("SKU_Desc", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("shipToColIdIo-Asc"), {
            sorter: new sap.ui.model.Sorter("ShipToId", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("shipToColIdIo-Dsc"), {
            sorter: new sap.ui.model.Sorter("ShipToId", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("sourceColIdIo-Asc"), {
            sorter: new sap.ui.model.Sorter("SourceId", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("sourceColIdIo-Dsc"), {
            sorter: new sap.ui.model.Sorter("SourceId", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("transitColIdIo-Asc"), {
            sorter: new sap.ui.model.Sorter("EstdTransitDays", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("transitColIdIo-Dsc"), {
            sorter: new sap.ui.model.Sorter("EstdTransitDays", true)
        }));
        return oRowRepeater;
    },
    
    /**
     * method to create the column header row in the order page
     * @param id
     * @param oController
     * @returns custom control McTable
     */
    _createColumnHeaderControlRow: function(id, oController) {
        var oTable = new mc.ccp.control.McTable(this.createId(id), {
            visibleRowCount: 0,
            selectionMode: sap.ui.table.SelectionMode.None,
            columnHeaderVisible: true,
            width: '100%',
        });
        var oColumnEmpty = new mc.ccp.control.McColumn(this.createId('empty'), {
            width: "80px",
            resizable: false
        });
        oTable.addColumn(oColumnEmpty);
        var oColumnDistSKU = new mc.ccp.control.McColumn(this.createId('distSkuColIdIo'), {
            label: new sap.ui.commons.Label({
                text: "{i18n>VW_IMPORT_ORD_DIST_SKU}"
            }),
            sortProperty: "Dist_SKU",
            filterProperty: "Dist_SKU",
            width: "82px",
            resizable: false
        });
        oTable.addColumn(oColumnDistSKU);
        var oColumnSKU = new mc.ccp.control.McColumn(this.createId('skuColIdIo'), {
            label: new sap.ui.commons.Label({
                text: "{i18n>VW_IMPORT_ORD_SKU}"
            }),
            sortProperty: "SKU",
            filterProperty: "SKU",
            width: "82px",
            resizable: false
        });
        oTable.addColumn(oColumnSKU);
        var oColumnDescription = new mc.ccp.control.McColumn(this.createId('descColIdIo'), {
            label: new sap.ui.commons.Label({
                text: "{i18n>VW_IMPORT_ORD_DESCRIPTION}"
            }),
            sortProperty: "SKU_Desc",
            filterProperty: "SKU_Desc",
            width: "576px",
            resizable: false
        });
        oTable.addColumn(oColumnDescription);
        var oColumnShipTo = new mc.ccp.control.McColumn(this.createId('shipToColIdIo'), {
            label: new sap.ui.commons.Label({
                text: "{i18n>VW_IMPORT_ORD_SHIP_TO}"
            }),
            sortProperty: "ShipToId",
            filterProperty: "ShipToId",
            width: "82px",
            resizable: false
        });
        oTable.addColumn(oColumnShipTo);
        var oColumnSource = new mc.ccp.control.McColumn(this.createId('sourceColIdIo'), {
            label: new sap.ui.commons.Label({
                text: "{i18n>VW_IMPORT_ORD_SOURCE}"
            }),
            sortProperty: "SourceId",
            filterProperty: "SourceId",
            width: "82px",
            resizable: false
        });
        oTable.addColumn(oColumnSource);
        var oColumnTransit = new mc.ccp.control.McColumn(this.createId('transitColIdIo'), {
            label: new sap.ui.commons.Label({
                text: "{i18n>VW_IMPORT_ORD_TRANSIT}"
            }),
            sortProperty: "EstdTransitDays",
            filterProperty: "EstdTransitDays",
            width: "165px",
            resizable: false
        });
        oTable.addColumn(oColumnTransit);
        oTable.bindRows('/Items');
        oTable.attachSort(oController.onSortColumn, oController);
        oTable.attachFilter(oController.onFilterColumn, oController);
        return oTable;
    }
});