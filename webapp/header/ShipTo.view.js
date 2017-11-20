/***
 * @Author EA45
 * @Date 10/07/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is the view of the Dash Board Header Main Page
 */
sap.ui.jsview("mc.ccp.header.ShipTo", {
    /** Specifies the Controller belonging to this View. 
     * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
     * @memberOf shipto.ShipTo
     */
    getControllerName: function() {
        return "mc.ccp.header.ShipTo";
    },
    
    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf shipto.ShipTo
     */
    createContent: function(oController) {
        //Required Library
        jQuery.sap.require("mc.ccp.control.McTable");
        jQuery.sap.require("mc.ccp.control.McColumn");
        // Create an instance of the table control
        var oTable = new mc.ccp.control.McTable(this.createId("Shiptotable"), {
            width: '600px',
            enableColumnFreeze: true,
            selectionMode: sap.ui.table.SelectionMode.None,
            navigationMode: sap.ui.table.NavigationMode.Scrollbar
        });
        // Define the columns and the control templates to be used
        var oTopCheck = new sap.ui.commons.CheckBox(this.createId("topCheckId"), {
            checked: true,
        });
        oTopCheck.attachChange(oController.selectAll, oController);
        var colCheck = new sap.ui.commons.CheckBox({
            checked: false
        }).addStyleClass("McCcpShipToCheck");
        colCheck.bindProperty("checked", "selectFlag");
        colCheck.attachChange(oController.select, oController);
        oTable.addColumn(new mc.ccp.control.McColumn("CheckBox", {
            label: oTopCheck,
            template: colCheck,
            hAlign: "Center",
            width: "18px",
        }));
        
        //id,label,jsonProp,width
        oTable.addColumn(this._createTableColumn('ShipTo','ST_SHIPTO','ShipToId','30px'));
        oTable.addColumn(this._createTableColumn('ShipToName','ST_SHIPTONAME','ShipToName','100px'));
        oTable.addColumn(this._createTableColumn('City','ST_CITY','City','50px'));
        oTable.addColumn(this._createTableColumn('State','ST_STATE','State','25px'));  
        oTable.bindRows("/");
        oTable.attachSort(oController.onSortColumn, oController);
        oTable.attachFilter(oController.onFilterColumn, oController);
        oTable.addStyleClass('globalAlignCenter');
        var oLabel = new sap.ui.commons.TextView(this.createId('topLabelId'));
        // Add elements to vertical layout
        var oLayout = new sap.ui.layout.VerticalLayout({
            content: [oLabel, oTable]
        });
        return oLayout;
    },
    /***
     * This method is to create a table column and return it.
     * @param id
     * @param label
     * @param jsonProp
     * @param width
     * @returns {mc.ccp.control.McColumn}
     */
    _createTableColumn : function(id,label,jsonProp,width){
    	return new mc.ccp.control.McColumn(this.createId(id), {
            label: new sap.ui.commons.Label({
                text: MCAPP.getText(label)
            }),
            template: new sap.ui.commons.TextView().bindProperty("text", jsonProp),
            width: width,
            hAlign: "Center",
            vAlign: "Center",
            sortProperty: jsonProp,
            filterProperty: jsonProp,
        });  	
    	
    }
});