jQuery.sap.declare('mc.ccp.control.McColumn');
sap.ui.table.Column.extend("mc.ccp.control.McColumn", { 
	metadata : {
	}
});

mc.ccp.control.McColumn.prototype._createMenu = function() {
    jQuery.sap.require('mc.ccp.control.McColumnMenu');
    return new mc.ccp.control.McColumnMenu(this.getId() + '-menu');
};