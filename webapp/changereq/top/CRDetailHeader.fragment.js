/***
 * @Author DS05
 * @Date 10/13/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is CRDetailHeader fragment
 */
sap.ui.jsfragment("mc.ccp.changereq.top.CRDetailHeader", {
	
    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf changereq.top.CRDetailHeader
     */
    createContent: function(oController) {
    	//creating Change Request Detail label for Header section
        var oTxtView = new sap.ui.commons.TextView({
            text: MCAPP.getText('VW_CR_DETAIL_HEADER_TITLE', this),
        }).addStyleClass('McCcpOrderHeaderTableTrTitle');
        //Add this label to custom horizontal layout
        var oLayout = new mc.ccp.control.McHorizontalLayout('headerFragment', {
            height: "100%",
            width: "100%",
            widths: ["24%", "76%"],
            content: [oTxtView, new sap.ui.core.HTML()]
        });
        return oLayout;
    }
});