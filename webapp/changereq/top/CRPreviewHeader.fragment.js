/***
 * @Author DS05
 * @Date 10/13/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is CRPreviewHeader fragment
 */
sap.ui.jsfragment("mc.ccp.changereq.top.CRPreviewHeader", {
	
    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf changereq.top.CRPreviewHeader
     */
    createContent: function(oController) {
    	var enableFlag = this.oController.getReadOnlyFlag();
        if(enableFlag !== true){
        	enableFlag = true;
        } else {
        	enableFlag = false;
        }
    	//Creating Change Request Preview Label for Header section
        var oTextView = new sap.ui.commons.TextView({
            text: MCAPP.getText('VW_CR_PRW_HEADER_TITLE', this),
        }).addStyleClass('McCcpOrderHeaderTableTrTitle');
        //Creating "Modify SKUs By" label for Header section
        var oSkuLink = new sap.ui.commons.Link(this.createId("idSKULinkPreview"), {
            text: MCAPP.getText('VW_CR_PRW_HEADER_MODIFY_SKU', this)
        }).attachPress(oController.onPressSave, oController);
        oSkuLink.addStyleClass('McCcpOrderHeaderRadioLable');
        //Creating Submit Request" Button for Header section
        var oSubmitReqBtn = new sap.ui.commons.Button(this.createId("idSubmitBtn"), {
            text: MCAPP.getText('VW_CR_PRW_HEADER_SUBMIT_CR_BTN', this),
            height: "35px",
            width: "100px",
            enabled : enableFlag
        }).attachPress(oController.onPressSave, oController);
        //Adding all the above instances to vertical layout
        var oLayout = new mc.ccp.control.McHorizontalLayout('headerFragment', {
            height: "100%",
            width: "100%",
            widths: ["24%", "50%", "13%", "13%"],
            content: [oTextView, new sap.ui.core.HTML(), oSkuLink, oSubmitReqBtn]
        });
        return oLayout;
    }
});