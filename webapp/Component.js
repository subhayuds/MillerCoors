jQuery.sap.declare("mc.ccp.Component");
jQuery.sap.require("sap.ui.core.routing.Router");

sap.ui.core.UIComponent.extend("mc.ccp.Component", {
	metadata : {
		
	config: {
		
		resourceBundle : "i18n/messageBundle.properties",
	},

    routing: {

		routes : [
		   
          
          {	  name:"Empty",
        	  pattern : ["","Order"],
        	  targetControl:"GlobalFrameId",
        	  targetAggregation:"content",
        	  viewPath : "mc.ccp.order",
        	  view:"Order",
  			  viewType : "JS",
  			  clearTarget : true
          },
          
          {	  name:"Empty1",
        	  pattern : ["Order1"],
        	  targetControl:"GlobalFrameId",
        	  targetAggregation:"content",
        	  viewPath : "mc.ccp.order",
        	  view:"Order",
  			  viewType : "JS",
  			  clearTarget : true
          },
          
          {	  name:"ImpExpOrder",
        	  pattern : ["ImpExpOrder"],
        	  targetControl:"GlobalFrameId",
        	  targetAggregation:"content",
        	  viewPath : "mc.ccp.order",
        	  view:"ImpExpOrder",
  			  viewType : "JS",
  			  clearTarget : true
          },
          
          {	  name:"ChangeRequest",
        	  pattern : ["ChangeRequest"],
        	  targetControl:"GlobalFrameId",
        	  targetAggregation:"content",
        	  viewPath : "mc.ccp.changereq",
        	  view:"ChangeRequest",
  			  viewType : "JS",
  			  clearTarget : true
          },
          {	  name:"ChangeRequestPreview",
        	  pattern : ["ChangeRequestPreview"],
        	  targetControl:"GlobalFrameId",
        	  targetAggregation:"content",
        	  viewPath : "mc.ccp.changereq",
        	  view:"ChangeRequestPreview",
  			  viewType : "JS",
  			  clearTarget : true
          },
          
          {	  name:"ChangeRequestDetail",
        	  pattern : ["ChangeRequestDetail"],
        	  targetControl:"GlobalFrameId",
        	  targetAggregation:"content",
        	  viewPath : "mc.ccp.changereq",
        	  view:"ChangeRequestDetail",
  			  viewType : "JS",
  			  clearTarget : true
          },
          
          {	  name:"Forecast",
        	  pattern : ["Forecast"],
        	  targetControl:"GlobalFrameId",
        	  targetAggregation:"content",
        	  viewPath : "mc.ccp.forecast",
        	  view:"Forecast",
  			  viewType : "JS",
  			  clearTarget : true
          },
          {	  name:"Setting",
        	  pattern : ["Setting"],
        	  targetControl:"GlobalFrameId",
        	  targetAggregation:"content",
        	  viewPath : "mc.ccp.setting",
        	  view:"Setting",
  			  viewType : "JS",
  			  clearTarget : true
          },
          {   name:"Inventory",
              pattern : ["Inventory"],
              targetControl:"GlobalFrameId",
              targetAggregation:"content",
              viewPath : "mc.ccp.inventory",
              view:"Inventory",
              viewType : "JS",
              clearTarget : true
        },
        /*{	  name:"Error",
          pattern : ":all*:",
      	  targetControl:"mainAppViewId",
      	  targetAggregation:"content",
      	  viewPath : "mc.ccp",
      	  view:"Error",
			  viewType : "JS",
			  clearTarget : true
        },*/
        { name:"ImportOrder",
      	  pattern : ["ImportOrder"],
      	  targetControl:"GlobalFrameId",
      	  targetAggregation:"content",
      	  viewPath : "mc.ccp.importorder",
      	  view:"ImportOrder",
      	  viewType : "JS",
      	  clearTarget : true
        },
        {	  name:"ExportOrder",
      	  pattern : ["ExportOrder"],
      	  targetControl:"GlobalFrameId",
      	  targetAggregation:"content",
      	  viewPath : "mc.ccp.exportorder",
      	  view:"ExportOrder",
      	  viewType : "JS",
      	  clearTarget : true
        },
        {   name:"ImportInventory",
            pattern : ["ImportInventory"],
            targetControl:"GlobalFrameId",
            targetAggregation:"content",
            viewPath : "mc.ccp.importinventory",
            view:"ImportInventory",
            viewType : "JS",
            clearTarget : true
      } ,
      {        name:"SalesAndInventory",
          pattern : ["SalesAndInventory"],
          targetControl:"GlobalFrameId",
          targetAggregation:"content",
          viewPath : "mc.ccp.inventory",
          view:"SalesAndInventory",
                  viewType : "JS",
                  clearTarget : true
      },
      
      {	  name:"Shipment",
    	  pattern : ["Shipment"],
    	  targetControl:"GlobalFrameId",
    	  targetAggregation:"content",
    	  viewPath : "mc.ccp.shipment",
    	  view:"Shipment",
			  viewType : "JS",
			  clearTarget : true
      },
      {        name:"ShipmentsImpExp",
          pattern : ["ShipmentsImpExp"],
          targetControl:"GlobalFrameId",
          targetAggregation:"content",
          viewPath : "mc.ccp.shipment",
          view:"ShipmentsImpExp",
          viewType : "JS",
                 clearTarget : true
       }
          ]
	
    }
    
},
init : function() {

	jQuery.sap.log.setLevel(jQuery.sap.log.Level.INFO);   
    var rootPath = jQuery.sap.getModulePath("mc.ccp");
    var mConfig = this.getMetadata().getConfig();
    
    var i18nModel = new sap.ui.model.resource.ResourceModel({
        bundleUrl : [rootPath, mConfig.resourceBundle].join("/")
    });    
    this.setModel(i18nModel, "i18n");
    
 // Create and set service model to the component
    var oAppModel = new sap.ui.model.json.JSONModel();    
    oAppModel.loadData('config/app.json',{},false);
    this.setModel(oAppModel,"app");
    
    
    var oServiceModel = new sap.ui.model.json.JSONModel();    
    oServiceModel.loadData('config/service.json',{},false);
    this.setModel(oServiceModel,"service");
    
    var oTogglePagesModel = new sap.ui.model.json.JSONModel();    
    oTogglePagesModel.loadData('config/togglePages.json',{},false);
    this.setModel(oTogglePagesModel,"togglePages");
    
    var oDropDownModel = new sap.ui.model.json.JSONModel();	
    oDropDownModel.loadData("config/dropdown.json",{},false); 
    this.setModel(oDropDownModel,"dropdown");
    
    //Header view can not get the models so moved this method down
    sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
        
    jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
	var router = this.getRouter();	
	router.attachRouteMatched(this.handleRouting, this);
	router.attachViewCreated(this.handleViewCreated, this);
	this.routeHandler = new sap.m.routing.RouteMatchedHandler(router);
	router.initialize();
	
},

createContent : function(oController) {
	jQuery.sap.require("sap.ui.commons.MessageBox");
	var view = sap.ui.view({id:"mainAppViewId", viewName:"mc.ccp.layout.App", type:sap.ui.core.mvc.ViewType.JS});
	return view;
},

//This method is used for initial pop up of Splash Screen once when logged into the application
onAfterRendering: function() {
	jQuery.sap.log.info('Component OnAfterRendering method');
	//return;
	if(MCAPP.getAppLoadError()){
		return;
	}
	var headerView = MCAPP.getHeaderView();
	var alertModel = headerView.getModel('alertFirst');
	if (!alertModel) {
		sap.ui.commons.MessageBox.show(MCAPP.getText('GBL_DATA_LOAD_ERROR', this), sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', this), [sap.ui.commons.MessageBox.Action.OK]);
		return;
	}
	var alertData = alertModel.getData().results;
	if (alertData.length == 0 ) {
		//sap.ui.commons.MessageBox.show('No Alerts for the day', sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', this), [sap.ui.commons.MessageBox.Action.OK]);
		return;
	}
	if (headerView.oAlertDialog == null) {
		var isCalledFromComponent = true;
		var oAlertView = new sap.ui.view({
			type: sap.ui.core.mvc.ViewType.JS,
			viewName: "mc.ccp.header.Alert",
			viewData: [isCalledFromComponent]
		});
		var oCloseButton = new sap.ui.commons.Button('closeButtonId', {
			text: MCAPP.getText('GBL_CLOSE', this),
			enabled: false
		}).addStyleClass('McCcpMsgAlertclose');
		oCloseButton.attachPress(oAlertView.getController().onPressClose, oAlertView.getController());
		/*var results = alertData.results.length;*/
		var results = alertData.length;
		 
		headerView.oAlertDialog = new mc.ccp.control.McDialog('alertdialog', {
			preventEscape : true,
			modal: true,
			width: '40%',
            height: '50%',
			 title: MCAPP.getText('SPLASH_SCREEN', this)+" ( 1 "+ MCAPP.getText('GBL_OF', this) + " " + results + " )",
			content: [oAlertView],
			buttons: [oCloseButton],
		}).addStyleClass('McCcpCustomDialog');
		headerView.oAlertDialog.attachCloseClicked(oAlertView.getController().onPressEscape, oAlertView.getController());
		headerView.oAlertDialog.addStyleClass('McCcpHeaderDialogClose');
		headerView.oAlertDialog.open();
	}
	else {
		headerView.oAlertDialog.open();
		
	}
}

});


mc.ccp.Component.prototype.handleRouting = function(oEvent){
	jQuery.sap.log.info('MAIN: MATCHED :'+oEvent.getParameter("name"));		
};

mc.ccp.Component.prototype.handleViewCreated = function(oEvent){
	var obj = this.getRouter()._oViews;
	jQuery.each(obj, function(name, value) {		
		if(oEvent.getParameter('viewName') != name){
			value.destroy();
			delete obj[name];
		}	    
	});
};

mc.ccp.Component.prototype.destroy = function(){
	if(this.routeHandler){
		this.routeHandler.destroy();
	}
	sap.ui.core.UIComponent.destroy.apply(this,arguments);
	
};

