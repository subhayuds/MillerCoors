/***
 * @Author II84
 * @Date 03-12-2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is Custom Control Table for Import Inventory WorkSheet View.
 */
jQuery.sap.declare('mc.ccp.inventory.control.ImportInventoryWSItemTable');
jQuery.sap.require("mc.ccp.control.McArrowTextField");
jQuery.sap.require("mc.ccp.control.McDialog");
sap.ui.core.Control.extend('mc.ccp.inventory.control.ImportInventoryWSItemTable', {
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
            plannedQuantityLinkWeek1: { // Aggregations for planned quantity for current week -1 & current week +1 
                type: "sap.ui.commons.Link",
                multiple: false,
                visibility: "public"
            },
            plannedQuantityLinkWeek3: {
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
                // Aggregating ins/outs quantity from current week -1 (week1) to current week + 2 (week 4) are editable.
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
            insOutsQuantityWeek5: {
                type: "mc.ccp.control.McArrowTextField",
                multiple: false,
                visibility: "public"
            },
            insOutsQuantityWeek6: {
                type: "mc.ccp.control.McArrowTextField",
                multiple: false,
                visibility: "public"
            },
            insOutsQuantityWeek7: {
                type: "mc.ccp.control.McArrowTextField",
                multiple: false,
                visibility: "public"
            },
            insOutsQuantityWeek8: {
                type: "mc.ccp.control.McArrowTextField",
                multiple: false,
                visibility: "public"
            },
            insOutsQuantityWeek9: {
                type: "mc.ccp.control.McArrowTextField",
                multiple: false,
                visibility: "public"
            },
            insOutsQuantityWeek10: {
                type: "mc.ccp.control.McArrowTextField",
                multiple: false,
                visibility: "public"
            },
            currentOrderedQuantity: {
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
            //Adding Dist Forecast aggregations for all the weeks for (Current Week + 1) 3 to (Last Week) 15
            
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
            distForecastQuantityWeek10: {
                type: "mc.ccp.control.McArrowTextField",
                multiple: false,
                visibility: "public"
            },
            distForecastQuantityWeek11: {
                type: "mc.ccp.control.McArrowTextField",
                multiple: false,
                visibility: "public"
            },
            distForecastQuantityWeek12: {
                type: "mc.ccp.control.McArrowTextField",
                multiple: false,
                visibility: "public"
            },
            distForecastQuantityWeek13: {
                type: "mc.ccp.control.McArrowTextField",
                multiple: false,
                visibility: "public"
            },
            distForecastQuantityWeek14: {
                type: "mc.ccp.control.McArrowTextField",
                multiple: false,
                visibility: "public"
            },
            distForecastQuantityWeek15: {
                type: "mc.ccp.control.McArrowTextField",
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
     * @memberOf inventory.control.ImportInventoryWSItemTable
     */
    init: function() {    	
        // Setting Aggregation for current Ordered Quantity.
        var oCurrentOrderedQuantity = new mc.ccp.control.McArrowTextField({});        
        oCurrentOrderedQuantity.bindProperty("pallet", "PalletValue");
        oCurrentOrderedQuantity.bindProperty("readOnly", "readOnly");
        this.setAggregation('currentOrderedQuantity', oCurrentOrderedQuantity);
        var positionOfOrderWeek = MCAPP.getPositionCurrentOrderWeek();
        oCurrentOrderedQuantity.bindProperty("value", "/InventoryItemsData/" + positionOfOrderWeek + "/Current_Ord_Qty");
        //Set Maximum length of Arrowtextfield as per gateway as 10
        oCurrentOrderedQuantity.getAggregation("textField").setMaxLength(10);
        
        // Setting Aggregation for ins/outs Quantity from current week + 1 to current week + 8 (0-9) - 10 weeks.        
        for (var i = 0; i <=9; i++) {	
            var sInsOutsQuantityWeek = "insOutsQuantityWeek" + (i + 1);
            var oInsOutsQuantity = new mc.ccp.control.McArrowTextField({
                arrows: false
            }).bindProperty("value", "/InventoryItemsData/" + i + "/Ins_Out");
            //InsOut would never be disbaled
//            oInsOutsQuantity.bindProperty("readOnly", "/InventoryItemsData/" + i + "/readOnly");
            this.setAggregation(sInsOutsQuantityWeek, oInsOutsQuantity);
            //Set Maximum length of Arrowtextfield as per gateway as 10
			oInsOutsQuantity.getAggregation("textField").setMaxLength(10);
        }
        
        // Setting Aggregation for planned Quantity.
        var oplannedQuantityLinkWeek1 = new sap.ui.commons.Link({
            arrows: false
        }).bindProperty("text", "/InventoryItemsData/0/PlannedQty");
        this.setAggregation('plannedQuantityLinkWeek1', oplannedQuantityLinkWeek1);
        var oplannedQuantityLinkWeek3 = new sap.ui.commons.Link({
            arrows: false
        }).bindProperty("text", "/InventoryItemsData/2/PlannedQty");
        this.setAggregation('plannedQuantityLinkWeek3', oplannedQuantityLinkWeek3);
        // Setting Aggregation for transit Quantity.  
        var oInTransitQuantityLink = new sap.ui.commons.Link({
            arrows: false
        }).bindProperty("text", "/InventoryItemsData/1/TransitQty");
        this.setAggregation('inTransitQuantityLink', oInTransitQuantityLink);
        // setting Aggregation for ExpandCollapse Image at the current order quantity data row.  
        var oExpandCollapseSuggestQuantity = new sap.ui.commons.Image({
            src: 'image/expand.png'
        });
        this.setAggregation('expandCollapseSuggestQuantity', oExpandCollapseSuggestQuantity);
        // Setting Aggregation for ExpandCollapse Image at the dist forecast data row.
        var oExpandCollapsePriorYearSales = new sap.ui.commons.Image({
            src: 'image/expand.png'
        });
        this.setAggregation('expandCollapsePriorYearSales', oExpandCollapsePriorYearSales);
        
        // Setting Aggregation for Dist Forecast Quantity from week 3 to week 15, because (Current Week - 1 and Current Week ) are not editable
        for (var i = 2; i <=14; i++) {	
            var sDistForecastQuantityWeek = "distForecastQuantityWeek" + (i + 1);
            var oDistForecastQuantityWeek = new mc.ccp.control.McArrowTextField({
                arrows: false
            }).bindProperty("value", "/InventoryItemsData/" + i + "/DistForecast");
            //Dist Forecast would never be disblaed
            this.setAggregation(sDistForecastQuantityWeek, oDistForecastQuantityWeek);
            //Set Maximum length of Arrowtextfield as per gateway as 10
            oDistForecastQuantityWeek.getAggregation("textField").setMaxLength(10);
        }
    },
    
    /**
     * Called when the custom control has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     * @memberOf inventory.control.ImportInventoryWSItemTable
     */
    onAfterRendering: function() {
        // Attaching change event for ins outs quantity from current week + 1 to current week + 8 are editable.
    	//Number of Ins Outs aggregations are 10
        for (var i = 0; i <= 9; i++) {
            this.getAggregation('insOutsQuantityWeek' + (i + 1)).attachChange(this.handleChangeInsOuts, this);
        }
        //Attaching Event for Dist Forecast, Number of Dist Forecast aggregations are 13 (3-15)
        for (var i = 2; i <= 14; i++) {
            this.getAggregation('distForecastQuantityWeek' + (i + 1)).attachChange(this.handleChangeDistForecast, this);
        }
        this.getAggregation('currentOrderedQuantity').attachChange(this.handleChangeInsOuts, this);
        this.getAggregation('plannedQuantityLinkWeek1').attachPress(this.handlePressPlannedShipLink, this);
        this.getAggregation('plannedQuantityLinkWeek3').attachPress(this.handlePressPlannedShipLink, this);
        this.getAggregation('inTransitQuantityLink').attachPress(this.handlePressPlannedShipLink, this);
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
     * @memberOf inventory.control.ImportInventoryWSItemTable
     */
    onBeforeRendering: function() {
        // detaching change event for ins outs quantity from current week + 1 to current week + 8 are editable, total of 10 weeks.
        for (var i = 0; i <= 9; i++) {
            this.getAggregation('insOutsQuantityWeek' + (i + 1)).detachChange(this.handleChangeInsOuts, this);
        }
        //Detaching Event for Dist Forecast, Number of Dist Forecast aggregations are 14 (3-15)
        for (var i = 2; i <= 14; i++) {
            this.getAggregation('distForecastQuantityWeek' + (i + 1)).detachChange(this.handleChangeDistForecast, this);
        }
        this.getAggregation('currentOrderedQuantity').detachChange(this.handleChangeInsOuts, this);
        this.getAggregation('plannedQuantityLinkWeek1').detachPress(this.handlePressPlannedShipLink, this);
        this.getAggregation('plannedQuantityLinkWeek3').detachPress(this.handlePressPlannedShipLink, this);
        this.getAggregation('inTransitQuantityLink').detachPress(this.handlePressPlannedShipLink, this);
        this.getAggregation('expandCollapseSuggestQuantity').detachPress(this.handlePressCurrentOrderExpandAndCollapseImage, this);
        this.getAggregation('expandCollapsePriorYearSales').detachPress(this.handlePressDistForecastExpandAndCollapseImage, this);
    },
    
    /***
     * Is called to render the change request table control.
     * @param oRm - Renderer Manager
     * @param oControl - control of renderer
     * @memberOf inventory.control.ImportInventoryWSItemTable
     */
    renderer: function(oRm, oControl) {
    	var noOfWeeks = 15;
    	var positionOfOrderWeek = MCAPP.getPositionCurrentOrderWeek();
    	
        oRm.write("<div ");
        oRm.writeControlData(oControl);
        oRm.addStyle("width", oControl.getWidth());
        oRm.writeStyles();
        oRm.writeClasses();
        oRm.write(">");
        oRm.write("<table border=0 height='100%' width='100%' cellpadding='0' cellspacing='0' class='impInvTable' >");
        // looped 13 times to render the Beginning Inv, Beginning DOI, Inv Variance, Ins/Outs, Current ordered, 
        //Suggested, Ordered, Confirmed, Change Request, Planned Qty, Transit Qty, Arrived Qty, Dist Forecast, Prior Year Sales, +-/%, End Inv, 
        //Projected DOI, Target DOI rows for each record.
        for (var i = 1; i < 14; i++) {        	
        	oControl._renderDataRows(oRm, oControl, i, noOfWeeks, positionOfOrderWeek);
        }
        oRm.write("</table>");
        oRm.write("</div>");
    },
    
    /***
     * This method will helpful to display three quantities SuggQty,OrderedQty,ConfirmQty in the view page.
     * @param oRm - Renderer Manager
     * @param oControl - control of renderer
     * @param noOfWeeks - Total number of weeks for which InsOut data needs to be populated
     * @param positionOfOrderWeek - position for the current ordered week
     * @memberOf inventory.control.ImportInventoryWSItemTable
     */
    _renderSuggestQuantityRow: function(oRm, oControl, noOfWeeks, positionOfOrderWeek) {
    	 var i;
    	 oRm.write("<tr id=" + (oControl.sId + '-forecast') + " height='30px' style=''>");
        // Creating SuggQty column.
        var jsonSuggestProperty = 'SuggQty';
        oRm.write("<td width='1%'></td>");
        oRm.write("<td width='8.95%' class='impInvPadLeft'>" + MCAPP.getText('VW_INV_WORK_SHEET_SUGGESTED') + "</td>");
        // creating SuggQty column from week1 to week 9.       
        for (i = 0; i <= noOfWeeks - 1; i++) {
            if(i == positionOfOrderWeek){
    			oRm.write("<td width='6%' class='impInvTableTd'>" + oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonSuggestProperty) + "</td>");
    		}
    		else{
    			oRm.write("<td width='6%' class='impInvNormalTableTd'>" + oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonSuggestProperty) + "</td>");
    		}
        }
        oRm.write("</tr>");
        oRm.write("<tr id=" + (oControl.sId + '-forecast') + " height='30px' style=''>");
        
        // Creating OrderedQty column.
        var jsonOrderedProperty = 'OrderedQty';
        oRm.write("<td width='1%'></td>");
        oRm.write("<td width='8.95%' class='impInvPadLeft'>" + MCAPP.getText('VW_INV_WORK_SHEET_ORDERED') + "</td>");
        // Creating OrderedQty column from week1 to week 9.        
        for (i = 0; i <= noOfWeeks - 1; i++) {
            if(i == positionOfOrderWeek){
    			oRm.write("<td width='6%' class='impInvTableTd'>" + oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonOrderedProperty) + "</td>");
    		}
    		else{
    			oRm.write("<td width='6%' class='impInvNormalTableTd'>" + oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonOrderedProperty) + "</td>");
    		}
        }
        oRm.write("</tr>");
        oRm.write("<tr id=" + (oControl.sId + '-forecast') + " height='30px' style=''>");
        
        // Creating ConfirmQty column.
        var jsonConfirmProperty = 'ConfirmQty';
        oRm.write("<td width='1%'></td>");
        oRm.write("<td width='8.95%' class='impInvPadLeft'>" + MCAPP.getText('VW_INV_WORK_SHEET_CONFIRMED') + "</td>");
        // Creating ConfirmQty column from week1 to week9.       
        for (i = 0; i <= noOfWeeks - 1; i++) {
            if(i === positionOfOrderWeek){
    			oRm.write("<td width='6%' class='impInvTableTd'>" + oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonConfirmProperty) + "</td>");
    		}
    		else{
    			oRm.write("<td width='6%' class='impInvNormalTableTd'>" + oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonConfirmProperty) + "</td>");
    		}
        }
        oRm.write("</tr>");
    },
       
    /***
     * This method will helpful to display two rows, PriorYearSales, Percentage in the view page
     * @param oRm - Renderer Manager
     * @param oControl - control of renderer
     * @param noOfWeeks - Total number of weeks for which InsOut data needs to be populated
     * @param positionOfOrderWeek - position for the current ordered week
     * @memberOf inventory.control.ImportInventoryWSItemTable
     */
    _renderPriorYearSalesRow: function(oRm, oControl, noOfWeeks, positionOfOrderWeek) {
    	var i;
    	this._calculateSalesAndAccuracy();
        oRm.write("<tr id=" + (oControl.sId + '-distforecast') + " height='30px' style=''>");        
        // Creating PriorYearSales column.
        var jsonPriorYearProperty = 'PriorYearSales';
        oRm.write("<td width='1%'></td>");
        oRm.write("<td width='8.95%' class=''impInvPadLeft>" + MCAPP.getText('VW_INV_WORK_SHEET_PY_SALES') + "</td>");
        // Creating PriorYearSales column from week1 to week9.
        for (i = 0; i <= noOfWeeks - 1; i++) {
            if(i == positionOfOrderWeek){
    			oRm.write("<td width='6%' class='impInvTableTd'>" + oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonPriorYearProperty) + "</td>");
    		}
    		else{
    			oRm.write("<td width='6%' class='impInvNormalTableTd'>" + oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonPriorYearProperty) + "</td>");
    		}
        }
        oRm.write("</tr>");
        oRm.write("<tr id=" + (oControl.sId + '-distforecast') + " height='30px' style=''>");
        
        //Creating PERCENTAGE_SALES column.
        var jsonPercentageProperty = 'PERCENTAGE_SALES';
        oRm.write("<td width='1%'></td>");
        oRm.write("<td width='8.95%' class='impInvPadLeft'>" + MCAPP.getText('VW_INV_WORK_SHEET_PERC_MINUS_PLUS') + "</td>");
        //Creating PERCENTAGE_SALES column from week1 to week9.        
        for (i = 0; i <= noOfWeeks - 1; i++) {
            if(i == positionOfOrderWeek){
    			oRm.write("<td width='6%' class='impInvTableTd'>" + oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonPercentageProperty) + "</td>");
    		}
    		else{
    			oRm.write("<td width='6%' class='impInvNormalTableTd'>" + oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonPercentageProperty) + "</td>");
    		}
        }
        oRm.write("</tr>");
    },
    
    /***
     * This method will helpful to display all Projected DOI columns, the data in the Projected DOI column will appear in red font if projected days of inventory are 5 days above or below the target DOI in the Custom Table Control in the view page
     * @param i - Position of ProjectedDOI in the row
     * @param jsonProperty - Name of Json Property
     * @param oRm - Renderer Manager
     * @param oControl - control of renderer
     * @param noOfWeeks - Total number of weeks for which InsOut data needs to be populated
     * @param positionOfOrderWeek - position for the current ordered week
     * @memberOf inventory.control.ImportInventoryWSItemTable
     */
    _renderProjectedDOIRow: function(i, jsonProperty, oRm, oControl, noOfWeeks, positionOfOrderWeek) {
        var projectedDOI = oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonProperty);
        var targetDOI = oControl.getModel().getProperty('/InventoryItemsData/' + i + '/TargDOI');
        var absoluteDays = Math.abs(projectedDOI - targetDOI);
        var differentDays = absoluteDays - 5;
        if (differentDays > 0) {
        	if(i == positionOfOrderWeek)
        		oRm.write("<td width='6%' class='InvWSProjectedDoiColor impInvTableTd'>" + oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonProperty) + "</td>");
        	else
        		oRm.write("<td width='6%' class='InvWSProjectedDoiColor impInvNormalTableTd'>" + oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonProperty) + "</td>");
        }
        else {
        	if(i == positionOfOrderWeek){
    			oRm.write("<td width='6%' class='impInvTableTd'>" + oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonProperty) + "</td>");
    		}
    		else{
    			oRm.write("<td width='6%' class='impInvNormalTableTd'>" + oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonProperty) + "</td>");
    		}
        }
    },
    
    /**
     * This function renders the Ins_Out Row with Aggregations and without Aggregation depending on position of Order Week
     * @param jsonProperty - Name of Json Property
     * @param oRm - Renderer Manager
     * @param oControl - control of renderer
     * @param noOfWeeks - Total number of weeks for which InsOut data needs to be populated
     * @param positionOfOrderWeek - position for the current ordered week
     * @memberOf inventory.control.ImportInventoryWSItemTable
     */
    _renderinsOutsQuantityWeekRow: function(jsonProperty, oRm, oControl, noOfWeeks, positionOfOrderWeek) {
    	for(var i = 0; i<=positionOfOrderWeek; i++){
        	var insOutProperty = "insOutsQuantityWeek" + (i+1);
        	oRm.write("<td width='6%' height='30px'>");
        	oRm.renderControl(oControl.getAggregation(insOutProperty));
        	oRm.write("</td>");
        }
        for(var j=positionOfOrderWeek+1; j<noOfWeeks ; j++){
        	oRm.write("<td width='6%' class='impInvNormalTableTd'>" + oControl.getModel().getProperty('/InventoryItemsData/' + j + '/' + jsonProperty) + "</td>");
        }
       
    },
    
    /***
     * This method will helpful to display all Beginning Inventory, Beginning DOI, Inventory Variance, Ins/Outs, Current ordered, Suggested, Ordered, Confirmed, Change Request, Planned Quantity, Transit Quantity, Arrived Quantity, Distribute Forecast, Prior Year Sales, +-/%, End Inventory, Projected DOI and Target DOI rows in the Custom Table Control in the view page
     * @param oRm - Renderer Manager
     * @param oControl - control of renderer
     * @param index - Index of 14 Properties to be populated
     * @param noOfWeeks - Total number of weeks for which InsOut data needs to be populated
     * @param positionOfOrderWeek - position for the current ordered week
     * @memberOf inventory.control.ImportInventoryWSItemTable
     */
    _renderDataRows: function(oRm, oControl, index, noOfWeeks, positionOfOrderWeek) {
        var jsonProperty = '';
        var rowLabel = '';
        var plannedQuantityRowNo1 = 1;
        var plannedQuantityRowNo2 = 3;
        var inTransitRowNo = 2;
        
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
        oRm.write("<tr id=" + (oControl.sId + jsonProperty) + " height='30px'>");
        if (index == 5) {
            oRm.write("<td width='1%' class='impInvTextCenter'>");
            oRm.renderControl(oControl.getAggregation('expandCollapseSuggestQuantity'));
            oRm.write("</td>");
        }
        else if (index == 10) {
            oRm.write("<td width='1%' class='impInvTextCenter'>");
            oRm.renderControl(oControl.getAggregation('expandCollapsePriorYearSales'));
            oRm.write("</td>");
        }
        else {
            oRm.write("<td width='1%'>");
            oRm.write("</td>");
        }
        oRm.write("<td width='8.95%' class='impInvPadLeft impinvTableFirstColumn'>" + rowLabel + "</td>");

        if (index == 3) {
        	//Inventory Variance to be calculated for only for previous week and current week (week of 3/3 and 3/10 in this example)
        	
        	var sCurrentWeekBegINV = oControl.getModel().getProperty('/InventoryItemsData/0/BegINV');
    		var sPreviousWeekEndINV = oControl.getModel().oData.AnalyticsData[3].EndINV;
    		var sInvVariance = sCurrentWeekBegINV - sPreviousWeekEndINV;
    		oRm.write("<td width='6%' class='impInvNormalTableTd'>" + sInvVariance + "</td>");
    		
    		var sCurrentWeekBeginingInventory = oControl.getModel().getProperty('/InventoryItemsData/1/BegINV');
    		var sPreviousWeekEndingInventory = oControl.getModel().getProperty('/InventoryItemsData/0/EndINV');
    		var sInventoryVariance = sCurrentWeekBeginingInventory - sPreviousWeekEndingInventory;
    		oRm.write("<td width='6%' class='impInvNormalTableTd'>" + sInventoryVariance + "</td>");
    		
        	for(var i = 2; i<noOfWeeks; i++){
        		if(i == positionOfOrderWeek){
        			oRm.write("<td width='6%' class='impInvTableTd'>" + oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonProperty) + "</td>");
        		}
        		else{
        			oRm.write("<td width='6%' class='impInvNormalTableTd'>" + oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonProperty) + "</td>");
        		}
        	}
        }
        if (index == 4) {
        	//Render the Insout Row for Inventory Data
        	oControl._renderinsOutsQuantityWeekRow(jsonProperty, oRm, oControl, noOfWeeks, positionOfOrderWeek);
        }
        else if(index == 5){
        	//Render the Current Order Quantity
        	for(var i = 0; i<noOfWeeks; i++){            	
        		if(i === positionOfOrderWeek){
        			oRm.write("<td width='6%' height='30px' class='impInvTableTd impInvTableArrowTd'>");
        			oRm.renderControl(oControl.getAggregation('currentOrderedQuantity'));        			
        			oControl.getAggregation('currentOrderedQuantity').bindProperty("value", "/InventoryItemsData/" + i + "/Current_Ord_Qty");
        			oControl.getAggregation('currentOrderedQuantity').bindProperty("readOnly", "/InventoryItemsData/" + i + "/readOnly");
        			oRm.write("</td>");
        		}else{
        			oRm.write("<td width='6%' class='impInvNormalTableTd'>" + oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonProperty) + "</td>");
        		}
        	}
        	oControl._renderSuggestQuantityRow(oRm, oControl, noOfWeeks, positionOfOrderWeek);
        }
        else if(index == 6){
    		//Render the changed Request Week
        	for(var i = 0; i<noOfWeeks; i++){
        		if(i == positionOfOrderWeek){
        			oRm.write("<td width='6%' class='impInvTableTd'>" + oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonProperty) + "</td>");
        		}
        		else{
        			oRm.write("<td width='6%' class='impInvNormalTableTd'>" + oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonProperty) + "</td>");
        		}
        	}
        }
        else if(index == 7){        	
        	//Planned Ship		Links at Row 1 and row 3        	
        	for(var i = 0; i<noOfWeeks; i++){
        		if(i == (plannedQuantityRowNo1 - 1)){
        			// comparing with "PlannedQty" = "0", since "0" is the value coming from oData service
                    if (oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonProperty) == "0") {
                    	oRm.write("<td width='6%' class='impInvNormalTableTd'>" + oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonProperty) + "</td>");
                    } else {
                    	oRm.write("<td width='6%' height='30px' class='impInvNormalTableTd'>");
                    	oRm.renderControl(oControl.getAggregation('plannedQuantityLinkWeek1'));
                    	oRm.write("</td>");
                    }
        			
        		}
        		else if(i == (plannedQuantityRowNo2 - 1)){
        			if (oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonProperty) == "0") {
                    	oRm.write("<td width='6%' class='impInvNormalTableTd'>" + oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonProperty) + "</td>");
                    } else {
                    	oRm.write("<td width='6%' height='30px' class='impInvNormalTableTd'>");
            			oRm.renderControl(oControl.getAggregation('plannedQuantityLinkWeek3'));
            			oRm.write("</td>");
                    }
        			
        		}
        		else{
        			if(i == positionOfOrderWeek){
            			oRm.write("<td width='6%' class='impInvTableTd'>" + oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonProperty) + "</td>");
            		}
            		else{
            			oRm.write("<td width='6%' class='impInvNormalTableTd'>" + oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonProperty) + "</td>");
            		}
        		}
        	}
        }
        else if(index == 8){
        	//In-Transit Ship        	
        	for(var i = 0; i<noOfWeeks; i++){
        		if(i == (inTransitRowNo - 1)){
        			// comparing with "TransitQty" = "0", since "0" is the value coming from oData service
                    if (oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonProperty) == "0") {
                    	oRm.write("<td width='6%' class='impInvNormalTableTd'>" + oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonProperty) + "</td>");
                    } else {
                    	oRm.write("<td width='6%' height='30px' class='impInvNormalTableTd'>");
                    	oRm.renderControl(oControl.getAggregation('inTransitQuantityLink'));
                    	oRm.write("</td>");
                    }        			
        		}
        		else{
        			if(i == positionOfOrderWeek){
            			oRm.write("<td width='6%' class='impInvTableTd'>" + oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonProperty) + "</td>");
            		}
            		else{
            			oRm.write("<td width='6%' class='impInvNormalTableTd'>" + oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonProperty) + "</td>");
            		}
        		}
        	}
        }
        else if(index == 10){
        	//Dist-Forecast   - added aggregation for Dist Forecast    	
        	for(var i = 0; i<noOfWeeks; i++){//        		
        		if(i  === 0 || i  === 1){
        			oRm.write("<td width='6%' class='impInvNormalTableTd'>" + oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonProperty) + "</td>");
        		}
        		else{
                	var distForecastProperty = "distForecastQuantityWeek" + (i+1);
                	oRm.write("<td width='6%' height='30px'>");
                	oRm.renderControl(oControl.getAggregation(distForecastProperty));
                	oRm.write("</td>");
        		}
        	}
        	oControl._renderPriorYearSalesRow(oRm, oControl, noOfWeeks, positionOfOrderWeek);
        }
        else if(index == 12){
        	//Renders Projected DOIRow
        	for(var i = 0; i<noOfWeeks; i++){
        		oControl._renderProjectedDOIRow(i, jsonProperty, oRm, oControl, noOfWeeks, positionOfOrderWeek);
        	}
        }
        else if(index != 3 && index != 4 && index != 5 && index != 6 && index != 7 && index != 8 && index != 10){
        	for(var i = 0; i<noOfWeeks; i++){
        		if(i == positionOfOrderWeek){
        			oRm.write("<td width='6%' class='impInvTableTd'>" + oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonProperty) + "</td>");
        		}
        		else{
        			oRm.write("<td width='6%' class='impInvNormalTableTd'>" + oControl.getModel().getProperty('/InventoryItemsData/' + i + '/' + jsonProperty) + "</td>");
        		}
        	}
        }        
        oRm.write("</tr>");
    }
});

/***
 * This method will helpful to get all changed data in the rows of Custom Table Control in the view page
 * @param oEvent
 * @memberOf inventory.control.ImportInventoryWSItemTable
 */
mc.ccp.inventory.control.ImportInventoryWSItemTable.prototype.handleChangeDistForecast = function(oEvent) {
    var sSource = '';
    for (var key in this.mAggregations) {
        if (this.mAggregations.hasOwnProperty(key)) {
            if (oEvent.getSource().sId == this.mAggregations[key].sId) {
                sSource = key;
                break;
            }
        }
    }
//    var positionCurrentOrderWeek = MCAPP.getPositionCurrentOrderWeek();
    
    var relContextPath = '';    
    //Getting Context Path for Dist Forecast
    if(sSource.indexOf('distForecastQuantityWeek') === 0){
    	var s = sSource.split('distForecastQuantityWeek');
    	var position = parseInt(s[1]);
    	relContextPath = "/InventoryItemsData/" + (position-1) + "/DistForecast";
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
    this._calculateSalesAndAccuracy();
    this._calculateProjectedDOI();
    this.rerender();
};

/***
 * This method will helpful to calculate the Percentage Sales and First Accuracy based on DistForecast, Prior Year Sales and CurrentYearSales in the Custom Table Control
 *@memberOf inventory.control.ImportInventoryWSItemTable
 */
mc.ccp.inventory.control.ImportInventoryWSItemTable.prototype._calculateSalesAndAccuracy = function() {
    var noOfWeeks = 15;
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
 * This method will helpful to get all changed data in the rows of Custom Table Control in the view page
 * @param oEvent
 * @memberOf inventory.control.ImportInventoryWSItemTable
 */
mc.ccp.inventory.control.ImportInventoryWSItemTable.prototype.handleChangeInsOuts = function(oEvent) {
    var sSource = '';
    for (var key in this.mAggregations) {
        if (this.mAggregations.hasOwnProperty(key)) {
            if (oEvent.getSource().sId == this.mAggregations[key].sId) {
                sSource = key;
                break;
            }
        }
    }
    var positionCurrentOrderWeek = MCAPP.getPositionCurrentOrderWeek();
    
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
        case 'insOutsQuantityWeek5':
            relContextPath = "/InventoryItemsData/4/Ins_Out";
            break;
        case 'insOutsQuantityWeek6':
            relContextPath = "/InventoryItemsData/5/Ins_Out";
            break;
        case 'insOutsQuantityWeek7':
            relContextPath = "/InventoryItemsData/6/Ins_Out";
            break;
        case 'insOutsQuantityWeek8':
            relContextPath = "/InventoryItemsData/7/Ins_Out";
            break;       
        case 'insOutsQuantityWeek9':
            relContextPath = "/InventoryItemsData/8/Ins_Out";
            break;
        case 'insOutsQuantityWeek10':
            relContextPath = "/InventoryItemsData/9/Ins_Out";
            break; 
        case 'currentOrderedQuantity':
            relContextPath = "/InventoryItemsData/" + positionCurrentOrderWeek + "/Current_Ord_Qty";
            break;
    }
//    //Getting Context Path for Dist Forecast
//    if(sSource.indexOf('distForecastQuantityWeek') === 0){
//    	var s = sSource.split('distForecastQuantityWeek');
//    	var position = s[1];
//    	relContextPath = "/InventoryItemsData/" + (position-1) + "/DistForecast";
//    }
    
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
 * @memberOf inventory.control.ImportInventoryWSItemTable
 */
mc.ccp.inventory.control.ImportInventoryWSItemTable.prototype._isDirty = function() {
    var oChangedModel = this.getModel();
    var oOriginalModel = this.getModel('backup');
    if (!oOriginalModel) {
        oOriginalModel = this.getParent().getParent().getParent().getModel('backup');
    }
    var positionCurrentOrderWeek = MCAPP.getPositionCurrentOrderWeek();
    if (oOriginalModel.getProperty('/InventoryItemsData/0/Ins_Out') == oChangedModel.getProperty('/InventoryItemsData/0/Ins_Out') 
    		&& oOriginalModel.getProperty('/InventoryItemsData/1/Ins_Out') == oChangedModel.getProperty('/InventoryItemsData/1/Ins_Out') 
    		&& oOriginalModel.getProperty('/InventoryItemsData/2/Ins_Out') == oChangedModel.getProperty('/InventoryItemsData/2/Ins_Out') 
    		&& oOriginalModel.getProperty('/InventoryItemsData/3/Ins_Out') == oChangedModel.getProperty('/InventoryItemsData/3/Ins_Out') 
    		&& oOriginalModel.getProperty('/InventoryItemsData/4/Ins_Out') == oChangedModel.getProperty('/InventoryItemsData/4/Ins_Out') 
    		&& oOriginalModel.getProperty('/InventoryItemsData/5/Ins_Out') == oChangedModel.getProperty('/InventoryItemsData/5/Ins_Out') 
    		&& oOriginalModel.getProperty('/InventoryItemsData/6/Ins_Out') == oChangedModel.getProperty('/InventoryItemsData/6/Ins_Out') 
    		&& oOriginalModel.getProperty('/InventoryItemsData/7/Ins_Out') == oChangedModel.getProperty('/InventoryItemsData/7/Ins_Out') 
    		&& oOriginalModel.getProperty('/InventoryItemsData/' + positionCurrentOrderWeek + '/Current_Ord_Qty') == oChangedModel.getProperty('/InventoryItemsData/' + positionCurrentOrderWeek + '/Current_Ord_Qty')
    		&& oOriginalModel.getProperty('/InventoryItemsData/1/DistForecast') == oChangedModel.getProperty('/InventoryItemsData/1/DistForecast') 
    		&& oOriginalModel.getProperty('/InventoryItemsData/2/DistForecast') == oChangedModel.getProperty('/InventoryItemsData/2/DistForecast') 
    		&& oOriginalModel.getProperty('/InventoryItemsData/3/DistForecast') == oChangedModel.getProperty('/InventoryItemsData/3/DistForecast') 
    		&& oOriginalModel.getProperty('/InventoryItemsData/4/DistForecast') == oChangedModel.getProperty('/InventoryItemsData/4/DistForecast') 
    		&& oOriginalModel.getProperty('/InventoryItemsData/5/DistForecast') == oChangedModel.getProperty('/InventoryItemsData/5/DistForecast') 
    		&& oOriginalModel.getProperty('/InventoryItemsData/6/DistForecast') == oChangedModel.getProperty('/InventoryItemsData/6/DistForecast') 
    		&& oOriginalModel.getProperty('/InventoryItemsData/7/DistForecast') == oChangedModel.getProperty('/InventoryItemsData/7/DistForecast')
    		&& oOriginalModel.getProperty('/InventoryItemsData/8/DistForecast') == oChangedModel.getProperty('/InventoryItemsData/8/DistForecast') 
    		&& oOriginalModel.getProperty('/InventoryItemsData/9/DistForecast') == oChangedModel.getProperty('/InventoryItemsData/9/DistForecast') 
    		&& oOriginalModel.getProperty('/InventoryItemsData/10/DistForecast') == oChangedModel.getProperty('/InventoryItemsData/10/DistForecast') 
    		&& oOriginalModel.getProperty('/InventoryItemsData/11/DistForecast') == oChangedModel.getProperty('/InventoryItemsData/11/DistForecast') 
    		&& oOriginalModel.getProperty('/InventoryItemsData/12/DistForecast') == oChangedModel.getProperty('/InventoryItemsData/12/DistForecast') 
    		&& oOriginalModel.getProperty('/InventoryItemsData/13/DistForecast') == oChangedModel.getProperty('/InventoryItemsData/13/DistForecast') 
    		&& oOriginalModel.getProperty('/InventoryItemsData/14/DistForecast') == oChangedModel.getProperty('/InventoryItemsData/14/DistForecast') 
    		
    		) {
        return false;
    }
    else {
        return true;
    }
   
    
};

/***
 * This method will helpful to change the Projected DOI based on Current Order Qty values in the Custom Table Control
 *@param currentOrderQuantity
 *@memberOf inventory.control.ImportInventoryWSItemTable
 */
mc.ccp.inventory.control.ImportInventoryWSItemTable.prototype._calculateProjectedDOI = function() {
	// creating data for projected DOI function
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
	           crQuantity : 0,
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
 * This method will helpful to show the Inventory Shipment Screen when user press on PlannedShip & In-Transit Ship links in the Custom Table Control
 * @param oEvent
 * @memberOf inventory.control.ImportInventoryWSItemTable
 */
mc.ccp.inventory.control.ImportInventoryWSItemTable.prototype.handlePressPlannedShipLink = function(oEvent) {
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
 * This method will helpful to get the error states of changed ones in the Custom Table Control
 * @memberOf inventory.control.ImportInventoryWSItemTable
 */
mc.ccp.inventory.control.ImportInventoryWSItemTable.prototype._hasErrors = function() {
    var errorState = this.mAggregations.insOutsQuantityWeek1.getErrorState() || this.mAggregations.insOutsQuantityWeek2.getErrorState() 
    || this.mAggregations.insOutsQuantityWeek3.getErrorState() || this.mAggregations.insOutsQuantityWeek4.getErrorState() 
    || this.mAggregations.insOutsQuantityWeek5.getErrorState() || this.mAggregations.insOutsQuantityWeek6.getErrorState() 
    || this.mAggregations.insOutsQuantityWeek7.getErrorState() || this.mAggregations.insOutsQuantityWeek8.getErrorState()
    || this.mAggregations.insOutsQuantityWeek9.getErrorState() || this.mAggregations.insOutsQuantityWeek10.getErrorState()
    || this.mAggregations.distForecastQuantityWeek3.getErrorState()
    ||this.mAggregations.distForecastQuantityWeek4.getErrorState() || this.mAggregations.distForecastQuantityWeek5.getErrorState()
    ||this.mAggregations.distForecastQuantityWeek6.getErrorState() || this.mAggregations.distForecastQuantityWeek7.getErrorState()
    ||this.mAggregations.distForecastQuantityWeek8.getErrorState() || this.mAggregations.distForecastQuantityWeek9.getErrorState()
    ||this.mAggregations.distForecastQuantityWeek10.getErrorState() || this.mAggregations.distForecastQuantityWeek11.getErrorState()
    ||this.mAggregations.distForecastQuantityWeek12.getErrorState() || this.mAggregations.distForecastQuantityWeek13.getErrorState()
    ||this.mAggregations.distForecastQuantityWeek14.getErrorState() || this.mAggregations.distForecastQuantityWeek15.getErrorState();
    return errorState;
};

/***
 * This method will helpful to show/hide Suggest Quantity, Ordered Quantity and Confirm Quantity rows in the  Custom Table Control
 *  @param oEvent
 *  @memberOf inventory.control.ImportInventoryWSItemTable
 */
mc.ccp.inventory.control.ImportInventoryWSItemTable.prototype.handlePressCurrentOrderExpandAndCollapseImage = function(oEvent) {
    if (this.getExpand()) {
        jQuery.sap.byId(this.getId()).find('tr#' + this.getId() + '-forecast').hide();
        this.setExpand(false);
        this.getAggregation('expandCollapseSuggestQuantity').setSrc('image/expand.png');
    }
    else {
        //this.getId() + '-forecast';
        this.getId() + jQuery.sap.byId(this.getId()).find('tr#' + this.getId() + '-forecast').show();
        this.setExpand(true);
        this.getAggregation('expandCollapseSuggestQuantity').setSrc('image/collapse.png');
    }
};

/***
 * This method will helpful to show/hide Prior Year Sales, % +/- rows in the Custom Table Control
 * @param oEvent
 * @memberOf inventory.control.ImportInventoryWSItemTable
 */
mc.ccp.inventory.control.ImportInventoryWSItemTable.prototype.handlePressDistForecastExpandAndCollapseImage = function(oEvent) {
    if (this.getExpandPriorSales()) {
        jQuery.sap.byId(this.getId()).find('tr#' + this.getId() + '-distforecast').hide();
        this.setExpandPriorSales(false);
        this.getAggregation('expandCollapsePriorYearSales').setSrc('image/expand.png');
    }
    else {
        this.getId() + '-distforecast';
        this.getId() + jQuery.sap.byId(this.getId()).find('tr#' + this.getId() + '-distforecast').show();
        this.setExpandPriorSales(true);
        this.getAggregation('expandCollapsePriorYearSales').setSrc('image/collapse.png');
    }
};

/***
 * This method will helpful to set the Expand property for Suggest Quantity row in the Custom Table Control
 * @param oEvent
 * @memberOf inventory.control.ImportInventoryWSItemTable
 */
mc.ccp.inventory.control.ImportInventoryWSItemTable.prototype.expand = function(oEvent) {
    jQuery.sap.byId(this.getId()).find('tr#' + this.getId() + '-forecast').show();
    this.getAggregation('expandCollapseSuggestQuantity').setSrc('image/collapse.png');
    this.setExpand(true);
};

/***
 * This method will helpful to set the Collapse property for Suggest Quantity row in the Custom Table Control
 * @param oEvent
 * @memberOf inventory.control.ImportInventoryWSItemTable
 */
mc.ccp.inventory.control.ImportInventoryWSItemTable.prototype.collapse = function(oEvent) {
    jQuery.sap.byId(this.getId()).find('tr#' + this.getId() + '-forecast').hide();
    this.getAggregation('expandCollapseSuggestQuantity').setSrc('image/expand.png');
    this.setExpand(false);
};

/***
 * This method will helpful to set the Expand property for Prior Year Sales row in the Custom Table Control
 * @param oEvent
 * @memberOf inventory.control.ImportInventoryWSItemTable
 */
mc.ccp.inventory.control.ImportInventoryWSItemTable.prototype.expandPriorYearSales = function(oEvent) {
    jQuery.sap.byId(this.getId()).find('tr#' + this.getId() + '-distforecast').show();
    this.getAggregation('expandCollapsePriorYearSales').setSrc('image/collapse.png');
    this.setExpandPriorSales(true);
};

/***
 * This method will helpful to set the Collapse property for Prior Year Sales row in the Custom Table Control
 * @param oEvent
 * @memberOf inventory.control.ImportInventoryWSItemTable
 */
mc.ccp.inventory.control.ImportInventoryWSItemTable.prototype.collapsePriorYearSales = function(oEvent) {
    jQuery.sap.byId(this.getId()).find('tr#' + this.getId() + '-distforecast').hide();
    this.getAggregation('expandCollapsePriorYearSales').setSrc('image/expand.png');
    this.setExpandPriorSales(false);
};

/***
 * Called when the Control is destroyed. Use this one to free resources and finalize activities.
 *@param oEvent
 *@memberOf inventory.control.ImportInventoryWSItemTable
 */
mc.ccp.inventory.control.ImportInventoryWSItemTable.prototype.exit = function(oEvent) {
	//Clearing the Calculated Position for current Order Week, as It would be different for each SKU
    MCAPP.clearPositionCurrentOrderWeek(); 
    //Detaching Change Event for Ins/Out Quantity Weeks for Current Week + 1 to Current Week + 8 
    for (var i = 0; i <= 9; i++) {
        this.getAggregation('insOutsQuantityWeek' + (i + 1)).detachChange(this.handleChangeInsOuts, this);
    }
    //Detaching Change Event for Dist Forecast Quantity Weeks for Week 3 (Current Week +1) to Week 15
    for (var i = 2; i <= 14; i++) {
        this.getAggregation('distForecastQuantityWeek' + (i + 1)).detachChange(this.handleChangeDistForecast, this);
    }
    
    this.getAggregation('currentOrderedQuantity').detachChange(this.handleChangeInsOuts, this);
    this.getAggregation('plannedQuantityLinkWeek1').detachPress(this.handlePressPlannedShipLink, this);
    this.getAggregation('plannedQuantityLinkWeek3').attachPress(this.handlePressPlannedShipLink, this);
    this.getAggregation('inTransitQuantityLink').attachPress(this.handlePressPlannedShipLink, this);
    this.getAggregation('expandCollapseSuggestQuantity').detachPress(this.handlePressCurrentOrderExpandAndCollapseImage, this);
    this.getAggregation('expandCollapsePriorYearSales').detachPress(this.handlePressDistForecastExpandAndCollapseImage, this);    
};