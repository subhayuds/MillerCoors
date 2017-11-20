/***
 * @Author FN31
 * @Date 12/01/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is Shipment view
 */
sap.ui.jsview("mc.ccp.shipment.Shipment", {
	
    /** Specifies the Controller belonging to this View. 
     * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
     * @memberOf Shipment.Shipment
     */
    getControllerName: function() {
        return "mc.ccp.shipment.Shipment";
    },
    
    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf Shipment.Shipment
     */
    createContent: function(oController) {
        //Required Library
        jQuery.sap.require("mc.ccp.shipment.control.ShipmentItemTable");
        jQuery.sap.require("mc.ccp.control.McDateHeader");
        jQuery.sap.require("mc.ccp.control.McHorizontalLayout");
        jQuery.sap.require("mc.ccp.control.McPaginator");
        jQuery.sap.require("mc.ccp.control.McComboBox");
        jQuery.sap.require("mc.ccp.control.McTable");
        jQuery.sap.require("mc.ccp.control.McColumn");
        //********************************ROW 1***********************************************************		
        var oPageControlsTopRow = this._createPageControlsRow(oController, 'Top');
        //********************************ROW 2***********************************************************			
        var oColumnHeaders = this._createColumnHeaderControlRow('columnHeaderId', oController);
        //********************************ROW 3***********************************************************	
        var oRowRepeater = this._createRowRepeaterControlRow('rowRepeaterId', oController);
        //Hide Some Features
        oRowRepeater.onAfterRendering = function() {
            jQuery.sap.byId(this.getId()).find('.sapUiRrPtb').hide();
            jQuery.sap.byId(this.getId()).find('.sapUiRrStb').hide();
            jQuery.sap.byId(this.getId()).find('.sapUiTbCont').hide();
            jQuery.sap.byId(this.getId()).find('.sapUiRrFtr').hide();
            MCAPP.setBusy(false);
        };
        //********************************ROW 4***********************************************************		
        var oPageControlsBottomRow = this._createPageControlsRow(oController, 'Bottom');
        //************************************************************************************************			
        var oVerticalLayout = new sap.ui.layout.VerticalLayout({
            content: [oPageControlsTopRow, oColumnHeaders, oRowRepeater, oPageControlsBottomRow]
        });
        return oVerticalLayout;
    },
    
    /**
     * method to create the page controls row in the Shipment page
     * @param oController
     * @param pos
     * @returns {mc.ccp.control.McHorizontalLayout}
     */
    _createPageControlsRow: function(oController, pos) {
        var oExpandCollapseLink = new sap.ui.commons.Link(this.createId('expandCollapseLinkId' + pos), {
            text: "{i18n>GBL_EXPAND_ALL}"
        });
        oExpandCollapseLink.attachPress(oController.onPressExpandCollapseAll, oController);
        var oTotalText = new sap.ui.commons.TextView(this.createId('totalTxtId' + pos)).addStyleClass('McCcpOrderVwLabel');
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
        var oTopControlsRow = new mc.ccp.control.McHorizontalLayout({
            height: "50px",
            width: "100%",
            ptop: "5px",
            widths: ["10%", "10%", "15%", "45%", "10%", "10%"],
            content: [oExpandCollapseLink, oComboBox, oTotalText, oPaginator, oCancelButton, oSaveButton]
        });
        return oTopControlsRow;
    },
    
    /**
     * method to create the row repeater row in the Shipment page
     * @param id
     * @param oController
     * @returns {sap.ui.commons.RowRepeater}
     */
    _createRowRepeaterControlRow: function(id, oController) {
        var oShipmentCustomTable = new mc.ccp.shipment.control.ShipmentItemTable();
        oShipmentCustomTable.bindProperty("expand", "expand");
        oShipmentCustomTable.bindProperty("dirtyState", "dirtyState");
        oShipmentCustomTable.bindProperty("readOnly", "readOnly");
        oShipmentCustomTable.attachChange(oController.onChangeRecord, oController);
        oShipmentCustomTable.attachExpand(oController.expand, oController);
        oShipmentCustomTable.attachCollapse(oController.collapse, oController);
        var oRowRepeater = new sap.ui.commons.RowRepeater(this.createId(id), {
            design: "Standard",
            numberOfRows: 2,
            currentPage: 1,
            rows: {
                path: "/results",
                template: oShipmentCustomTable
            }
        });
       
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter("shpto-Asc", {
            sorter: new sap.ui.model.Sorter("ShipToId", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter("shpto-Dsc", {
            sorter: new sap.ui.model.Sorter("ShipToId", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter("shipment-Asc", {
            sorter: new sap.ui.model.Sorter("ShipmentNo", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter("shipment-Dsc", {
            sorter: new sap.ui.model.Sorter("ShipmentNo", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter("status-Asc", {
            sorter: new sap.ui.model.Sorter("Status_Text", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter("status-Dsc", {
            sorter: new sap.ui.model.Sorter("Status_Text", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter("source-Asc", {
            sorter: new sap.ui.model.Sorter("SourceName", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter("source-Dsc", {
            sorter: new sap.ui.model.Sorter("SourceName", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter("carrier-Asc", {
            sorter: new sap.ui.model.Sorter("CarrierName", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter("carrier-Dsc", {
            sorter: new sap.ui.model.Sorter("CarrierName", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter("mode-Asc", {
            sorter: new sap.ui.model.Sorter("Mode", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter("mode-Dsc", {
            sorter: new sap.ui.model.Sorter("Mode", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter("truck_rail-Asc", {
            sorter: new sap.ui.model.Sorter("TruckRailNumber", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter("truck_rail-Dsc", {
            sorter: new sap.ui.model.Sorter("TruckRailNumber", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter("act_load-Asc", {
            sorter: new sap.ui.model.Sorter("ActLoad", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter("act_load-Dsc", {
            sorter: new sap.ui.model.Sorter("ActLoad", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter("scheduleship-Asc", {
            sorter: new sap.ui.model.Sorter("ScheduleShip", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter("scheduleship-Dsc", {
            sorter: new sap.ui.model.Sorter("ScheduleShip", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter("actship-Asc", {
            sorter: new sap.ui.model.Sorter("ACT_SHIP", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter("actship-Dsc", {
            sorter: new sap.ui.model.Sorter("ACT_SHIP", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter("estarrival-Asc", {
            sorter: new sap.ui.model.Sorter("EstArrival", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter("estarrival-Dsc", {
            sorter: new sap.ui.model.Sorter("EstArrival", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter("actarrival-Asc", {
            sorter: new sap.ui.model.Sorter("ActArrival", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter("actarrival-Dsc", {
            sorter: new sap.ui.model.Sorter("ActArrival", true)
        }));
        
        return oRowRepeater;
    },
    
    /**
     * method to create the column header row in the Shipment page
     * @param id
     * @param oController
     * @returns {mc.ccp.control.McTable}
     */
    _createColumnHeaderControlRow: function(id, oController) {
       //creating table headers
    	var oTable = new mc.ccp.control.McTable(this.createId("shipTable"),{			
			visibleRowCount: 0,			
			selectionMode: sap.ui.table.SelectionMode.None,			
			columnHeaderVisible : true,
			width : '101.4%',
					
		});
		oTable.addStyleClass('dateTable');
		
		var oColumnEmpty = new mc.ccp.control.McColumn(this.createId('empty'), {
			label: new sap.ui.commons.Label({text: ''}),
			width: "3%"
		});	
		oTable.addColumn(oColumnEmpty);
		
		var oColumnShipTo = new mc.ccp.control.McColumn('shpto', {
			label: new sap.ui.commons.Label({text: "{i18n>VW_SHIPMENT_MAIN_TABLE_SHIP_TO}"}),
			sortProperty: "ShipToId",
			filterProperty: "ShipToId",
			width: "9%"
		});	
		oTable.addColumn(oColumnShipTo);
		
		var oColumnShipemntNo = new mc.ccp.control.McColumn('shipment',{
			label: new sap.ui.commons.Label({text: "{i18n>VW_SHIPMENT_MAIN_TABLE_SHIPMENT}"}),
			sortProperty: "ShipmentNo",
			filterProperty: "ShipmentNo",
			width: "8.2%"
		});	
		oTable.addColumn(oColumnShipemntNo);
		
		var oColumnStatusText = new mc.ccp.control.McColumn('status',{
			label: new sap.ui.commons.Label({text: "{i18n>VW_SHIPMENT_MAIN_TABLE_STATUS}"}),			
			sortProperty: "Status_Text",
			filterProperty: "Status_Text",
			width: "8%"
		});	
		oTable.addColumn(oColumnStatusText);
				
		var oColumnPod = new mc.ccp.control.McColumn('pod',{
			label: new sap.ui.commons.Label({text: "{i18n>VW_SHIPMENT_MAIN_TABLE_POD}"}),			
			width: "5%"
		});	
		oTable.addColumn(oColumnPod);
		
		var oColumnSourceName = new mc.ccp.control.McColumn('source',{
			label: new sap.ui.commons.Label({text: "{i18n>VW_SHIPMENT_MAIN_TABLE_SOURCE}"}),			
			sortProperty: "SourceName",
			filterProperty: "SourceName",
			width: "8%"
		});	
		oTable.addColumn(oColumnSourceName);
		
		var oColumnCarrierName = new mc.ccp.control.McColumn('carrier',{
			label: new sap.ui.commons.Label({text: "{i18n>VW_SHIPMENT_MAIN_TABLE_CARRIER}"}),			
			sortProperty: "CarrierName",
			filterProperty: "CarrierName",
			width: "8%"
		});	
		oTable.addColumn(oColumnCarrierName);

		var oColumnMode = new mc.ccp.control.McColumn('mode',{
			label: new sap.ui.commons.Label({text: "{i18n>VW_SHIPMENT_MAIN_TABLE_MODE}"}),			
			sortProperty: "Mode",
			filterProperty: "Mode",
			width: "7%"
		});	
		oTable.addColumn( oColumnMode);
		
		var oColumnTruckRailNumber = new mc.ccp.control.McColumn('truck_rail',{
			label: new sap.ui.commons.Label({text: "{i18n>VW_SHIPMENT_MAIN_TABLE_TRUCK_RAIL_NO}"}),			
			sortProperty: "TruckRailNumber",
			filterProperty: "TruckRailNumber",
			width: "8.5%"
		});	
		oTable.addColumn(oColumnTruckRailNumber);
		
		var oColumnActLoad = new mc.ccp.control.McColumn('act_load',{
			label: new sap.ui.commons.Label({text: "{i18n>VW_SHIPMENT_MAIN_TABLE_ACT_LOAD}"}),			
			sortProperty: "ActLoad",
			filterProperty: "ActLoad",
			width: "7%"
		});			
		oTable.addColumn(oColumnActLoad);
		
		var oColumnScheduleShip = new mc.ccp.control.McColumn('scheduleship',{
			label: new sap.ui.commons.Label({text: "{i18n>VW_SHIPMENT_MAIN_TABLE_SCHED_SHIP}"}),			
			sortProperty: "ScheduleShip",
			filterProperty: "ScheduleShip",
			width: "7%"
		});	
		oTable.addColumn(oColumnScheduleShip);
		
		var oColumnActShip = new mc.ccp.control.McColumn('actship',{
			label: new sap.ui.commons.Label({text: "{i18n>VW_SHIPMENT_MAIN_TABLE_ACT_SHIP}"}),			
			sortProperty: "ACT_SHIP",
			filterProperty: "ACT_SHIP",
			width: "7%"
		});	
		oTable.addColumn(oColumnActShip);
		
		var oColumnEstArrival = new mc.ccp.control.McColumn('estarrival',{
			label: new sap.ui.commons.Label({text: "{i18n>VW_SHIPMENT_MAIN_TABLE_EST_ARRIVAL}"}),			
			sortProperty: "EstArrival",
			filterProperty: "EstArrival",
			width: "7%"
		});	
		oTable.addColumn(oColumnEstArrival);
		
		var oColumnActArrival = new mc.ccp.control.McColumn('actarrival',{
			label: new sap.ui.commons.Label({text: "{i18n>VW_SHIPMENT_MAIN_TABLE_ACT_ARRIVAL}"}),			
			sortProperty: "ActArrival",
			filterProperty: "ActArrival",
			width: "7%"
		});	
		oTable.addColumn(oColumnActArrival);
		
		oTable.bindRows('/results');
		oTable.attachSort(oController.onSortColumn, oController);
		oTable.attachFilter(oController.onFilterColumn, oController);
		
		return oTable;
    }
});
