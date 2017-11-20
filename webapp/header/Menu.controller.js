/***
 * @Author AF80
 * @Date 10/07/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is Menu view controller
 */
sap.ui.controller("mc.ccp.header.Menu", {
    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf header.Menu
     */
    onInit: function() {
        if (MCAPP.getDistributorType() == 'E') {
            // disabling CR
            this.getView().byId("changereqlink").addStyleClass('menu_itemDisable');
            sap.ui.getCore().byId("crlink").getAggregation('content')[0].setEnabled(false);
            // disabling  Forecast
            this.getView().byId("forecastlink").setEnabled(false);
            this.getView().byId("forecastlink").addStyleClass('menu_itemDisable');
            // disabling Sales & Inventory
            this.getView().byId("salesinventorylink").setEnabled(false);
            this.getView().byId("salesinventorylink").addStyleClass('menu_itemDisable');
        }
        this.onAfterRendering();
    },
    
    onAfterRendering: function(){
    	var CRcount = MCAPP.getCRcount();
    	if((CRcount === "0" || CRcount === '')){
    		sap.ui.getCore().byId("item1-1-4").setVisible(false);
    		sap.ui.getCore().byId("crlink").getContent()[1].setVisible(false);
    	}
    	else{
    		if((MCAPP.getDistributorType() === "D") || ((MCAPP.getDistributorType() === "I") && (sap.ui.getCore().byId("segmentedbuttonId").mAssociations.selectedButton) === "Domestic")){
    			sap.ui.getCore().byId("item1-1-4").setVisible(true);
        		sap.ui.getCore().byId("crlink").getContent()[1].setVisible(true);
    		}
    		else{
    			sap.ui.getCore().byId("item1-1-4").setVisible(false);
        		sap.ui.getCore().byId("crlink").getContent()[1].setVisible(false);
    		}
    	}    	
    },
    
    /**
     * method used to redirect to other module depending upon the logged in distributor type
     * @param oEvent
     */
    redirect: function(oEvent) {
    	var pagename = oEvent.getSource().mProperties.text;
        if (MCAPP.getDistributorType() == 'D') {
               switch (pagename) {
               case 'Order':
                     MCAPP.navigateTo("Empty", {}, this, false);
                     break;
               case 'Create CR':
                     MCAPP.navigateTo("ChangeRequest", {}, this, false, '');
                     break;
               case 'Preview CR':
                     MCAPP.navigateTo("ChangeRequestPreview", {}, this, false, '');
                     break;
               case 'CR Details':
                     MCAPP.navigateTo("ChangeRequestDetail", {}, this, false, '');
                     break;
               case 'Forecast':
                     MCAPP.navigateTo("Forecast", {}, this, false, '');
                     break;
               case 'Inventory':
                     MCAPP.navigateTo("Inventory", {}, this, false, '');
                     break;
               case 'Shipment':
                     MCAPP.navigateTo("Shipment", {}, this, false, '');
                     break;
               case 'Sales Inventory':
                     MCAPP.navigateTo("SalesAndInventory", {}, this, false, '');
                     break;
               default:
                     break;
               }
        }
        if (MCAPP.getDistributorType() == 'E') {
               switch (pagename) {
               case 'Order':
                     MCAPP.getComponent().getRouter()._oRoutes.Empty._oConfig.view = 'ImpExpOrder';
                     MCAPP.getComponent().getRouter()._oRoutes.Empty._oConfig.viewPath = 'mc.ccp.order';
                     MCAPP.navigateTo("Empty", {}, this, false);
                     break;
               case 'Inventory':
                     MCAPP.navigateTo("Inventory", {}, this, false, '');
                     break;
               case 'Shipment':
                     MCAPP.navigateTo("ShipmentsImpExp", {}, this, false, '');
                     break;
               default:
                     break;
               }
        }
        if (MCAPP.getDistributorType() == 'I') {
               var segmentedButtonSelected = sap.ui.getCore().byId("segmentedbuttonId").getAssociation('selectedButton');
               if (segmentedButtonSelected == MCAPP.getText('DH_IMPORT', this)) {
                     switch (pagename) {
                     case 'Order':
                            MCAPP.getComponent().getRouter()._oRoutes.Empty._oConfig.view = 'ImpExpOrder';
                            MCAPP.getComponent().getRouter()._oRoutes.Empty._oConfig.viewPath = 'mc.ccp.order';
                            MCAPP.navigateTo("Empty", {}, this, false);
                            break;
                     case 'Inventory':
                            MCAPP.navigateTo("Inventory", {}, this, false, '');
                            break;
                     case 'Shipment':
                            MCAPP.navigateTo("ShipmentsImpExp", {}, this, false, '');
                            break;
                     default:
                            break;
                     }
               } else {
                     switch (pagename) {
                     case 'Order':
                            MCAPP.getComponent().getRouter()._oRoutes.Empty._oConfig.view = 'Order';
                            MCAPP.getComponent().getRouter()._oRoutes.Empty._oConfig.viewPath = 'mc.ccp.order';
                            MCAPP.navigateTo("Empty", {}, this, false);
                            break;
                     case 'Create CR':
                            MCAPP.navigateTo("ChangeRequest", {}, this, false, '');
                            break;
                     case 'Preview CR':
                            MCAPP.navigateTo("ChangeRequestPreview", {}, this, false, '');
                            break;
                     case 'CR Details':
                            MCAPP.navigateTo("ChangeRequestDetail", {}, this, false, '');
                            break;
                     case 'Forecast':
                            MCAPP.navigateTo("Forecast", {}, this, false, '');
                            break;
                     case 'Inventory':
                            MCAPP.navigateTo("Inventory", {}, this, false, '');
                            break;
                     case 'Shipment':
                            MCAPP.navigateTo("Shipment", {}, this, false, '');
                            break;
                     case 'Sales Inventory':
                            MCAPP.navigateTo("SalesAndInventory", {}, this, false, '');
                            break;
                     default:
                            break;
                     }
               }
        }

    },
});