/***
 * @Author DU09
 * @Date 11/12/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is responsible to create the Shipment Table which is a custom control.
 */
//Required libraries
jQuery.sap.declare('mc.ccp.inventory.control.ShipmentTable');
sap.ui.core.Control.extend('mc.ccp.inventory.control.ShipmentTable', {
    metadata: {
        properties: {
            'width': {
                type: 'sap.ui.core.CSSSize',
                group: 'Dimension',
                defaultValue: '100%'
            },
            'height': {
                type: 'sap.ui.core.CSSSize',
                group: 'Dimension',
                defaultValue: '210px'
            },
            'expand': {
                type: "boolean",
                defaultValue: false
            },
        },
        aggregations: {
            expColpsImg: {
                type: "sap.ui.commons.Image",
                multiple: false,
                visibility: "public"
            },
            chkPodStatus: {
                type: "sap.ui.commons.CheckBox",
                multiple: false,
                visibility: "public"
            }
        },
        events: {
            'expanded': {},
            'collapsed': {},
            'press': {}
        }
    },
    
    /**
     * Called when a ShipmentTable control is instantiated.
     */
    init: function() {
        var expColpsImg = new sap.ui.commons.Image({
            src: 'image/expand.png'
        });
        this.setAggregation('expColpsImg', expColpsImg);
        var chkPodStatus = new sap.ui.commons.CheckBox({
            checked: false,
        });
        this.setAggregation('chkPodStatus', chkPodStatus);
    },
    
    /***
     * Is called after rendering the ShipmentTable Control.
     * This method is used to attach the change and press events on the links and other controls of ShipmentTable.
     */
    onAfterRendering: function() {
        this.getAggregation('expColpsImg').attachPress(this._onPressExpandCollapse, this);
        this.getAggregation('chkPodStatus').attachChange(this._handleSelectPodStatusChange, this);
        if (this.getExpand()) {
            this.expand();
        } else {
            this.collapse();
        }
    },
    
    /***
     * Is called before rendering the ShipmentTable Control.
     * This method is used to detach the change and press events on the links and other controls of ShipmentTable.
     */
    onBeforeRendering: function() {
        this.getAggregation('expColpsImg').detachPress(this._onPressExpandCollapse, this);
        this.getAggregation('chkPodStatus').detachChange(this._handleSelectPodStatusChange, this);
    },
    
    /***
     * Is called to render the Table control.
     * @param oRm
     * @param oControl
     */
    renderer: function(oRm, oControl) {
        oRm.write("<div");
        oRm.writeControlData(oControl);
        oRm.addStyle("width", oControl.getWidth());
        oRm.writeStyles();
        oRm.writeClasses();
        oRm.write(">");
        oRm.write("<table width='100%' border=0 cellpadding='0' cellspacing='0' class='McCcpInvShipTable' >");
        oControl._renderHeaderRow(oRm, oControl); //This function is called to render the primary table header
        oRm.write("</table>");
        oRm.write("<div id=" + (oControl.sId + '-shipment') + " class='McCcpScroll'>");
        oRm.write("<table width='70%' class='shpInnerTable'>");
        oControl._renderShipDetailHeader(oRm, oControl); //This function is called to render the secondary table header
        oRm.write("</table>");
        oRm.write("</div>");
        oRm.write("</div>");
    },
    
    /***
     * Is called to render the Primary Table Rows. Called with in renderer method.
     * @param oRm
     * @param oControl
     */
    _renderHeaderRow: function(oRm, oControl) {
        oRm.write("<tr height='30px'>");
        //expColpsImg
        oRm.write("<td class='McCcpCenter' width='2%'>");
        oRm.renderControl(oControl.getAggregation('expColpsImg'));
        oRm.write("</td>");
        oRm.write("<td class='McColRightAlign' width='8%'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).ShipToId + "</td>");
        oRm.write("<td class='McColRightAlign' width='8%'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).ShipmentNo + "</td>");
        if (oControl.getModel().getProperty(oControl.getBindingContext().getPath()).Status_Code === MCAPP.getText('VW_INV_SHIP_PLANNED_CODE')) {
            oRm.write("<td class='McColNumLeftAlign' width='7%'>" + MCAPP.getText('VW_INV_SHIP_PLANNED') + "</td>");
        } else if (oControl.getModel().getProperty(oControl.getBindingContext().getPath()).Status_Code === MCAPP.getText('VW_INV_SHIP_TRANSIT_CODE')) {
            oRm.write("<td class='McColNumLeftAlign' width='7%'>" + MCAPP.getText('VW_INV_SHIP_TRANSIT') + "</td>");
        } else if (oControl.getModel().getProperty(oControl.getBindingContext().getPath()).Status_Code === MCAPP.getText('VW_INV_SHIP_ARRIVED_CODE')) {
            oRm.write("<td class='McColNumLeftAlign' width='7%'>" + MCAPP.getText('VW_INV_SHIP_ARRIVED') + "</td>");
            oControl.mAggregations.chkPodStatus.mProperties.checked = true;
        }
        if (oControl.getModel().getProperty(oControl.getBindingContext().getPath()).Status_Code === MCAPP.getText('VW_INV_SHIP_PLANNED_CODE')) {
            oRm.write("<td width='7%'></td>");
        } else {
            oRm.write("<td class='McCcpCenter' width='7%'>");
            oRm.renderControl(oControl.getAggregation('chkPodStatus'));
            oRm.write("</td>");
        }
        oRm.write("<td class='McColNumLeftAlign' width='7%'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).SourceName + "</td>");
        oRm.write("<td class='McColNumLeftAlign' width='7%'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).CarrierName + "</td>");
        oRm.write("<td class='McColNumLeftAlign' width='7%'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).Mode + "</td>");
        oRm.write("<td class='McColNumLeftAlign' width='8%'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).TruckRailNumber + "</td>");
        oRm.write("<td class='McCcpCenter' width='8%'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).ActLoad + "</td>");
        oRm.write("<td class='McCcpCenter' width='8%'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).ScheduleShip + "</td>");
        oRm.write("<td class='McCcpCenter' width='8%'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).ActShip + "</td>");
        oRm.write("<td class='McCcpCenter' width='8%'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).EstArrival + "</td>");
        oRm.write("<td class='McCcpCenter' width='8%'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).ActArrival + "</td>");
        oRm.write("</tr>");
    },
    
    /***
     * Is called to render the Secondary Table Header Row. Called with in renderer method.
     * @param oRm
     * @param oControl
     */
    _renderShipDetailHeader: function(oRm, oControl) {
        oRm.write("<tr >");
        oRm.write("<td class='shipTable'>" + MCAPP.getText("VW_INV_SHIP_DIST_SKU") + "</td>");
        oRm.write("<td class='shipTable'>" + MCAPP.getText("VW_INV_SHIP_SKU") + "</td>");
        oRm.write("<td class='shipTable'>" + MCAPP.getText("VW_INV_SHIP_DESCRIPTION") + "</td>");
        oRm.write("<td class='shipTable'>" + MCAPP.getText("VW_INV_SHIP_SALES_ORDER") + "</td>");
        oRm.write("<td class='shipTable'>" + MCAPP.getText("VW_INV_SHIP_CUSTOM_ID") + "</td>");
        oRm.write("<td class='shipTable'>" + MCAPP.getText("VW_INV_SHIP_UNITS") + "</td>");
        oRm.write("<td class='shipTable'>" + MCAPP.getText("VW_INV_SHIP_PALLETS") + "</td>");
        oRm.write("</tr>");
        var oDetail = oControl.getModel().getProperty(oControl.getBindingContext().getPath()).ZCCP_SHIP_HDR_TO_ITEM_NAV.results.length;
        for (var j = 0; j < oDetail; j++) {
            oControl._renderShipDetailRow(oRm, oControl, j); //This method is called to render the secondary table rows.
        }
    },
    
    /***
     * Is called to render the Secondary Table Row. Called with in _renderShipDetailHeader method.
     * @param oRm
     * @param oControl
     * @param index
     */
    _renderShipDetailRow: function(oRm, oControl, index) {
        var oClickedSKU = oControl.getParent().getParent().getParent().getViewData()[0];
        var oShipSKU = parseInt(oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_SHIP_HDR_TO_ITEM_NAV/results/' + index + '/SKU'));
        if (oClickedSKU === oShipSKU) {
            oControl._renderHighlightShipDetail(oRm, oControl, index); // This method is called to render the secondary table rows for highlighting the current SKU.
        } else {
            oRm.write("<tr class='McCcpShipTableAltBg' height='30px'>");
            oRm.write("<td>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_SHIP_HDR_TO_ITEM_NAV/results/' + index + '/Dist_SKU') + "</td>");
            oRm.write("<td>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_SHIP_HDR_TO_ITEM_NAV/results/' + index + '/SKU') + "</td>");
            oRm.write("<td>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_SHIP_HDR_TO_ITEM_NAV/results/' + index + '/SKU_Desc') + "</td>");
            oRm.write("<td>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_SHIP_HDR_TO_ITEM_NAV/results/' + index + '/Sales_Ord_No') + "</td>");
            oRm.write("<td>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_SHIP_HDR_TO_ITEM_NAV/results/' + index + '/Custom_PO') + "</td>");
            oRm.write("<td>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_SHIP_HDR_TO_ITEM_NAV/results/' + index + '/Units') + "</td>");
            oRm.write("<td>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_SHIP_HDR_TO_ITEM_NAV/results/' + index + '/Pallets') + "</td>");
            oRm.write("</tr>");
        }
    },
    
    /***
     * Is called to render the Secondary Table Row for highlighting the current SKU. Called with in _renderShipDetailRow method.
     * @param oRm
     * @param oControl
     * @param index
     */
    _renderHighlightShipDetail: function(oRm, oControl, index) {
        oRm.write("<tr class='McCcpShipTableAltBg McCcpShipTableHighlight' height='30px'>");
        oRm.write("<td>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_SHIP_HDR_TO_ITEM_NAV/results/' + index + '/Dist_SKU') + "</td>");
        oRm.write("<td>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_SHIP_HDR_TO_ITEM_NAV/results/' + index + '/SKU') + "</td>");
        oRm.write("<td>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_SHIP_HDR_TO_ITEM_NAV/results/' + index + '/SKU_Desc') + "</td>");
        oRm.write("<td>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_SHIP_HDR_TO_ITEM_NAV/results/' + index + '/Sales_Ord_No') + "</td>");
        oRm.write("<td>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_SHIP_HDR_TO_ITEM_NAV/results/' + index + '/Custom_PO') + "</td>");
        oRm.write("<td>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_SHIP_HDR_TO_ITEM_NAV/results/' + index + '/Units') + "</td>");
        oRm.write("<td>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_SHIP_HDR_TO_ITEM_NAV/results/' + index + '/Pallets') + "</td>");
        oRm.write("</tr>");
    }
});

/***
 * Is called on change of the status of the shipment according to POD.
 * @param oEvent
 */
mc.ccp.inventory.control.ShipmentTable.prototype._handleSelectPodStatusChange = function(oEvent) {
    MCAPP.setDirtyFlag(true);
    if (oEvent.getSource().getProperty("checked") === true) {
        var sChngStatus = MCAPP.getText('VW_INV_SHIP_ARRIVED_CODE');
        oEvent.getSource().getModel().setProperty(oEvent.getSource().getBindingContext().sPath + '/Status_Code', sChngStatus);
    } else {
    	MCAPP.setDirtyFlag(false);
        var sBackupStatus = oEvent.getSource().getModel('backupShipment').getProperty(oEvent.getSource().getBindingContext().sPath + '/Status_Code');
        oEvent.getSource().getModel().setProperty(oEvent.getSource().getBindingContext().sPath + '/Status_Code', sBackupStatus);
    }
    this.rerender();
};

/***
 * Is called on press of the expand/collapse icon.
 * @param oEvent
 */
mc.ccp.inventory.control.ShipmentTable.prototype._onPressExpandCollapse = function(oEvent) {
    if (this.getExpand()) {
        jQuery.sap.byId(this.getId()).find('div#' + this.getId() + '-shipment').hide();
        this.setExpand(false);
        this.getAggregation('expColpsImg').setSrc('image/expand.png');
        this.fireCollapsed();
    } else {
        jQuery.sap.byId(this.getId()).find('div#' + this.getId() + '-shipment').show();
        this.setExpand(true);
        this.getAggregation('expColpsImg').setSrc('image/collapse.png');
        this.fireExpanded();
    }
};

/***
 * Is called to expand the secondary table. Called within onPressExpandCollapse method.
 * @param oEvent
 */
mc.ccp.inventory.control.ShipmentTable.prototype.expand = function(oEvent) {
    jQuery.sap.byId(this.getId()).find('div#' + this.getId() + '-shipment').show();
    this.getAggregation('expColpsImg').setSrc('image/collapse.png');
    this.setExpand(true);
};

/***
 * Is called to collapse the secondary table. Called within onPressExpandCollapse method.
 * @param oEvent
 */
mc.ccp.inventory.control.ShipmentTable.prototype.collapse = function(oEvent) {
    jQuery.sap.byId(this.getId()).find('div#' + this.getId() + '-shipment').hide();
    this.getAggregation('expColpsImg').setSrc('image/expand.png');
    this.setExpand(false);
};

/***
 * Is called implicitly whenever the user is navigating away from this screen.
 * @param oEvent
 */
mc.ccp.inventory.control.ShipmentTable.prototype.exit = function(oEvent) {
    //remove attached non-default event handler
    jQuery.sap.log.info('CHECK DESTROY' + this.sId);
};