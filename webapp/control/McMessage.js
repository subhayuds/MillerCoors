jQuery.sap.declare('mc.ccp.control.McMessage');
sap.ui.core.Control.extend("mc.ccp.control.McMessage", {
	 metadata: {
	    properties: {
	    	'id': {type : 'string'},
	    	'width': {type: 'sap.ui.core.CSSSize',defaultValue: '25px'},
	    	'height': {type: 'sap.ui.core.CSSSize',defaultValue: '15px'},
	    	'count': {type: 'int',defaultValue: '0'},
	    	'source'  : {type : 'string', multiple : false, visibility: 'public'}
	    },
		events :{
		    press : {}
		    }	 			
	 },  
		  
	 _oImage : null,
		  
	init : function() {			
		_oImage = new sap.ui.commons.Image();;
		},
		  
	onBeforeRendering: function() {	
		_oImage.id=this.getId();
		 _oImage.setSrc(this.getSource()); 
		 _oImage.setHeight(this.getHeight());
		 _oImage.setWidth(this.getWidth());
		},		 
		
	renderer : function(oRm, oControl) { 
		oRm.write("<div");	
		oRm.writeControlData(oControl);		
		oRm.addStyle('height', oControl.getHeight());
		oRm.addStyle('width', oControl.getWidth());
		oRm.writeStyles();
		oRm.write(">");		
		oRm.renderControl(_oImage);

		if (oControl.getCount() > 0) {
			oRm.write("<div align='center' class='mcCustControlMsgCount'>");		
			oRm.write(oControl.getCount());		
			oRm.write("</div>");  
			}
		
		oRm.write("</div>");
		}
});

mc.ccp.control.McMessage.prototype.onclick = function(oEvent) {	
	this.firePress();
	};