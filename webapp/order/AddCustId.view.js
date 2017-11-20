/***
 * @Author MS34
 * @Date 21/11/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is AddCustId view 
 */	

sap.ui.jsview("mc.ccp.order.AddCustId", {

	/** Specifies the Controller belonging to this View. 
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf order.AddCustId
	 */ 
	getControllerName : function() {
		return "mc.ccp.order.AddCustId";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	 * Since the Controller is given to this method, its event handlers can be attached right away. 
	 * @memberOf order.AddCustId
	 */ 
	createContent : function(oController) {
		//Required Library
		jQuery.sap.require("mc.ccp.control.McTable");
		jQuery.sap.require("mc.ccp.control.McColumn");

		//Define Text Description
		var oTextDesc = new sap.ui.commons.TextView({	  		
			text:MCAPP.getText('VW_CUST_ID_PO_DESC'),	
			width : '100%'
		});

		//Create an instance of the custom table (McTable) control
		var oTable = new mc.ccp.control.McTable(this.createId("addcustomId"),{
			visibleRowCount: 4,
			width:'80%',			
			selectionMode: sap.ui.table.SelectionMode.None,
			navigationMode: sap.ui.table.NavigationMode.Scrollbar,
			//columnHeaderVisible: true,
		}).addStyleClass('McCcpAlignCenter');

		//Define the custom columns (McColumn) and the control templates to be used
		oTable.addColumn(new mc.ccp.control.McColumn(this.createId("shipto"),{
			label:MCAPP.getText('VW_CUST_ID_SHIPTO'),
			template: new sap.ui.commons.TextView().bindProperty("text", "ShipToId"),
			width: "70px",
			sortProperty: "ShipToId",
			filterProperty: "ShipToId",
			resizable : false			
		}));

		oTable.addColumn(new mc.ccp.control.McColumn(this.createId("source"),{
			label: MCAPP.getText('VW_CUST_ID_PO_SOURCE'),
			template: new sap.ui.commons.TextView().bindProperty("text", "SourceName"),
			width: "120px",
			hAlign: "Center",
			vAlign: "Center",
			sortProperty: "SourceName",
			filterProperty: "SourceName",
			resizable : false
		}));

		var oCustId = new sap.ui.commons.TextField({
			value: "{Custom_PO}",
			enabled: "{readOnly}",
			maxLength : 10
		}).addStyleClass('McCcpCustIDField');
		oCustId.attachChange(oController.handleChangeCustomIDPO, oController);
		oTable.addColumn(new mc.ccp.control.McColumn(this.createId("customid"),{
			label: MCAPP.getText('VW_CUST_ID_PO_CUST_IDPO'),
			template: oCustId,
			width: "80px",
			hAlign: "Center",
			vAlign: "Center",
			sortProperty: "Custom_PO",
			filterProperty: "Custom_PO",
			resizable : false
		}));

		oTable.bindRows("/results");		
		oTable.attachFilter(oController.onFilterColumn, oController);       
		//Add elements to vertical layout
		var oVerticalLayout = new sap.ui.layout.VerticalLayout( {
			content: [oTextDesc, oTable]
		});
		return oVerticalLayout;
	}
});
