sap.ui.controller("mc.ccp.changereq.CRInProgress", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf changereq.CRPreview
*/
	onInit: function() {
		jQuery.sap.log.info('init of change req Preview');
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf changereq.CRPreview
*/
	onBeforeRendering: function() {
		this.getView().setBindingContext(this.getView().getViewData());
		var oCurrentBindingContext = this.getView().getBindingContext();
		var oChangeReqNo = oCurrentBindingContext.getProperty("Change_Req_No");
		var oStatusText = oCurrentBindingContext.getProperty("Status_Text");
		var oSubmitDate = oCurrentBindingContext.getProperty("CR_Submit_Date");
		var oConfirmedQty = oCurrentBindingContext.getProperty("Confirmed_Qty");
		var oCrQty = oCurrentBindingContext.getProperty("Change_Req_Qty");
		var oReasonText = oCurrentBindingContext.getProperty("Reason_Text");
	    
	    this.byId("changeReqNo").setText(oChangeReqNo);
	    this.byId("statusText").setText(oStatusText);
	    this.byId("dateSubmt").setText(oSubmitDate);
	    this.byId("confQTy").setText(oConfirmedQty);
	    this.byId("creqQty").setText(oCrQty);
	    this.byId("reason").setText(oReasonText);
	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf changereq.CRPreview
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf changereq.CRPreview
*/
//	onExit: function() {
//
//	}

});