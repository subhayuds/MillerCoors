jQuery.sap.declare('mc.ccp.control.McDateHeader');


sap.ui.core.Control.extend('mc.ccp.control.McDateHeader', {
  metadata: {
    properties: {
    	'width': {type: 'sap.ui.core.CSSSize',group: 'Dimension',defaultValue: '100%'},
    	'height': {type: 'sap.ui.core.CSSSize',group: 'Dimension',defaultValue: '30px'},
    	'collectionName': 'string',
    	'columnCount' : {type: 'int',defaultValue: 9},
    	'columnColor' : {type: 'int',defaultValue: 0},
    	'firstColumnWidth' : {type: 'string',defaultValue: '19'}
    	
    }
  },  

  init : function() {	
	//  alert('b');
  },

  onBeforeRendering: function (){	  
  },
  
  onAfterRendering: function (){	
  },
  renderer: function(oRm, oControl) {
	//  alert('e');
	  
	oRm.write("<div ");
	oRm.writeControlData(oControl); 
	oRm.addStyle("width", oControl.getWidth());  
	oRm.addStyle("height", oControl.getHeight());
	//oRm.addStyle("background-color", 'green');
	oRm.writeStyles();
	oRm.writeClasses(); 
	oRm.write(">");	
	oRm.write("<table border=0 height='100%' width='100%' cellpadding='0' cellspacing='0' class='DateRowTbl'>");
	oControl._renderDateRow(oRm,oControl);	
	oRm.write("</table>");
	oRm.write("</div>");
  },

  ///    d/results/0/WEEKSANDQTY/results/0/WEEK
  
  _renderDateRow : function(oRm,oControl){	 
	 
	
	  oRm.write("<tr id="+(oControl.sId+'-DateRow')+" class='DateRowTblTr'>");	
	  oRm.write("<td width='"+oControl.getFirstColumnWidth()+"%"+"'>&nbsp;</td>");
	  var oWidth = (100 - oControl.getFirstColumnWidth()) / oControl.getColumnCount();
	  if(oControl.getCollectionName() =="InventoryItemsData"){
		  for(var i = 0 ; i <oControl.getColumnCount() ; i ++){
			  if(oControl.getColumnColor() != 0 && (oControl.getColumnColor() -1)== i ){
				  oRm.write("<td width='"+oWidth+"%"+"' style='background-color:#ee9e2e'>"+oControl.getModel().getProperty('/InventoryItemsData/'+i+'/Week_No')+"</td>");
			  }else{
				  oRm.write("<td width='"+oWidth+"%"+"'>"+oControl.getModel().getProperty('/InventoryItemsData/'+i+'/Week_No')+"</td>");
			  }
		  }
	  }else if(oControl.getCollectionName() ==="ZCCP_FORE_HEAD_ITEM_NAV"){
		  // Date Header shows from current week to next 8 weeks
		  var currentWeekIndex = "3";
		  var collectionLength = oControl.getModel().getProperty('/results/0/'+oControl.getCollectionName()+'/results/').length;
		  for(currentWeekIndex ; currentWeekIndex < collectionLength ; currentWeekIndex ++){
			  if(oControl.getColumnColor() != 0 && (oControl.getColumnColor() -1)== (currentWeekIndex - 3) ){
				  oRm.write("<td width='"+oWidth+"%"+"' style='background-color:#ee9e2e'>"+oControl.getModel().getProperty('/results/0/'+oControl.getCollectionName()+'/results/'+currentWeekIndex+'/Week_No')+"</td>");
			  }else{
				  oRm.write("<td width='"+oWidth+"%"+"'>"+oControl.getModel().getProperty('/results/0/'+oControl.getCollectionName()+'/results/'+currentWeekIndex+'/Week_No')+"</td>");
			  }
		  }
	  }
	  else{
		  for(var i = 0 ; i <oControl.getColumnCount() ; i ++){
			  if(oControl.getColumnColor() != 0 && (oControl.getColumnColor() -1)== i ){
				  oRm.write("<td width='"+oWidth+"%"+"' style='background-color:#ee9e2e'>"+oControl.getModel().getProperty('/results/0/'+oControl.getCollectionName()+'/results/'+i+'/Week_No')+"</td>");
			  }else{
				  oRm.write("<td width='"+oWidth+"%"+"'>"+oControl.getModel().getProperty('/results/0/'+oControl.getCollectionName()+'/results/'+i+'/Week_No')+"</td>");
			  }
		  }
	  }
	  oRm.write("</tr>");  	 	 
  },
  
  exit: function() {	
  }

});
	


