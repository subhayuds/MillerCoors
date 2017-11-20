

jQuery.sap.declare('mc.ccp.control.McHorizontalLayout');
sap.ui.core.Control.extend("mc.ccp.control.McHorizontalLayout", { 
	metadata : {
		properties : { 
			'width': {type: 'sap.ui.core.CSSSize',group: 'Dimension',defaultValue: '100%'},
	    	'height':{type: 'sap.ui.core.CSSSize',group: 'Dimension',defaultValue: '100%'},
			'ptop': {type: 'sap.ui.core.CSSSize',defaultValue: '0px'},
			
			'widths': {type: 'sap.ui.core.CSSSize[]',group: 'Appearance',defaultValue: null}			
		},
		aggregations : {
			'content': {type: 'sap.ui.core.Control',multiple: true,singularName: 'content'}
		}
	},
		
		//
	renderer : function(oRm, oControl) { 		
		oRm.write("<div class='sapUiHLayout sapUiHLayoutNoWrap' ");
		oRm.writeControlData(oControl); 
		oRm.addStyle("width", oControl.getWidth());  
		oRm.addStyle("height", oControl.getHeight());
		oRm.addStyle("padding-top", oControl.getPtop());
		
		oRm.writeStyles();
		oRm.writeClasses(); 
		oRm.write(">");	
		var aChildren = oControl.getContent();
		var aWidths = oControl.getWidths();
		
		for ( var i = 0; i < aChildren.length; i++) {
			oRm.write("<div class='sapUiHLayoutChildWrapper' style='height:100%;width:"+aWidths[i]+"'>");
			oRm.renderControl(aChildren[i]);
			oRm.write("</div>");
		}
		
		oRm.write("</div>");
	}
		
});