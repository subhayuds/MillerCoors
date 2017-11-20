sap.ui.jsview("mc.ccp.layout.App", {	

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf frame.App
	*/ 
	getControllerName : function() {
		return "mc.ccp.layout.App";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf frame.App
	*/ 
	createContent : function(oController) {
		jQuery.sap.require("mc.ccp.control.McGlobalTableFrame");
		jQuery.sap.require("mc.ccp.util.Application");		
		this.initiateAppContext();		
		var headerView = sap.ui.view({id:"headerViewId", viewName:"mc.ccp.header.Header", type:sap.ui.core.mvc.ViewType.JS}).setHeight('100%');
		
		
		
		if(!MCAPP.getAppLoadError()){		
		var menuView = sap.ui.view({id:"menuViewId", viewName:"mc.ccp.header.Menu", type:sap.ui.core.mvc.ViewType.JS}).setHeight('100%');	
		var footerView = sap.ui.view({id:"footerViewId", viewName:"mc.ccp.footer.Footer", type:sap.ui.core.mvc.ViewType.JS}).setHeight('100%');
		var breadcrumb = new sap.ui.commons.Label().addStyleClass('mcGlobalTableTrBreadCrumb');	
		var oAppFrame = new mc.ccp.control.McGlobalTableFrame('GlobalFrameId',{
			header :[ headerView],
			breadcrumb: [breadcrumb],
			menu :[ menuView],
			content:[ ],
			footer :[ footerView]
		});	
		//oAppFrame.setHeaderHeight('55px')
		
		
		oAppFrame.setBusyIndicatorDelay(0);		
		return oAppFrame;
		}
		
	},
	
	initiateAppContext :  function(){		
		// Creating Global Variable at App Context Level        
		sap.ui.getCore().AppContext = new Object();		
		sap.ui.getCore().AppContext.userInfo = new Object();
		//
		sap.ui.getCore().AppContext.shitos = new Object();
		sap.ui.getCore().AppContext.crcount = new Object();
		sap.ui.getCore().AppContext.currentweek = new Object();	
		sap.ui.getCore().AppContext.AppLoadError = false;
		sap.ui.getCore().AppContext.toggleOption = 'D';	
		sap.ui.getCore().AppContext.isExpand = false;	
		//CURRENT VIEW DETAILS
		sap.ui.getCore().AppContext.currentView = new Object();				
		sap.ui.getCore().AppContext.currentView.errorFlag = false;
		sap.ui.getCore().AppContext.currentView.dirtyFlag = false;		
		
		// CSA NON CSA FIELDSALES CUTOFFTIME PARAMS
		sap.ui.getCore().AppContext.CutOffTime = new Object();
		sap.ui.getCore().AppContext.CRCutOffTime = new Object();
		sap.ui.getCore().AppContext.distributorType = "";
		sap.ui.getCore().AppContext.distributorId = "";
		sap.ui.getCore().AppContext.distributorName = "";
		sap.ui.getCore().AppContext.Editable_Flag="";
		sap.ui.getCore().AppContext.SalesInvFilter = new Object();
		//Position of Current Order Week - Inventory Order WS
        sap.ui.getCore().AppContext.positionCurrentOrderWeek = new Object();

        //userInfo, page/CurrentView , Applcation
        //userIfo - distId , distName, shipto[],  crcount
        //pllication - currentWeek
        //currentView - errorFlag, dirtyFlag, viewName
		
	}
	

});
