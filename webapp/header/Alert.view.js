/***
 * @Author EO19
 * @Date 09/15/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is Alert view
 */
sap.ui.jsview("mc.ccp.header.Alert", {
    /** Specifies the Controller belonging to this View. 
     * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
     * Utilizes McMsgAccordion and McMsgAccordionSection Custom Controls
     * @memberOf mc.ccp.header.Alert
     */
    getControllerName: function() {
        return "mc.ccp.header.Alert";
    },
    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf mc.ccp.header.Alert
     */
    createContent: function(oController) {
        //Utilizes McMsgAccordion and McMsgAccordionSection Custom Controls
        jQuery.sap.require("mc.ccp.header.control.McMsgAccordion");
        jQuery.sap.require("mc.ccp.header.control.McMsgAccordionSection");
        //Creating Accordion
        var oAccordion = new mc.ccp.header.control.McMsgAccordion(this.createId('alertAccordionId'), {
            width: '500px'
        });
        //Creating Accordion section
        var oSection = new mc.ccp.header.control.McMsgAccordionSection();
        oSection.bindProperty("title", "TDLine");
        oSection.bindProperty("date", "Date");
        oSection.bindProperty("read", 'isReadFlag');
        //Creating Text View for messages description
        var oTextView = new sap.ui.commons.TextView();
        oTextView.bindProperty("text", "Description");
        //Add content to the Section
        oSection.addContent(oTextView);
        oAccordion.bindAggregation('sections', '/results', oSection);
        oAccordion.attachSectionOpen(oController.onSectionOpen, oController);
        oAccordion.attachSectionClose(oController.onSectionClose, oController);
        oAccordion.addStyleClass('McCcpHeaderAccordion');
        //Creating Print Icon
        var oPrintIcon = new sap.ui.core.Icon({
            src: sap.ui.core.IconPool.getIconURI('print')
        });
        oPrintIcon.attachPress(oController.onPressPrint, oController);
        oPrintIcon.addStyleClass('McCcpHeaderAlertPrintIcon');
        var oAlertLayout = new sap.ui.layout.VerticalLayout({
            content: [oPrintIcon, oAccordion]
        });
        return oAlertLayout;
    }
});