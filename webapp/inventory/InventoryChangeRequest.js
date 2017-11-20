sap.ui.jsview("mc.ccp.inventory.InventoryChangeRequest", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf inventory.InventoryChangeRequest
	*/ 
	getControllerName : function() {
		return "mc.ccp.inventory.InventoryChangeRequest";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf inventory.InventoryChangeRequest
	*/ 
	createContent : function(oController) {
		//Required Library
		 jQuery.sap.require("mc.ccp.control.McHorizontalLayout");
	        var oLblInProgressDesc = new sap.ui.commons.Label({
	            wrapping: true,
	            text: MCAPP.getText('VW_INV_WORK_SHEET_CR_PRW_IN_PROG_DESC', this)
	        });
	        var oLblChangeReqNo = new sap.ui.commons.Label({
	            text: MCAPP.getText('VW_INV_WORK_SHEET_CR_PRW_CHANGE_REQ_NO', this)
	        });
	        var oLblStatus = new sap.ui.commons.Label({
	            text: MCAPP.getText('VW_INV_WORK_SHEET_CR_PRW_STATUS', this)
	        });
	        var oLblDateSubmitted = new sap.ui.commons.Label({
	            text: MCAPP.getText('VW_INV_WORK_SHEET_CR_PRW_DATE_SUBMITTED', this)
	        });
	        var oLblConfirmedQty = new sap.ui.commons.Label({
	            text: MCAPP.getText('VW_INV_WORK_SHEET_CR_PRW_CONFIRMED_QTY', this)
	        });
	        var oLblChangeRequestQty = new sap.ui.commons.Label({
	            text: MCAPP.getText('VW_INV_WORK_SHEET_CR_PRW_CHANGE_REQ_QTY', this)
	        });
	        var oLblReason = new sap.ui.commons.Label({
	            text: MCAPP.getText('VW_INV_WORK_SHEET_CR_PRW_REASON', this)
	        });
	        var oTextViewChangeReqNo = new sap.ui.commons.TextView(this.createId("changeRequestNo"), {});
	        var oTextViewStatus = new sap.ui.commons.TextView(this.createId("statusCR"), {});
	        var oTextViewDateSubmitted = new sap.ui.commons.TextView(this.createId("dateSubmitted"), {});
	        var oTextViewConfirmedQty = new sap.ui.commons.TextView(this.createId("confirmQty"), {});
	        var oTextViewChangeRequestQty = new sap.ui.commons.TextView(this.createId("changerequestQty"), {});
	        var oTextViewReason = new sap.ui.commons.TextView(this.createId("reasonCR"), {});
	        var oRowDummy = new mc.ccp.control.McHorizontalLayout({
	            height: "25px",
	            width: "500px",
	            ptop: "5px",
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
	            height: "25px",
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
