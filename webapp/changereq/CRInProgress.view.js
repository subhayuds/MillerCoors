sap.ui.jsview("mc.ccp.changereq.CRInProgress", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf changereq.CRPreview
	*/ 
	getControllerName : function() {
		return "mc.ccp.changereq.CRInProgress";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf changereq.CRPreview
	*/ 
	createContent : function(oController) {
		//Required Library
		jQuery.sap.require("mc.ccp.control.McHorizontalLayout");
		
		var oLblDesc = new sap.ui.commons.Label({
			wrapping :true,
			text : MCAPP.getText('VW_CR_PRW_IN_PROG_DESC',this)
		});
		
		var oLblChangeReqNo = new sap.ui.commons.Label({
			text:MCAPP.getText('VW_CR_PRW_CHANGE_REQ_NO',this)
		});
		
		var oLblStatus = new sap.ui.commons.Label({
			text : MCAPP.getText('VW_CR_PRW_STATUS',this)
		});
		
		var oLblDateSub = new sap.ui.commons.Label({
			text : MCAPP.getText('VW_CR_PRW_DATE_SUBMITTED',this)
		});
		
		var oLblCnfmQty = new sap.ui.commons.Label({
			text : MCAPP.getText('VW_CR_PRW_CONFIRMED_QTY',this)
		});
		
		var oLblCRqty = new sap.ui.commons.Label({
			text : MCAPP.getText('VW_CR_PRW_CHANGE_REQ_QTY',this)
		});
		
		var oLblRsn = new sap.ui.commons.Label({
			text : MCAPP.getText('VW_CR_PRW_REASON',this)
		});
		
		var sLblChangeReqNo = new sap.ui.commons.Label(this.createId("changeReqNo"),{
		});
		
		var sLblStatus = new sap.ui.commons.Label(this.createId("statusText"),{
		});
		
		var sLblDateSub = new sap.ui.commons.Label(this.createId("dateSubmt"),{
		});
		
		var sLblCnfmQty = new sap.ui.commons.Label(this.createId("confQTy"),{
		});
		
		var sLblCRqty = new sap.ui.commons.Label(this.createId("creqQty"),{
		});
		
		var sLblRsn = new sap.ui.commons.Label(this.createId("reason"),{
		});
		
		var oRowDummy = new  mc.ccp.control.McHorizontalLayout({
			height : "25px",
			width  : "500px",
			ptop : "5px",
			widths : [ "10%", "50%" ,"30%"],			
			content: [new sap.ui.core.HTML(),new sap.ui.core.HTML(),new sap.ui.core.HTML()] 			
		});
		
		var oRow1 = new  mc.ccp.control.McHorizontalLayout({
			height : "25px",
			width  : "500px",
			ptop : "5px",
			widths : [ "10%", "50%" ,"30%"],			
			content: [new sap.ui.core.HTML(),oLblChangeReqNo,sLblChangeReqNo] 			
		});	
		
		var oRow2 = new  mc.ccp.control.McHorizontalLayout({
			height : "25px",
			width  : "500px",
			ptop : "5px",
			widths : [ "10%", "50%" ,"30%"],			
			content: [new sap.ui.core.HTML(),oLblStatus,sLblStatus] 			
		});	
		
		var oRow3 = new  mc.ccp.control.McHorizontalLayout({
			height : "25px",
			width  : "500px",
			ptop : "5px",
			widths : [ "10%", "50%" ,"30%"],			
			content: [new sap.ui.core.HTML(),oLblDateSub,sLblDateSub] 			
		});	
		
		var oRow4 = new  mc.ccp.control.McHorizontalLayout({
			height : "25px",
			width  : "500px",
			ptop : "5px",
			widths : [ "10%", "50%" ,"30%"],			
			content: [new sap.ui.core.HTML(),oLblCnfmQty,sLblCnfmQty] 			
		});	
		
		var oRow5 = new  mc.ccp.control.McHorizontalLayout({
			height : "25px",
			width  : "500px",
			ptop : "5px",
			widths : [ "10%", "50%" ,"30%"],			
			content: [new sap.ui.core.HTML(),oLblCRqty,sLblCRqty] 			
		});	
		
		var oRow6 = new  mc.ccp.control.McHorizontalLayout({
			height : "25px",
			width  : "500px",
			ptop : "5px",
			widths : [ "10%", "50%" ,"30%"],			
			content: [new sap.ui.core.HTML(),oLblRsn,sLblRsn] 			
		});	
		
		var oVerticalLayout = new sap.ui.layout.VerticalLayout({
			content : [oLblDesc,oRowDummy,oRow1,oRow2,oRow3,oRow4,oRow5,oRow6]
		});
		return oVerticalLayout;
	}

});
