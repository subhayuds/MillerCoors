/***
 * @Author so97
 * @Date 10/10/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is Forecast view
 */
sap.ui.jsview("mc.ccp.forecast.Forecast", {
    /** Specifies the Controller belonging to this View. 
     * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
     * @memberOf forecast.Forecast
     */
    getControllerName: function() {
        return "mc.ccp.forecast.Forecast";
    },
    
    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf forecast.Forecast
     * @param oController
     */
    createContent: function(oController) {
        //Required Library
        jQuery.sap.require("mc.ccp.forecast.control.ForecastItemTable");
        jQuery.sap.require("mc.ccp.control.McDateHeader");
        jQuery.sap.require("mc.ccp.control.McHorizontalLayout");
        jQuery.sap.require("mc.ccp.control.McPaginator");
        jQuery.sap.require("mc.ccp.control.McComboBox");
        jQuery.sap.require("mc.ccp.control.McTable");
        jQuery.sap.require("mc.ccp.control.McColumn");
        //********************************ROW for empty line space***********************************************************		
        var oEmptyRow = this._createEmptyRow(oController);
        //********************************ROW for page controls for top***********************************************************		
        var oPageControlsRowTop = this._createPageControlsRow(oController, 'Top');
        //********************************ROW for Date Header***********************************************************			
        var oDateHeader = new mc.ccp.control.McDateHeader(this.createId("idDateHeader"),{
            collectionName: "ZCCP_FORE_HEAD_ITEM_NAV",
            columnCount: 9,
            columnColor: 4
        });
        //********************************ROW for column header***********************************************************			
        var oColumnHeader = this._createColumnHeaderControlRow('columnHeaderId', oController);
        //********************************ROW for row repeater***********************************************************	
        var oRowRepeater = this._createRowRepeaterControlRow('rowRepeaterId', oController);
        //********************************ROW for page controls for bottom***********************************************************		
        var oPageControlsRowBottom = this._createPageControlsRow(oController, 'Bottom');
        //Hide Standard  Features like sort and paginator etc
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
        };
        var oVerticalLayout = new sap.ui.layout.VerticalLayout(this.createId("vLayoutForecastId"), {
            content: [oEmptyRow, oPageControlsRowTop, oDateHeader, oColumnHeader, oRowRepeater, oEmptyRow.clone(), oPageControlsRowBottom]
        });
        return oVerticalLayout;
    },
    
    /*
     * This method creates an empty row
     */
    _createEmptyRow: function() {
        var oEmptyRow = new mc.ccp.control.McHorizontalLayout({
            height: "25px",
            width: "100%",
            ptop: "5px",
            widths: ["100%"],
            content: [new sap.ui.core.HTML()]
        });
        return oEmptyRow;
    },
    
    /*
     * This method is called to have the controls in the page
     * like Total number of records, expand all, combo Box for number of records
     * @param oController,pos
     */
    _createPageControlsRow: function(oController, pos) {
    	var enableFlag = false;
        if(MCAPP.isReadOnlyRole() !== true){
        	enableFlag = true;
        }
        var oExpandCollapseLink = new sap.ui.commons.Link(this.createId('expandCollapseLinkId' + pos), {
            text: "{i18n>GBL_EXPAND_ALL}"
        });
        oExpandCollapseLink.attachPress(oController.onPressExpandCollapseAll, oController);
        var oTotalText = new sap.ui.commons.TextView(this.createId('totalTxtId' + pos)).addStyleClass('McCcpVwlabel');
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
        oPaginator.attachPage(oController.onPageSaveAndNavigate, oController);
        var oCancelButton = new sap.ui.commons.Button({
            text: "{i18n>GBL_CANCEL}",
            height: "35px",
            width: "90px"
        });
        oCancelButton.attachPress(oController.onPressCancel, oController);
        var oSaveButton = new sap.ui.commons.Button({
            text: "{i18n>GBL_SAVE}",
            height: "35px",
            width: "90px",
            enabled : enableFlag
        });
        oSaveButton.attachPress(oController.onPressSave, oController);
        var oTopControlsRow = new mc.ccp.control.McHorizontalLayout(this.createId("idPageControlsRow"+pos),{
            height: "50px",
            width: "100%",
            ptop: "5px",
            widths: ["10%", "6%", "8%", "11%", "45%", "10%","10%"],
            content: [oExpandCollapseLink, oTotalText,oComboBox,oPerPage, oPaginator, oCancelButton, oSaveButton]
        });
        return oTopControlsRow;
    },
    
    /*
     * This method returns the row repeater which holds all the data for the page
     * @param id
     * @param oController
     * @returns {sap.ui.commons.RowRepeater}
     */
    _createRowRepeaterControlRow: function(id, oController) {
        var oForecastItemTable = new mc.ccp.forecast.control.ForecastItemTable({
            collectionName: "Items",
            errorState: true
        });
        oForecastItemTable.bindProperty("expand", "expand");
        oForecastItemTable.bindProperty("dirtyState", "dirtyState");
        oForecastItemTable.bindProperty("errorState", "errorState");
        oForecastItemTable.bindProperty("readOnly", "readOnly");
        oForecastItemTable.attachChange(oController.onChangeRecord, oController);
        oForecastItemTable.attachExpand(oController.onExpandedRow, oController);
        oForecastItemTable.attachCollapse(oController.onCollapsedRow, oController);
        var oRowRepeater = new sap.ui.commons.RowRepeater(this.createId(id), {
            design: "Standard",
            numberOfRows: 2,
            currentPage: 1,
            footerPager: new sap.ui.commons.Paginator(this.createId("tmpPaginator")),
            rows: {
                path: "/results",
                template: oForecastItemTable
            }
        });
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("distSkuColIdFr-Asc"), {
            sorter: new sap.ui.model.Sorter("Dist_SKU", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("distSkuColIdFr-Dsc"), {
            sorter: new sap.ui.model.Sorter("Dist_SKU", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("skuColIdFr-Asc"), {
            sorter: new sap.ui.model.Sorter("SKU", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("skuColIdFr-Dsc"), {
            sorter: new sap.ui.model.Sorter("SKU", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("descColIdFr-Asc"), {
            sorter: new sap.ui.model.Sorter("SKU_Desc", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("descColIdFr-Dsc"), {
            sorter: new sap.ui.model.Sorter("SKU_Desc", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("shipToColIdFr-Asc"), {
            sorter: new sap.ui.model.Sorter("ShipToId", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("shipToColIdFr-Dsc"), {
            sorter: new sap.ui.model.Sorter("ShipToId", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("sourceColIdFr-Asc"), {
            sorter: new sap.ui.model.Sorter("SourceName", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("sourceColIdFr-Dsc"), {
            sorter: new sap.ui.model.Sorter("SourceName", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("transitColIdFr-Asc"), {
            sorter: new sap.ui.model.Sorter("EstdTransitDays", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("transitColIdFr-Dsc"), {
            sorter: new sap.ui.model.Sorter("EstdTransitDays", true)
        }));
        return oRowRepeater;
    },
    
    /*
     *
     * method to create the column header row in the order page
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
        oTable.addColumn(new mc.ccp.control.McColumn(this.createId('empty'), {
            width: "19%",
            resizable: false
        }));
        oTable.addColumn(new mc.ccp.control.McColumn(this.createId('distSkuColIdFr'), {
            label: new sap.ui.commons.Label({
                text: "{i18n>VW_FORECAST_DIST_SKU}"
            }),
            sortProperty: "Dist_SKU",
            filterProperty: "Dist_SKU",
            width: "9%",
            resizable: false
        }));
        oTable.addColumn(new mc.ccp.control.McColumn(this.createId('skuColIdFr'), {
            label: new sap.ui.commons.Label({
                text: "{i18n>VW_FORECAST_SKU}"
            }),
            sortProperty: "SKU",
            filterProperty: "SKU",
            width: "9%",
            resizable: false
        }));
        oTable.addColumn(new mc.ccp.control.McColumn(this.createId('descColIdFr'), {
            label: new sap.ui.commons.Label({
                text: "{i18n>VW_FORECAST_DESCRIPTION}"
            }),
            sortProperty: "SKU_Desc",
            filterProperty: "SKU_Desc",
            width: "36%",
            resizable: false
        }));
        oTable.addColumn(new mc.ccp.control.McColumn(this.createId('shipToColIdFr'), {
            label: new sap.ui.commons.Label({
                text: "{i18n>VW_FORECAST_SHIP_TO}"
            }),
            sortProperty: "ShipToId",
            filterProperty: "ShipToId",
            width: "9%",
            resizable: false
        }));
        oTable.addColumn(new mc.ccp.control.McColumn(this.createId('sourceColIdFr'), {
            label: new sap.ui.commons.Label({
                text: "{i18n>VW_FORECAST_SOURCE}"
            }),
            sortProperty: "SourceName",
            filterProperty: "SourceName",
            width: "9%",
            resizable: false
        }));
        oTable.addColumn(new mc.ccp.control.McColumn(this.createId('transitColIdFr'), {
            label: new sap.ui.commons.Label({
                text: "{i18n>VW_FORECAST_EST_TRAN}"
            }),
            sortProperty: "EstdTransitDays",
            filterProperty: "EstdTransitDays",
            width: "9%",
            resizable: false
        }));
        oTable.bindRows('/Items');
        oTable.attachSort(oController.onSortColumn, oController);
        oTable.attachFilter(oController.onFilterColumn, oController);
        return oTable;
    }
});