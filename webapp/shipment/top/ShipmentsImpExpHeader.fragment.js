/***
 * @Author FN31
 * @Date 12/05/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is Shipment Import/Export Header fragment
 */
sap.ui.jsfragment("mc.ccp.shipment.top.ShipmentsImpExpHeader", {
	
    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf shipment.top.ShipmentsImpExpHeader
     */
    createContent: function(oController) {
    	//creating Settings label for Header section
        var oTextView = new sap.ui.commons.TextView({
            text: MCAPP.getText('VW_SHIPMENT_IMP_EXP_HEADER_TITLE', this),
        }).addStyleClass('McCcpOrderHeaderTableTrTitle');
        
        //Creating Print Icon
        var oPrintIcon = new sap.ui.core.Icon({
            src: sap.ui.core.IconPool.getIconURI('print')
        }).addStyleClass('printIcon');
        oPrintIcon.attachPress(oController.onPressPrint, oController);
        
        //Add this label to custom horizontal layout
        var oLayout = new mc.ccp.control.McHorizontalLayout('headerFragment', {
            height: "100%",
            width: "100%",
            widths: ["95%", "5%"],
            content: [oTextView, oPrintIcon]
        });
        return oLayout;
    }
});