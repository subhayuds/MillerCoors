sap.ui.jsview("mc.ccp.footer.Footer", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf footer.Footer
	*/ 
	getControllerName : function() {
		return "mc.ccp.footer.Footer";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf footer.Footer
	*/ 
	createContent : function(oController) {
		var oButton = new sap.ui.commons.TextView({ 
			text:"Copyright : Millercoors, 2017", 
			//press:oController.doSomething 
		}); 
		return oButton;
	}

});
