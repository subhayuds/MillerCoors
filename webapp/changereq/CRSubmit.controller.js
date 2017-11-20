sap.ui.controller("mc.ccp.changereq.CRSubmit", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf changereq.CRSubmitt
     */
    onInit: function() {
        jQuery.sap.log.info('init of chnage req Submit view');
    },

    /**
     * close is used to close the CR Submit dialog box.
     * @memberOf changereq.CRSubmitt
     */
    close: function(oEvent) {
        oEvent.getSource().getParent().close();

        var thisRouter = sap.ui.core.UIComponent.getRouterFor(this);
        thisRouter.navTo("ChangeRequestDetail");
    },
    /**
     * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
     * (NOT before the first rendering! onInit() is used for that one!).
     * @memberOf changereq.CRSubmitt
     */
    //	onBeforeRendering: function() {
    //
    //	},

    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     * @memberOf changereq.CRSubmitt
     */
    //	onAfterRendering: function() {
    //
    //	},

    /**
     * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
     * @memberOf changereq.CRSubmitt
     */
    //	onExit: function() {
    //
    //	}

});