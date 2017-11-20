/***
 * @Author UR09
 * @Date 11/13/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is inventory main page view for domestic.
 */
sap.ui.jsfragment("mc.ccp.inventory.top.Header", {
	
    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf inventory.top.Header
     */
    createContent: function(oController) {
        var oInventoryView = new sap.ui.commons.TextView({
            text: MCAPP.getText("VW_INV_DOI_SUMMARY", this),
        }).addStyleClass('McCcpInventoryHeaderTableTrTitle');
        var oHorizontalLayout = new mc.ccp.control.McHorizontalLayout({
            height: "100%",
            width: "100%",
            widths: ["30%", "70%"],
            content: [oInventoryView]
        });
        return oHorizontalLayout;
    }
});