/***
 * @Author OD79
 * @Date 11/21/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is Import Order Header Fragment.
 */
sap.ui.jsfragment("mc.ccp.order.top.ImpExpHeader", {
    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf pages.header.Header
     */
    createContent: function(oController) {
        //creates the Orders Title
        var oTxtView = new sap.ui.commons.TextView({
            text: MCAPP.getText('GBL_ORDERS', this)
        }).addStyleClass('McCcpOrderHeaderTableTrTitle');
        var oHeaderFragmentRow = new mc.ccp.control.McHorizontalLayout('headerFragment', {
            height: "100%",
            width: "100%",
            widths: ["30%", "70%"],
            content: [oTxtView]
        });
        return oHeaderFragmentRow;
    }
});