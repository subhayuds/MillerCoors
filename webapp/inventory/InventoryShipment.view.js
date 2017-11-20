/***
 * @Author DU09
 * @Date 11/12/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is Inventory Shipment View.
 */
sap.ui.jsview("mc.ccp.inventory.InventoryShipment", {
	
    /** Specifies the Controller belonging to this View. 
     * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
     * @memberOf inventory.InventoryShipment
     */
    getControllerName: function() {
        return "mc.ccp.inventory.InventoryShipment";
    },
    
    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf inventory.InventoryShipment
     */
    createContent: function(oController) {
        //Required Library
        jQuery.sap.require("mc.ccp.inventory.control.ShipmentTable");
        jQuery.sap.require("mc.ccp.control.McPaginator");
        jQuery.sap.require("mc.ccp.control.McComboBox");
        jQuery.sap.require("mc.ccp.control.McHorizontalLayout");
        jQuery.sap.require("mc.ccp.control.McTable");
        jQuery.sap.require("mc.ccp.control.McColumn");
        //Creating page control row to create Total Text Label, ComboBox, Paginator 
        var oPageControlsRow = this._createPageControlsRow("totalTxtShipId", "comboBoxShipId", "paginatorShipId", oController);
        //************************************Row1***********************************************			
        var oColumnHeaders = this._getColumnHeaderControl('columnHeaderId', oController);
        //************************************Row2***********************************************	
        var oRowRepeater = this._getRowRepeaterControl('rowRepeaterId', oController);
        //Creating page control row to create Total Text Label, ComboBox, Paginator
        var oPageControlsRowClone = this._createPageControlsRow("totalTxtShipIdCl", "comboBoxShipIdCl", "paginatorShipIdCl", oController);
        var oBlankSpaceLayout = new mc.ccp.control.McHorizontalLayout({
            height: "1px",
            width: "100%",
            widths: ["100%"],
            content: [new sap.ui.core.HTML()]
        });
        //Vertical Layout to display the content of the screen vertically
        var oVerticalLayout = new sap.ui.layout.VerticalLayout({
            width: "100%",
            content: [oPageControlsRow, oBlankSpaceLayout, oColumnHeaders, oRowRepeater, oBlankSpaceLayout, oPageControlsRowClone]
        });
        //Hide Some Features
        oRowRepeater.onAfterRendering = function() {
            jQuery.sap.byId(this.getId()).find('.sapUiRrPtb').hide();
            jQuery.sap.byId(this.getId()).find('.sapUiRrStb').hide();
            jQuery.sap.byId(this.getId()).find('.sapUiTbCont').hide();
            jQuery.sap.byId(this.getId()).find('.sapUiRrFtr').hide();
        };
        return oVerticalLayout;
    },
    
    
    /***
     * method to create the page controls row in the inventory main page
     * @param oController
     * @param id
     * @returns {mc.ccp.control.McHorizontalLayout}
     */
    _createPageControlsRow: function(totalTxtShipId, comboBoxShipId, paginatorShipId, oController) {
        var oTextViewTotalText = new sap.ui.commons.TextView(this.createId(totalTxtShipId)).addStyleClass('McCcpVwlabel');
        var oComboBox = new mc.ccp.control.McComboBox(this.createId(comboBoxShipId), {
            width: "85px",
            height: "35px",
            selectedKey: "10",
            editable: true,
        });
        oComboBox.attachChange(oController.onChangeDropdown, oController);
        var oPaginator = new mc.ccp.control.McPaginator(this.createId(paginatorShipId));
        oPaginator.attachPage(oController.onSaveAndNavigate, oController);
        var oTopControlsRow = new mc.ccp.control.McHorizontalLayout({
            height: "50px",
            width: "100%",
            widths: ["10%", "20%", "70%"],
            content: [oComboBox, oTextViewTotalText, oPaginator]
        });
        return oTopControlsRow;
    },
    
    /**
     * method to create the column header row in the DOI Summary Shipment page
     * @param id
     * @param oController
     * @returns {mc.ccp.control.McTable}
     */
    _getColumnHeaderControl: function(id, oController) {
        var oTable = new mc.ccp.control.McTable(this.createId(id), {
            visibleRowCount: 0,
            selectionMode: sap.ui.table.SelectionMode.None,
            columnHeaderVisible: true,
            width: '100%',
        });
        oTable.addStyleClass('McCcpInvShipTable');
        var oColumn1 = new mc.ccp.control.McColumn(this.createId('empty'), {
            width: "2%"
        });
        oTable.addColumn(oColumn1);
        var oColumn2 = new mc.ccp.control.McColumn(this.createId('invShipToId'), {
            label: new sap.ui.commons.Label({
                text: MCAPP.getText("VW_INV_SHIP_TO")
            }),
            sortProperty: "ShipToId",
            filterProperty: "ShipToId",
            width: "8%"
        });
        oTable.addColumn(oColumn2);
        var oColumn3 = new mc.ccp.control.McColumn(this.createId('shipNumId'), {
            label: new sap.ui.commons.Label({
                text: MCAPP.getText("VW_INV_SHIP_NUM")
            }),
            sortProperty: "ShipmentNo",
            filterProperty: "ShipmentNo",
            width: "8%"
        });
        oTable.addColumn(oColumn3);
        var oColumn4 = new mc.ccp.control.McColumn(this.createId('statusId'), {
            label: new sap.ui.commons.Label({
                text: MCAPP.getText("VW_INV_SHIP_STATUS")
            }),
            sortProperty: "Status_Text",
            filterProperty: "Status_Text",
            width: "7%"
        });
        oTable.addColumn(oColumn4);
        var oColumn5 = new mc.ccp.control.McColumn(this.createId('podId'), {
            label: new sap.ui.commons.Label({
                text: MCAPP.getText("VW_INV_SHIP_POD")
            }),
            sortProperty: "POD",
            filterProperty: "POD",
            width: "7%"
        });
        oTable.addColumn(oColumn5);
        var oColumn6 = new mc.ccp.control.McColumn(this.createId('sourceId'), {
            label: new sap.ui.commons.Label({
                text: MCAPP.getText("VW_INV_SHIP_SOURCE")
            }),
            sortProperty: "SourceName",
            filterProperty: "SourceName",
            width: "7%"
        });
        oTable.addColumn(oColumn6);
        var oColumn7 = new mc.ccp.control.McColumn(this.createId('carrierId'), {
            label: new sap.ui.commons.Label({
                text: MCAPP.getText("VW_INV_SHIP_CARRIER")
            }),
            sortProperty: "CarrierName",
            filterProperty: "CarrierName",
            width: "7%"
        });
        oTable.addColumn(oColumn7);
        var oColumn8 = new mc.ccp.control.McColumn(this.createId('modeId'), {
            label: new sap.ui.commons.Label({
                text: MCAPP.getText("VW_INV_SHIP_MODE")
            }),
            sortProperty: "Mode",
            filterProperty: "Mode",
            width: "7%"
        });
        oTable.addColumn(oColumn8);
        var oColumn9 = new mc.ccp.control.McColumn(this.createId('transportId'), {
            label: new sap.ui.commons.Label({
                text: MCAPP.getText("VW_INV_SHIP_TRANSPORT")
            }).addStyleClass('McCcpNoWrap'),
            sortProperty: "TruckRailNumber",
            filterProperty: "TruckRailNumber",
            width: "8%"
        });
        oTable.addColumn(oColumn9);
        var oColumn10 = new mc.ccp.control.McColumn(this.createId('actLoadId'), {
            label: new sap.ui.commons.Label({
                text: MCAPP.getText("VW_INV_SHIP_ACT_LOAD")
            }).addStyleClass('McCcpNoWrap'),
            sortProperty: "ActLoad",
            filterProperty: "ActLoad",
            width: "8%"
        });
        oTable.addColumn(oColumn10);
        var oColumn11 = new mc.ccp.control.McColumn(this.createId('schdShipId'), {
            label: new sap.ui.commons.Label({
                text: MCAPP.getText("VW_INV_SHIP_SCHD_SHIP")
            }).addStyleClass('McCcpNoWrap'),
            sortProperty: "ScheduledShip",
            filterProperty: "ScheduledShip",
            width: "8%"
        });
        oTable.addColumn(oColumn11);
        var oColumn12 = new mc.ccp.control.McColumn(this.createId('actShipId'), {
            label: new sap.ui.commons.Label({
                text: MCAPP.getText("VW_INV_SHIP_ACT_SHIP")
            }).addStyleClass('McCcpNoWrap'),
            sortProperty: "ActualShip",
            filterProperty: "ActualShip",
            width: "8%"
        });
        oTable.addColumn(oColumn12);
        var oColumn13 = new mc.ccp.control.McColumn(this.createId('estArriveId'), {
            label: new sap.ui.commons.Label({
                text: MCAPP.getText("VW_INV_SHIP_EST_ARRIVAL")
            }).addStyleClass('McCcpNoWrap'),
            sortProperty: "EstArrival",
            filterProperty: "EstArrival",
            width: "8%"
        });
        oTable.addColumn(oColumn13);
        var oColumn14 = new mc.ccp.control.McColumn(this.createId('actArriveId'), {
            label: new sap.ui.commons.Label({
                text: MCAPP.getText("VW_INV_SHIP_ACT_ARRIVAL")
            }).addStyleClass('McCcpNoWrap'),
            sortProperty: "ActArrival",
            filterProperty: "ActArrival",
            width: "8%"
        });
        oTable.addColumn(oColumn14);
        oTable.bindRows('/Items');
        oTable.attachSort(oController.onSortColumn, oController);
        oTable.attachFilter(oController.onFilterColumn, oController);
        return oTable;
    },
    
    /**
     * method to create the row repeater row in the DOI Summary Shipment page
     * @param id
     * @param oController
     * @returns {sap.ui.commons.RowRepeater}
     */
    _getRowRepeaterControl: function(id, oController) {
        var oDetailTable = new mc.ccp.inventory.control.ShipmentTable();
        oDetailTable.bindProperty("expand", "expand");
        var oRowRepeater = new sap.ui.commons.RowRepeater("rowRepeaterId", {
            design: "Standard",
            numberOfRows: 5,
            currentPage: 1,
            rows: {
                path: "/results",
                template: oDetailTable
            }
        });
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("invShipToId-Asc"), {
            sorter: new sap.ui.model.Sorter("ShipToId", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("invShipToId-Dsc"), {
            sorter: new sap.ui.model.Sorter("ShipToId", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("shipNumId-Asc"), {
            sorter: new sap.ui.model.Sorter("ShipmentNo", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("shipNumId-Dsc"), {
            sorter: new sap.ui.model.Sorter("ShipmentNo", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("statusId-Asc"), {
            sorter: new sap.ui.model.Sorter("Status_Text", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("statusId-Dsc"), {
            sorter: new sap.ui.model.Sorter("Status_Text", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("podId-Asc"), {
            sorter: new sap.ui.model.Sorter("POD", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("podId-Dsc"), {
            sorter: new sap.ui.model.Sorter("POD", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("sourceId-Asc"), {
            sorter: new sap.ui.model.Sorter("SourceId", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("sourceId-Dsc"), {
            sorter: new sap.ui.model.Sorter("SourceId", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("carrierId-Asc"), {
            sorter: new sap.ui.model.Sorter("CarrierName", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("carrierId-Dsc"), {
            sorter: new sap.ui.model.Sorter("CarrierName", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("modeId-Asc"), {
            sorter: new sap.ui.model.Sorter("Mode", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("modeId-Dsc"), {
            sorter: new sap.ui.model.Sorter("Mode", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("transportId-Asc"), {
            sorter: new sap.ui.model.Sorter("TruckRailNumber", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("transportId-Dsc"), {
            sorter: new sap.ui.model.Sorter("TruckRailNumber", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("actLoadId-Asc"), {
            sorter: new sap.ui.model.Sorter("ActLoad", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("actLoadId-Dsc"), {
            sorter: new sap.ui.model.Sorter("ActLoad", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("schdShipId-Asc"), {
            sorter: new sap.ui.model.Sorter("ScheduledShip", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("schdShipId-Dsc"), {
            sorter: new sap.ui.model.Sorter("ScheduledShip", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("actShipId-Asc"), {
            sorter: new sap.ui.model.Sorter("ActualShip", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("actShipId-Dsc"), {
            sorter: new sap.ui.model.Sorter("ActualShip", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("estArriveId-Asc"), {
            sorter: new sap.ui.model.Sorter("EstArrival", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("estArriveId-Dsc"), {
            sorter: new sap.ui.model.Sorter("EstArrival", true)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("actArriveId-Asc"), {
            sorter: new sap.ui.model.Sorter("ActArrival", false)
        }));
        oRowRepeater.addSorter(new sap.ui.commons.RowRepeaterSorter(this.createId("actArriveId-Dsc"), {
            sorter: new sap.ui.model.Sorter("ActArrival", true)
        }));
        return oRowRepeater;
    }
});