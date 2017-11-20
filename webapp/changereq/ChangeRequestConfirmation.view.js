/***
 * @Author DS05
 * @Date 10/13/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is ChangeRequestConfirmation view
 */
sap.ui.jsview("mc.ccp.changereq.ChangeRequestConfirmation", {
	
    /** Specifies the Controller belonging to this View. 
     * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
     * @memberOf changereq.ChangeRequestConfirmation
     */
    getControllerName: function() {
        return "mc.ccp.changereq.ChangeRequestConfirmation";
    },
    
    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf changereq.ChangeRequestConfirmation
     */
    createContent: function(oController) {
        jQuery.sap.require("mc.ccp.control.McHorizontalLayout");
        //********************************Row 1*************************************************
        var oTopRowForDialog = this._createTopRowForCRSubmitReq(oController);
        //********************************Row 2*************************************************
        var oCRNumberRow = this._createCRNumberRow(oController);
        //********************************Row 3*************************************************
        var oCRNumberSKURow = this._createCRNumberSKURow(oController);
        //********************************Row 4	*************************************************
        var oDateSubmittedRow = this._createDateSubmittedRow(oController);
        //adding all the rows in vertical layout
        var oLayout = new sap.ui.layout.VerticalLayout({
            content: [oTopRowForDialog, oCRNumberRow, oCRNumberSKURow, oDateSubmittedRow]
        });
        return oLayout;
    },
    
    /** This  prepares the "Change Request Submitted" label  row.
     * @memberOf changereq.ChangeRequestConfirmation
     */
    _createTopRowForCRSubmitReq: function() {
        var oTopRowTxtPart1 = new sap.ui.commons.TextView({
            text: MCAPP.getText('VW_CR_PRW_SUBMIT_TEXT', this),
            width: '100%',
            design: sap.ui.commons.TextViewDesign.p
        });
        return oTopRowTxtPart1;
    },
    
    /** This  prepares the "Change Request Number" row.
     * @memberOf changereq.ChangeRequestConfirmation
     */
    _createCRNumberRow: function() {
        var CRNumber = this.getViewData()[1];
        var oCRNumLabel = new sap.ui.commons.Label({
            text: MCAPP.getText('VW_CR_PRW_NUM_LABEL', this),
            design: sap.ui.commons.LabelDesign.Bold
        });
        var oCRNumValue = new sap.ui.commons.Label({
            text: CRNumber
        });
        var oCRNumberRowHLayout = new mc.ccp.control.McHorizontalLayout({
            height: "30px",
            width: "100%",
            ptop: "7px",
            widths: ["10%", "40%", "50%"],
            content: [new sap.ui.core.HTML(), oCRNumLabel, oCRNumValue]
        });
        return oCRNumberRowHLayout;
    },
    
    /** This  prepares the "No of SKUs" row.
     * @memberOf changereq.ChangeRequestConfirmation
     */
    _createCRNumberSKURow: function() {
        var noOfSku = this.getViewData()[0];
        var oCRNumSKULabel = new sap.ui.commons.Label({
            text: MCAPP.getText('VW_CR_PRW_NUM_SKU_LABEL', this),
            design: sap.ui.commons.LabelDesign.Bold
        });
        var oCRNumSKUValue = new sap.ui.commons.Label({
            text: noOfSku
        });
        var oCRNumberSKURowHLayout = new mc.ccp.control.McHorizontalLayout({
            height: "30px",
            width: "100%",
            ptop: "5px",
            widths: ["10%", "40%", "50%"],
            content: [new sap.ui.core.HTML(), oCRNumSKULabel, oCRNumSKUValue]
        });
        return oCRNumberSKURowHLayout;
    },
    
    /** This  prepares the "Date Submitted" row.
     * @memberOf changereq.ChangeRequestConfirmation
     */
    _createDateSubmittedRow: function() {
        var date = this.getViewData()[2];
        var oDateSubmittedLabel = new sap.ui.commons.Label({
            text: MCAPP.getText('VW_CR_PRW_DATE_SUBMIT_LABEL', this),
            design: sap.ui.commons.LabelDesign.Bold
        });
        var oDateSubmittedValue = new sap.ui.commons.Label({
            text: date
        });
        var oDateSubmittedRowHLayout = new mc.ccp.control.McHorizontalLayout({
            height: "30px",
            width: "100%",
            ptop: "5px",
            widths: ["10%", "40%", "50%"],
            content: [new sap.ui.core.HTML(), oDateSubmittedLabel, oDateSubmittedValue]
        });
        return oDateSubmittedRowHLayout;
    },
});