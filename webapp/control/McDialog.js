jQuery.sap.declare('mc.ccp.control.McDialog');
sap.ui.commons.Dialog.extend("mc.ccp.control.McDialog", { 
	metadata : {
		 properties: {
			 'dirtyDependent' : {type : "boolean", defaultValue : false},
			 'preventEscape' : {type : "boolean", defaultValue : false}
		 },
		events: {
            'closeClicked': {}            
        }		
	},
	renderer: {}
});

mc.ccp.control.McDialog.prototype.onclick = function(e) {
	if(e.target.id == this.getId() + '-close'){		
		if(this.getDirtyDependent()){
			if(MCAPP.getDirtyFlag()){
				this.fireCloseClicked();        	
				e.preventDefault();
			}else{
				MCAPP.setBusy(false);
				this.close();
	            e.preventDefault();
			}			
		}else if(this.getPreventEscape()){
            this.fireCloseClicked();
        }
		else{
			this.close();
            e.preventDefault();
		}		  		
	}
	return false;
};

mc.ccp.control.McDialog.prototype.onsapescape = function(e) {
	if(this.getDirtyDependent()){
		if(MCAPP.getDirtyFlag()){
			this.fireCloseClicked(); 
		}else{
			MCAPP.setBusy(false);
			this.close();
			 e.preventDefault();
			 e.stopPropagation();
		}		 
	}else if(this.getPreventEscape()){
		this.fireCloseClicked();
	}
	else{
		this.close();
		 e.preventDefault();
		 e.stopPropagation();
	}
};
mc.ccp.control.McDialog.prototype.handleClosed = function() {
    this.oPopup.detachEvent('closed', this.handleClosed, this);
    //this.fireClosed(this._oRect);
    this.close();
    this.$().hide()
};



