jQuery.sap.declare('mc.ccp.control.McGlobalTableFrame');
sap.ui.core.Control.extend("mc.ccp.control.McGlobalTableFrame", { 

    metadata : {      
    	properties: {
    		headerHeight :      {type: 'sap.ui.core.CSSSize', defaultValue: '60px'},
    		menuHeight   :      {type: 'sap.ui.core.CSSSize', defaultValue: '40px'},
    		breadcrumbHeight :  {type: 'sap.ui.core.CSSSize', defaultValue: '20px'},
    		titleHeight  :      {type: 'sap.ui.core.CSSSize', defaultValue: '40px'},
    		footerHeight :      {type: 'sap.ui.core.CSSSize', defaultValue: '50px'},    		
    		contentWidth :      {type: 'sap.ui.core.CSSSize', defaultValue: '1150px'},
    		contentMinWidth :   {type: 'sap.ui.core.CSSSize', defaultValue: '1150px'},
    		contentHeight :     {type: 'sap.ui.core.CSSSize', defaultValue: '445px'},    		
    	},
    	
       aggregations: {
    	  menu:  {singularName: "menu"},
          content: {singularName: "content"},
          header:  {singularName: "header"}, 
          footer:  {singularName: "footer"},
          breadcrumb:  {singularName: "breadcrumb"}
       }
    },
    
       
     onAfterRendering: function(){    	
    	 jQuery.sap.log.info('Global Table Control rendered');
     },
    

    renderer : function(oRm, oControl) { 		
	 // alert(oControl.getHeaderHeight());
	    oRm.write("<table ");
	    oRm.writeControlData(oControl);  // writes the Control ID and enables event handling - important!
	    oRm.writeAttribute('cellpadding', '0');
	    oRm.writeAttribute('cellspacing', '0');
	    oRm.addClass('mcGlobalTable');	    
		oRm.writeClasses();       
	    oRm.write(">");
	    
	    // HEADER
	    oRm.write("<tr>");
	    oRm.write("<td>&nbsp;</td>");
	    oRm.write("<td ");	    
	    oRm.addStyle('height', oControl.getHeaderHeight());
	    oRm.writeStyles();
	    oRm.write(">");
	    oRm.renderControl(oControl.getHeader()[0]);
	    oRm.write("</td>");
	    oRm.write("<td>&nbsp;</td>");
	    oRm.write("</tr>");	    
	    
	    //MENU	    
	    oRm.write("<tr class=\"nav_bar\">");
	    oRm.write("<td>&nbsp;</td>");
	    oRm.write("<td ");	    
	    oRm.addStyle('height', oControl.getMenuHeight());
	    oRm.writeStyles();
	    oRm.write(">");
	    //oRm.write("Menu");	
	    oRm.renderControl(oControl.getMenu()[0]);
	    oRm.write("</td>");
	    oRm.write("<td>&nbsp;</td>");
	    oRm.write("</tr>");
	    
	    //BREADCRUB
	    oRm.write("<tr ");
	    oRm.addClass('mcGlobalTableTrBreadCrumb');	
	    oRm.writeClasses(); 
	    oRm.write(">");
	    oRm.write("<td>&nbsp;</td>");
	    oRm.write("<td ");	    
	    oRm.addStyle('height', oControl.getBreadcrumbHeight());
	    oRm.writeStyles();
	    oRm.write(">");	    
	    //oRm.write("Order > Order Details " );	
	    oRm.renderControl(oControl.getBreadcrumb()[0]);
	    oRm.write("</td>");
	    oRm.write("<td>&nbsp;</td>");
	    oRm.write("</tr>");
	    
	    
	    
	    //Page Title	    
	    oRm.write("<tr ");	        
	    oRm.addStyle('background-image', 'url(./image/drops.jpg)');
	    oRm.writeStyles();	    
	    oRm.write(">");
	    oRm.write("<td>&nbsp;</td>");
	    oRm.write("<td id='McTitleBarId'");	    
	    oRm.addStyle('height', oControl.getTitleHeight());
	    oRm.writeStyles();
	    oRm.write(">");	    
	    oRm.write("Orders" );
	   // oRm.renderControl(oControl.getPageHeader());
	    oRm.write("</td>");
	    oRm.write("<td>&nbsp;</td>");
	    oRm.write("</tr>");
	    
	    //CONTENT
	    
	    oRm.write("<tr>");
	    oRm.write("<td>&nbsp;</td>");
	    oRm.write("<td ");	    
	    oRm.addStyle('width', oControl.getContentWidth());
	    oRm.addStyle('min-width', oControl.getContentMinWidth());
	    oRm.writeStyles();	
	    oRm.write(">");	    	    
   		oRm.write("<div ");
   		oRm.addStyle('min-height', oControl.getContentHeight());
   		oRm.writeStyles();
   		oRm.write(">");	   		
   		oRm.renderControl(oControl.getContent()[0]);
   		oRm.write("</div>");
		oRm.write("</td>");
		oRm.write("<td>&nbsp;</td>");
		oRm.write("</tr>");
		
		//FOOTER
		 oRm.write("<tr ");
		 oRm.addStyle('background-color', '#6E6E6E');
		 oRm.writeStyles();
		 oRm.write(">");	  
		 oRm.write("<td>&nbsp;</td>");
		 oRm.write("<td ");	    
		 oRm.addStyle('height', oControl.getFooterHeight());
		 oRm.writeStyles();
		 oRm.write(">");
		 oRm.renderControl(oControl.getFooter()[0]);
		 oRm.write("</td>");
		 oRm.write("<td>&nbsp;</td>");
		 oRm.write("</tr>");	
		 
		oRm.write("</table>");
		
}


});