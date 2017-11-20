jQuery.sap.declare('mc.ccp.control.McComboBox');
sap.ui.commons.ComboBox.extend("mc.ccp.control.McComboBox", { 
	metadata : {
		properties : { 
			height : "string"
		}
	}
});

mc.ccp.control.McComboBox.prototype.init = function() {
	sap.ui.commons.ComboBox.prototype.init.apply(this, arguments);	
	var data = MCAPP.getComponent().getModel('dropdown').getData().data;
	for ( var i = 0; i < data.length; i++) {	
		var oItem = new sap.ui.core.ListItem();
		oItem.setText(data[i].value);
	    oItem.setKey(data[i].value);
	    this.addItem(oItem);
	}   
};



mc.ccp.control.McComboBox.prototype._handleSelect = function(c) {

	/*if(MCAPP.getDirtyFlag()){
		sap.ui.commons.MessageBox.alert(MCAPP.getText('GBL_SAVE_PROMP_DD',this));
		return;
	}*/
    var s = c.getParameter('selectedIndex'), S = c.getParameter('selectedId'), i = c.getParameter('selectedItem');
    if (!i && S) {
        i = sap.ui.getCore().byId(S);
        if (i.getParent() !== this._getListBox(false)) {
            i = null
        }
        s = jQuery.inArray(i, this._getListBox().getItems())
    }
    if (i && i.getEnabled()) {
        var n = i.getText();
        this._iClosedUpDownIdx = s;
        this._close(); 
        jQuery(this.getInputDomRef()).attr('aria-posinset', this._getListBox().getSelectedIndex() + 1);
        var o = this.getValue();
        var O = this.getSelectedKey();
        var N = i.getKey();
        var a = this.getSelectedItemId();
        var b = i.getId();
        this._sTypedChars = n;
        this._sWantedSelectedKey = undefined;
        this._sWantedSelectedItemId = undefined;
        if (o != n || O != N || a != b) {
        	//if(!MCAPP.getDirtyFlag()){
        		this.setValue(n, true);
                this.setProperty('selectedKey', N, true);
                this.setProperty('selectedItemId', b, true);
                this.fireChange({newValue: n,selectedItem: i})
        	//}else{
        	//	sap.ui.commons.MessageBox.alert(MCAPP.getText('GBL_SAVE_PROMP_DD',this));
        	//}
            
        } else if (n != jQuery(this.getInputDomRef()).val()) {
            jQuery(this.getInputDomRef()).val(n)
        }
    }
    this._doSelect();
    return i
};

