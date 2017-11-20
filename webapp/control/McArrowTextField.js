jQuery.sap.declare('mc.ccp.control.McArrowTextField');
jQuery.sap.require("sap.ui.core.IconPool");


sap.ui.core.Control.extend('mc.ccp.control.McArrowTextField', {
  metadata: {
    properties: {
    	'width': {type: 'sap.ui.core.CSSSize',defaultValue: '100%'},
    	'height':{type: 'sap.ui.core.CSSSize',defaultValue: '100%'},
    	'readOnly' : {type : "boolean", defaultValue : false}, 
    	'arrows' : {type : "boolean", defaultValue : true},    	 	
    	'pallet': {type : "string", defaultValue : '1' },
    	'value': 'string',   
    	'originalValue': 'string'
    },
    aggregations: {    	   
    	textField    : {type : "sap.ui.commons.TextField", multiple : false, visibility: "public"},
    	up    		 : {type : "sap.ui.core.Icon", multiple : false, visibility: "public"},
    	down         : {type : "sap.ui.core.Icon", multiple : false, visibility: "public"}    	
    },
    events :{
    	change : {}
    }
  },  
  
  

  init : function() {	  
	  var textField  = new sap.ui.commons.TextField({width:'87%' }).addStyleClass('McCcpControlArrowTextField');
	  this.setAggregation('textField', textField);
	  textField.attachBrowserEvent("keypress",this.preventNonNumeric);
	  
	  var upIcon =  new sap.ui.core.Icon( {src : sap.ui.core.IconPool.getIconURI('up'),size:'100%'});
	  this.setAggregation('up', upIcon);
	  upIcon.addStyleClass('McCcpBlock');
	  var downIcon =  new sap.ui.core.Icon(  {src : sap.ui.core.IconPool.getIconURI( 'down'),size:'100%'});
	  this.setAggregation('down', downIcon);
	  downIcon.addStyleClass('McCcpBlock');
  },
  
  preventNonNumeric : function(oEvent){	  
	  var key_codes = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 46,8, 37, 39];  //delete 46, backspace 8, arrows 37,39
      if (!($.inArray(oEvent.which, key_codes) >= 0)) {  
    	  oEvent.preventDefault();  
      }  
  },

  onBeforeRendering: function (){
	  //Keep the original Value for backgroundColor Change
	  if(!this.getOriginalValue()){
		  this.setOriginalValue(this.getValue());
	  }
	  
	  //LOGIC TO SHOW ARROWS OR NOT 
	  if(this.getArrows()){
		  this.getAggregation('textField').setWidth("87%");
	  }else{
		  this.getAggregation('textField').setWidth("100%");
	  }
	  // END OF LOGIC 	  
	  // READ ONLY LOGIC
	  if(this.getReadOnly()){
		  this.getAggregation('textField').setEditable(false);
	  }
	  
	  
	  this.getAggregation('textField').setValue(this.getValue());
	  
	//remove attached non-default event handler
	  jQuery.sap.byId(this.getId()).unbind("change", jQuery.proxy(this._valueChange, this));	  
	
  },
  
  onAfterRendering: function (){
	//attached non-default event handler
	 jQuery.sap.byId(this.getId()).bind("change", jQuery.proxy(this._valueChange, this));
  },
  


  renderer: function(oRm, oControl) {	  	
	oRm.write("<div ");
	oRm.writeControlData(oControl);	
	oRm.addStyle("width", oControl.getWidth());  
	oRm.addStyle("height", oControl.getHeight());		
	oRm.writeStyles();
	oRm.addClass('McCcpControlArrowTextFieldTopDiv');
	oRm.writeClasses();	
	oRm.write(">");		
	if(oControl.getValue() != oControl.getOriginalValue() ){
		oControl.getAggregation('textField').addStyleClass('McCcpControlArrowTextFieldBGColor');
	}else{
		oControl.getAggregation('textField').removeStyleClass('McCcpControlArrowTextFieldBGColor');
	}
	oRm.renderControl(oControl.getAggregation('textField'));
	if(oControl.getArrows()){
		oRm.write("<div ");		
		oRm.addClass('McCcpControlArrowTextFieldDiv');	
		oRm.writeClasses();   
		oRm.write(">");
		oRm.renderControl(oControl.getAggregation('up'));
		oRm.renderControl(oControl.getAggregation('down'));
		oRm.write("</div>");
	}	
	oRm.write("</div>");
  }

});

mc.ccp.control.McArrowTextField.prototype.onclick = function(oEvent) {
	if(this.getReadOnly()){
		return;
	}
	
	if(oEvent.srcControl.sId == this.getAggregation('up').sId ){
		var oldValue = this.getValue();
		var newValue = Number(this.getValue())+Number(this.getPallet());
		this.setValue(newValue);			
		this.fireChange({changed:newValue,previous:oldValue});		
	}
	
	if(oEvent.srcControl.sId == this.getAggregation('down').sId ){			
		var oldValue = this.getValue();
		var newValue = Number(this.getValue())-Number(this.getPallet());
		if(newValue < 0){
			return;
		}
		this.setValue(newValue);			
		this.fireChange({changed:newValue,previous:oldValue});	
	}	
	
};

mc.ccp.control.McArrowTextField.prototype._valueChange = function(oEvent) {
	var palletValue = this.getPallet();
	if(palletValue){
		var roundedValue = "0";
		if(palletValue !== "0"){
			roundedValue = Math.ceil(oEvent.target.value/ palletValue) * palletValue;	
		}
		this.setValue(roundedValue);			
		this.fireChange({changed:roundedValue,previous:oEvent.target.defaultValue});
	}else{		
		this.setValue(oEvent.target.value);			
		this.fireChange({changed:oEvent.target.value,previous:oEvent.target.defaultValue});
	}		
};

mc.ccp.control.McArrowTextField.prototype.onsapup   = function(oEvent) {	
	oEvent.preventDefault();
		if(this.getReadOnly()){
			return;
		}
		this.setValue(Number(this.getValue())+Number(this.getPallet()));	
		this.fireChange({changed:this.getValue(),previous:oEvent.target.value});		
	
};

mc.ccp.control.McArrowTextField.prototype.onsapdown   = function(oEvent) {	
	oEvent.preventDefault();
	if(this.getReadOnly()){
		return;
	}
	if(!( (Number(this.getValue())-Number(this.getPallet())) < 0 )){
		this.setValue(Number(this.getValue())-Number(this.getPallet()));
		this.fireChange({changed:this.getValue(),previous:oEvent.target.value});	
	}
};


mc.ccp.control.McArrowTextField.prototype.exit = function(oEvent) {
	
	//remove attached non-default event handler
	  jQuery.sap.byId(this.getId()).unbind("change", jQuery.proxy(this._valueChange, this));
};

