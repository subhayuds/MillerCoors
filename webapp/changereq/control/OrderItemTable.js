jQuery.sap.declare('mc.ccp.changereq.control.OrderItemTable');
jQuery.sap.require("mc.ccp.control.McArrowTextField");	

sap.ui.core.Control.extend('mc.ccp.changereq.control.OrderItemTable', {
	metadata: {
		properties: {
			'width'      : {type: 'sap.ui.core.CSSSize',group: 'Dimension',defaultValue: '100%'},
			'height'     : {type: 'sap.ui.core.CSSSize',group: 'Dimension',defaultValue: '210px'},    	
			'expand'     : {type : "boolean", defaultValue : false},
			'dirtyState' : {type : "boolean", defaultValue : false},
			'readOnly' : {type : "boolean", defaultValue : false}
		},
		aggregations: {    	   
			skuLink     : {type : "sap.ui.commons.Link",multiple : false, visibility: "public"}, 
			ordQty      : {type : "mc.ccp.control.McArrowTextField", multiple : false, visibility: "public"}, 
			inProgLink     : {type : "sap.ui.commons.Link",multiple : false, visibility: "public"},
			chngReqQty  : {type : "mc.ccp.control.McArrowTextField", multiple : false, visibility: "public"}, 
			expColpsImg : {type : "sap.ui.commons.Image", multiple : false, visibility: "public"}, 

			frctQty1    : {type : "mc.ccp.control.McArrowTextField", multiple : false, visibility: "public"},
			frctQty2    : {type : "mc.ccp.control.McArrowTextField", multiple : false, visibility: "public"},
			frctQty3    : {type : "mc.ccp.control.McArrowTextField", multiple : false, visibility: "public"},
			frctQty4    : {type : "mc.ccp.control.McArrowTextField", multiple : false, visibility: "public"},
			frctQty5    : {type : "mc.ccp.control.McArrowTextField", multiple : false, visibility: "public"},
			frctQty6    : {type : "mc.ccp.control.McArrowTextField", multiple : false, visibility: "public"},
			frctQty7    : {type : "mc.ccp.control.McArrowTextField", multiple : false, visibility: "public"},
		},
		events : {
			'change' :{},
			'expanded' :{},
			'collapsed' :{},
			'press' :{}
		}
	},  


	init : function() {	
		// jQuery.sap.require("sap.ui.core.theming.Parameters");
		//var myColor = sap.ui.core.theming.Parameters.get("sapHighlightColor");	  
		//jQuery.sap.log.info(myColor);

		jQuery.sap.log.info('CHECK INIT ::' + this.sId);
		//For Order Qty Aggregation
		var ordQty  = new mc.ccp.control.McArrowTextField();		 
		ordQty.bindProperty("value", "ZCCP_CH_REQ_HEAD_ITEM_NAV/results/3/OrderedQty");
		// ordQty.bindProperty("pallet", "ZCCP_CH_REQ_HEAD_ITEM_NAV/results/3/pallet");
		ordQty.setProperty("pallet", "50");
		ordQty.bindProperty("readOnly", "readOnly");
		this.setAggregation('ordQty', ordQty);	  
		var chngReqQty  = new mc.ccp.control.McArrowTextField();		 
		chngReqQty.bindProperty("value", "ZCCP_CH_REQ_HEAD_ITEM_NAV/results/2/ChangeReqQty");
		chngReqQty.setProperty("pallet", "50");
		chngReqQty.bindProperty("readOnly", "readOnly");
		this.setAggregation('chngReqQty', chngReqQty);


		//For Forecast Qty's Aggregations
		var frctQty1  = new mc.ccp.control.McArrowTextField({arrows:false}).bindProperty("value", "ZCCP_CH_REQ_HEAD_ITEM_NAV/results/2/DistForecast");	 
		this.setAggregation('frctQty1', frctQty1);	 
		var frctQty2  = new mc.ccp.control.McArrowTextField({arrows:false}).bindProperty("value", "ZCCP_CH_REQ_HEAD_ITEM_NAV/results/3/DistForecast");	 
		this.setAggregation('frctQty2', frctQty2);	 
		var frctQty3  = new mc.ccp.control.McArrowTextField({arrows:false}).bindProperty("value", "ZCCP_CH_REQ_HEAD_ITEM_NAV/results/4/DistForecast");	 
		this.setAggregation('frctQty3', frctQty3);	 
		var frctQty4  = new mc.ccp.control.McArrowTextField({arrows:false}).bindProperty("value", "ZCCP_CH_REQ_HEAD_ITEM_NAV/results/5/DistForecast");	 
		this.setAggregation('frctQty4', frctQty4);	 
		var frctQty5  = new mc.ccp.control.McArrowTextField({arrows:false}).bindProperty("value", "ZCCP_CH_REQ_HEAD_ITEM_NAV/results/6/DistForecast");	 
		this.setAggregation('frctQty5', frctQty5);	 
		var frctQty6  = new mc.ccp.control.McArrowTextField({arrows:false}).bindProperty("value", "ZCCP_CH_REQ_HEAD_ITEM_NAV/results/7/DistForecast");	 
		this.setAggregation('frctQty6', frctQty6);	 
		var frctQty7  = new mc.ccp.control.McArrowTextField({arrows:false}).bindProperty("value", "ZCCP_CH_REQ_HEAD_ITEM_NAV/results/8/DistForecast");	 
		this.setAggregation('frctQty7', frctQty7);

		var skuLink  = new sap.ui.commons.Link({arrows:false}).bindProperty("text", "SKU");	 
		this.setAggregation('skuLink', skuLink);

		/*var inProgLink  = new sap.ui.commons.Link({arrows:false}).bindProperty("text", "ZCCP_CH_REQ_HEAD_ITEM_NAV/results/2/ChangeReqQty");*/
		var inProgLink  = new sap.ui.commons.Link({arrows:false , text : MCAPP.getText('CC_CR_ITMTBL_IN_PROG',this)});
		this.setAggregation('inProgLink', inProgLink);

		var expColpsImg  = new sap.ui.commons.Image({src:'image/expand.png'});	 
		this.setAggregation('expColpsImg', expColpsImg); 	 

	},


	onAfterRendering: function (){
		this.getAggregation('chngReqQty').attachChange(this.handleOrderChange,this);
		this.getAggregation('ordQty').attachChange(this.handleOrderChange,this);
		this.getAggregation('frctQty1').attachChange(this.handleForecastChange,this);
		this.getAggregation('frctQty2').attachChange(this.handleForecastChange,this);
		this.getAggregation('frctQty3').attachChange(this.handleForecastChange,this);
		this.getAggregation('frctQty4').attachChange(this.handleForecastChange,this);
		this.getAggregation('frctQty5').attachChange(this.handleForecastChange,this);
		this.getAggregation('frctQty6').attachChange(this.handleForecastChange,this);
		this.getAggregation('frctQty7').attachChange(this.handleForecastChange,this);
		this.getAggregation('skuLink').attachPress(this.handleLinkPress,this);
		this.getAggregation('inProgLink').attachPress(this.handleLinkPressInProgress,this);
		this.getAggregation('expColpsImg').attachPress(this.handleExpandCollapsePress,this);
		if(this.getExpand()){		  
			this.expand();
		}else{		  
			this.collapse();
		}	  
	},

	onBeforeRendering: function (){
		this.getAggregation('chngReqQty').detachChange(this.handleOrderChange,this);
		this.getAggregation('ordQty').detachChange(this.handleOrderChange,this);
		this.getAggregation('frctQty1').detachChange(this.handleForecastChange,this);
		this.getAggregation('frctQty2').detachChange(this.handleForecastChange,this);
		this.getAggregation('frctQty3').detachChange(this.handleForecastChange,this);
		this.getAggregation('frctQty4').detachChange(this.handleForecastChange,this);
		this.getAggregation('frctQty5').detachChange(this.handleForecastChange,this);
		this.getAggregation('frctQty6').detachChange(this.handleForecastChange,this);
		this.getAggregation('frctQty7').detachChange(this.handleForecastChange,this);
		this.getAggregation('skuLink').detachPress(this.handleLinkPress,this);
		this.getAggregation('inProgLink').detachPress(this.handleLinkPressInProgress,this);
		this.getAggregation('expColpsImg').detachPress(this.handleExpandCollapsePress,this);
	},

	renderer: function(oRm, oControl) {	  
		oRm.write("<div ");
		oRm.writeControlData(oControl); 
		oRm.addStyle("width", oControl.getWidth());  
		//oRm.addStyle("height", oControl.getHeight());	
		oRm.writeStyles();
		oRm.writeClasses(); 
		oRm.write(">");	
		oRm.write("<table border=0 height='100%' width='100%' cellpadding='0' cellspacing='0' class='McCcpChngReqOrdTable' >");
		oRm.write("<tr class='McCcpChngReqOrdTableSpaceTr' height='5px' ><td colspan='10'></td></tr>");
		oControl._renderHeaderRow(oRm,oControl);	
		for (var i = 1; i < 7; i++) { 
			oControl._renderRow(oRm,oControl,i);
		}	
		oControl._renderForecastRow(oRm,oControl);	
		oRm.write("</table>");
		oRm.write("</div>");
	},

	_renderHeaderRow : function(oRm,oControl){
		oRm.write("<tr height='30px' class='McCcpChngReqOrdTableHdrTr'>");
		oRm.write("<td>");oRm.renderControl(oControl.getAggregation('expColpsImg'));oRm.write("</td>");
		oRm.write("<td>"+oControl.getModel().getProperty(oControl.getBindingContext().getPath()).DistSKU+"</td>");
		oRm.write("<td>");oRm.renderControl(oControl.getAggregation('skuLink'));oRm.write("</td>");
		oRm.write("<td colspan=2>"+oControl.getModel().getProperty(oControl.getBindingContext().getPath()).SKU_Desc+"</td>");
		oRm.write("<td>"+oControl.getModel().getProperty(oControl.getBindingContext().getPath()).Sales_Ord_No+"</td>");
		oRm.write("<td>"+oControl.getModel().getProperty(oControl.getBindingContext().getPath()).Custom_PO+"</td>");
		oRm.write("<td>"+oControl.getModel().getProperty(oControl.getBindingContext().getPath()).ShipToId+"</td>");
		oRm.write("<td>"+oControl.getModel().getProperty(oControl.getBindingContext().getPath()).SourceName+"</td>");
		oRm.write("<td>"+oControl.getModel().getProperty(oControl.getBindingContext().getPath()).Estdtransitdays+"</td>");	 
		oRm.write("</tr>");	  
	},

	_renderForecastRow : function(oRm,oControl){
		var jsonProp = 'DistForecast';
		oRm.write("<tr id="+(oControl.sId+'-forecast')+" height='30px' style='' class='McCcpChngReqOrdTableFrctTr'>");	//ZCCP_CH_REQ_HEAD_ITEM_NAV/results/2/DIST_FORECST
		oRm.write("<td width='19%'>"+this.getModel('i18n').getProperty('GBL_DIST_FORECAST')+"</td>");
		oRm.write("<td width='9%'>"+oControl.getModel().getProperty(oControl.getBindingContext().getPath()+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/0/'+jsonProp)+"</td>");	  
		oRm.write("<td width='9%'>"+oControl.getModel().getProperty(oControl.getBindingContext().getPath()+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/1/'+jsonProp)+"</td>");	  
		oRm.write("<td width='9%' height='30px'>"); oRm.renderControl(oControl.getAggregation('frctQty1')); oRm.write("</td>");
		oRm.write("<td width='9%' height='30px'>"); oRm.renderControl(oControl.getAggregation('frctQty2')); oRm.write("</td>");
		oRm.write("<td width='9%' height='30px'>"); oRm.renderControl(oControl.getAggregation('frctQty3')); oRm.write("</td>");
		oRm.write("<td width='9%' height='30px'>"); oRm.renderControl(oControl.getAggregation('frctQty4')); oRm.write("</td>");
		oRm.write("<td width='9%' height='30px'>"); oRm.renderControl(oControl.getAggregation('frctQty5')); oRm.write("</td>");
		oRm.write("<td width='9%' height='30px'>"); oRm.renderControl(oControl.getAggregation('frctQty6')); oRm.write("</td>");
		oRm.write("<td width='9%' height='30px'>"); oRm.renderControl(oControl.getAggregation('frctQty7')); oRm.write("</td>");	 
		oRm.write("</tr>");  	  	 
	},

	_renderRow : function(oRm,oControl,index){
		var jsonProp = '';
		var rowLabel = '';

		switch (index) {
		case 1:
			jsonProp = "SuggQty";
			rowLabel = this.getModel('i18n').getProperty('GBL_SUGGESTED');
			break;
		case 2:
			jsonProp = "OrderedQty";
			rowLabel = this.getModel('i18n').getProperty('GBL_ORDERED');
			break;
		case 3:
			jsonProp = "ConfirmQty";
			rowLabel = this.getModel('i18n').getProperty('GBL_CONFIRMED');
			break;
		case 4:
			jsonProp = "ChangeReqQty";
			rowLabel = this.getModel('i18n').getProperty('GBL_CHANGE_REQ');
			break;
		case 5:
			jsonProp = "ProjDOI";
			rowLabel = this.getModel('i18n').getProperty('GBL_PROJECTED_DOI');
			break;
		case 6:
			jsonProp = "TargDOI";
			rowLabel = this.getModel('i18n').getProperty('GBL_TARGET_DOI');
			break;
		}  

		oRm.write("<tr id="+(oControl.sId+jsonProp)+" height='30px' class='McCcpChngReqOrdTableTr McCcpChngReqTableTr'>");	///ZCCP_CH_REQ_HEAD_ITEM_NAV/results/0/
		oRm.write("<td width='19%'>"+rowLabel+"</td>");
		oRm.write("<td width='9%'>"+oControl.getModel().getProperty(oControl.getBindingContext().getPath()+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/0/'+jsonProp)+"</td>");	  
		oRm.write("<td width='9%'>"+oControl.getModel().getProperty(oControl.getBindingContext().getPath()+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/1/'+jsonProp)+"</td>");

		if(index == 4){
			if(oControl.getModel().getProperty(oControl.getBindingContext().getPath()+'/Status_Code') == "03"){
				oRm.write("<td width='9%' height='30px'>");oRm.renderControl(oControl.getAggregation('inProgLink')); oRm.write("</td>");
			}else{
				oRm.write("<td width='9%' height='30px'>"); oRm.renderControl(oControl.getAggregation('chngReqQty')); oRm.write("</td>");
			}
		}else{
			oRm.write("<td width='9%'>"+oControl.getModel().getProperty(oControl.getBindingContext().getPath()+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/2/'+jsonProp)+"</td>");
		}	
		oRm.write("<td width='9%'>"+oControl.getModel().getProperty(oControl.getBindingContext().getPath()+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/3/'+jsonProp)+"</td>");
		oRm.write("<td width='9%'>"+oControl.getModel().getProperty(oControl.getBindingContext().getPath()+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/4/'+jsonProp)+"</td>");
		oRm.write("<td width='9%'>"+oControl.getModel().getProperty(oControl.getBindingContext().getPath()+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/5/'+jsonProp)+"</td>");
		oRm.write("<td width='9%'>"+oControl.getModel().getProperty(oControl.getBindingContext().getPath()+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/6/'+jsonProp)+"</td>");
		oRm.write("<td width='9%'>"+oControl.getModel().getProperty(oControl.getBindingContext().getPath()+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/7/'+jsonProp)+"</td>");
		oRm.write("<td width='9%'>"+oControl.getModel().getProperty(oControl.getBindingContext().getPath()+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/8/'+jsonProp)+"</td>");
		oRm.write("</tr>");  
	}
});

mc.ccp.changereq.control.OrderItemTable.prototype.handleOrderChange = function(oEvent) {
	jQuery.sap.log.info('handleOrderChange in CRTable');	
	
	var changedData = oEvent.getParameter('changed');
	var originalData;
	
	var bkUpModel = this.getModel('backupCR');
	if(bkUpModel){// ONLY Works For other than FireFox
	  originalData = bkUpModel.getProperty(this.getBindingContext().sPath+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/2/ChangeReqQty');
	}else{  // ONLY Works For FireFox TODO ::Need a better solution
	  originalData = this.getParent().getParent().getParent().getModel('backup').getProperty(this.getBindingContext().sPath+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/2/ChangeReqQty');
	}	  	  
		
	 	
	if(this._isDirty()){				
		this.setDirtyState(true);				
	}else{				
		this.setDirtyState(false);				
	}
	
	this.fireChange({source:'ChangeReqQty',changedData:changedData,originalData:originalData,dirtyState:this.getDirtyState()});
	this._calculateProjectedDOI();
	this.rerender();
};


mc.ccp.changereq.control.OrderItemTable.prototype.handleLinkPressInProgress= function(oEvent) {
	MCAPP.setBusy(true);

	var oOkButton = new sap.ui.commons.Button({text:MCAPP.getText('GBL_OK',this),width:"90px", height:'30px'});
	oOkButton.attachPress(function(oEvent){oEvent.getSource().getParent().close();MCAPP.setBusy(false);});

	oCustIdPoDialog = new sap.ui.commons.Dialog('vehEstDialog',{
		modal : true,
		width: '40%',
		height : '60%',		
		title:MCAPP.getText('VW_CR_PRW_TITLE',this) +" "+oEvent.getSource().getBindingContext().getProperty("SKU"), 		
		buttons : [oOkButton],
		closed : function(oEvent){MCAPP.setBusy(false);this.destroy();}
	}).addStyleClass('McCustomDialog');
	oCustIdPoDialog.open();

	var oCustIdPoView = new sap.ui.view({
		type : sap.ui.core.mvc.ViewType.JS,
		viewName : "mc.ccp.changereq.CRInProgress",
		viewData : oEvent.getSource().getBindingContext()
	});	

	oCustIdPoDialog.addContent(oCustIdPoView);
};

mc.ccp.changereq.control.OrderItemTable.prototype.handleLinkPress= function(oEvent) {
//TODO : Inventory Module is yet not integrated
/*	var thisRouter = sap.ui.core.UIComponent.getRouterFor(this);
    thisRouter.navTo("InventoryFlowWorksheet");*/
};




mc.ccp.changereq.control.OrderItemTable.prototype.handleForecastChange = function(oEvent) {
	var source = '';
	for (var key in this.mAggregations) {
		if (this.mAggregations.hasOwnProperty(key)) {		    
			if(oEvent.getSource().sId == this.mAggregations[key].sId){
				source = key;
				break;
			}
		}
	}
	jQuery.sap.log.info(source);

	var relContextPath = '';
	switch (source) {
	case 'frctQty1':
		relContextPath = "/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/2/DistForecast";   	  
		break;
	case 'frctQty2':
		relContextPath = "/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/3/DistForecast";   	  
		break;
	case 'frctQty3':
		relContextPath = "/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/4/DistForecast";   	  
		break;
	case 'frctQty4':
		relContextPath = "/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/5/DistForecast";   	  
		break;
	case 'frctQty5':
		relContextPath = "/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/6/DistForecast";   	  
		break;
	case 'frctQty6':
		relContextPath = "/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/7/DistForecast";   	  
		break;
	case 'frctQty7':
		relContextPath = "/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/8/DistForecast";   	  
		break;
	}
	var changedData = oEvent.getParameter('changed');
	var originalData;

	var bkUpModel = this.getModel('backupCR');
	if(bkUpModel){// ONLY Works For other than FireFox
		originalData = bkUpModel.getProperty(this.getBindingContext().sPath+relContextPath);
	}else{  // ONLY Works For FireFox TODO ::Need a better solution
		originalData = this.getParent().getParent().getParent().getModel('backupCR').getProperty(this.getBindingContext().sPath+relContextPath);
	}

	if(this._isDirty()){				
		this.setDirtyState(true);				
	}else{				
		this.setDirtyState(false);				
	}			
	this.fireChange({source:source,changedData:changedData,originalData:originalData,dirtyState:this.getDirtyState()});
	this._calculateProjectedDOI();
	this.rerender();
};

mc.ccp.changereq.control.OrderItemTable.prototype._hasErrors = function() {
	var test =   this.mAggregations.chngReqQty.getErrorState() || 
	this.mAggregations.frctQty1.getErrorState() ||
	this.mAggregations.frctQty2.getErrorState() ||
	this.mAggregations.frctQty3.getErrorState() ||
	this.mAggregations.frctQty4.getErrorState() ||
	this.mAggregations.frctQty5.getErrorState() ||
	this.mAggregations.frctQty6.getErrorState() ||
	this.mAggregations.frctQty7.getErrorState();			
	jQuery.sap.log.info(test);
	return test;
};


mc.ccp.changereq.control.OrderItemTable.prototype._isDirty = function() {

	var changedModel = this.getModel();

	var originalModel = this.getModel('backupCR');
	if(!originalModel){// ONLY Works For other than FireFox
		originalModel = this.getParent().getParent().getParent().getModel('backupCR');
	}

	if(        originalModel.getProperty(this.getBindingContext().sPath+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/2/ChangeReqQty') 
			== changedModel.getProperty(this.getBindingContext().sPath+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/2/ChangeReqQty')

			&& originalModel.getProperty(this.getBindingContext().sPath+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/2/DistForecast') 
			== changedModel.getProperty(this.getBindingContext().sPath+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/2/DistForecast')

			&& originalModel.getProperty(this.getBindingContext().sPath+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/3/DistForecast') 
			== changedModel.getProperty(this.getBindingContext().sPath+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/3/DistForecast')

			&& originalModel.getProperty(this.getBindingContext().sPath+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/4/DistForecast') 
			== changedModel.getProperty(this.getBindingContext().sPath+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/4/DistForecast')

			&& originalModel.getProperty(this.getBindingContext().sPath+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/5/DistForecast') 
			== changedModel.getProperty(this.getBindingContext().sPath+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/5/DistForecast')

			&& originalModel.getProperty(this.getBindingContext().sPath+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/6/DistForecast') 
			== changedModel.getProperty(this.getBindingContext().sPath+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/6/DistForecast')

			&& originalModel.getProperty(this.getBindingContext().sPath+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/7/DistForecast') 
			== changedModel.getProperty(this.getBindingContext().sPath+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/7/DistForecast')

			&& originalModel.getProperty(this.getBindingContext().sPath+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/8/DistForecast') 
			== changedModel.getProperty(this.getBindingContext().sPath+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/8/DistForecast')

	){
		return false;
	}else{
		return true;
	}

};


mc.ccp.changereq.control.OrderItemTable.prototype._calculateProjectedDOI = function(){	
/*	
	//Step 1: calculating the Ending Inventory for n weeks. Ending Inventory (Week N) = Beginning Inventory (Week N) + Current Order Quantity (Week N) – Forecast (Week N).
	for(var i=0; i<9; i++){
		var beginningInv = this.getModel().getProperty(this.getBindingContext().sPath+'/Beg_Inv');
		var currentOrderQty = this.getModel().getProperty(this.getBindingContext().sPath+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/'+i+'/OrderedQty');
		var forecastQty = this.getModel().getProperty(this.getBindingContext().sPath+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/'+i+'/DistForecast');
		var endingInv = parseInt(beginningInv) + parseInt(currentOrderQty) - parseInt(forecastQty) ;
		console.log("ending inv for week " + i +" is = "+endingInv);
	}*/
	//------------
	this.getModel().setProperty(this.getBindingContext().sPath+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/0/ProjDOI',this.getAggregation('chngReqQty').getValue()+1);
	this.getModel().setProperty(this.getBindingContext().sPath+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/1/ProjDOI',this.getAggregation('chngReqQty').getValue()+2);
	this.getModel().setProperty(this.getBindingContext().sPath+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/2/ProjDOI',this.getAggregation('chngReqQty').getValue()+3);
	this.getModel().setProperty(this.getBindingContext().sPath+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/3/ProjDOI',this.getAggregation('chngReqQty').getValue()+4);
	this.getModel().setProperty(this.getBindingContext().sPath+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/4/ProjDOI',this.getAggregation('chngReqQty').getValue()+5);
	this.getModel().setProperty(this.getBindingContext().sPath+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/5/ProjDOI',this.getAggregation('chngReqQty').getValue()+6);
	this.getModel().setProperty(this.getBindingContext().sPath+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/6/ProjDOI',this.getAggregation('chngReqQty').getValue()+7);
	this.getModel().setProperty(this.getBindingContext().sPath+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/7/ProjDOI',this.getAggregation('chngReqQty').getValue()+8);
	this.getModel().setProperty(this.getBindingContext().sPath+'/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/8/ProjDOI',this.getAggregation('chngReqQty').getValue()+9);
};

mc.ccp.changereq.control.OrderItemTable.prototype.handleExpandCollapsePress= function(oEvent) {
	if(this.getExpand()){
		jQuery.sap.byId(this.getId()).find('tr#'+this.getId()+'-forecast').hide();
		this.setExpand(false);	
		this.getAggregation('expColpsImg').setSrc('image/expand.png');
		this.fireCollapsed();
	}else{
		jQuery.sap.byId(this.getId()).find('tr#'+this.getId()+'-forecast').show();
		this.setExpand(true);	
		this.getAggregation('expColpsImg').setSrc('image/collapse.png');
		this.fireExpanded();
	}
};

mc.ccp.changereq.control.OrderItemTable.prototype.expand  = function(oEvent) {
	jQuery.sap.byId(this.getId()).find('tr#'+this.getId()+'-forecast').show();
	this.getAggregation('expColpsImg').setSrc('image/collapse.png');
	this.setExpand(true);	
};

mc.ccp.changereq.control.OrderItemTable.prototype.collapse  = function(oEvent) {
	jQuery.sap.byId(this.getId()).find('tr#'+this.getId()+'-forecast').hide();
	this.getAggregation('expColpsImg').setSrc('image/expand.png');
	this.setExpand(false);
};

mc.ccp.changereq.control.OrderItemTable.prototype.exit = function(oEvent) {
	//remove attached non-default event handler
	jQuery.sap.log.info('CHECK DESTROY'+ this.sId);
};


