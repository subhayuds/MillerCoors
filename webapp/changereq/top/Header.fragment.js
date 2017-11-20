/***
 * @Author OD79
 * @Date 10/XX/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is Change Request Header Fragment.
 */
sap.ui.jsfragment("mc.ccp.changereq.top.Header", {
    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf pages.header.Header
     */
    createContent: function(oController) {
        // creates the Change Request Title
        var oTextViewTitle = new sap.ui.commons.TextView({
            text: MCAPP.getText('FRG_CR_TITLE', this)
        }).addStyleClass('McCcpOrderHeaderTableTrTitle');
        // creates the Modify SKUs by label
        var oTextViewModifySKUs = new sap.ui.commons.TextView({
            text: MCAPP.getText('FRG_CR_MOD_SBU_BY', this)
        }).addStyleClass('McCcpOrderHeaderRadioLable');
        var oMatrixLayout = new sap.ui.commons.layout.MatrixLayout();
        oMatrixLayout.setLayoutFixed(false);
        oMatrixLayout.setColumns(2);
        // creates the current order radio button
        var oRadioButtonCurrentOrder = new sap.ui.commons.RadioButton(this.createId("CRRadioBut1"), {
            text: MCAPP.getText('FRG_CR_CURRENT_ORDER', this),
            tooltip: MCAPP.getText('FRG_CR_CURRENT_ORDER', this),
            groupName: 'OrdRdGrp'
        });
        oRadioButtonCurrentOrder.attachSelect(oController.onSelectOrderPage, oController);
        //creates the change request radio button
        var oRadioButtonChangeReq = new sap.ui.commons.RadioButton(this.createId("CRRadioBut2"), {
            text: MCAPP.getText('MENU_CHANGEREQUEST', this),
            tooltip: MCAPP.getText('MENU_CHANGEREQUEST', this),
            groupName: 'OrdRdGrp',
            selected: true
        });
        oMatrixLayout.createRow(oRadioButtonCurrentOrder, oRadioButtonChangeReq);
        oMatrixLayout.addStyleClass('McCcpOrderHeaderRadioGrp');
        var oHorizontalLayout = new sap.ui.layout.HorizontalLayout({
            content: [oTextViewModifySKUs, oMatrixLayout]
        });
        // creates the CR Preview Button
        var oButtonCRPreview = new sap.ui.commons.Button({
            text: MCAPP.getText('FRG_CR_CR_PRVW', this),
            height: "35px",
            width: "90px"
        });
        oButtonCRPreview.attachPress(oController.onPressCRPreviewButton, oController);
        var oLayout = new mc.ccp.control.McHorizontalLayout('headerFragment', {
            height: "100%",
            width: "100%",
            widths: ["30%", "55%", "15%"],
            content: [oTextViewTitle, oHorizontalLayout, oButtonCRPreview]
        });
        return oLayout;
    }
});