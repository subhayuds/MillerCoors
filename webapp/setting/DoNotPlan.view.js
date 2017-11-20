/***
 * @Author MG53
 * @Date 11/15/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is Setting controller
 */
sap.ui.jsview("mc.ccp.setting.DoNotPlan", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf setting.DoNotPlan
	* @returns mc.ccp.setting.DoNotPlan
	*/ 
	getControllerName : function() {
		return "mc.ccp.setting.DoNotPlan";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf setting.DoNotPlan
	* @param oController 
	* @returns sap.ui.commons.FormattedTextView
	*/ 
	createContent : function(oController) {		 				
		var oText = MCAPP.getText("VW_DNP_REPLAN_HIDE", this);
		oText += '<ul><li>'+ MCAPP.getText("VW_DNP_ORDER_STARTING", this) +'</li>';	
		oText += '<li>'+ MCAPP.getText("VW_DNP_ORDER_WITHIN", this) +'</li>';
		oText += '<li>'+ MCAPP.getText("VW_DNP_ORDER_PROCESSED", this) +'</li>';
		oText += '<li>'+ MCAPP.getText("VW_DNP_ORDER_AUTOMATICALLY", this) +'</li></ul>';			
		var oTextView = new sap.ui.commons.FormattedTextView();		
		oTextView.setHtmlText(oText);
		return oTextView;		
	}
});
