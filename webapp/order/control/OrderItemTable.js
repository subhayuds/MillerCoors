/***
 * @Author CM02
 * @Date 09/01/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is responsible to create the Order Table which is a custom control.
 */
//Required libraries
jQuery.sap.declare('mc.ccp.order.control.OrderItemTable');
jQuery.sap.require("mc.ccp.control.McArrowTextField");
sap.ui.core.Control.extend('mc.ccp.order.control.OrderItemTable', {
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
			},
			'forceRender': {
				type: "boolean",
				defaultValue: false
			},
			'readOnlyRole': {
                type: "boolean",
                defaultValue: false
            },
		},
		aggregations: {
			skuLink: {
				type: "sap.ui.commons.Link",
				multiple: false,
				visibility: "public"
			},
			ordQty: {
				type: "mc.ccp.control.McArrowTextField",
				multiple: false,
				visibility: "public"
			},
			expColpsImg: {
				type: "sap.ui.commons.Image",
				multiple: false,
				visibility: "public"
			},
			frctQty1: {
				type: "mc.ccp.control.McArrowTextField",
				multiple: false,
				visibility: "public"
			},
			frctQty2: {
				type: "mc.ccp.control.McArrowTextField",
				multiple: false,
				visibility: "public"
			},
			frctQty3: {
				type: "mc.ccp.control.McArrowTextField",
				multiple: false,
				visibility: "public"
			},
			frctQty4: {
				type: "mc.ccp.control.McArrowTextField",
				multiple: false,
				visibility: "public"
			},
			frctQty5: {
				type: "mc.ccp.control.McArrowTextField",
				multiple: false,
				visibility: "public"
			},
			frctQty6: {
				type: "mc.ccp.control.McArrowTextField",
				multiple: false,
				visibility: "public"
			},
			frctQty7: {
				type: "mc.ccp.control.McArrowTextField",
				multiple: false,
				visibility: "public"
			}
		},
		events: {
			'change': {},
			'expanded': {},
			'collapsed': {},
			'press': {}
		}
	},
	/**
	 * Called when an OrderItemTable control is instantiated.
	 * It will bind the various oModel aggregation to this custom control.
	 */
	init: function() {
		//For Order Qty Aggregation
		var ordQty = new mc.ccp.control.McArrowTextField();
		ordQty.bindProperty("value", "ZCCP_WEEKSANDQTY_NAV/results/3/OrderedQty");
		ordQty.bindProperty("pallet", "PalletValue");
		ordQty.bindProperty("readOnly", "readOnly");
		this.setAggregation('ordQty', ordQty);
		ordQty.getAggregation("textField").setMaxLength(16);
		//For Forecast Qty's Aggregations
		var noOfWeeks = 9;
		for (var i = 2; i <= noOfWeeks - 1; i++) {
			var frctQtyVar = "frctQty" + (i - 1);
			var frctQty = new mc.ccp.control.McArrowTextField({
				arrows: false
			}).bindProperty("value", "ZCCP_WEEKSANDQTY_NAV/results/" + i + "/DistForecast");
			frctQty.bindProperty("readOnly", "readOnlyRole");
			this.setAggregation(frctQtyVar, frctQty);
			frctQty.getAggregation("textField").setMaxLength(16);
		}
		//For skuLink Aggregation
		var skuLink = new sap.ui.commons.Link({
			arrows: false
		}).bindProperty("text", "SKU");
		this.setAggregation('skuLink', skuLink);
		//For expColpsImg Aggregation
		var expColpsImg = new sap.ui.commons.Image({
			src: 'image/expand.png'
		});
		this.setAggregation('expColpsImg', expColpsImg);
	},
	/***
	 * Is called before rendering the OrderItemTable Control.
	 * This method is used to detach the change and press events on the links and other controls of OrderItemTable.
	 */
	onBeforeRendering: function() {
		var frctQty = "frctQty";
		this.getAggregation('ordQty').detachChange(this.handleChangeOrderQty, this);
		var noOfWeeks = 9;
		for (var i = 1; i < noOfWeeks - 1; i++) {
			this.getAggregation(frctQty + i).detachChange(this.handleChangeForecastQty, this);
		}
		this.getAggregation('skuLink').detachPress(this.handlePressSkuLink, this);
		this.getAggregation('expColpsImg').detachPress(this.handlePressExpColps, this);
	},
	/***
	 * Is called after rendering the OrderItemTable Control.
	 * This method is used to attach the change and press events on the links and other controls of OrderItemTable.
	 */
	onAfterRendering: function() {
		this.getAggregation('ordQty').attachChange(this.handleChangeOrderQty, this);
		var frctQty = "frctQty";
		var noOfWeeks = 9;
		for (var i = 1; i < noOfWeeks - 1; i++) {
			this.getAggregation(frctQty + i).attachChange(this.handleChangeForecastQty, this);
		}
		this.getAggregation('skuLink').attachPress(this.handlePressSkuLink, this);
		this.getAggregation('expColpsImg').attachPress(this.handlePressExpColps, this);
		if (this.getExpand()) {
			this.expand();
		} else {
			this.collapse();
		}
	},
	/***
	 * Is called to render the Order Item Table control.
	 * @param oRm
	 * @param oControl
	 */
	renderer: function(oRm, oControl) {
		oRm.write("<div ");
		oRm.writeControlData(oControl);
		oRm.addStyle("width", oControl.getWidth());
		oRm.writeStyles();
		oRm.writeClasses();
		oRm.write(">");
		oRm.write("<table class='McCcpOrderItemTbl'>");
		oRm.write("<tr class='McCcpOrderItemTblSpaceTr'><td colspan='10'></td></tr>");
		oControl._renderHeaderRow(oRm, oControl);
		var noOfRows = 6;
		for (var i = 1; i < noOfRows; i++) {
			oControl._renderRow(oRm, oControl, i);
		}
		oControl._renderForecastRow(oRm, oControl);
		oRm.write("</table>");
		oRm.write("</div>");
	},
	/***
	 * Is called to render the Header Row. Called with in renderer method.
	 * @param oRm
	 * @param oControl
	 */
	_renderHeaderRow: function(oRm, oControl) {
		oRm.write("<tr class='McCcpOrderItemTblHdrTr'>");
		oRm.write("<td colspan=2>");
		oRm.renderControl(oControl.getAggregation('expColpsImg'));
		oRm.write("</td>");
		oRm.write("<td title ='"+ oControl.getModel().getProperty(oControl.getBindingContext().getPath()).Dist_SKU +"'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).Dist_SKU + "</td>");
		oRm.write("<td>");
		oRm.renderControl(oControl.getAggregation('skuLink'));
		oRm.write("</td>");
		oRm.write("<td title ='"+ oControl.getModel().getProperty(oControl.getBindingContext().getPath()).SKU_Desc +"' colspan=4>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).SKU_Desc + "</td>");
		oRm.write("<td title ='"+ oControl.getModel().getProperty(oControl.getBindingContext().getPath()).ShipToId +"'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).ShipToId + "</td>");
		oRm.write("<td title ='"+ oControl.getModel().getProperty(oControl.getBindingContext().getPath()).SourceName +"'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).SourceName + "</td>");
		oRm.write("<td title ='"+ oControl.getModel().getProperty(oControl.getBindingContext().getPath()).EstdTransitDays +"'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).EstdTransitDays + "</td>");
		oRm.write("</tr>");
	},
	/***
	 * Is called to render the Forecast Row . Called with in renderer method.
	 * @param oRm
	 * @param oControl
	 */
	_renderForecastRow: function(oRm, oControl) {
		var jsonProp = 'DistForecast';
		oRm.write("<tr id=" + (oControl.sId + '-forecast') + " class='McCcpOrderItemTblFrctTr'>");
		oRm.write("<td colspan=2 class='McCcpOrderItemTblLblCol'>" + this.getModel('i18n').getProperty('GBL_DIST_FORECAST') + "</td>");
		oRm.write("<td class='McCcpOrderItemTblDataCol'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_WEEKSANDQTY_NAV/results/0/' + jsonProp) + "</td>");
		oRm.write("<td class='McCcpOrderItemTblDataCol'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_WEEKSANDQTY_NAV/results/1/' + jsonProp) + "</td>");
		var frctQty = "frctQty";
		var noOfWeeks = 9;
		for (var i = 1; i < noOfWeeks - 1; i++) {
			oRm.write("<td class='McCcpOrderItemTblDataCol McCcpOrderItemTblStdHght'>");
			oRm.renderControl(oControl.getAggregation(frctQty + i));
			oRm.write("</td>");
		}
		oRm.write("</tr>");
	},
	/***
	 * Is called to render the rows. Called with in renderer method.
	 * This will create the Suggested, Ordered, Confirmed, Projected DOI and Target DOI rows as per the case.
	 * @param oRm
	 * @param oControl
	 */
	_renderRow: function(oRm, oControl, index) {
		var jsonProp = '';
		var rowLabel = '';
		switch (index) {
		case 1:
			jsonProp = "SuggQty";
			rowLabel = this.getModel('i18n').getProperty('GBL_SUGGESTED');
			break;
		case 2:
			jsonProp = "OrderedQty";
			rowLabel = this.getModel('i18n').getProperty('GBL_ORDERED');
			break;
		case 3:
			jsonProp = "ConfirmQty";
			rowLabel = this.getModel('i18n').getProperty('GBL_CONFIRMED');
			break;
		case 4:
			jsonProp = "ProjDOI";
			rowLabel = this.getModel('i18n').getProperty('GBL_PROJECTED_DOI');
			break;
		case 5:
			jsonProp = "TargDOI";
			rowLabel = this.getModel('i18n').getProperty('GBL_TARGET_DOI');
			break;
		}
		oRm.write("<tr id=" + (oControl.sId + jsonProp) + "  class='McCcpOrderItemTblTr McCcpOrderItemTblStdHght'>");
		oRm.write("<td colspan=2 class='McCcpOrderItemTblLblCol'>" + rowLabel + "</td>");
		var noOfWeeks = 9;
		for (var i = 0; i <= noOfWeeks - 1; i++) {
			if (index == 2) {
				if (oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_WEEKSANDQTY_NAV/results/' + i + '/BlockPrdFlag') == 'X') {
					if (i == 3) {
						oControl.getAggregation('ordQty').setReadOnly(true);
						oRm.write("<td class='McCcpOrderItemTblDataCol McCcpOrderItemTblStdHght'>");
						oRm.renderControl(oControl.getAggregation('ordQty'));
						oRm.write("</td>");
					} else {
						oRm.write("<td class='McCcpOrderItemTblDataCol McCcpOrderItemTblCellProdBlock'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_WEEKSANDQTY_NAV/results/' + i + '/' + jsonProp) + "</td>");
					}
				} else {
					if (i == 3) {
						oRm.write("<td class='McCcpOrderItemTblDataCol McCcpOrderItemTblStdHght' >");
						oRm.renderControl(oControl.getAggregation('ordQty'));
						oRm.write("</td>");
					} else {
						oRm.write("<td class='McCcpOrderItemTblDataCol'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_WEEKSANDQTY_NAV/results/' + i + '/' + jsonProp) + "</td>");
					}
				}
			} 
			else if(index == 4){
				var projDOI = oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_WEEKSANDQTY_NAV/results/' + i + '/' + jsonProp);
				var targDOI = oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_WEEKSANDQTY_NAV/results/' + i + '/TargDOI');
				var absDays = Math.abs(projDOI - targDOI);
				var diffDays = absDays - 5;
                if (diffDays > 0) {
                	oRm.write("<td class='McCcpOrderItemTblDataCol McCcpRed'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_WEEKSANDQTY_NAV/results/' + i + '/' + jsonProp) + "</td>");
                }else{
                	oRm.write("<td class='McCcpOrderItemTblDataCol'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_WEEKSANDQTY_NAV/results/' + i + '/' + jsonProp) + "</td>");
                }
			}
			else {
				oRm.write("<td class='McCcpOrderItemTblDataCol'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_WEEKSANDQTY_NAV/results/' + i + '/' + jsonProp) + "</td>");
			}
		}
		oRm.write("</tr>");
	},
	 doRender : function(){
		 if(this.getForceRender() === true){
			 this.setForceRender(false);
		 }else{
			 this.setForceRender(true);
		 }
	 }
});
/***
 * Is called on change of Order quantity. Setting the dirty state of changed record to true.
 * Also calculation of projected DOI would be done as per the new quantity entered by the user.
 * @param oEvent
 */
mc.ccp.order.control.OrderItemTable.prototype.handleChangeOrderQty = function(oEvent) {
	var changedData = oEvent.getParameter('changed');
	var originalData;
	var bkUpModel = this.getModel('backup');
	if (bkUpModel) {
		originalData = bkUpModel.getProperty(this.getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/3/OrderedQty');
	} else {
		originalData = this.getParent().getParent().getParent().getModel('backup').getProperty(this.getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/3/OrderedQty');
	}
	if (this._isDirty()) {
		this.setDirtyState(true);
	} else {
		this.setDirtyState(false);
	}
	this.fireChange({
		source: 'OrderQty',
		changedData: changedData,
		originalData: originalData,
		dirtyState: this.getDirtyState()
	});
	this._calculateProjectedDOI();
	//this.rerender();
	this.doRender();
};
/***
 * Is called on press of SKU Link.
 * @param oEvent
 */
mc.ccp.order.control.OrderItemTable.prototype.handlePressSkuLink = function(oEvent) {
	this.firePress({
		sku: oEvent.getSource().getProperty('text')
	});
};
/***
 * Is called on change of forecast quantity. Setting the dirty state of changed record to true.
 * Also calculation of projected DOI would be done as per the quantity entered by the user.
 * @param oEvent
 */
mc.ccp.order.control.OrderItemTable.prototype.handleChangeForecastQty = function(oEvent) {
	//Identify the Source control(which Forecast object) into Source
	var source = '';
	for (var key in this.mAggregations) {
		if (this.mAggregations.hasOwnProperty(key)) {
			if (oEvent.getSource().sId == this.mAggregations[key].sId) {
				source = key;
				break;
			}
		}
	}
	var relContextPath = '';
	switch (source) {
	case 'frctQty1':
		relContextPath = "/ZCCP_WEEKSANDQTY_NAV/results/2/DistForecast";
		break;
	case 'frctQty2':
		relContextPath = "/ZCCP_WEEKSANDQTY_NAV/results/3/DistForecast";
		break;
	case 'frctQty3':
		relContextPath = "/ZCCP_WEEKSANDQTY_NAV/results/4/DistForecast";
		break;
	case 'frctQty4':
		relContextPath = "/ZCCP_WEEKSANDQTY_NAV/results/5/DistForecast";
		break;
	case 'frctQty5':
		relContextPath = "/ZCCP_WEEKSANDQTY_NAV/results/6/DistForecast";
		break;
	case 'frctQty6':
		relContextPath = "/ZCCP_WEEKSANDQTY_NAV/results/7/DistForecast";
		break;
	case 'frctQty7':
		relContextPath = "/ZCCP_WEEKSANDQTY_NAV/results/8/DistForecast";
		break;
	}
	var changedData = oEvent.getParameter('changed');
	var originalData;
	var bkUpModel = this.getModel('backup');
	if (bkUpModel) {
		originalData = bkUpModel.getProperty(this.getBindingContext().sPath + relContextPath);
	} else {
		originalData = this.getParent().getParent().getParent().getModel('backup').getProperty(this.getBindingContext().sPath + relContextPath);
	}
	if (this._isDirty()) {
		this.setDirtyState(true);
	} else {
		this.setDirtyState(false);
	}
	this.fireChange({
		source: source,
		changedData: changedData,
		originalData: originalData,
		dirtyState: this.getDirtyState()
	});
	this._calculateProjectedDOI();
	//this.rerender();
	this.doRender();
};
/***
 * returns the dirty state of the record.
 */
mc.ccp.order.control.OrderItemTable.prototype._isDirty = function() {
	var changedModel = this.getModel();
	var originalModel = this.getModel('backup');
	if (!originalModel) {
		originalModel = this.getParent().getParent().getParent().getModel('backup');
	}
	if (originalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/3/OrderedQty') == changedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/3/OrderedQty') && originalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/2/DistForecast') == changedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/2/DistForecast') && originalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/3/DistForecast') == changedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/3/DistForecast') && originalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/4/DistForecast') == changedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/4/DistForecast') && originalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/5/DistForecast') == changedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/5/DistForecast') && originalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/6/DistForecast') == changedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/6/DistForecast') && originalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/7/DistForecast') == changedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/7/DistForecast') && originalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/8/DistForecast') == changedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/8/DistForecast')) {
		return false;
	} else {
		return true;
	}
};
/***
 * Is called to set the expand collapse image on click of the expand/Collapse img link.
 * If user clicks on expand, forecast row would be displayed else its display would be hidden.
 * @param oEvent
 */
mc.ccp.order.control.OrderItemTable.prototype.handlePressExpColps = function(oEvent) {
	if (this.getExpand()) {
		jQuery.sap.byId(this.getId()).find('tr#' + this.getId() + '-forecast').hide();
		this.setExpand(false);
		this.getAggregation('expColpsImg').setSrc('image/expand.png');
		this.fireCollapsed();
	} else {
		jQuery.sap.byId(this.getId()).find('tr#' + this.getId() + '-forecast').show();
		this.setExpand(true);
		this.getAggregation('expColpsImg').setSrc('image/collapse.png');
		this.fireExpanded();
	}
};
/***
 * Is a method  to change the collapse image to expand image. Also it will display the forecast row.
 * @param oEvent
 */
mc.ccp.order.control.OrderItemTable.prototype.expand = function(oEvent) {
	jQuery.sap.byId(this.getId()).find('tr#' + this.getId() + '-forecast').show();
	this.getAggregation('expColpsImg').setSrc('image/collapse.png');
	this.setExpand(true);
};
/***
 * Is a method to change the expand image to collapse image. Also it will hide the forecast row from OrderItemTable.
 * @param oEvent
 */
mc.ccp.order.control.OrderItemTable.prototype.collapse = function(oEvent) {
	jQuery.sap.byId(this.getId()).find('tr#' + this.getId() + '-forecast').hide();
	this.getAggregation('expColpsImg').setSrc('image/expand.png');
	this.setExpand(false);
};
/***
 * Is called implicitly by the framework to clean up the resource.
 * @param oEvent */
mc.ccp.order.control.OrderItemTable.prototype.exit = function(oEvent) {
	//remove attached non-default event handler   
	this.getAggregation('ordQty').detachChange(this.handleChangeOrderQty, this);
	var frctQty = "frctQty";
	var noOfWeeks = 9;
	for (var i = 1; i < noOfWeeks - 1; i++) {
		this.getAggregation(frctQty + i).detachChange(this.handleChangeForecastQty, this);
	}
	this.getAggregation('skuLink').detachPress(this.handlePressSkuLink, this);
	this.getAggregation('expColpsImg').detachPress(this.handlePressExpColps, this);
};
/***
 * Is called to calculate the projected DOI.
 */
mc.ccp.order.control.OrderItemTable.prototype._calculateProjectedDOI = function() {
	// step 1: getting the row object which has been tapped on Order Create Screen
	var oCurrentRow = this.getModel().getProperty(this.getBindingContext().sPath);

	// step 2: creating on the fly object
	var oData = {"results" : []};
	var numberOfWeeks = oCurrentRow.ZCCP_WEEKSANDQTY_NAV.results.length;
	for(var i=0; i<numberOfWeeks; i++){
		var oCurrentRowItem = oCurrentRow.ZCCP_WEEKSANDQTY_NAV.results[i];
		var beginningInv = 0;
		if(i === 0){
			beginningInv = parseInt(oCurrentRow.BegINV);
		}
		oData.results.push({
			beginningInventory :beginningInv,
			endingInventory : 0,
			projectedDOI : parseInt(oCurrentRowItem.ProjDOI),
			forecastQuantity : parseInt(oCurrentRowItem.DistForecast),
			arrivedQuantity : parseInt(oCurrentRowItem.ArrivedQty),
			intransitShipments : parseInt(oCurrentRowItem.TransitQty),
			plannedShipments : parseInt(oCurrentRowItem.PlannedQty),
			crQuantity : 0,
			currentOrderQuantity : 0,
			orderedQuantity : parseInt(oCurrentRowItem.OrderedQty),
			suggestedQuantity : parseInt(oCurrentRowItem.SuggQty),
			confirmedQuantity : parseInt(oCurrentRowItem.ConfirmQty),
			insOuts : 0
		});
	}
	// step 3: creating on the fly model
	var oOnTheFlyModel = new sap.ui.model.json.JSONModel();
	oOnTheFlyModel.setData(oData);

	oOnTheFlyModel = MCAPP.projectedDOI(oOnTheFlyModel, numberOfWeeks);
	for (var k = 0; k < oOnTheFlyModel.getData().results.length; k++) {
		this.getModel().setProperty(this.getBindingContext().sPath + '/ZCCP_WEEKSANDQTY_NAV/results/' + k + '/ProjDOI', oOnTheFlyModel.getProperty('/results/' + k + '/projectedDOI'));
	}
};