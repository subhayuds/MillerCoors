jQuery.sap.declare('mc.ccp.control.McTable');
sap.ui.table.Table.extend("mc.ccp.control.McTable", { 
	metadata : {
		aggregation : {
			'columns': {type: 'mc.ccp.control.McColumn',multiple: true,singularName: 'column',bindable: 'bindable'}			
		}
		
	},
	renderer: {}
	
	
});

mc.ccp.control.McTable.prototype._onColumnMove = function(e){
	e.preventDefault();
};
