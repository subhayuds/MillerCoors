/***
 * @Author FN31
 * @Date 12/01/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is responsible to create the Shipment Table which is a custom control.
 */
//Required libraries
jQuery.sap.declare('mc.ccp.shipment.control.ShipmentItemTable');
jQuery.sap.require("mc.ccp.control.McArrowTextField");
sap.ui.core.Control.extend('mc.ccp.shipment.control.ShipmentItemTable', {
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
      'dirtyState': {
        type: "boolean",
        defaultValue: false
      },
      'readOnly': {
        type: "boolean",
        defaultValue: false
      }
    },
    aggregations: {
      skuLink: {
        type: "sap.ui.commons.Link",
        multiple: false,
        visibility: "public"
      },
      POD: {
        type: "sap.ui.commons.CheckBox",
        multiple: false,
        visibility: "public",
        checked : false
      },
      expandCollapseImage: {
        type: "sap.ui.commons.Image",
        multiple: false,
        visibility: "public"
      },
    
    },
    events: {
      'change': {},
      'expand': {},
      'collapse': {},
      'press': {}
    }
  },
  
  /**
   * Called when ShipmentItemTable control is instantiated. 
   * It will bind the various oModel properties to this custom control.
   */
  init: function() {
      var expColpsImg = new sap.ui.commons.Image({src: 'image/expand.png'});
      this.setAggregation('expandCollapseImage', expColpsImg);
      var podCheckBox  = new sap.ui.commons.CheckBox({checked: false});
	  this.setAggregation('POD', podCheckBox);
  },
  
  /***
   * Is called before rendering the ShipmentItemTable Control.
   * This method is used to detach the change and press events on the links and other controls of ShipmentItemTable.
   */
  onBeforeRendering: function() {
	  this.getAggregation('POD').detachChange(this.handleChangePOD, this);
      this.getAggregation('expandCollapseImage').detachPress(this.onPressExpandCollapse, this);
  },
  
  /***
   * Is called after rendering the ShipmentItemTable Control.
   * This method is used to attach the change and press events on the links and other controls of ShipmentItemTable.
   */
  onAfterRendering: function() {
	  this.getAggregation('POD').attachChange(this.handleChangePOD, this);
	  this.getAggregation('expandCollapseImage').attachPress(this.onPressExpandCollapse, this);
	  if (this.getExpand()) {
		  this.expand();
	  } else {
		  this.collapse();
	  }
  },
  
  /***
   * Is called to render the Table control.
   * @param oRm
   * @param oControl
   */
  renderer: function(oRm, oControl) {	  
	oRm.write("<div ");
	oRm.writeControlData(oControl); 
	oRm.addStyle("width", oControl.getWidth());  
	//oRm.writeStyles();
	//oRm.writeClasses(); 
	oRm.write(">");	
	oRm.write("<table border=0 height='100%' width='100%' cellpadding='0' cellspacing='0' class='shipmentTable McCcpOrderItemTbl' >");
	oControl._renderShipmentTableRows(oRm, oControl);	
	oControl._renderShowAnalyticsTableRows(oRm, oControl);	
	oRm.write("</table>");
	oRm.write("</div>");
  },

  /***
   * Is called to render the Shipment table records.
   * @param oRm
   * @param oControl
   */
  _renderShipmentTableRows : function(oRm, oControl){
	oRm.write("<tr height='30px' class='shipmentTableTr McCcpOrderItemTblTr'>");
	oRm.write("<td width='3%' class='McCcpTextCenter'>"); oRm.renderControl(oControl.getAggregation('expandCollapseImage')); oRm.write("</td>");
	oRm.write("<td width='9%' class='McCcpPadRight'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).ShipToId + "</td>");
	oRm.write("<td width='8%' class='McCcpPadRight'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).ShipmentNo + "</td>");
	oRm.write("<td width='8%' class='McCcpTextLeft'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).Status_Text + "</td>");
	// POD field	
	oRm.write("<td width='5%' class='McCcpTextCenter'><div style='width:40px;'>");
	
	var statusCode = oControl.getModel().getProperty(oControl.getBindingContext().getPath()).Status_Code;
	if(statusCode === "02"){ // This condition is for status code arrived  
		oControl.mAggregations.POD.mProperties.checked = true;
		oRm.renderControl(oControl.getAggregation('POD')); 
	} else if(statusCode === "04"){ // in-transit.
		oControl.mAggregations.POD.mProperties.checked = false;
		oRm.renderControl(oControl.getAggregation('POD')); 
	}
	
	oRm.write("</div></td>");
	
	oRm.write("<td width='8%' class='McCcpTextLeft'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).SourceName + "</td>");
	oRm.write("<td width='8%' class='McCcpTextLeft'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).CarrierName + "</td>");
	oRm.write("<td width='7%' class='McCcpTextCenter'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).Mode + "</td>");	 
	oRm.write("<td width='8%' class='McCcpTextLeft'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).TruckRailNumber + "</td>");
	oRm.write("<td width='7%' class='McCcpTextCenter'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).ActLoad + "</td>");
	oRm.write("<td width='7%' class='McCcpTextCenter'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).ScheduleShip + "</td>");	
	oRm.write("<td width='7%' class='McCcpTextCenter'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).ActShip + "</td>");
	oRm.write("<td width='7%' class='McCcpTextCenter'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).EstArrival + "</td>");
	oRm.write("<td width='7%' class='McCcpTextCenter'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).ActArrival + "</td>");	 
	oRm.write("</tr>");	  
  },
	  
  /***
   * Is called to render show analytics table records.
   * @param oRm
   * @param oControl
   */
  _renderShowAnalyticsTableRows : function(oRm, oControl){
	  oRm.write("<tr id="+(oControl.sId+'-showanalytics')+" height='30px' style='' class='shipmentTableFrctTr'>");
	  this._calculateAnalytics(oRm, oControl);
	  oRm.write("</tr>");  	  	 
  },
  
  /***
   * Is called to render the rows. Called with in renderer method. 
   * This will create the Dist SKU, SKU, Description, Sales Order, Cust ID/PO, Units and Pallets rows as per the case. 
   * @param oRm
   * @param oControl
   */
  _calculateAnalytics: function(oRm, oControl) {
	  oRm.write("<td colspan=3></td>");
	  oRm.write("<td class='whiteBg' colspan=11>");
	  oRm.write("<table class='McCcpChildTable' border='1' cellpadding='5' width='100%'>");
	  oRm.write("<tr>");
	  
	  oRm.write("<th align='center'>" + this.getModel('i18n').getProperty('VW_SHIPMENT_CHILD_TABLE_DIST_SKU') + "</th>"); 
	  oRm.write("<th align='center'>" + this.getModel('i18n').getProperty('VW_SHIPMENT_CHILD_TABLE_SKU') + "</th>");
	  oRm.write("<th align='center'>" + this.getModel('i18n').getProperty('VW_SHIPMENT_CHILD_TABLE_DESC') + "</th>");
	  oRm.write("<th align='center'>" + this.getModel('i18n').getProperty('VW_SHIPMENT_CHILD_TABLE_SALES_ORDER') + "</th>");
	  oRm.write("<th align='center'>" + this.getModel('i18n').getProperty('VW_SHIPMENT_CHILD_TABLE_CUSTOM_ID_PO') + "</th>");
	  oRm.write("<th align='center'>" + this.getModel('i18n').getProperty('VW_SHIPMENT_CHILD_TABLE_UNITS') + "</th>");
	  oRm.write("<th align='center'>" + this.getModel('i18n').getProperty('VW_SHIPMENT_CHILD_TABLE_PALLETS') + "</th>");
	  
	  oRm.write("</tr>");
	  var items =  oControl.getModel().getProperty(oControl.getBindingContext().getPath()).ZCCP_SHIP_HDR_TO_ITEM_NAV.results;
	  var totalUnits = 0;
	  var totalPallets = 0;
	  for(var i = 0; i<items.length; i++){
		  oRm.write("<tr>");			  
		  oRm.write("<td align='right'> "+ oControl.getModel().getProperty(oControl.getBindingContext().getPath()).ZCCP_SHIP_HDR_TO_ITEM_NAV.results[i].Dist_SKU + "</td>");
		  oRm.write("<td align='right'> "+ oControl.getModel().getProperty(oControl.getBindingContext().getPath()).ZCCP_SHIP_HDR_TO_ITEM_NAV.results[i].SKU + "</td>");
	      oRm.write("<td> "+ oControl.getModel().getProperty(oControl.getBindingContext().getPath()).ZCCP_SHIP_HDR_TO_ITEM_NAV.results[i].SKU_Desc + "</td>");
		  oRm.write("<td align='right'> "+ oControl.getModel().getProperty(oControl.getBindingContext().getPath()).ZCCP_SHIP_HDR_TO_ITEM_NAV.results[i].Sales_Ord_No + "</td>");
		  oRm.write("<td align='right'> "+ oControl.getModel().getProperty(oControl.getBindingContext().getPath()).ZCCP_SHIP_HDR_TO_ITEM_NAV.results[i].Custom_PO + "</td>");
		  oRm.write("<td align='right'> "+ oControl.getModel().getProperty(oControl.getBindingContext().getPath()).ZCCP_SHIP_HDR_TO_ITEM_NAV.results[i].Units + "</td>");
		  oRm.write("<td align='right'> "+ oControl.getModel().getProperty(oControl.getBindingContext().getPath()).ZCCP_SHIP_HDR_TO_ITEM_NAV.results[i].Pallets + "</td>");
		  oRm.write("</tr>");
		  totalUnits = Number(totalUnits)+Number(oControl.getModel().getProperty(oControl.getBindingContext().getPath()).ZCCP_SHIP_HDR_TO_ITEM_NAV.results[i].Units);
		  totalPallets = Number(totalPallets)+Number(oControl.getModel().getProperty(oControl.getBindingContext().getPath()).ZCCP_SHIP_HDR_TO_ITEM_NAV.results[i].Pallets);
	 }
	 oRm.write("<tr><td colspan='4'></td><th align='center'>" + this.getModel('i18n').getProperty('VW_SHIPMENT_CHILD_TABLE_TOTAL') + "</th><th align='right'>" + totalUnits + "</th><th align='right'>"
			 + totalPallets + "</th></tr>");
	 oRm.write("</table>");
	 oRm.write("</td>");
  },
});

/***
 * Is called to maintain the dirty state of the record in oModel.
 */
mc.ccp.shipment.control.ShipmentItemTable.prototype._isDirty = function() {
  var changedModel = this.getModel();
  var originalModel = this.getModel('backup');
  if (!originalModel) { 
    originalModel = this.getParent().getParent().getParent().getModel('backup');
  }
  if (originalModel.getProperty(
		  this.getBindingContext().sPath + '/Status_Code') === changedModel.getProperty(this.getBindingContext().sPath + '/Status_Code')) {
    return false;
  } else {
    return true;
  }
};

/***
 * Is called to set the expand collapse image on click of the expand/Collapse img link. 
 * If user clicks on expand, additional information would be displayed else its display would be hidden.
 * @param oEvent
 */
mc.ccp.shipment.control.ShipmentItemTable.prototype.onPressExpandCollapse = function(oEvent) {
  if (this.getExpand()) {
    jQuery.sap.byId(this.getId()).find('tr#' + this.getId() + '-showanalytics').hide();
    this.setExpand(false);
    this.getAggregation('expandCollapseImage').setSrc('image/expand.png');
    this.fireCollapse();
  } else {
    jQuery.sap.byId(this.getId()).find('tr#' + this.getId() + '-showanalytics').show();
    this.setExpand(true);
    this.getAggregation('expandCollapseImage').setSrc('image/collapse.png');
    this.fireExpand();
  }
};

/***
 * Is called to change the collapse image to expand image. Also it will display the additional information.
 * @param oEvent
 */
mc.ccp.shipment.control.ShipmentItemTable.prototype.expand = function(oEvent) {
  jQuery.sap.byId(this.getId()).find('tr#' + this.getId() + '-showanalytics').show();
  this.getAggregation('expandCollapseImage').setSrc('image/collapse.png');
  this.setExpand(true);
};

/***
 * Is called to change the expand image to collapse image. Also it will hide the additional information.
 * @param oEvent
 */
mc.ccp.shipment.control.ShipmentItemTable.prototype.collapse = function(oEvent) {
  jQuery.sap.byId(this.getId()).find('tr#' + this.getId() + '-showanalytics').hide();
  this.getAggregation('expandCollapseImage').setSrc('image/expand.png');
  this.setExpand(false);
};

/***
 * Is called on change of POD. Setting the dirty state of changed record to true.
 * @param oEvent
 */
mc.ccp.shipment.control.ShipmentItemTable.prototype.handleChangePOD = function(oEvent) {
	var changedData =oEvent.getSource().getProperty("checked");
    if ( changedData === true) {
    	oEvent.getSource().getModel().setProperty(oEvent.getSource().getBindingContext().sPath + '/Status_Code', MCAPP.getText('VW_INV_SHIP_ARRIVED_CODE'));
        oEvent.getSource().getModel().setProperty(oEvent.getSource().getBindingContext().sPath + '/Status_Text', MCAPP.getText('VW_INV_SHIP_ARRIVED'));
        oEvent.getSource().getModel().setProperty(oEvent.getSource().getBindingContext().sPath + '/ProofOfDelivery', "X");
    } else {
        oEvent.getSource().getModel().setProperty(oEvent.getSource().getBindingContext().sPath + '/Status_Code', MCAPP.getText('VW_INV_SHIP_TRANSIT_CODE'));
        oEvent.getSource().getModel().setProperty(oEvent.getSource().getBindingContext().sPath + '/Status_Text', MCAPP.getText('VW_INV_SHIP_TRANSIT'));
        oEvent.getSource().getModel().setProperty(oEvent.getSource().getBindingContext().sPath + '/ProofOfDelivery', "");
    }

    if (this._isDirty()) {
        this.setDirtyState(true);
    } else {
        this.setDirtyState(false);
    }
    
    this.rerender();
};
