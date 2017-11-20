/***
 * @Author DS05
 * @Date 10/13/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is ChangeRequestConfirmation controller
 */
sap.ui.controller("mc.ccp.changereq.ChangeRequestConfirmation", {
    /**
     * onPressClose is used to close the CR Submit dialog box.
     * @memberOf changereq.ChangeRequestConfirmation
     */
    onPressClose: function(oEvent) {
    	if(oEvent.getId() === "closeClicked"){
    		oEvent.getSource().close();
    	}else{
    		oEvent.getSource().getParent().close();
    	}
        var thisRouter = sap.ui.core.UIComponent.getRouterFor(this);
        thisRouter.navTo("ChangeRequestDetail");
    },
});