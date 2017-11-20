/***
 * @Author CM02
 * @Date 09/01/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is VehicleEstimator view
 */
sap.ui.jsview("mc.ccp.order.VehicleEstimator", {
    /** Specifies the Controller belonging to this View. 
     * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
     * @memberOf order.VehicleEstimator
     */
    getControllerName: function() {
        return "mc.ccp.order.VehicleEstimator";
    },
    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf order.VehicleEstimator
     */
    createContent: function(oController) {
    	 //Required Library
    	jQuery.sap.require("mc.ccp.control.McTable");
        jQuery.sap.require("mc.ccp.control.McColumn");
        //Define Text Description 
        var oText1 = new sap.ui.commons.TextView({
            text: MCAPP.getText('VW_VEH_EST_HEDR'),
            width: '100%',
        });
        //Create an instance of the custom table control
        var oTable = new mc.ccp.control.McTable({
            width: '80%',
            visibleRowCount: 4,
            selectionMode: sap.ui.table.SelectionMode.None,
            navigationMode: sap.ui.table.NavigationMode.Scrollbar
        }).addStyleClass('McCcpAlignCenter');
        oTable.addColumn(new mc.ccp.control.McColumn({
            label: new sap.ui.commons.Label({
                text: MCAPP.getText('VW_VEH_EST_SOURCE')
            }),
            template: new sap.ui.commons.TextView().bindProperty("text", "SourceId"),
            width: "30%",
            sortProperty: "SourceId",
            filterProperty: "SourceId",
        }));
        oTable.addColumn(new mc.ccp.control.McColumn({
            label: new sap.ui.commons.Label({
                text: MCAPP.getText('VW_VEH_EST_SHIP_TO')
            }),
            template: new sap.ui.commons.TextView().bindProperty("text", "ShipToId"),
            width: "30%",
            sortProperty: "ShipToId",
            filterProperty: "ShipToId",
        }));
        oTable.addColumn(new mc.ccp.control.McColumn({
            label: new sap.ui.commons.Label({
                text: MCAPP.getText('VW_VEH_EST_TITLE')
            }),
            template: new sap.ui.commons.TextView().bindProperty("text", "Vehicle_Desc"),
            width: "40%",
            sortProperty: "Vehicle_Desc",
            filterProperty: "Vehicle_Desc",
        }));
        oTable.bindRows("/ZCCP_VECH_EST_NAV/results");
        //Add elements to vertical layout
        var oLayout = new sap.ui.layout.VerticalLayout({
            content: [oText1, oTable]
        });
        return oLayout;
    }
});