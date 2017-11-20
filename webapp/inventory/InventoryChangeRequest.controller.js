/***
 * @Author RA03
 * @Date 14-10-2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is the controller specific to InventoryChangeRequest View.
 */
sap.ui.controller("mc.ccp.inventory.InventoryChangeRequest", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf inventory.InventoryChangeRequest
     */
    //	onInit: function() {
    //
    //	},

    /**
     * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
     * (NOT before the first rendering! onInit() is used for that one!).
     * @memberOf inventory.InventoryChangeRequest
     */
    onBeforeRendering: function() {

        // setting the binding context of the view to the data being passed from Change Request view.
        this.getView().setBindingContext(this.getView().getViewData());
        //var oCurrentBindingContext=this.getView().getBindingContext();
        var oBindingContext = this.getView().getBindingContext();
        // getting the respective properties from the binding context
        var sChangeReqNo = oBindingContext.getProperty("Change_Req_No");
        var sStatusText = oBindingContext.getProperty("CR_Status_Text");
        var sSubmitDate = oBindingContext.getProperty("CR_Submit_Date");
        var sConfirmedQty = oBindingContext.getProperty("ConfirmQty");
        var sChangeRequestQty = oBindingContext.getProperty("Change_Req_Qty");
        var sReasonText = oBindingContext.getProperty("CR_Reason_Text");
        // setting the text properties of the labels to the properties fetched above
        this.byId("changeRequestNo").setText(sChangeReqNo);
        this.byId("statusCR").setText(sStatusText);
        this.byId("dateSubmitted").setText(sSubmitDate);
        this.byId("confirmQty").setText(sConfirmedQty);
        this.byId("changerequestQty").setText(sChangeRequestQty);
        this.byId("reasonCR").setText(sReasonText);

    },

    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     * @memberOf inventory.InventoryChangeRequest
     */
    //	onAfterRendering: function() {
    //
    //	},

    /**
     * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
     * @memberOf inventory.InventoryChangeRequest
     */
    //	onExit: function() {
    //
    //	}

});