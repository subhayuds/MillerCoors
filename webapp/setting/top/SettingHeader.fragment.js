/***
 * @Author EX66
 * @Date 12/08/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is setting header fragment page view.
 */
sap.ui.jsfragment("mc.ccp.setting.top.SettingHeader", {
	
    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf inventory.top.Header
     */
    createContent: function(oController) {        
        var oSettingView = new sap.ui.commons.TextView().addStyleClass('McCcpOrderHeaderTableTrTitle');
        oSettingView.setText(oController.getView().getModel("i18n").getProperty("VW_SETTING_TITLE"));
        var oHorizontalLayout = new mc.ccp.control.McHorizontalLayout({
            height: "100%",
            width: "100%",
            widths: ["30%", "70%"],
            content: [oSettingView]
        });
        return oHorizontalLayout;
    }
});