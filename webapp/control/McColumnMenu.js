jQuery.sap.declare('mc.ccp.control.McColumnMenu');
sap.ui.table.ColumnMenu.extend("mc.ccp.control.McColumnMenu", { 
	metadata : {
	},
	renderer: {}
});

mc.ccp.control.McColumnMenu.prototype._addMenuItems = function() {
    if (this._oColumn) {
        this._addSortMenuItem(false);
        this._addSortMenuItem(true);
        
        this._addFilterMenuItem();
        //this._addSampleMenuItem();
        this._addGroupMenuItem();
        this._addColumnVisibilityMenuItem()
    }
};

/*mc.ccp.control.McColumnMenu.prototype._addSampleMenuItem = function() {
	this.addItem( new mc.ccp.control.TmpMenuItem("EMK",{text:"hello"}));
};*/


mc.ccp.control.McColumnMenu.prototype._getThemedIcon = function(I) {
	if(I === "filter"){
		return "resources/sap/ui/table/themes/sap_bluecrystal/img/ico12_filter.gif";
	}else{
		return "resources/sap/ui/table/themes/sap_bluecrystal/img/"+I;
	}
};

mc.ccp.control.McColumnMenu.prototype._createMenuTextFieldItem = function(i, t, I, v, h) {
    jQuery.sap.require('mc.ccp.control.McMenuTextFieldItem');
    
    h = h || function() {
    };
    return new mc.ccp.control.McMenuTextFieldItem(this.getId() + '-' + i, {label: this.oResBundle.getText(t),icon: I ? this._getThemedIcon(I) : null,value: v,select: h || function() {
        }})
};
