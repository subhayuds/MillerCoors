jQuery.sap.declare('mc.ccp.control.McPaginator');
sap.ui.commons.Paginator.extend("mc.ccp.control.McPaginator", { 
	metadata : {
		properties: {
			'width': {type: 'sap.ui.core.CSSSize',defaultValue: '400px'},
	    	'height':{type: 'sap.ui.core.CSSSize',defaultValue: '50px'},
			'showSave' : {type : "boolean", defaultValue : true}		
			},
		aggregations : {
            prevLink    : {type : "sap.ui.commons.Link", multiple : false, visibility: "public"},
            nextLink    : {type : "sap.ui.commons.Link", multiple : false, visibility: "public"},
            
            prevSaveLable    : {type : "sap.ui.commons.Label", multiple : false, visibility: "public"},
            nextSaveLable    : {type : "sap.ui.commons.Label", multiple : false, visibility: "public"},
            
            prevIcon    : {type : "sap.ui.core.Icon", multiple : false, visibility: "public"},
            nextIcon    : {type : "sap.ui.core.Icon", multiple : false, visibility: "public"}
        }
	},
	
	 init : function(){
		 var oControl = this;
		 sap.ui.commons.Paginator.prototype.init.apply(this, arguments); 
		 
		 // Create Links 
		 var oPrevLink = new sap.ui.commons.Link({
		        text: MCAPP.getText('GBL_PREVIOUS'),	       
		        press: function() {
		        	if(oControl.getCurrentPage() > 1){
		        		
		        		oControl.setCurrentPage(oControl.getCurrentPage() - 1);
		        		
			        	oControl.firePage({
			        		srcPage : oControl.getCurrentPage() +1,
			        		targetPage : oControl.getCurrentPage(),
			        		type : sap.ui.commons.PaginatorEvent.Previous 
		                 });
			        	
		        	}else{
		        		//alert('min reached');
		        	}
		        	
		        }});
		 
		 oPrevLink.addStyleClass('naviLink');
		 
		 
		 
		 var oNextLink = new sap.ui.commons.Link({
		        text:  MCAPP.getText('GBL_NEXT'),
		        press: function() {
		        	if(oControl.getCurrentPage() < oControl.getNumberOfPages()){		        		
		        		oControl.setCurrentPage(oControl.getCurrentPage() + 1);		        		
			        	oControl.firePage({
			        		srcPage : oControl.getCurrentPage()-1,
			        		targetPage : oControl.getCurrentPage(),
			        		type : sap.ui.commons.PaginatorEvent.Next 
		                 });
			        	
			        	
		        	}else{
		        		//alert('max reached');
		        	}
		        	
		        }});
		 oNextLink.addStyleClass('naviLink');
		 
		 oControl.setAggregation("prevLink", oPrevLink);
		 oControl.setAggregation("nextLink", oNextLink);		 
	 },
	 


	// the part creating the HTML:
	renderer : function(oRm, oControl) { 
		jQuery.sap.require("sap.ui.core.IconPool");
		
		oRm.write("<div ");
		oRm.writeControlData(oControl); 
		oRm.addStyle("width", oControl.getWidth());  
		oRm.addStyle("height", oControl.getHeight()); 
		
		oRm.addStyle("background-color", 'white');
		oRm.writeStyles();
		oRm.writeClasses(); 
		oRm.write(">");
		
		
		var oSaveLabel1 = new sap.ui.commons.Label({text : 'Save &'}).addStyleClass('naviLinkText'); 
		var oSaveLabel2 = new sap.ui.commons.Label({text : 'Save &'}).addStyleClass('naviLinkText');
        
		var prevIcon =  new sap.ui.core.Icon( {src : sap.ui.core.IconPool.getIconURI( 'media-reverse' ),  
            size : "10px",  
            color : "#333333",
        } ).addStyleClass('naviLinkImg');
       
       var nextIcon =  new sap.ui.core.Icon( {src : sap.ui.core.IconPool.getIconURI( 'media-play' ),  
           size : "10px",  
           color : "#333333",
       } );
 
		
		oRm.write("<table border=0 height='100%' width='100%' cellpadding='0' cellspacing='0'>");
		oRm.write("<tr><td width='30%' style='padding-right: 10px;text-align: right;'>");
		
		
		
		
		if(oControl.getShowSave()){
			oRm.write("<div class='saveDivShow'>");
		}else{
			oRm.write("<div class='saveDivHide'>");
		}		
		oRm.renderControl(oSaveLabel1)
		oRm.write("</div>");
		oRm.write("<div class='linkDiv'>");
		oRm.renderControl(prevIcon);
		oRm.write("&nbsp;&nbsp;");
		oRm.renderControl(oControl.getAggregation("prevLink")); 
		oRm.write("</div>");
		
		oRm.write("</td><td width='40%' align=center>");
		oRm.write("<span class='naviText'>Page <input type='text' style='width:20px' value='"+oControl.getCurrentPage()+"' maxlength=2> of "+oControl.getNumberOfPages()+"</span>");
		oRm.write("</td><td width='30%' style='padding-left: 10px;text-align: left;'>");
		
		if(oControl.getShowSave()){
			oRm.write("<div class='saveDivShow'>");
		}else{
			oRm.write("<div class='saveDivHide'>");
		}
		oRm.renderControl(oSaveLabel2);
		oRm.write("</div>");
		oRm.write("<div class='linkDiv'>");
		oRm.renderControl(oControl.getAggregation("nextLink"));
		oRm.write("&nbsp;&nbsp;");
		oRm.renderControl(nextIcon);
		oRm.write("</div>");
		
		
		oRm.write("</td></tr></table>");
		
		oRm.write("</div>"); 
		
	}
	
});

mc.ccp.control.McPaginator.prototype.onchange = function(oEvent) {
	//alert('change');
};

mc.ccp.control.McPaginator.prototype.onsapenter = function(oEvent) {
    var tmp = parseInt(oEvent.target.value);
    if(isNaN(tmp) || (tmp <  1  ||  tmp > this.getNumberOfPages())){
           var errorDialog = new sap.ui.commons.Dialog({
                  modal : true,
                  width: '300px',
                  height : '200px',                       
                  title:'Error',
                  content : [ new sap.ui.commons.TextView({text:'Invalid Page Number'}) ],
                  buttons : [new sap.ui.commons.Button({text:'OK',press:function(){errorDialog.close();}})],
                  closed : function(oEvent){this.destroy();}
          
           }).addStyleClass('McCcpCustomDialog');
           errorDialog.open();
           tmp = parseInt(oEvent.srcControl.mProperties.currentPage);
           $("span.naviText").html("Page <input type='text' style='width:20px' value='"+tmp+"' maxlength=2/> of "+oEvent.srcControl.mProperties.numberOfPages+"");
           return;
    }     
if(tmp != parseInt(oEvent.srcControl.mProperties.currentPage)){
	this.setCurrentPage(tmp);
	this.firePage({
	    srcPage : parseInt(oEvent.target.getAttribute('value')),
	    targetPage : parseInt(oEvent.target.value),
	    type : sap.ui.commons.PaginatorEvent.Goto
	});
}

    
   
};