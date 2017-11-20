/***
 * @Author OD79
 * @Date 10/16/2014 
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is Controller specific to Change Request Progress View
 */
sap.ui.controller("mc.ccp.changereq.ChangeRequestProgress", {
    /**
     * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
     * (NOT before the first rendering! onInit() is used for that one!).
     * @memberOf changereq.ChangeRequestProgress
     */
    onBeforeRendering: function() {
    	// setting the binding context of the view to the data being passed from Change Request view.
        this.getView().setBindingContext(this.getView().getViewData());
        var oBindingContext = this.getView().getBindingContext();
        // getting the respective properties from the binding context
        var sChangeReqNo = oBindingContext.getProperty("Change_Req_No");
        var sStatusText = oBindingContext.getProperty("Status_Text");
        var sSubmitDate = oBindingContext.getProperty("CR_Submit_Date");
        var sConfirmedQty = oBindingContext.getProperty("Confirmed_Qty");
        var sChangeRequestQty = oBindingContext.getProperty("Change_Req_Qty");
        var sReasonText = oBindingContext.getProperty("Reason_Text");
        // setting the text properties of the labels to the properties fetched above
        this.byId("changeReqNo").setText(sChangeReqNo);
        this.byId("statusText").setText(sStatusText);
        this.byId("dateSubmt").setText(sSubmitDate);
        this.byId("confQty").setText(sConfirmedQty);
        this.byId("creqQty").setText(sChangeRequestQty);
        this.byId("reason").setText(sReasonText);
    }
});