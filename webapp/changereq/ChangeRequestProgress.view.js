/***
 * @Author OD79
 * @Date 10/16/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is Change Request Progress View
 */
sap.ui.jsview("mc.ccp.changereq.ChangeRequestProgress", {
    /** Specifies the Controller belonging to this View. 
     * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
     * @memberOf changereq.ChangeRequestProgress
     */
    getControllerName: function() {
        return "mc.ccp.changereq.ChangeRequestProgress";
    },
    
    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf changereq.ChangeRequestProgress
     */
    createContent: function(oController) {
        //Required Library
        jQuery.sap.require("mc.ccp.control.McHorizontalLayout");
        var oLblInProgressDesc = new sap.ui.commons.Label({
            wrapping: true,
            text: MCAPP.getText('VW_CR_PRW_IN_PROG_DESC', this)
        });
        var oLblChangeReqNo = new sap.ui.commons.Label({
            text: MCAPP.getText('VW_CR_PRW_CHANGE_REQ_NO', this)
        });
        var oLblStatus = new sap.ui.commons.Label({
            text: MCAPP.getText('VW_CR_PRW_STATUS', this)
        });
        var oLblDateSubmitted = new sap.ui.commons.Label({
            text: MCAPP.getText('VW_CR_PRW_DATE_SUBMITTED', this)
        });
        var oLblConfirmedQty = new sap.ui.commons.Label({
            text: MCAPP.getText('VW_CR_PRW_CONFIRMED_QTY', this)
        });
        var oLblChangeRequestQty = new sap.ui.commons.Label({
            text: MCAPP.getText('VW_CR_PRW_CHANGE_REQ_QTY', this)
        });
        var oLblReason = new sap.ui.commons.Label({
            text: MCAPP.getText('VW_CR_PRW_REASON', this),
            width : "250px"
        });
        var oTextViewChangeReqNo = new sap.ui.commons.TextView(this.createId("changeReqNo"), {});
        var oTextViewStatus = new sap.ui.commons.TextView(this.createId("statusText"), {});
        var oTextViewDateSubmitted = new sap.ui.commons.TextView(this.createId("dateSubmt"), {});
        var oTextViewConfirmedQty = new sap.ui.commons.TextView(this.createId("confQty"), {});
        var oTextViewChangeRequestQty = new sap.ui.commons.TextView(this.createId("creqQty"), {});
        var oTextViewReason = new sap.ui.commons.TextView(this.createId("reason"), {});
        var oRowDummy = new mc.ccp.control.McHorizontalLayout({
            height: "25px",
            width: "500px",
            ptop: "2px",
            widths: ["10%", "50%", "30%"],
            content: [new sap.ui.core.HTML(), new sap.ui.core.HTML(), new sap.ui.core.HTML()]
        });
        var oRowChangeRequestNo = new mc.ccp.control.McHorizontalLayout({
            height: "25px",
            width: "500px",
            ptop: "5px",
            widths: ["10%", "50%", "30%"],
            content: [new sap.ui.core.HTML(), oLblChangeReqNo, oTextViewChangeReqNo]
        });
        var oRowStatus = new mc.ccp.control.McHorizontalLayout({
            height: "25px",
            width: "500px",
            ptop: "5px",
            widths: ["10%", "50%", "30%"],
            content: [new sap.ui.core.HTML(), oLblStatus, oTextViewStatus]
        });
        var oRowDateSubmitted = new mc.ccp.control.McHorizontalLayout({
            height: "25px",
            width: "500px",
            ptop: "5px",
            widths: ["10%", "50%", "30%"],
            content: [new sap.ui.core.HTML(), oLblDateSubmitted, oTextViewDateSubmitted]
        });
        var oRowConfirmedQty = new mc.ccp.control.McHorizontalLayout({
            height: "25px",
            width: "500px",
            ptop: "5px",
            widths: ["10%", "50%", "30%"],
            content: [new sap.ui.core.HTML(), oLblConfirmedQty, oTextViewConfirmedQty]
        });
        var oRowChangeRequestQty = new mc.ccp.control.McHorizontalLayout({
            height: "25px",
            width: "500px",
            ptop: "5px",
            widths: ["10%", "50%", "30%"],
            content: [new sap.ui.core.HTML(), oLblChangeRequestQty, oTextViewChangeRequestQty]
        });
        var oRowReason = new mc.ccp.control.McHorizontalLayout({
            height: "35px",
            width: "500px",
            ptop: "5px",
            widths: ["10%", "50%", "30%"],
            content: [new sap.ui.core.HTML(), oLblReason, oTextViewReason]
        });
        var oVerticalLayout = new sap.ui.layout.VerticalLayout({
            content: [oLblInProgressDesc, oRowDummy, oRowChangeRequestNo, oRowStatus, oRowDateSubmitted, oRowConfirmedQty, oRowChangeRequestQty, oRowReason]
        });
        return oVerticalLayout;
    }
});