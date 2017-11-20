jQuery.sap.require('sap.ui.commons.MenuTextFieldItem');
jQuery.sap.declare('mc.ccp.control.McMenuTextFieldItem');
sap.ui.commons.MenuTextFieldItem.extend("mc.ccp.control.McMenuTextFieldItem", { 
	metadata : {
	}
});


mc.ccp.control.McMenuTextFieldItem.prototype.onsapenter = function(e) {
	
		var v = e.target.value;
		if(!MCAPP.getDirtyFlag()){
			this.setValue(v, true);
		}
	    this.getParent().selectItem(this);
	    e.preventDefault();
	    e.stopPropagation();
	
    
};