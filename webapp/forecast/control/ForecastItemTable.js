/***
 * @Author so97
 * @Date 09/10/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is responsible to create the Forecast Table which is a custom control.
 */
jQuery.sap.declare('mc.ccp.forecast.control.ForecastItemTable');
jQuery.sap.require("mc.ccp.control.McArrowTextField");
sap.ui.core.Control.extend('mc.ccp.forecast.control.ForecastItemTable', {
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
            'errorState': {
                type: "boolean",
                defaultValue: false
            },
            'readOnly': {
                type: "boolean",
                defaultValue: false
            },
            'collectionName': 'string',
            'forceRender': {
				type: "boolean",
				defaultValue: false
			},
        },
        aggregations: {
            expandCollapseImage: {
                type: "sap.ui.commons.Image",
                multiple: false,
                visibility: "public"
            },
            forecastQuantityWeek3: {
                type: "mc.ccp.control.McArrowTextField",
                multiple: false,
                visibility: "public"
            },
            forecastQuantityWeek4: {
                type: "mc.ccp.control.McArrowTextField",
                multiple: false,
                visibility: "public"
            },
            forecastQuantityWeek5: {
                type: "mc.ccp.control.McArrowTextField",
                multiple: false,
                visibility: "public"
            },
            forecastQuantityWeek6: {
                type: "mc.ccp.control.McArrowTextField",
                multiple: false,
                visibility: "public"
            },
            forecastQuantityWeek7: {
                type: "mc.ccp.control.McArrowTextField",
                multiple: false,
                visibility: "public"
            },
            forecastQuantityWeek8: {
                type: "mc.ccp.control.McArrowTextField",
                multiple: false,
                visibility: "public"
            },
            forecastQuantityWeek9: {
                type: "mc.ccp.control.McArrowTextField",
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
     * Called when Forecast ItemTable is instantiated.
     * Can be used to modify the control before it is displayed, to bind event handlers and do other one-time initialization.
     */
    init: function() {
    	// setting Aggregation for forecast Quantity from week 3 to week 9.
        var noOfWeeks = 9;
        for (var i = 2; i <= noOfWeeks - 1; i++) {
            var sForecastQuantityWeek = "forecastQuantityWeek" + (i + 1);
            var oForecastQuantity = new mc.ccp.control.McArrowTextField({
                arrows: false,
            }).bindProperty("value", "ZCCP_FORE_HEAD_ITEM_NAV/results/" + (i+3) + "/DistForecast");
            oForecastQuantity.bindProperty("readOnly", "readOnly");
            oForecastQuantity.getAggregation("textField").setMaxLength(16);
            this.setAggregation(sForecastQuantityWeek, oForecastQuantity);
        }
        var oExpandCollapseImage = new sap.ui.commons.Image({
            src: 'image/expand.png'
        });
        this.setAggregation('expandCollapseImage', oExpandCollapseImage);
    },
    
    /**
     * Similar to onAfterRendering, but this hook is invoked before the custom control is re-rendered
     * (NOT before the first rendering! init() is used for that one!).
     */
    onBeforeRendering: function() {
        var noOfWeeks = 9;
        for (var i = 2; i <= noOfWeeks - 1; i++) {
            this.getAggregation('forecastQuantityWeek' + (i + 1)).detachChange(this.handleChangeForecastQuantity, this);
        }
        this.getAggregation('expandCollapseImage').detachPress(this.handlePressExpandCollapse, this);
    },
    
    /**
     * Called when the custom control has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     */
    onAfterRendering: function() {
        var noOfWeeks = 9;
        for (var i = 2; i <= noOfWeeks - 1; i++) {
            this.getAggregation('forecastQuantityWeek' + (i + 1)).attachChange(this.handleChangeForecastQuantity, this);
        }
        this.getAggregation('expandCollapseImage').attachPress(this.handlePressExpandCollapse, this);
        if (this.getExpand()) {
            this.expand();
        }
        else {
            this.collapse();
        }
    },
    
    /***
     * Is called to render the Forecast item table control.
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
        oRm.write("<table class='McCcpForecastItemTbl'>");
        oRm.write("<tr class='McCcpForecastItemTblSpaceTr'><td colspan='10'></td></tr>");
        oControl._renderHeaderRow(oRm, oControl);
        oControl._renderForecastRow(oRm, oControl);
     // looping 3 times to render the PY Sales,% -/+,MillerCoors forecast
        for (var i = 1; i < 4; i++) {
            oControl._renderRow(oRm, oControl, i);
        }
        oControl._renderForecastInnerTable(oRm, oControl);
        oRm.write("</table>");
        oRm.write("</div>");
    },
    
    /***
     * Is called to create the header row for each record of the table.
     * @param oRm
     * @param oControl
     */
    _renderHeaderRow: function(oRm, oControl) {
        oRm.write("<tr class='McCcpForecastItemTblHdrTr'>");
        oRm.write("<td  colspan=2>");
        oRm.renderControl(oControl.getAggregation('expandCollapseImage'));
        oRm.write("</td>");
        oRm.write("<td>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).Dist_SKU.trim() + "</td>");
        oRm.write("<td>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).SKU.trim() + "</td>");
        oRm.write("<td colspan=4>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).SKU_Desc + "</td>");
        oRm.write("<td>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).ShipToId + "</td>");
        oRm.write("<td  title ='"+ oControl.getModel().getProperty(oControl.getBindingContext().getPath()).SourceName +"'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).SourceName + "</td>");
        oRm.write("<td>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).EstdTransitDays +"</td>");
        oRm.write("</tr>");
    },
    
    /***
     * Is called to create the forecast row for each record of the table..
     * @param oRm
     * @param oControl
     */
    _renderForecastRow: function(oRm, oControl) {
        var jsonProperty = 'DistForecast';
        oRm.write("<tr id=" + (oControl.sId + '-forecast') + " class='McCcpForecastItemTblStdHght McCcpForecastItemTblFrctTr'>"); 
        oRm.write("<td  colspan=2 class='McCcpForecastItemTblLblCol'>" + this.getModel('i18n').getProperty('VW_FORECAST_DIST_FORECAST') + "</td>");
        oRm.write("<td class='McCcpForecastItemTblDataCol'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_FORE_HEAD_ITEM_NAV/results/3/' + jsonProperty) + "</td>");
        oRm.write("<td class='McCcpForecastItemTblDataCol'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_FORE_HEAD_ITEM_NAV/results/4/' + jsonProperty) + "</td>");
        var noOfWeeks = 9;
        for (var i = 2; i <= noOfWeeks - 1; i++) {
            oRm.write("<td class='forecastTdDataColPadding McCcpForecastItemTblStdHght'>");
            oRm.renderControl(oControl.getAggregation('forecastQuantityWeek' + (i + 1)));
            oRm.write("</td>");
        }
        oRm.write("</tr>");
    },
    
    /***
     * Is called to create the  row for each prior year sale of the table,percentage sale, mc forecast
     * @param oRm
     * @param oControl
     * @param index
     */
    _renderRow: function(oRm, oControl, index) {
        var jsonProperty = '';
        var rowLabel = '';
        switch (index) {
            case 1:
                jsonProperty = "PriorYearSales";
                rowLabel = this.getModel('i18n').getProperty('VW_FORECAST_PY_SALES');
                break;
            case 2:
                jsonProperty = "PERCENTAGE_SALES";
                rowLabel = this.getModel('i18n').getProperty('VW_FORECAST_PERCENTAGE_SALES');
                break;
            case 3:
                jsonProperty = "MCForecast";
                rowLabel = this.getModel('i18n').getProperty('VW_FORECAST_MC_FORE');
                break;
        }
        oRm.write("<tr id=" + (oControl.sId + jsonProperty) + " style='display:none' class='McCcpForecastItemTblTr McCcpForecastItemTblStdHght'>"); 
        oRm.write("<td  colspan=2 class='McCcpForecastItemTblLblCol'>" + rowLabel + "</td>");
        var totalNoOfWeeks = 12;
        var previousWeekIndex = 3;
        for (previousWeekIndex; previousWeekIndex < totalNoOfWeeks; previousWeekIndex++) {
        	 if (previousWeekIndex == 6) {
                 oRm.write("<td class='McCcpForecastItemTblDataCol McCcpForecastItemTblStdHght'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_FORE_HEAD_ITEM_NAV/results/'+previousWeekIndex+'/' + jsonProperty) + "</td>");
             }
             else {
            	 oRm.write("<td class='McCcpForecastItemTblDataCol'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_FORE_HEAD_ITEM_NAV/results/'+previousWeekIndex+'/' + jsonProperty) + "</td>");
             }
            
        }
        oRm.write("</tr>");
    },
    
    /***
     * Is called to create the inner table which is  hidden initially.
     * @param oRm
     * @param oControl
     */
    _renderForecastInnerTable: function(oRm, oControl) {
    	//debugger;
        var jsonProperty = 'Week_No';
        var totalNumberOfWeeks = 12;
        oRm.write("<tr id=" + (oControl.sId + '-forecastInnerTable') + " height='170px' style='' class='forecastTableFrctTr'>"); 
        oRm.write("<td  colspan=2 class='McCcpForecastItemTblLblCol'></td>");
        oRm.write("<td colspan='9' style='border:1px solid grey'>");
        oRm.write("<table width='56%' class='collapsedBorder' style='margin:auto;'>");
        oRm.write("<tr class='forecastTdAlignRight McCcpForecastItemTblStdHght'><th>&nbsp;</th>  ");
        //the inner table displays the records from 0th to 3rd
        for (var i = 0; i < totalNumberOfWeeks - 8; i++) {
            oRm.write("<th>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_FORE_HEAD_ITEM_NAV/results/'+i+'/' + jsonProperty) + "</th>");
        }
        oRm.write("</tr>");
        oRm.write("<tr class='McCcpForecastItemTblStdHght'><td class='McCcpForecastItemTblDataCol leftAlign'>" + this.getModel('i18n').getProperty('VW_FORECAST_SALES') + "</td>");
        for (var i = 0; i < totalNumberOfWeeks - 8; i++) {
            oRm.write("<td class='McCcpForecastItemTblDataCol forecastTdAlignRight'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_FORE_HEAD_ITEM_NAV/results/'+i+'/CurrentYearSales') + "</td>");
        }
        oRm.write("</tr>");
        oRm.write("<tr class='McCcpForecastItemTblStdHght'><td class='McCcpForecastItemTblDataCol leftAlign'>" + this.getModel('i18n').getProperty('VW_FORECAST_PY_SALES') + "</td>");
        for (var i = 0; i < totalNumberOfWeeks - 8; i++) {
            oRm.write("<td class='McCcpForecastItemTblDataCol forecastTdAlignRight'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_FORE_HEAD_ITEM_NAV/results/'+i+'/PriorYearSales') + "</td>");
        }
        oRm.write("</tr>");
        oRm.write("<tr class='McCcpForecastItemTblStdHght'><td class='McCcpForecastItemTblDataCol leftAlign'>" + this.getModel('i18n').getProperty('VW_FORECAST_PERCENTAGE_SALES') + "</td>");
        for (var i = 0; i < totalNumberOfWeeks - 8; i++) {
            oRm.write("<td class='McCcpForecastItemTblDataCol forecastTdAlignRight'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_FORE_HEAD_ITEM_NAV/results/'+i+'/PERCENTAGE_SALES') + "</td>");
        }
        oRm.write("</tr>");
        oRm.write("<tr class='McCcpForecastItemTblStdHght'><td class='McCcpForecastItemTblDataCol leftAlign'>" + this.getModel('i18n').getProperty('VW_FORECAST_FRST_ACCURACY') + "</td>");
        for (var i = 0; i < totalNumberOfWeeks - 8; i++) {
            oRm.write("<td class='McCcpForecastItemTblDataCol forecastTdAlignRight'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_FORE_HEAD_ITEM_NAV/results/'+i+'/FRST_ACCURACY') + "</td>");
        }
        oRm.write("</tr></table>");
        oRm.write("</td>");
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
 * Is called on change of change forecast quantity.
 * @param oEvent
 */
mc.ccp.forecast.control.ForecastItemTable.prototype.handleChangeForecastQuantity = function(oEvent) {
    var source = '';
    for (var key in this.mAggregations) {
        if (this.mAggregations.hasOwnProperty(key)) {
            if (oEvent.getSource().sId == this.mAggregations[key].sId) {
                source = key;
                break;
            }
        }
    }
    jQuery.sap.log.info(source);
    var relativeContextPath = '';
    var weekIndex = '';
    switch (source) {
        case 'forecastQuantityWeek3':
            relativeContextPath = "/ZCCP_FORE_HEAD_ITEM_NAV/results/5/DistForecast";
            weekIndex = "5";
            break;
        case 'forecastQuantityWeek4':
            relativeContextPath = "/ZCCP_FORE_HEAD_ITEM_NAV/results/6/DistForecast";
            weekIndex = "6";
            break;
        case 'forecastQuantityWeek5':
            relativeContextPath = "/ZCCP_FORE_HEAD_ITEM_NAV/results/7/DistForecast";
            weekIndex = "7";
            break;
        case 'forecastQuantityWeek6':
            relativeContextPath = "/ZCCP_FORE_HEAD_ITEM_NAV/results/8/DistForecast";
            weekIndex = "8";
            break;
        case 'forecastQuantityWeek7':
            relativeContextPath = "/ZCCP_FORE_HEAD_ITEM_NAV/results/9/DistForecast";
            weekIndex = "9";
            break;
        case 'forecastQuantityWeek8':
            relativeContextPath = "/ZCCP_FORE_HEAD_ITEM_NAV/results/10/DistForecast";
            weekIndex = "10";
            break;
        case 'forecastQuantityWeek9':
            relativeContextPath = "/ZCCP_FORE_HEAD_ITEM_NAV/results/11/DistForecast";
            weekIndex = "11";
            break;
    }
    var changedData = oEvent.getParameter('changed');
    var originalData = null;
    var backUpModel = this.getModel('backup');
    if (backUpModel) { 
        originalData = backUpModel.getProperty(this.getBindingContext().sPath + relativeContextPath);
    }
    else { 
        originalData = this.getParent().getParent().getParent().getModel('backup').getProperty(this.getBindingContext().sPath + relativeContextPath);
    }
    if (this._isDirty()) {
        this.setDirtyState(true);
    }
    else {
        this.setDirtyState(false);
    }
    this.fireChange({
        source: source,
        changedData: changedData,
        originalData: originalData,
        dirtyState: this.getDirtyState()
    });
    this._calculatePercentSales(relativeContextPath,weekIndex);
    //this.rerender();
    this.doRender();
};

/***
 * Is called to calculate the percentage sales.
 */
mc.ccp.forecast.control.ForecastItemTable.prototype._calculatePercentSales = function(relativeContextPath,weekIndex) {
	var oCurrentRowData = this.getModel().getProperty(this.getBindingContext().sPath +"/ZCCP_FORE_HEAD_ITEM_NAV/results/"+weekIndex+"/");
	if((parseInt(oCurrentRowData.DistForecast) + parseInt(oCurrentRowData.PriorYearSales)) == 0){
		oCurrentRowData.PERCENTAGE_SALES = 0 + "%";
	}else{
		oCurrentRowData.PERCENTAGE_SALES = parseInt((oCurrentRowData.DistForecast - oCurrentRowData.PriorYearSales) / ((parseInt(oCurrentRowData.DistForecast) + parseInt(oCurrentRowData.PriorYearSales)) / 2)) + "%";
	}
	if(oCurrentRowData.CurrentYearSales == 0 || oCurrentRowData.CurrentYearSales ===undefined){
		oCurrentRowData.FRST_ACCURACY = 0 + "%";
	}else{
		oCurrentRowData.FRST_ACCURACY = parseInt(1 - Math.abs((oCurrentRowData.DistForecast - oCurrentRowData.CurrentYearSales) / oCurrentRowData.CurrentYearSales)) + "%";
	}
};

/***
 * Is called to maintain the dirty state of the record in oModel.
 */
mc.ccp.forecast.control.ForecastItemTable.prototype._isDirty = function() {
    var changedModel = this.getModel();
    var originalModel = this.getModel('backup');
    if (!originalModel) { // ONLY Works For other than FireFox
        originalModel = this.getParent().getParent().getParent().getModel('backup');
    }
    if (originalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/2/DistForecast') == changedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/2/DistForecast') && originalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/3/DistForecast') == changedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/3/DistForecast') && originalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/4/DistForecast') == changedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/4/DistForecast') && originalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/5/DistForecast') == changedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/5/DistForecast') && originalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/6/DistForecast') == changedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/6/DistForecast') && originalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/7/DistForecast') == changedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/7/DistForecast') && originalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/8/DistForecast') == changedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/8/DistForecast') && originalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/9/DistForecast') == changedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/9/DistForecast') && originalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/10/DistForecast') == changedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/10/DistForecast') && originalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/11/DistForecast') == changedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_FORE_HEAD_ITEM_NAV/results/11/DistForecast')) {
        return false;
    }
    else {
        return true;
    }
};

/***
* Is called to set the expand collapse image on click of the expand/Collapse img link.
* If user clicks on expand, forecast row would be displayed else its display would be hidden.
* @param oEvent
*/
mc.ccp.forecast.control.ForecastItemTable.prototype.handlePressExpandCollapse = function(oEvent) {
    if (this.getExpand()) {
        jQuery.sap.byId(this.getId()).find('tr#' + this.getId() + '-forecastInnerTable').hide();
        this.setExpand(false);
        this.getAggregation('expandCollapseImage').setSrc('image/expand.png');
        this.fireCollapse();
    }
    else {
        jQuery.sap.byId(this.getId()).find('tr#' + this.getId() + '-forecastInnerTable').show();
        jQuery.sap.byId(this.getId()).find('tr#' + this.getId() + 'PriorYearSales').show();
        jQuery.sap.byId(this.getId()).find('tr#' + this.getId() + 'PERCENTAGE_SALES').show();
        jQuery.sap.byId(this.getId()).find('tr#' + this.getId() + 'MCForecast').show();
        this.setExpand(true);
        this.getAggregation('expandCollapseImage').setSrc('image/collapse.png');
        this.fireExpand();
    }
};

/***
* Is a method  to change the collapse image to expand image. Also it will display the PY Sales,% -/+,MillerCoors rows.
* @param oEvent
*/
mc.ccp.forecast.control.ForecastItemTable.prototype.expand = function(oEvent) {
    jQuery.sap.byId(this.getId()).find('tr#' + this.getId() + '-forecastInnerTable').show();
    jQuery.sap.byId(this.getId()).find('tr#' + this.getId() + 'PriorYearSales').show();
    jQuery.sap.byId(this.getId()).find('tr#' + this.getId() + 'PERCENTAGE_SALES').show();
    jQuery.sap.byId(this.getId()).find('tr#' + this.getId() + 'MCForecast').show();
    this.getAggregation('expandCollapseImage').setSrc('image/collapse.png');
    jQuery.sap.byId(this.getId()).find('td img').attr("src", "image/collapse.png");
    this.setExpand(true);
};

/***
* Is a method  to change the expanded image to collapse image. Also it will hide PY Sales,% -/+,MillerCoors.
* @param oEvent
*/
mc.ccp.forecast.control.ForecastItemTable.prototype.collapse = function(oEvent) {
    jQuery.sap.byId(this.getId()).find('tr#' + this.getId() + '-forecastInnerTable').hide();
    this.getAggregation('expandCollapseImage').setSrc('image/expand.png');
    this.setExpand(false);
};

/***
* Is called implicitly by the framework to clean up the resource.
* @param oEvent */
mc.ccp.forecast.control.ForecastItemTable.prototype.exit = function(oEvent) {
    jQuery.sap.log.info('CHECK DESTROY' + this.sId);
};