/***
 * @Author AF80
 * @Date 10/07/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is Menu view
 */
sap.ui.jsview("mc.ccp.header.Menu", {
    /** Specifies the Controller belonging to this View. 
     * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
     * @memberOf header.Menu
     */
    getControllerName: function() {
        return "mc.ccp.header.Menu";
    },
    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf header.Menu
     */
    createContent: function(oController) {
        //Current week
        var Currweekobj = MCAPP.getCurrentweek();
        var currentweeklabel = new sap.ui.commons.Label({
            text: MCAPP.getText('MENU_CURRENTWEEK') + " : "
        });
        var currentweeklvalue = new sap.ui.commons.TextView({
            text: Currweekobj
        });
        var Currentweek = new sap.ui.layout.HorizontalLayout("currentweek", {
            content: [currentweeklabel, currentweeklvalue]
        });
        Currentweek.addStyleClass('currentweek');
        //Current CRcount 
        var CRcount = MCAPP.getCRcount();
        var count = new sap.ui.commons.Label("count", {
            text: CRcount
        });
        //Nav Item - Order
        var oLinkOrder = new sap.ui.commons.Link(this.createId('orderMenuId'), {
            text: "{i18n>MENU_ORDER}"
        });
        oLinkOrder.addStyleClass('menu_item');
        oLinkOrder.attachPress(oController.redirect, oController);
        //Nav Item with Submenu
        var oMenu = new sap.ui.commons.Menu("menu1-1", {
            ariaDescription: "{i18n>MENU_CHANGEREQUEST}",
        });
        var oCRMenuItem = new sap.ui.commons.MenuItem("item1-1-1", {
            text: MCAPP.getText('MENU_CREATECR', this)
        });
        oCRMenuItem.attachSelect(oController.redirect, oController);
        var oCrPreviewMenuItem = new sap.ui.commons.MenuItem("item1-1-2", {
            text: MCAPP.getText('MENU_PREVIEWCR', this)
        });
        oCrPreviewMenuItem.attachSelect(oController.redirect, oController);
        var oCrDetailMenuItem = new sap.ui.commons.MenuItem("item1-1-3", {
            text: MCAPP.getText('MENU_CRDETAILS', this)
        });
        oCrDetailMenuItem.attachSelect(oController.redirect, oController);
        oMenu.addItem(oCRMenuItem);
        oMenu.addItem(oCrPreviewMenuItem);
        oMenu.addItem(oCrDetailMenuItem);
        var oMenuItem4 = new sap.ui.commons.MenuItem("item1-1-4", {
            text: CRcount
        });
        oMenu.addItem(oMenuItem4);
        //Link which opens the submenu on click of Change Request
        var oLinkCR = new sap.ui.commons.Link(this.createId("changereqlink"), {
            text: "{i18n>MENU_CHANGEREQUEST}"
        });
        oLinkCR.attachPress(function() {
            var eDock = sap.ui.core.Popup.Dock;
            oMenu.open(false /*First item already highlighted*/ , oLinkCR.getFocusDomRef(), /*Dom reference which gets the focus back when the menu is closed,*/ eDock.BeginTop, /*"Edge" of the menu (see sap.ui.core.Popup)*/ eDock.BeginBottom, /* "Edge" of the related opener position (see sap.ui.core.Popup)*/ oLinkCR.getDomRef() /* Related opener position (see sap.ui.core.Popup)*/ );
        });
        oMenu.addStyleClass('menu_dropdown');
        oLinkCR.addStyleClass('menu_item');
        
        var crlink = new sap.ui.layout.HorizontalLayout("crlink", {
            content: [oLinkCR, count]
        });
        //Nav Item - Forecast
        var oLinkForecast = new sap.ui.commons.Link(this.createId("forecastlink"), {
            text: "{i18n>MENU_FORECAST}"
        });
        oLinkForecast.addStyleClass('menu_item');
        oLinkForecast.attachPress(oController.redirect, oController);
        //Nav Item - Inventory
        var oLinkInventory = new sap.ui.commons.Link(this.createId("inventorylink"), {
            text: "{i18n>MENU_INVENTORY}"
        });
        oLinkInventory.addStyleClass('menu_item');
        oLinkInventory.attachPress(oController.redirect, oController);
        //Nav Item - Shipment
        var oLinkShipment = new sap.ui.commons.Link(this.createId("shipmentlink"), {
            text: "{i18n>MENU_SHIPMENT}"
        });
        oLinkShipment.addStyleClass('menu_item');
        oLinkShipment.attachPress(oController.redirect, oController);
        //Nav Item - Sales Inventory
        var oLinkSalesAndInv = new sap.ui.commons.Link(this.createId("salesinventorylink"), {
            text: "{i18n>MENU_SALESINVENTORY}"
        });
        oLinkSalesAndInv.addStyleClass('menu_item');
        oLinkSalesAndInv.attachPress(oController.redirect, oController);
        //Adding all to horizontal layout 
        var Menubar = new sap.ui.layout.HorizontalLayout("Layout1", {
            content: [oLinkOrder, crlink, oLinkForecast, oLinkInventory, oLinkShipment, oLinkSalesAndInv]
        });
        var MenuRow = new mc.ccp.control.McHorizontalLayout({
            height: "100%",
            width: "100%",
            ptop: "5px",
            widths: ["84%", "15%"],
            content: [Menubar, Currentweek]
        });
        return MenuRow;
    }
});