/***
 * @Author AF80
 * @Date 10/07/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is Header view (Dashboard Header view)
 */	
sap.ui.jsview("mc.ccp.header.Header", {
	oAlertDialog: null,
	oMessageDialog: null,
	/**
	 * Specifies the Controller belonging to this View. In the case that it is
	 * not implemented, or that "null" is returned, this View does not have a
	 * Controller.
	 *
	 * @memberOf header.Header
	 */
	getControllerName: function() {
		return "mc.ccp.header.Header";
	},
	/**
	 * Is initially called once after the Controller has been instantiated. It
	 * is the place where the UI is constructed. Since the Controller is given
	 * to this method, its event handlers can be attached right away.
	 *
	 * @memberOf header.Header
	 */
	createContent: function(oController) {
		jQuery.sap.require("mc.ccp.control.McGlobalTableFrame");
		jQuery.sap.require("mc.ccp.control.McHorizontalLayout");
		jQuery.sap.require("mc.ccp.control.McMessage");
		jQuery.sap.require("mc.ccp.control.McDialog");
		// This is the 1st DIV include Logo
		var logoId = new sap.ui.commons.Image("logoId");
		logoId.setSrc("image/MillerLogo.PNG");
		logoId.setTooltip("Miller Coors");
		logoId.setWidth("100%");
		logoId.setHeight("100%");
		// This is the 2nd DIV include shiptos link
		var shipToLink = new sap.ui.commons.Link(this.createId("shiptolink"), {
			text: "",
			tooltip: ""
		}).addStyleClass('extraHorizontalSpace');
		shipToLink.attachPress(oController.onPressShipToLocation, oController);
		var shipToLabel = new sap.ui.commons.Label({
			text: "{i18n>DH_SHIP_TOS_SELECTED}"
		}).addStyleClass('extraHorizontalSpace');
		var oShipToLayout = new sap.ui.layout.HorizontalLayout({
			content: [shipToLink,new sap.ui.core.HTML({content : "<div style='width:7px'></div>"}), shipToLabel]
		});
		// This is the 3nd DIV empty container
		var emptydiv = new sap.ui.core.HTML({
			content: "<div></div>",
		});
		// This is the 4nd DIV include toogle button
		var oSegmentedButton = new sap.ui.commons.SegmentedButton("segmentedbuttonId", {
			id: "SBText",
			buttons: [new sap.ui.commons.Button({
				id: "Domestic",
				text: "{i18n>DH_DOMESTIC}",
				width: '100px',
				height: '35px'
			}), new sap.ui.commons.Button({
				id: 'Import',
				text: "{i18n>DH_IMPORT}",
				width: '100px',
				height: '35px'
			})]
		});
		oSegmentedButton.setSelectedButton("Domestic");
		
		oSegmentedButton.attachSelect(oController.onSelectDomesticOrImport, oController);
		// This is the 5th DIV include Alerts, Messages, Settings, Help		
		//Create a layout instance
		var oMsgAlert = new sap.ui.commons.layout.AbsoluteLayout({
			width: "85px",
			height: "50px"
		});
		var Message = new sap.ui.commons.Image({
			src: "image/Message.png"
		});
		Message.attachPress(oController.onPressMessage, oController);
		var Html = new sap.ui.core.HTML(this.createId("countCarrier"), {
			content: ""
		});
		var Alert = new sap.ui.commons.Image({
			src: "image/Alert.png"
		});
		Alert.attachPress(oController.onPressSplashMessages, oController);
		//Helper function to create a content in the layout
		var addData = function(oPosition, oImage) {
			oMsgAlert.addContent(oImage, oPosition);
		};
		//Add the content using the helper function
		addData({left: "0px",top: "20px"}, Message);
		addData({left: "15px",top: "8px"}, Html);
		addData({left: "50px",top: "18px"}, Alert);
		// Settings link
		var oSettingLink = new sap.ui.commons.Link('SettingLink', {
			text: "{i18n>DH_SETTINGS}",
			tooltip: "{i18n>DH_SETTINGS}",
		});
		oSettingLink.attachPress(oController.onPressSettings, oController);
		// Help link
		var oHelpLink = new sap.ui.commons.Link('HelpLink', {
			text: "{i18n>DH_HELP}",
			tooltip: "{i18n>DH_HELP}",
			press: function() {
				window.open('http://www.google.com', '_blank', 'toolbar=0,location=0,menubar=0');
			}
		}).addStyleClass('extraHorizontalSpace');
		var oSetttingLayout = new sap.ui.layout.HorizontalLayout("oSetttingLayout", {
			content: [oMsgAlert, oSettingLink, oHelpLink]
		}).addStyleClass('floatRight');
		var HeaderRow = new mc.ccp.control.McHorizontalLayout({
			height: "60px",
			width: "100%",
			ptop: "5px",
			widths: ["25%", "25%", "10%", "20%", "20%"],
			content: [logoId, oShipToLayout, emptydiv, oSegmentedButton, oSetttingLayout]
		});
		return HeaderRow;
	}
});