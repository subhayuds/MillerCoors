/***
 * @Author so97
 * @Date 10/10/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is responsible to create the Forecast Table which is a custom control.
 */
sap.ui.jsfragment("mc.ccp.forecast.top.Header", {
	 /** Is initially called once. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf forecast.Forecast
     * @param oController
     */
    createContent: function(oController) {
        var oTextView = new sap.ui.commons.TextView().addStyleClass('McCcpOrderHeaderTableTrTitle');
        oTextView.setText(oController.getView().getModel("i18n").getProperty("VW_FORECAST_TITLE"));
        var enableFlag = false;
        if(MCAPP.isReadOnlyRole() !== true){
        	enableFlag = true;
        }
        //Creating "Import Data" button for Header section
        var oImportButton = new sap.ui.commons.Button({
            icon: "sap-icon://upload",
            width : "110px",
            height : "35px",
            enabled : enableFlag
        }).addStyleClass('importDataHeader');
        oImportButton.setText(oController.getView().getModel("i18n").getProperty("VW_FORECAST_IMPORT_DATA"));
        oImportButton.attachPress(oController.onPressImport, oController);
        //Adding all the above instances to vertical layout
        var oLinksRow = new mc.ccp.control.McHorizontalLayout({
            width: "100%",
            widths: ["90%", "10%"],
            content: [oTextView, oImportButton]
        });
        return oLinksRow;
    }
});