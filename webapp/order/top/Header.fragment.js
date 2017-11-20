/***
 * @Author CM02
 * @Date 09/01/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is Order Header Fragment.
 */
sap.ui.jsfragment("mc.ccp.order.top.Header", {
    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf pages.header.Header
     */
    createContent: function(oController) {
        //creates the Orders Title
        var oTxtView = new sap.ui.commons.TextView({
            text: MCAPP.getText('GBL_ORDERS', this)
        }).addStyleClass('McCcpOrderHeaderTableTrTitle');
        //creates the Modify SKUs by label
        var oRadioLabel = new sap.ui.commons.TextView({
            text: MCAPP.getText('FRG_CR_MOD_SBU_BY', this)
        }).addStyleClass('McCcpOrderHeaderRadioLable');
        var oMLayout = new sap.ui.commons.layout.MatrixLayout();
        oMLayout.setLayoutFixed(false);
        oMLayout.setColumns(2);
        //creates the Change Order Radio button
        var oRB1 = new sap.ui.commons.RadioButton(this.createId("RadioBut1"), {
            text: MCAPP.getText('FRG_CR_CURRENT_ORDER', this),
            tooltip: MCAPP.getText('FRG_CR_CURRENT_ORDER', this),
            selected: true,
            groupName: 'OrdRdGrp'
        });
        //creates the Change Request Radio button
        var oRB2 = new sap.ui.commons.RadioButton(this.createId("RadioBut2"), {
            text: MCAPP.getText('MENU_CHANGEREQUEST', this),
            tooltip: MCAPP.getText('MENU_CHANGEREQUEST', this),
            groupName: 'OrdRdGrp'
        });
        oRB2.attachSelect(oController.onSelectChangeReq, oController);
        oMLayout.createRow(oRB1, oRB2);
        oMLayout.addStyleClass('McCcpOrderHeaderRadioGrp');
        var oHLayout = new sap.ui.layout.HorizontalLayout({
            content: [oRadioLabel, oMLayout]
        });
        var oLayout = new mc.ccp.control.McHorizontalLayout('headerFragment', {
            height: "100%",
            width: "100%",
            widths: ["30%", "70%"],
            content: [oTxtView, oHLayout]
        });
        return oLayout;
    }
});