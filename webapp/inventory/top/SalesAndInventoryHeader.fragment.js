/***
 * @Author DS05
 * @Date 11/19/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is SalesAndInventoryHeader fragment
 */
sap.ui.jsfragment("mc.ccp.inventory.top.SalesAndInventoryHeader", {
	
    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf inventory.top.SalesAndInventoryHeader
     */
    createContent: function(oController) {
    	//Creating Sales & Inventory Label for Header section
        var oTextView = new sap.ui.commons.TextView({
            text: MCAPP.getText('FRG_SI_TITLE', this),
        }).addStyleClass('McCcpOrderHeaderTableTrTitle');
        //Creating "Import Data" button for Header section
        var enableFlag = false;
        if(MCAPP.isReadOnlyRole() !== true){
        	enableFlag = true;
        }
        var oImportButton = new sap.ui.commons.Button({
            icon: "sap-icon://upload",
            width : "110px",
            height : "35px",
            enabled : enableFlag
        }).addStyleClass('importDataHeader');
        oImportButton.setText(oController.getView().getModel("i18n").getProperty("FRG_SI_IMPORT_DATA"));
        oImportButton.attachPress(oController.onPressImportData, oController);
        //Adding all the above instances to vertical layout
        var oLayout = new mc.ccp.control.McHorizontalLayout('headerFragment', {
            height: "100%",
            width: "100%",
            widths: ["25%", "64%", "11%"],
            content: [oTextView, new sap.ui.core.HTML(), oImportButton]
        });
        return oLayout;
    }
});