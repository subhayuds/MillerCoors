/***
 * @Author II84
 * @Date 14-10-2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is Custom Control Table for Analytics data in Inventory WorkSheet View.
 */
jQuery.sap.declare('mc.ccp.inventory.control.ImportInventoryAnalyticsTable');
jQuery.sap.require("mc.ccp.control.McArrowTextField");
sap.ui.core.Control.extend('mc.ccp.inventory.control.ImportInventoryAnalyticsTable', {
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
            'dirtyState': {
                type: "boolean",
                defaultValue: false
            },
            'errorState': {
                type: "boolean",
                defaultValue: false
            }
        },
        events: {
            'change': {},
            'press': {}
        }
    },
    
    /**
     * Called when this control is instantiated.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf inventory.ImportInventoryAnalyticsTable
     */
    init: function() {
        jQuery.sap.log.info('CHECK INIT ::' + this.sId);
    },
    
    /**
     * This method will helpful to display the HTML elements in the view page
     * @memberOf inventory.ImportInventoryAnalyticsTable
     */
    renderer: function(oRm, oControl) {
        oRm.write("<div ");
        oRm.writeControlData(oControl);
        oRm.addStyle("width", oControl.getWidth());
        oRm.writeStyles();
        oRm.writeClasses();
        oRm.write(">");
        oRm.write("<table border=0 height='100%' width='100%' cellpadding='0' cellspacing='0' class='invAnalyticsTable' >");
        for (var i = 1; i < 6; i++) {
            oControl._renderDataRows(oRm, oControl, i);
        }
        oRm.write("</table>");
        oRm.write("</div>");
    },
    
    /**
     * This method will helpful to display all rows in the Custom Table Control in the view page
     * @memberOf inventory.ImportInventoryAnalyticsTable
     */
    _renderDataRows: function(oRm, oControl, index) {
        var jsonProperty = '';
        var rowLabel = '';
        switch (index) {
            case 1:
                jsonProperty = "Week_No";
                rowLabel = MCAPP.getText('VW_INV_WORK_SHEET_EMPTY');
                break;
            case 2:
                jsonProperty = "CurrentYearSales";
                rowLabel = MCAPP.getText('VW_INV_WORK_SHEET_SALES');
                break;
            case 3:
                jsonProperty = "PriorYearSales";
                rowLabel = MCAPP.getText('VW_INV_WORK_SHEET_PY_SALES');
                break;
            case 4:
                jsonProperty = "PERCENTAGE_SALES";
                rowLabel = MCAPP.getText('VW_INV_WORK_SHEET_PERC_MINUS_PLUS');
                break;
            case 5:
                jsonProperty = "FRST_ACCURACY";
                rowLabel = MCAPP.getText('VW_INV_WORK_SHEET_FIRST_ACCURACY');
                break;
        }
        oRm.write("<tr id=" + (oControl.sId + jsonProperty) + " height='30px'  class='invAnalyticsTableTr'>");
        var previousWeeks = 4;
        oRm.write("<td width='20%'>" + rowLabel + "</td>");
        for (var i = 0; i < previousWeeks; i++) {
            oRm.write("<td width='20%'>" + oControl.getModel().getProperty('/AnalyticsData/' + i + '/' + jsonProperty) + "</td>");
        }
        oRm.write("</tr>");
    }
});

/**
 * Called when the Control is destroyed. Use this one to free resources and finalize activities.
 * @memberOf inventory.ImportInventoryAnalyticsTable
 */
mc.ccp.inventory.control.ImportInventoryAnalyticsTable.prototype.exit = function(oEvent) {
    jQuery.sap.log.info('CHECK DESTROY' + this.sId);
};