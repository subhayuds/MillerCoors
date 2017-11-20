/***
 * @Author RA03
 * @Date 14-10-2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is Custom Control Table for items in Inventory WorkSheet View.
 */
jQuery.sap.declare('mc.ccp.inventory.control.InventoryWSItemTable');
jQuery.sap.require("mc.ccp.control.McArrowTextField");
jQuery.sap.require("mc.ccp.control.McDialog");
sap.ui.core.Control.extend('mc.ccp.inventory.control.InventoryWSItemTable', {
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
			'expandPriorSales': {
				type: "boolean",
				defaultValue: false
			},
			'dirtyState': {
				type: "boolean",
				defaultValue: false
			},
			'errorState': {
				type: "boolean",
				defaultValue: false
			},
			'readOnly': {
				type: "boolean",
				defaultValue: false
			},
		},
		aggregations: {
			inProgressLink: { // Aggregation for Change Request row editable table cell, when status code from oData service comes '03'
				type: "sap.ui.commons.Link",
				multiple: false,
				visibility: "public"
			},
			plannedQuantityLinkWeek1: { // Aggregations for planned quantity for current week -1 (Week 1)
				type: "sap.ui.commons.Link",
				multiple: false,
				visibility: "public"
			},
			plannedQuantityLinkWeek3: {		// Aggregations for planned quantity for current week +1 (Week 3)
				type: "sap.ui.commons.Link",
				multiple: false,
				visibility: "public"
			},
			inTransitQuantityLink: {
				// Aggregation for transit quantity for current week 
				type: "sap.ui.commons.Link",
				multiple: false,
				visibility: "public"
			},
			insOutsQuantityWeek1: {
				// Aggregating insouts quantity from current week -1 (week1) to current week + 2 (week 4) are editable.
				type: "mc.ccp.control.McArrowTextField",
				multiple: false,
				visibility: "public"
			},
			insOutsQuantityWeek2: {
				type: "mc.ccp.control.McArrowTextField",
				multiple: false,
				visibility: "public"
			},
			insOutsQuantityWeek3: {
				type: "mc.ccp.control.McArrowTextField",
				multiple: false,
				visibility: "public"
			},
			insOutsQuantityWeek4: {
				type: "mc.ccp.control.McArrowTextField",
				multiple: false,
				visibility: "public"
			},
			// Aggregating distForecast quantity from current week +1(week3) to current week + 7 (week 9) are editable.
			distForecastQuantityWeek3: {
				type: "mc.ccp.control.McArrowTextField",
				multiple: false,
				visibility: "public"
			},
			distForecastQuantityWeek4: {
				type: "mc.ccp.control.McArrowTextField",
				multiple: false,
				visibility: "public"
			},
			distForecastQuantityWeek5: {
				type: "mc.ccp.control.McArrowTextField",
				multiple: false,
				visibility: "public"
			},
			distForecastQuantityWeek6: {
				type: "mc.ccp.control.McArrowTextField",
				multiple: false,
				visibility: "public"
			},
			distForecastQuantityWeek7: {
				type: "mc.ccp.control.McArrowTextField",
				multiple: false,
				visibility: "public"
			},
			distForecastQuantityWeek8: {
				type: "mc.ccp.control.McArrowTextField",
				multiple: false,
				visibility: "public"
			},
			distForecastQuantityWeek9: {
				type: "mc.ccp.control.McArrowTextField",
				multiple: false,
				visibility: "public"
			},
			currentOrderedQuantity: {
				type: "mc.ccp.control.McArrowTextField",
				multiple: false,
				visibility: "public"
			},
			changeRequestQuantity: {
				type: "mc.ccp.control.McArrowTextField",
				multiple: false,
				visibility: "public"
			},
			expandCollapseSuggestQuantity: {
				type: "sap.ui.commons.Image",
				multiple: false,
				visibility: "public"
			},
			expandCollapsePriorYearSales: {
				type: "sap.ui.commons.Image",
				multiple: false,
				visibility: "public"
			},
		},
		events: {
			'change': {},
			'expanded': {},
			'collapsed': {},
			'press': {}
		}
	},

	/**
	 * Called when this control is instantiated.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 */
	init: function() {
		// setting Aggregation for current Ordered Quantity.
		var oCurrentOrderedQuantity = new mc.ccp.control.McArrowTextField({});
		oCurrentOrderedQuantity.bindProperty("value", "/InventoryItemsData/3/Current_Ord_Qty");
		oCurrentOrderedQuantity.bindProperty("pallet", "PalletValue");
		oCurrentOrderedQuantity.bindProperty("readOnly", "readOnly");
		this.setAggregation('currentOrderedQuantity', oCurrentOrderedQuantity);
		//Set Maximum length of Arrowtextfield as per gateway as 10
		oCurrentOrderedQuantity.getAggregation("textField").setMaxLength(10);
		
		// setting Aggregation for change request Quantity. 
		var oChangeRequestQuantity = new mc.ccp.control.McArrowTextField({
			value: "{/InventoryItemsData/2/Change_Req_Qty}",
			arrows: false
		});
		oChangeRequestQuantity.bindProperty("pallet", "PalletValue");
		this.setAggregation('changeRequestQuantity', oChangeRequestQuantity);
		this.getAggregation("changeRequestQuantity").getAggregation("textField").setProperty("editable", false);
		//Set Maximum length of Arrowtextfield as per gateway as 10
		oChangeRequestQuantity.getAggregation("textField").setMaxLength(10);
		// setting Aggregation for insouts Quantity from week 1 to week 4. 
		var noOfWeeks = 9;
		for (var i = 0; i <= noOfWeeks - 6; i++) { 
			var sInsOutsQuantityWeek = "insOutsQuantityWeek" + (i + 1);
			var oInsOutsQuantity = new mc.ccp.control.McArrowTextField({
				arrows: false
			}).bindProperty("value", "/InventoryItemsData/" + i + "/Ins_Out");
			this.setAggregation(sInsOutsQuantityWeek, oInsOutsQuantity);
			//Set Maximum length of Arrowtextfield as per gateway as 10
			oInsOutsQuantity.getAggregation("textField").setMaxLength(10);
		}
		// setting Aggregation for distforecast Quantity from week 3 to week 9. 
		for (var i = 2; i <= noOfWeeks-1; i++) { //looping from week2 onwards since forecast quantity for current week -1 (week 1) are non editable.
			var sDistForecastQuantityWeek = "distForecastQuantityWeek" + (i + 1);
			var oDistForecastQuantity = new mc.ccp.control.McArrowTextField({
				arrows: false
			}).bindProperty("value", "/InventoryItemsData/" + i + "/DistForecast");
			this.setAggregation(sDistForecastQuantityWeek, oDistForecastQuantity);
			//Set Maximum length of Arrowtextfield as per gateway as 10
			oDistForecastQuantity.getAggregation("textField").setMaxLength(10);
		}
		// setting Aggregation for planned Quantity.
		var oplannedQuantityLinkWeek1 = new sap.ui.commons.Link({
			arrows: false
		}).bindProperty("text", "/InventoryItemsData/0/PlannedQty");
		this.setAggregation('plannedQuantityLinkWeek1', oplannedQuantityLinkWeek1);
		var oplannedQuantityLinkWeek3 = new sap.ui.commons.Link({
			arrows: false
		}).bindProperty("text", "/InventoryItemsData/2/PlannedQty");
		this.setAggregation('plannedQuantityLinkWeek3', oplannedQuantityLinkWeek3);
		// setting Aggregation for transit Quantity.  
		var oinTransitQuantityLink = new sap.ui.commons.Link({
			arrows: false
		}).bindProperty("text", "/InventoryItemsData/1/TransitQty");
		this.setAggregation('inTransitQuantityLink', oinTransitQuantityLink);
		// setting Aggregation for In Progress Link.
		var oInProgressLink = new sap.ui.commons.Link({
			arrows: false,
			text: MCAPP.getText('VW_INV_WORK_SHEET_ITMTBL_IN_PROG', this)
		});
		this.setAggregation('inProgressLink', oInProgressLink);
		// setting Aggregation for ExpandCollapse Image at the current order quantity data row.  
		var oExpandCollapseSuggestQuantity = new sap.ui.commons.Image({
			src: 'image/expand.png'
		});
		this.setAggregation('expandCollapseSuggestQuantity', oExpandCollapseSuggestQuantity);
		// setting Aggregation for ExpandCollapse Image at the dist forecast data row.
		var oExpandCollapsePriorYearSales = new sap.ui.commons.Image({
			src: 'image/expand.png'
		});
		this.setAggregation('expandCollapsePriorYearSales', oExpandCollapsePriorYearSales);
	},

	/**
	 * Called when the custom control has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 */
	onAfterRendering: function() {
		// attaching change event for ins outs quantity from current week -1 (week1) to current week +2 (week 4) are editable.
		var noOfWeeks = 9;
		for (var i = 0; i <= noOfWeeks - 6; i++) {
			this.getAggregation('insOutsQuantityWeek' + (i + 1)).attachChange(this.handleChangeInsOuts, this);
		}
		// attaching change event for distForecast quantity from current week +1 (week3) to current week +7 (week 9) are editable.
		for (var i = 2; i <= noOfWeeks-1; i++) {
			this.getAggregation('distForecastQuantityWeek' + (i + 1)).attachChange(this.handleChangeInsOuts, this);
		}
		this.getAggregation('currentOrderedQuantity').attachChange(this.handleChangeInsOuts, this);
		this.getAggregation('changeRequestQuantity').attachChange(this.handleChangeInsOuts, this);
		this.getAggregation('plannedQuantityLinkWeek1').attachPress(this.handlePressPlannedShipLink, this);
		this.getAggregation('plannedQuantityLinkWeek3').attachPress(this.handlePressPlannedShipLink, this);
		this.getAggregation('inTransitQuantityLink').attachPress(this.handlePressPlannedShipLink, this);
		this.getAggregation('inProgressLink').attachPress(this.handlePressInprogressLink, this);
		this.getAggregation('expandCollapseSuggestQuantity').attachPress(this.handlePressCurrentOrderExpandAndCollapseImage, this);
		this.getAggregation('expandCollapsePriorYearSales').attachPress(this.handlePressDistForecastExpandAndCollapseImage, this);
		if (this.getExpand()) {
			this.expand();
		}
		else {
			this.collapse();
		}
		if (this.getExpandPriorSales()) {
			this.expandPriorYearSales();
		}
		else {
			this.collapsePriorYearSales();
		}
	},

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the custom control is re-rendered
	 * (NOT before the first rendering! init() is used for that one!).
	 */
	onBeforeRendering: function() {
		// detaching change event for ins outs quantity from current week -1 (week1) to current week +2 (week 4) are editable.
		var noOfWeeks = 9;
		for (var i = 0; i <= noOfWeeks - 6; i++) {
			this.getAggregation('insOutsQuantityWeek' + (i + 1)).detachChange(this.handleChangeInsOuts, this);
		}
		// detaching change event for distForecast quantity from current week +1 (week3) to current week +7 (week 9) are editable.
		for (var i = 2; i <= noOfWeeks-1; i++) {
			this.getAggregation('distForecastQuantityWeek' + (i + 1)).detachChange(this.handleChangeInsOuts, this);
		}
		this.getAggregation('changeRequestQuantity').detachChange(this.handleChangeInsOuts, this);
		this.getAggregation('plannedQuantityLinkWeek1').detachPress(this.handlePressPlannedShipLink, this);
		this.getAggregation('plannedQuantityLinkWeek3').detachPress(this.handlePressPlannedShipLink, this);
		this.getAggregation('inTransitQuantityLink').detachPress(this.handlePressPlannedShipLink, this);
		this.getAggregation('inProgressLink').detachPress(this.handlePressInprogressLink, this);
		this.getAggregation('expandCollapseSuggestQuantity').detachPress(this.handlePressCurrentOrderExpandAndCollapseImage, this);
		this.getAggregation('expandCollapsePriorYearSales').detachPress(this.handlePressDistForecastExpandAndCollapseImage, this);
	},

	/***
	 * Is called to render the Custom Inventory Worksheet Table control.
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
		oRm.write("<table border=0 height='100%' width='100%' cellpadding='0' cellspacing='0' class='invTable' >");
		// looped 13 times to render the Beginning Inv, Beginning DOI, Inv Variance, Ins/Outs, Current ordered, Suggested, Ordered, Confirmed, Change Request, Planned Qty, Transit Qty, Arrived Qty, Dist Forecast, Prior Year Sales, +-/%, End Inv, Projected DOI, Target DOI rows for each record.
		for (var i = 1; i < 14; i++) {
			oControl._renderDataRows(oRm, oControl, i);
		}
		oRm.write("</table>");
		oRm.write("</div>");
	},

	/***
	 * This method will helpful to display three quantities SuggQty,OrderedQty,ConfirmQty in the view page.
	 * @param oRm
	 * @param oControl
	 */
	_renderSuggestQuantityRow: function(oRm, oControl) {
		var noOfWeeks = 9;
		var i;
		oRm.write("<tr id=" + (oControl.sId + '-forecast') + " height='30px' style='' class='invTableTr'>");
		// creating SuggQty column.
		var jsonSuggestProperty = 'SuggQty';
		oRm.write("<td width='2%'></td>");
		oRm.write("<td width='12.5%'>" + MCAPP.getText('VW_INV_WORK_SHEET_SUGGESTED') + "</td>");
		// creating SuggQty column from week1 to week 9.  

		for (i = 0; i <= noOfWeeks - 1; i++) {
			oRm.write("<td width='9.5%'>" + oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonSuggestProperty) + "</td>");
		}
		oRm.write("</tr>");
		oRm.write("<tr id=" + (oControl.sId + '-forecast') + " height='30px' style='' class='invTableTr '>");
		// creating OrderedQty column.
		var jsonOrderedProperty = 'OrderedQty';
		oRm.write("<td width='2%'></td>");
		oRm.write("<td width='12.5%'>" + MCAPP.getText('VW_INV_WORK_SHEET_ORDERED') + "</td>");
		// creating OrderedQty column from week1 to week 9.

		for (i = 0; i <= noOfWeeks - 1; i++) {
			oRm.write("<td width='9.5%'>" + oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonOrderedProperty) + "</td>");
		}
		oRm.write("</tr>");
		oRm.write("<tr id=" + (oControl.sId + '-forecast') + " height='30px' style='' class='invTableTr'>");
		// creating ConfirmQty column.
		var jsonConfirmProperty = 'ConfirmQty';
		oRm.write("<td width='2%'></td>");
		oRm.write("<td width='12.5%'>" + MCAPP.getText('VW_INV_WORK_SHEET_CONFIRMED') + "</td>");
		// creating ConfirmQty column from week1 to week9.  

		for (i = 0; i <= noOfWeeks - 1; i++) {
			oRm.write("<td width='9.5%'>" + oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonConfirmProperty) + "</td>");
		}
		oRm.write("</tr>");
	},

	/***
	 * This method will helpful to display two rows, PriorYearSales, Percentage in the view page
	 * @param oRm
	 * @param oControl
	 */
	_renderPriorYearSalesRow: function(oRm, oControl) {
		var noOfWeeks = 9;
		var i;
		this._calculateSalesAndAccuracy();
		oRm.write("<tr id=" + (oControl.sId + '-distforecast') + " height='30px' style='' class='invTableTr'>");
		// creating PriorYearSales column.
		var jsonPriorYearProperty = 'PriorYearSales';
		oRm.write("<td width='2%'></td>");
		oRm.write("<td width='12.5%'>" + MCAPP.getText('VW_INV_WORK_SHEET_PY_SALES') + "</td>");
		// creating PriorYearSales column from week1 to week9.

		for (i = 0; i <= noOfWeeks - 1; i++) {
			oRm.write("<td width='9.5%'>" + oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonPriorYearProperty) + "</td>");
		}
		oRm.write("</tr>");
		oRm.write("<tr id=" + (oControl.sId + '-distforecast') + " height='30px' style='' class='invTableTr'>");
		// creating PERCENTAGE_SALES column.
		var jsonPercentageProperty = 'PERCENTAGE_SALES';
		oRm.write("<td width='2%'></td>");
		oRm.write("<td width='12.5%'>" + MCAPP.getText('VW_INV_WORK_SHEET_PERC_MINUS_PLUS') + "</td>");
		// creating PERCENTAGE_SALES column from week1 to week9.

		for (i = 0; i <= noOfWeeks - 1; i++) {
			oRm.write("<td width='9.5%'>" + oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonPercentageProperty) + "</td>");
		}
		oRm.write("</tr>");
	},

	/***
	 * This method will helpful to display all Projected DOI columns, the data in the Projected DOI column will appear in red font if projected days of inventory are 5 days above or below the target DOI in the Custom Table Control in the view page
	 * @param oRm
	 * @param oControl
	 *  @param i
	 */
	_renderProjectedDOIRow: function(i, jsonProperty, oRm, oControl) {
		var projectedDOI = oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonProperty);
		var targetDOI = oControl.getModel().getProperty('/InventoryItemsData/' + i + '/TargDOI');
		var absoluteDays = Math.abs(projectedDOI - targetDOI);
		var differentDays = absoluteDays - 5;
		if (differentDays > 0) {
			oRm.write("<td width='9.5%' class='InvWSProjectedDoiColor'>" + oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonProperty) + "</td>");
		}
		else {
			oRm.write("<td width='9.5%'>" + oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonProperty) + "</td>");
		}
	},

	/***
	 * This method will helpful to display all Beginning Inventory, Beginning DOI, Inventory Variance, Ins/Outs, Current ordered, Suggested, Ordered, Confirmed, Change Request, Planned Quantity, Transit Quantity, Arrived Quantity, Distribute Forecast, Prior Year Sales, +-/%, End Inventory, Projected DOI and Target DOI rows in the Custom Table Control in the view page
	 * @param oRm
	 * @param oControl
	 */
	_renderDataRows: function(oRm, oControl, index) {
		var jsonProperty = '';
		var rowLabel = '';
		switch (index) {
		case 1:
			jsonProperty = "BegINV";
			rowLabel = MCAPP.getText('VW_INV_WORK_SHEET_BEGINNING_INV');
			break;
		case 2:
			jsonProperty = "BegDOI";
			rowLabel = MCAPP.getText('VW_INV_WORK_SHEET_BEGINNING_DOI');
			break;
		case 3:
			jsonProperty = "Inv_Variance";
			rowLabel = MCAPP.getText('VW_INV_WORK_SHEET_INV_VARIANCE');
			break;
		case 4:
			jsonProperty = "Ins_Out";
			rowLabel = MCAPP.getText('VW_INV_WORK_SHEET_INS_OUTS');
			break;
		case 5:
			jsonProperty = "Current_Ord_Qty";
			rowLabel = MCAPP.getText('VW_INV_WORK_SHEET_CURRENT_ORDER_QTY');
			break;
		case 6:
			jsonProperty = "Change_Req_Qty";
			rowLabel = MCAPP.getText('VW_INV_WORK_SHEET_CR');
			break;
		case 7:
			jsonProperty = "PlannedQty";
			rowLabel = MCAPP.getText('VW_INV_WORK_SHEET_PLANNED_SHIP');
			break;
		case 8:
			jsonProperty = "TransitQty";
			rowLabel = MCAPP.getText('VW_INV_WORK_SHEET_IN_TRANSIT_SHIP');
			break;
		case 9:
			jsonProperty = "ArrivedQty";
			rowLabel = MCAPP.getText('VW_INV_WORK_SHEET_ARRIVED_SHIP');
			break;
		case 10:
			jsonProperty = "DistForecast";
			rowLabel = MCAPP.getText('VW_INV_WORK_SHEET_DIST_FORECAST');
			break;
		case 11:
			jsonProperty = "EndINV";
			rowLabel = MCAPP.getText('VW_INV_WORK_SHEET_END_INV');
			break;
		case 12:
			jsonProperty = "ProjDOI";
			rowLabel = MCAPP.getText('VW_INV_WORK_SHEET_PROJECTED_DOI');
			break;
		case 13:
			jsonProperty = "TargDOI";
			rowLabel = MCAPP.getText('VW_INV_WORK_SHEET_TARGET_DOI');
			break;
		}
		oRm.write("<tr id=" + (oControl.sId + jsonProperty) + " height='30px' class='invTableTr'>");
		if (index == 5) {
			oRm.write("<td width='2%'>");
			oRm.renderControl(oControl.getAggregation('expandCollapseSuggestQuantity'));
			oRm.write("</td>");
		}
		else if (index == 10) {
			oRm.write("<td width='2%'>");
			oRm.renderControl(oControl.getAggregation('expandCollapsePriorYearSales'));
			oRm.write("</td>");
		}
		else {
			oRm.write("<td width='2%'>");
			oRm.write("</td>");
		}
		oRm.write("<td width='12.5%' class='invTableFirstColumn'>" + rowLabel + "</td>");
		if (index == 4) {
			oRm.write("<td width='9.5%' height='30px'>");
			oRm.renderControl(oControl.getAggregation('insOutsQuantityWeek1'));
			oRm.write("</td>");
			oRm.write("<td width='9.5%' height='30px'>");
			oRm.renderControl(oControl.getAggregation('insOutsQuantityWeek2'));
			oRm.write("</td>");
			oRm.write("<td width='9.5%' height='30px'>");
			oRm.renderControl(oControl.getAggregation('insOutsQuantityWeek3'));
			oRm.write("</td>");
			oRm.write("<td width='9.5%' height='30px'>");
			oRm.renderControl(oControl.getAggregation('insOutsQuantityWeek4'));
			oRm.write("</td>");
		}
		else {
			if (index == 7) {
				// comparing with "PlannedQty" = "0", since "0" is the value coming from oData service
				if (oControl.getModel().getProperty('/InventoryItemsData/0/' + jsonProperty) == "0") {
					oRm.write("<td width='9.5%'>" + oControl.getModel().getProperty('/InventoryItemsData/0/' + jsonProperty) + "</td>");
				} else {
					oRm.write("<td width='9.5%' height='30px'>");
					oRm.renderControl(oControl.getAggregation('plannedQuantityLinkWeek1'));
					oRm.write("</td>");
				}

			}
			else {
				if (index == 12) {
					oControl._renderProjectedDOIRow(0, jsonProperty, oRm, oControl);
				}
				else {
					if (index == 3) {
						var sCurrentWeekBegINV = oControl.getModel().getProperty('/InventoryItemsData/0/BegINV');
						var sPreviousWeekEndINV = oControl.getModel().oData.AnalyticsData[3].EndINV;
						var sInvVariance = sCurrentWeekBegINV - sPreviousWeekEndINV;
						oRm.write("<td width='9.5%'>" + sInvVariance + "</td>");
					}
					else {
						oRm.write("<td width='9.5%'>" + oControl.getModel().getProperty('/InventoryItemsData/0/' + jsonProperty) + "</td>");
					}
				}
			}
			if (index == 8) {
				// comparing with "transitQty" = "0", since "0" is the value coming from oData service
				if (oControl.getModel().getProperty('/InventoryItemsData/1/' + jsonProperty) == "0") {
					oRm.write("<td width='9.5%'>" + oControl.getModel().getProperty('/InventoryItemsData/1/' + jsonProperty) + "</td>");
				} else {
					oRm.write("<td width='9.5%' height='30px'>");
					oRm.renderControl(oControl.getAggregation('inTransitQuantityLink'));
					oRm.write("</td>");
				}


			}
			else {
				if (index == 12) {
					oControl._renderProjectedDOIRow(1, jsonProperty, oRm, oControl);
				}
				else {
					if (index == 3) {
						var sCurrentWeekBeginingInventory = oControl.getModel().getProperty('/InventoryItemsData/1/BegINV');
						var sPreviousWeekEndingInventory = oControl.getModel().getProperty('/InventoryItemsData/0/EndINV');
						var sInventoryVariance = sCurrentWeekBeginingInventory - sPreviousWeekEndingInventory;
						oRm.write("<td width='9.5%'>" + sInventoryVariance + "</td>");
					}
					else {
						oRm.write("<td width='9.5%'>" + oControl.getModel().getProperty('/InventoryItemsData/1/' + jsonProperty) + "</td>");
					}
				}
			}
			if (index == 7) {
				// comparing with "PlannedQty" = "0", since "0" is the value coming from oData service
				if (oControl.getModel().getProperty('/InventoryItemsData/2/' + jsonProperty) == "0") {
					oRm.write("<td width='9.5%'>" + oControl.getModel().getProperty('/InventoryItemsData/2/' + jsonProperty) + "</td>");
				} else {
					oRm.write("<td width='9.5%' height='30px'>");
					oRm.renderControl(oControl.getAggregation('plannedQuantityLinkWeek3'));
					oRm.write("</td>");
				}
			}
			else if (index == 6) {
				// comparing with "Status_Code" = "03", since "03" is the value coming from oData service to show "In Progress"
				if (oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/CR_Status_Code') == "03") {
					oRm.write("<td width='9.5%' height='30px'>");
					oRm.renderControl(oControl.getAggregation('inProgressLink'));
					oRm.write("</td>");
				} else {
					oRm.write("<td width='9.5%' height='30px'>");
					oRm.renderControl(oControl.getAggregation('changeRequestQuantity'));
					oRm.write("</td>");
				}

			}
			else {
				if (index == 12) {
					oControl._renderProjectedDOIRow(2, jsonProperty, oRm, oControl);
				}
				else if(index==10)
				{
					oRm.write("<td width='9.5%' height='30px'>");
					oRm.renderControl(oControl.getAggregation('distForecastQuantityWeek3'));
					oRm.write("</td>");
				}
				else {
					oRm.write("<td width='9.5%'>" + oControl.getModel().getProperty('/InventoryItemsData/2/' + jsonProperty) + "</td>");
				}
			}
			if (index == 5) {
				oRm.write("<td width='9.5%' height='30px'>");
				oRm.renderControl(oControl.getAggregation('currentOrderedQuantity'));
				oRm.write("</td>");
			}
			else {
				if (index == 12) {
					oControl._renderProjectedDOIRow(3, jsonProperty, oRm, oControl);
				}
				else if(index==10)
				{
					oRm.write("<td width='9.5%' height='30px'>");
					oRm.renderControl(oControl.getAggregation('distForecastQuantityWeek4'));
					oRm.write("</td>");
				}
				else {
					oRm.write("<td width='9.5%'>" + oControl.getModel().getProperty('/InventoryItemsData/3/' + jsonProperty) + "</td>");
				}
			}
		}
		if (index == 12) {
			oControl._renderProjectedDOIRow(4, jsonProperty, oRm, oControl);
		}
		else if(index==10)
		{
			oRm.write("<td width='9.5%' height='30px'>");
			oRm.renderControl(oControl.getAggregation('distForecastQuantityWeek5'));
			oRm.write("</td>");
		}
		else {
			oRm.write("<td width='9.5%'>" + oControl.getModel().getProperty('/InventoryItemsData/4/' + jsonProperty) + "</td>");
		}
		if (index == 12) {
			oControl._renderProjectedDOIRow(5, jsonProperty, oRm, oControl);
		}
		else if(index==10)
		{
			oRm.write("<td width='9.5%' height='30px'>");
			oRm.renderControl(oControl.getAggregation('distForecastQuantityWeek6'));
			oRm.write("</td>");
		}
		else {
			oRm.write("<td width='9.5%'>" + oControl.getModel().getProperty('/InventoryItemsData/5/' + jsonProperty) + "</td>");
		}
		if (index == 12) {
			oControl._renderProjectedDOIRow(6, jsonProperty, oRm, oControl);
		}
		else if(index==10)
		{
			oRm.write("<td width='9.5%' height='30px'>");
			oRm.renderControl(oControl.getAggregation('distForecastQuantityWeek7'));
			oRm.write("</td>");
		}
		else {
			oRm.write("<td width='9.5%'>" + oControl.getModel().getProperty('/InventoryItemsData/6/' + jsonProperty) + "</td>");
		}
		if (index == 12) {
			oControl._renderProjectedDOIRow(7, jsonProperty, oRm, oControl);
		}
		else if(index==10)
		{
			oRm.write("<td width='9.5%' height='30px'>");
			oRm.renderControl(oControl.getAggregation('distForecastQuantityWeek8'));
			oRm.write("</td>");
		}
		else {
			oRm.write("<td width='9.5%'>" + oControl.getModel().getProperty('/InventoryItemsData/7/' + jsonProperty) + "</td>");
		}
		if (index == 12) {
			oControl._renderProjectedDOIRow(8, jsonProperty, oRm, oControl);
		}
		else if(index==10)
		{
			oRm.write("<td width='9.5%' height='30px'>");
			oRm.renderControl(oControl.getAggregation('distForecastQuantityWeek9'));
			oRm.write("</td>");
		}
		else {
			oRm.write("<td width='9.5%'>" + oControl.getModel().getProperty('/InventoryItemsData/8/' + jsonProperty) + "</td>");
		}
		if (index == 5) {
			oControl._renderSuggestQuantityRow(oRm, oControl);
		}
		if (index == 10) {
			oControl._renderPriorYearSalesRow(oRm, oControl);
		}
		oRm.write("</tr>");
	}
});

/***
 * This method will helpful to get all changed data in the rows of Custom Table Control in the view page
 * @param oEvent
 */
mc.ccp.inventory.control.InventoryWSItemTable.prototype.handleChangeInsOuts = function(oEvent) {
	var sSource = '';
	for (var key in this.mAggregations) {
		if (this.mAggregations.hasOwnProperty(key)) {
			if (oEvent.getSource().sId == this.mAggregations[key].sId) {
				sSource = key;
				break;
			}
		}
	}
	jQuery.sap.log.info(sSource);
	var relContextPath = '';
	switch (sSource) {
	case 'insOutsQuantityWeek1':
		relContextPath = "/InventoryItemsData/0/Ins_Out";
		break;
	case 'insOutsQuantityWeek2':
		relContextPath = "/InventoryItemsData/1/Ins_Out";
		break;
	case 'insOutsQuantityWeek3':
		relContextPath = "/InventoryItemsData/2/Ins_Out";
		break;
	case 'insOutsQuantityWeek4':
		relContextPath = "/InventoryItemsData/3/Ins_Out";
		break;
	case 'currentOrderedQuantity':
		relContextPath = "/InventoryItemsData/3/Current_Ord_Qty";
		break;
	case 'distForecastQuantityWeek3':
		relContextPath = "/InventoryItemsData/2/DistForecast";
		break;
	case 'distForecastQuantityWeek4':
		relContextPath = "/InventoryItemsData/3/DistForecast";
		break;
	case 'distForecastQuantityWeek5':
		relContextPath = "/InventoryItemsData/4/DistForecast";
		break;
	case 'distForecastQuantityWeek6':
		relContextPath = "/InventoryItemsData/5/DistForecast";
		break;
	case 'distForecastQuantityWeek7':
		relContextPath = "/InventoryItemsData/6/DistForecast";
		break;
	case 'distForecastQuantityWeek8':
		relContextPath = "/InventoryItemsData/7/DistForecast";
		break;
	case 'distForecastQuantityWeek9':
		relContextPath = "/InventoryItemsData/8/DistForecast";
		break;
	case 'changeRequestQuantity':
		relContextPath = "/InventoryItemsData/2/Change_Req_Qty";
		break;
	}
	var changedData = oEvent.getParameter('changed');
	var originalData;
	var oBackUpModel = this.getModel('backup');
	if (oBackUpModel) {
		originalData = oBackUpModel.getProperty(relContextPath);
	}
	else {
		originalData = this.getParent().getParent().getParent().getModel('backup').getProperty(this.getBindingContext().sPath + relContextPath);
	}
	if (this._isDirty()) {
		this.setDirtyState(true);
		MCAPP.setDirtyFlag(true);
	}
	else {
		this.setDirtyState(false);
		MCAPP.setDirtyFlag(false);
	}
	this.fireChange({
		source: sSource,
		changedData: changedData,
		originalData: originalData,
		dirtyState: this.getDirtyState()
	});
	this._calculateProjectedDOI();
	this._calculateSalesAndAccuracy();
	this.rerender();
};

/***
 * Is called to maintain the dirty state of the record in oModel
 */
mc.ccp.inventory.control.InventoryWSItemTable.prototype._isDirty = function() {
	var oChangedModel = this.getModel();
	var oOriginalModel = this.getModel('backup');
	if (!oOriginalModel) {
		oOriginalModel = this.getParent().getParent().getParent().getModel('backup');
	}
	if (oOriginalModel.getProperty('/InventoryItemsData/0/Ins_Out') == oChangedModel.getProperty('/InventoryItemsData/0/Ins_Out') && oOriginalModel.getProperty('/InventoryItemsData/1/Ins_Out') == oChangedModel.getProperty('/InventoryItemsData/1/Ins_Out') && oOriginalModel.getProperty('/InventoryItemsData/2/Ins_Out') == oChangedModel.getProperty('/InventoryItemsData/2/Ins_Out') && oOriginalModel.getProperty('/InventoryItemsData/3/Ins_Out') == oChangedModel.getProperty('/InventoryItemsData/3/Ins_Out') && oOriginalModel.getProperty('/InventoryItemsData/3/Current_Ord_Qty') == oChangedModel.getProperty('/InventoryItemsData/3/Current_Ord_Qty') && oOriginalModel.getProperty('/InventoryItemsData/2/Change_Req_Qty') == oChangedModel.getProperty('/InventoryItemsData/2/Change_Req_Qty')&&oOriginalModel.getProperty('/InventoryItemsData/2/DistForecast') == oChangedModel.getProperty('/InventoryItemsData/2/DistForecast') &&oOriginalModel.getProperty('/InventoryItemsData/3/DistForecast') == oChangedModel.getProperty('/InventoryItemsData/3/DistForecast') &&oOriginalModel.getProperty('/InventoryItemsData/4/DistForecast') == oChangedModel.getProperty('/InventoryItemsData/4/DistForecast') &&oOriginalModel.getProperty('/InventoryItemsData/5/DistForecast') == oChangedModel.getProperty('/InventoryItemsData/5/DistForecast') &&oOriginalModel.getProperty('/InventoryItemsData/6/DistForecast') == oChangedModel.getProperty('/InventoryItemsData/6/DistForecast') &&oOriginalModel.getProperty('/InventoryItemsData/7/DistForecast') == oChangedModel.getProperty('/InventoryItemsData/7/DistForecast') &&oOriginalModel.getProperty('/InventoryItemsData/8/DistForecast') == oChangedModel.getProperty('/InventoryItemsData/8/DistForecast')) {
		return false;
	}
	else {
		return true;
	}
};

/***
 * This method will helpful to change the Projected DOI based on Current Order Qty values in the Custom Table Control
 *@param currentOrderQuantity
 */
mc.ccp.inventory.control.InventoryWSItemTable.prototype._calculateProjectedDOI = function() {

	var oData = {"results" : []};
	var numberOfWeeks = this.getModel().getData().InventoryItemsData.length;
	for(var i=0; i<numberOfWeeks; i++){
		var oCurrentItem = this.getModel().getData().InventoryItemsData[i];
		oData.results.push({
			beginningInventory : parseInt(oCurrentItem.BegINV),
			endingInventory : parseInt(oCurrentItem.EndINV),
			projectedDOI : parseInt(oCurrentItem.ProjDOI),
			forecastQuantity : parseInt(oCurrentItem.DistForecast),
			arrivedQuantity : parseInt(oCurrentItem.ArrivedQty),
			intransitShipments : parseInt(oCurrentItem.TransitQty),
			plannedShipments : parseInt(oCurrentItem.PlannedQty),
			crQuantity : parseInt(oCurrentItem.Change_Req_Qty),
			currentOrderQuantity : parseInt(oCurrentItem.Current_Ord_Qty),
			suggestedQuantity : parseInt(oCurrentItem.SuggQty),
			confirmedQuantity : parseInt(oCurrentItem.ConfirmQty),
			orderedQuantity : parseInt(oCurrentItem.OrderedQty),
			insOuts : parseInt(oCurrentItem.Ins_Out)
		});
	}
	var oOnTheFlyModel = new sap.ui.model.json.JSONModel();
	oOnTheFlyModel.setData(oData);
	// calling projected DOI function
	oOnTheFlyModel = MCAPP.projectedDOI(oOnTheFlyModel, numberOfWeeks);
	for (var i = 0; i < oOnTheFlyModel.getData().results.length; i++) {
		this.getModel().setProperty('/InventoryItemsData/' + i + '/BegINV', oOnTheFlyModel.getProperty('/results/' + i + '/beginningInventory'));
		this.getModel().setProperty('/InventoryItemsData/' + i + '/EndINV', oOnTheFlyModel.getProperty('/results/' + i + '/endingInventory'));
		this.getModel().setProperty('/InventoryItemsData/' + i + '/ProjDOI', oOnTheFlyModel.getProperty('/results/' + i + '/projectedDOI'));
	}
};

/***
 * This method will helpful to calculate the Percentage Sales and First Accuracy based on DistForecast, Prior Year Sales and CurrentYearSales in the Custom Table Control
 *@memberOf inventory.control.ImportInventoryWSItemTable
 */
mc.ccp.inventory.control.InventoryWSItemTable.prototype._calculateSalesAndAccuracy = function() {
	var noOfWeeks = 9;
	var priorYearSales, distForecast, currentYearSales, percentageSales, firstAccuracy;
	var iPriorYearSales, iDistForecast, iCurrentYearSales;

	for (var i = 0; i < noOfWeeks; i++) {
		priorYearSales = this.getModel().getProperty('/InventoryItemsData/' + i + '/PriorYearSales');
		distForecast = this.getModel().getProperty('/InventoryItemsData/' + i + '/DistForecast');
		currentYearSales = this.getModel().getProperty('/InventoryItemsData/' + i + '/CurrentYearSales');

		if(priorYearSales!== undefined && distForecast != undefined){
			iDistForecast = parseInt(distForecast);
			iPriorYearSales = parseInt(priorYearSales);
			if(parseInt(((iDistForecast + iPriorYearSales)/2)) !== 0){
				percentageSales = parseInt((iDistForecast - iPriorYearSales)/((iDistForecast + iPriorYearSales)/2));    			
				this.getModel().setProperty('/InventoryItemsData/' + i + '/PERCENTAGE_SALES', (percentageSales + "%"));    			
			}
			else{
				this.getModel().setProperty('/InventoryItemsData/' + i + '/PERCENTAGE_SALES',"0%");
			}
		}
		if(currentYearSales!== undefined){
			iCurrentYearSales = parseInt(currentYearSales);
			if(iCurrentYearSales !== 0){
				firstAccuracy = parseInt(1 - Math.abs((distForecast - currentYearSales) / currentYearSales));
				this.getModel().setProperty('/InventoryItemsData/' + i + '/FRST_ACCURACY', (firstAccuracy + "%"));
			}
			else{
				this.getModel().setProperty('/InventoryItemsData/' + i + '/FRST_ACCURACY', "0%");
			}
		}    	
	}
};

/***
 * This method will helpful to show the Inventory Shipment Screen when user press on PlannedShip & In-Transit Ship links in the Custom Table Control
 * @param oEvent
 */
mc.ccp.inventory.control.InventoryWSItemTable.prototype.handlePressPlannedShipLink = function(oEvent) {
	var inventoryShipSkuIndex=oEvent.getSource().getBindingContext().sPath.split("/")[2];
	var oSkuNum = parseInt(this.getParent().getParent().oParent.oViewData[1]);
	var oLinkPress = oEvent.getSource().sParentAggregationName;
	var weekIndex = 0;
	if(oLinkPress==='inTransitQuantityLink'){
		weekIndex = 1;
	}else if(oLinkPress==='plannedQuantityLinkWeek1'){
		weekIndex = 0;
	}else if(oLinkPress==='plannedQuantityLinkWeek3'){
		weekIndex = 2;
	}
	var oDate = oEvent.getSource().getBindingContext().getModel().getData().InventoryItemsData[weekIndex].Week_No;
	var oShipmentDetailView = new sap.ui.view({
		type : sap.ui.core.mvc.ViewType.JS,
		viewName : "mc.ccp.inventory.InventoryShipment",
		viewData : [oSkuNum,oLinkPress,inventoryShipSkuIndex,oDate]
	});    
	var oCancelButton = new sap.ui.commons.Button({
		text: MCAPP.getText('GBL_CANCEL'),
		width: "90px",
		height: '30px'
	});
	oCancelButton.attachPress(oShipmentDetailView.getController().onPressCancel, oShipmentDetailView.getController());

	var oSaveButton = new sap.ui.commons.Button({
		text: MCAPP.getText('GBL_SAVE'),
		width: "90px",
		height: '30px'
	});
	oSaveButton.attachPress(oShipmentDetailView.getController().onPressSave, oShipmentDetailView.getController());

	var InvShipHlayout = new  mc.ccp.control.McHorizontalLayout({
		height : "100%",
		width  : "100%",			
		widths : [ "50%","50%"],			
		content: [oCancelButton,oSaveButton] 			
	});	

	var oShipmentDialog = new mc.ccp.control.McDialog({
		modal : true,
		width : '98%',
		height : '80%',
		title : MCAPP.getText('VW_INV_SHIP_SKU_HEADER') + " " + oSkuNum,
		content : [ oShipmentDetailView],
		buttons:[InvShipHlayout],
		closed : function(oEvent) {
			this.destroy();
		}
	}).addStyleClass('McCustomDialog');
	oShipmentDialog.attachCloseClicked(oShipmentDetailView.getController().onPressCancel, oShipmentDetailView.getController());

	oShipmentDialog.open();
};

/***
 * Is called on press of in progress link for a record.
 * @param oEvent
 */
mc.ccp.inventory.control.InventoryWSItemTable.prototype.handlePressInprogressLink = function(oEvent) {
	MCAPP.setBusy(true);
	var oSkuNumber= parseInt(this.getParent().getParent().oParent.oViewData[1]);
	var oOkButton = new sap.ui.commons.Button({
		text: MCAPP.getText('GBL_OK', this),
		width: "90px",
		height: '30px'
	});
	oOkButton.attachPress(function(oEvent) {
		oEvent.getSource().getParent().close();
		MCAPP.setBusy(false);
	});
	oCustIdPoDialog = new sap.ui.commons.Dialog({
		modal: true,
		width: '40%',
		height: '60%',
		title: MCAPP.getText('VW_INV_WORK_SHEET_CR_PRW_TITLE', this) + " " + oSkuNumber,
		buttons: [oOkButton],
		closed: function(oEvent) {
			MCAPP.setBusy(false);
			this.destroy();
		}
	}).addStyleClass('McCcpCustomDialog');
	oCustIdPoDialog.open();
	var oCustIdPoView = new sap.ui.view({
		type: sap.ui.core.mvc.ViewType.JS,
		viewName: "mc.ccp.inventory.InventoryChangeRequest",
		viewData: oEvent.getSource().getBindingContext()
	});
	oCustIdPoDialog.addContent(oCustIdPoView);
};

/***
 * This method will helpful to get the error states of changed ones in the Custom Table Control
 */
mc.ccp.inventory.control.InventoryWSItemTable.prototype._hasErrors = function() {
	var errorState = this.mAggregations.insOutsQuantityWeek1.getErrorState() || this.mAggregations.insOutsQuantityWeek2.getErrorState() || this.mAggregations.insOutsQuantityWeek3.getErrorState() || this.mAggregations.insOutsQuantityWeek4.getErrorState() || this.mAggregations.currentOrderedQuantity.getErrorState() || this.mAggregations.changeRequestQuantity.getErrorState();
	jQuery.sap.log.info(errorState);
	return errorState;
};

/***
 * This method will helpful to show/hide Suggest Quantity, Ordered Quantity and Confirm Quantity rows in the  Custom Table Control
 *  @param oEvent
 */
mc.ccp.inventory.control.InventoryWSItemTable.prototype.handlePressCurrentOrderExpandAndCollapseImage = function(oEvent) {
	var rowId = this.getId() + '-forecast';
	if (this.getExpand()) {
		jQuery.sap.byId(this.getId()).find('tr#' +rowId ).hide();
		this.setExpand(false);
		this.getAggregation('expandCollapseSuggestQuantity').setSrc('image/expand.png');
	}
	else { 
		jQuery.sap.byId(this.getId()).find('tr#' + rowId).show();
		this.setExpand(true);
		this.getAggregation('expandCollapseSuggestQuantity').setSrc('image/collapse.png');
	}
};

/***
 * This method will helpful to show/hide Prior Year Sales, % +/- rows in the Custom Table Control
 * @param oEvent
 */
mc.ccp.inventory.control.InventoryWSItemTable.prototype.handlePressDistForecastExpandAndCollapseImage = function(oEvent) {
	var rowId=this.getId() + '-distforecast';
	if (this.getExpandPriorSales()) {
		jQuery.sap.byId(this.getId()).find('tr#' + rowId).hide();
		this.setExpandPriorSales(false);
		this.getAggregation('expandCollapsePriorYearSales').setSrc('image/expand.png');
	}
	else { 
		jQuery.sap.byId(this.getId()).find('tr#' + rowId).show();
		this.setExpandPriorSales(true);
		this.getAggregation('expandCollapsePriorYearSales').setSrc('image/collapse.png');
	}
};

/***
 * This method will helpful to set the Expand property for Suggest Quantity row in the Custom Table Control
 * @param oEvent
 */
mc.ccp.inventory.control.InventoryWSItemTable.prototype.expand = function(oEvent) {
	jQuery.sap.byId(this.getId()).find('tr#' + this.getId() + '-forecast').show();
	this.getAggregation('expandCollapseSuggestQuantity').setSrc('image/collapse.png');
	this.setExpand(true);
};

/***
 * This method will helpful to set the Collapse property for Suggest Quantity row in the Custom Table Control
 * @param oEvent
 */
mc.ccp.inventory.control.InventoryWSItemTable.prototype.collapse = function(oEvent) {
	jQuery.sap.byId(this.getId()).find('tr#' + this.getId() + '-forecast').hide();
	this.getAggregation('expandCollapseSuggestQuantity').setSrc('image/expand.png');
	this.setExpand(false);
};

/***
 * This method will helpful to set the Expand property for Prior Year Sales row in the Custom Table Control
 * @param oEvent
 */
mc.ccp.inventory.control.InventoryWSItemTable.prototype.expandPriorYearSales = function(oEvent) {
	jQuery.sap.byId(this.getId()).find('tr#' + this.getId() + '-distforecast').show();
	this.getAggregation('expandCollapsePriorYearSales').setSrc('image/collapse.png');
	this.setExpandPriorSales(true);
};

/***
 * This method will helpful to set the Collapse property for Prior Year Sales row in the Custom Table Control
 * @param oEvent
 */
mc.ccp.inventory.control.InventoryWSItemTable.prototype.collapsePriorYearSales = function(oEvent) {
	jQuery.sap.byId(this.getId()).find('tr#' + this.getId() + '-distforecast').hide();
	this.getAggregation('expandCollapsePriorYearSales').setSrc('image/expand.png');
	this.setExpandPriorSales(false);
};

/***
 * Called when the Control is destroyed. Use this one to free resources and finalize activities.
 *@param oEvent
 */
mc.ccp.inventory.control.InventoryWSItemTable.prototype.exit = function(oEvent) {
	jQuery.sap.log.info('CHECK DESTROY' + this.sId);
};