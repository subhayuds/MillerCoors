/***
 * @Author CM02
 * @Date 09/01/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is Order view
 */
sap.ui.jsview("mc.ccp.order.Order", {
    /** Specifies the Controller belonging to this View. 
     * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
     * @memberOf order.Order
     */
    getControllerName: function() {
    
        return "mc.ccp.order.Order";
    },
    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf order.Order
     */
    createContent: function(oController) {
    	 
        //Required Library
        jQuery.sap.require("mc.ccp.order.control.OrderItemTable");
        jQuery.sap.require("mc.ccp.control.McDateHeader");
        jQuery.sap.require("mc.ccp.control.McHorizontalLayout");
        jQuery.sap.require("mc.ccp.control.McPaginator");
        jQuery.sap.require("mc.ccp.control.McComboBox");
        jQuery.sap.require("mc.ccp.control.McTable");
        jQuery.sap.require("mc.ccp.control.McColumn");
        jQuery.sap.require("mc.ccp.control.McDialog");
        //********************************ROW 1***********************************************************		
        var oVehicleCustIdRow = this._createVehicleCustIdRow(oController);
        //********************************ROW 2***********************************************************		
        var oPageControlsTopRow = this._createPageControlsRow(oController, 'Top');
        //********************************ROW 3***********************************************************	
       // alert('a');
        var oDateheader = new mc.ccp.control.McDateHeader(this.createId("idDateHeader"),{
            collectionName: "ZCCP_WEEKSANDQTY_NAV",
            columnColor: 4
        });
     //   alert('c');
        //********************************ROW 4***********************************************************			
        var oColumnHeaders = this._createColumnHeaderControlRow('columnHeaderId', oController);
        //********************************ROW 5***********************************************************	
        var oRowRepeater = this._createRowRepeaterControlRow('rowRepeaterId', oController);
        //Hide Standard  Features like sort and paginator ect
        oRowRepeater.onAfterRendering = function(oController) {
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
        	//-------------------
            jQuery.sap.byId(this.getId()).find('.sapUiRrPtb').hide();
            jQuery.sap.byId(this.getId()).find('.sapUiRrStb').hide();
            jQuery.sap.byId(this.getId()).find('.sapUiTbCont').hide();
            jQuery.sap.byId(this.getId()).find('.sapUiRrFtr').hide();
            MCAPP.setBusy(false);
        };
        //********************************ROW 6***********************************************************		
        var oPageControlsBottomRow = this._createPageControlsRow(oController, 'Bottom');
        //************************************************************************************************			
        var vLayout = new sap.ui.layout.VerticalLayout({
            content: [oVehicleCustIdRow, oPageControlsTopRow, oDateheader, oColumnHeaders, oRowRepeater, oPageControlsBottomRow]
        });
       
        return vLayout;
    },
    /**
     * method to create the links row in the order page
     * @param oController
     * @returns {mc.ccp.control.McHorizontalLayout}
     */
    _createVehicleCustIdRow: function(oController) {
        var oVehicleEstLink = new sap.ui.commons.Link({
            text: "{i18n>VW_ORD_SEE_CURR_VEHIC_ESTIMTR}",
            tooltip: "{i18n>VW_ORD_SEE_CURR_VEHIC_ESTIMTR}",
        });
        oVehicleEstLink.attachPress(oController.onPressVehicleEst, oController);
        var oCustIdPoLink = new sap.ui.commons.Link({
            text: "{i18n>VW_ORD_ADD_CUST_ID_PO}",
            tooltip: "{i18n>VW_ORD_ADD_CUST_ID_PO}"
        });
        oCustIdPoLink.attachPress(oController.onPressAddCustId, oController);
        var oLinksRow = new mc.ccp.control.McHorizontalLayout(this.createId("idVehicleCustIdRow"),{
            height: "25px",
            width: "100%",
            ptop: "5px",
            widths: ["50%", "30%", "20%"],
            content: [new sap.ui.core.HTML(), oVehicleEstLink, oCustIdPoLink]
        });
        return oLinksRow;
    },
    /**
     * method to create the page controls row in the order page
     * @param oController
     * @param pos
     * @returns {mc.ccp.control.McHorizontalLayout}
     */
    _createPageControlsRow: function(oController, pos) {
        var oExpandCollapseLink = new sap.ui.commons.Link(this.createId('expandCollapseLinkId' + pos), {
            text: "{i18n>GBL_EXPAND_ALL}"
        });
        oExpandCollapseLink.attachPress(oController.onPressExpandCollapseAll, oController);
        var oTotalTxt = new sap.ui.commons.TextView(this.createId('totalTxtId' + pos)).addStyleClass('McCcpVwlabel');
        var oPerPage = new sap.ui.commons.TextView(this.createId('perPage' + pos)).addStyleClass('McCcpVwlabel');
        var oComboBox = new mc.ccp.control.McComboBox(this.createId('comboBoxId' + pos), {
            width: "85px",
            height: "35px",
            selectedKey: "10",
            editable: true,
        });
        oComboBox.attachChange(oController.onChangeDropdown, oController);
        var oPaginator = new mc.ccp.control.McPaginator(this.createId('paginatorId' + pos), {
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
        var oTopContrlsRow = new mc.ccp.control.McHorizontalLayout(this.createId("idPageControlsRow"+pos),{
            height: "50px",
            width: "100%",
            ptop: "5px",
            widths: ["10%", "6%", "8%", "11%", "45%", "10%", "10%"],
            content: [oExpandCollapseLink, oTotalTxt, oComboBox, oPerPage, oPaginator, oCancelButton, oSaveButton]
        });
        return oTopContrlsRow;
    },
    /**
     * method to create the row repeater row in the order page
     * @param id
     * @param oController
     * @returns {sap.ui.commons.RowRepeater}
     */
    _createRowRepeaterControlRow: function(id, oController) {
        var oOrderCustTable = new mc.ccp.order.control.OrderItemTable();
        oOrderCustTable.bindProperty("expand", "expand");
        oOrderCustTable.bindProperty("dirtyState", "dirtyState");
        oOrderCustTable.bindProperty("readOnly", "readOnly");
        oOrderCustTable.bindProperty("readOnlyRole", "readOnlyRole");
        oOrderCustTable.attachChange(oController.onChangeRecord, oController);
        oOrderCustTable.attachExpanded(oController.onExpandedRow, oController);
        oOrderCustTable.attachCollapsed(oController.onCollapsedRow, oController);
        oOrderCustTable.attachPress(oController.onPressSkuLink, oController);
        var oRowRepeater = new sap.ui.commons.RowRepeater(this.createId(id), {
            design: "Standard",
            numberOfRows: 2,
            currentPage: 1,
            rows: {
                path: "/results",
                template: oOrderCustTable
            }
        });
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("distSkuColId-Asc"), {
            sorter: new sap.ui.model.Sorter("Dist_SKU", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("distSkuColId-Dsc"), {
            sorter: new sap.ui.model.Sorter("Dist_SKU", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("skuColId-Asc"), {
            sorter: new sap.ui.model.Sorter("SKU", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("skuColId-Dsc"), {
            sorter: new sap.ui.model.Sorter("SKU", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("descColId-Asc"), {
            sorter: new sap.ui.model.Sorter("SKU_Desc", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("descColId-Dsc"), {
            sorter: new sap.ui.model.Sorter("SKU_Desc", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("shipToColId-Asc"), {
            sorter: new sap.ui.model.Sorter("ShipToId", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("shipToColId-Dsc"), {
            sorter: new sap.ui.model.Sorter("ShipToId", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("sourceColId-Asc"), {
            sorter: new sap.ui.model.Sorter("SourceName", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("sourceColId-Dsc"), {
            sorter: new sap.ui.model.Sorter("SourceName", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("transitColId-Asc"), {
            sorter: new sap.ui.model.Sorter("EstdTransitDays", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("transitColId-Dsc"), {
            sorter: new sap.ui.model.Sorter("EstdTransitDays", true)
        }));
        return oRowRepeater;
    },
    /**
     * method to create the column header row in the order page
     * @param id
     * @param oController
     * @returns {sap.ui.table.Table}
     */
    _createColumnHeaderControlRow: function(id, oController) {    	        	
         var oTable = new mc.ccp.control.McTable(this.createId(id), {
             visibleRowCount: 0,
             selectionMode: sap.ui.table.SelectionMode.None,
             columnHeaderVisible: true,
             width: '100%',
         });
        var oColumn1 = new mc.ccp.control.McColumn(this.createId('empty'), {
            width: "19%",
            resizable: false
        });
        oTable.addColumn(oColumn1);
        var oColumn2 = new mc.ccp.control.McColumn(this.createId('distSkuColId'), {
            label: new sap.ui.commons.Label({
                text: MCAPP.getText('VW_ORD_DISTSKU', this)
            }),
            sortProperty: "Dist_SKU",
            filterProperty: "Dist_SKU",
            width: "9%",
            resizable: false
        });
        oTable.addColumn(oColumn2);
        var oColumn3 = new mc.ccp.control.McColumn(this.createId('skuColId'), {
            label: new sap.ui.commons.Label({
                text: MCAPP.getText('VW_ORD_SKU', this)
            }),
            sortProperty: "SKU",
            filterProperty: "SKU",
            width: "9%",
            resizable: false
        });
        oTable.addColumn(oColumn3);
        var oColumn4 = new mc.ccp.control.McColumn(this.createId('descColId'), {
            label: new sap.ui.commons.Label({
                text: MCAPP.getText('VW_ORD_DESCRIPTION', this)
            }),
            sortProperty: "SKU_Desc",
            filterProperty: "SKU_Desc",
            width: "36%",
            resizable: false
        });
        oTable.addColumn(oColumn4);
        var oColumn5 = new mc.ccp.control.McColumn(this.createId('shipToColId'), {
            label: new sap.ui.commons.Label({
                text: MCAPP.getText('VW_ORD_SHIPTO', this)
            }),
            sortProperty: "ShipToId",
            filterProperty: "ShipToId",
            width: "9%",
            resizable: false
        });
        oTable.addColumn(oColumn5);
        var oColumn6 = new mc.ccp.control.McColumn(this.createId('sourceColId'), {
            label: new sap.ui.commons.Label({
                text: MCAPP.getText('VW_ORD_SOURCE', this)
            }),
            sortProperty: "SourceName",
            filterProperty: "SourceName",
            width: "9%",
            resizable: false
        });
        oTable.addColumn(oColumn6);
        var oColumn7 = new mc.ccp.control.McColumn(this.createId('transitColId'), {
            label: new sap.ui.commons.Label({
                text: MCAPP.getText('VW_ORD_TRANSIT', this)
            }),
            sortProperty: "EstdTransitDays",
            filterProperty: "EstdTransitDays",
            width: "9%",
            resizable: false
        });
        oTable.addColumn(oColumn7);
        oTable.bindRows('/Items');
        oTable.attachSort(oController.onSortColumn, oController);
        oTable.attachFilter(oController.onFilterColumn, oController);
        return oTable;
    }
});