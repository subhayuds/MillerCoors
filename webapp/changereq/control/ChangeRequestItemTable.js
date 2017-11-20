/***
 * @Author OD79
 * @Date 09/01/2014 // TODO: correct it
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is responsible to create the Change Request Table which is a custom control.
 */
//Required Libraries
jQuery.sap.declare('mc.ccp.changereq.control.ChangeRequestItemTable');
jQuery.sap.require("mc.ccp.control.McArrowTextField");
sap.ui.core.Control.extend('mc.ccp.changereq.control.ChangeRequestItemTable', {
    metadata: {
        properties: {
            'width': {
                type: 'sap.ui.core.CSSSize',
                group: 'Dimension',
                defaultValue: '100%'
            },
            'height': {
                type: 'sap.ui.core.CSSSize',
                group: 'Dimension',
                defaultValue: '210px'
            },
            'expand': {
                type: "boolean",
                defaultValue: false
            },
            'dirtyState': {
                type: "boolean",
                defaultValue: false
            },
            'readOnly': {
                type: "boolean",
                defaultValue: false
            },
            'forceRender': {
				type: "boolean",
				defaultValue: false
			},
			'readOnlyRole': {
                type: "boolean",
                defaultValue: false
            },
        },
        aggregations: {
            skuLink: { 
                type: "sap.ui.commons.Link",
                multiple: false,
                visibility: "public"
            },
            orderedQuantity: {
                type: "mc.ccp.control.McArrowTextField",
                multiple: false,
                visibility: "public"
            },
            inProgressLink: { // Aggregation for Change Request row editable table cell, when status code from oData service comes '03'
                type: "sap.ui.commons.Link",
                multiple: false,
                visibility: "public"
            },
            changeRequestQuantity: { // Aggregation for Change Request row editable table cell, when status code from oData service != '03' 
                type: "mc.ccp.control.McArrowTextField",
                multiple: false,
                visibility: "public"
            },
            expandCollapseImage: {
                type: "sap.ui.commons.Image",
                multiple: false,
                visibility: "public"
            },
           // Aggregating forecast quantity from week 3 onwards, since forecast quantity for current week (week2) & current week -1 (week 1) are non editable.
            forecastQuantityWeek3: {
                type: "mc.ccp.control.McArrowTextField",
                multiple: false,
                visibility: "public"
            },
            forecastQuantityWeek4: {
                type: "mc.ccp.control.McArrowTextField",
                multiple: false,
                visibility: "public"
            },
            forecastQuantityWeek5: {
                type: "mc.ccp.control.McArrowTextField",
                multiple: false,
                visibility: "public"
            },
            forecastQuantityWeek6: {
                type: "mc.ccp.control.McArrowTextField",
                multiple: false,
                visibility: "public"
            },
            forecastQuantityWeek7: {
                type: "mc.ccp.control.McArrowTextField",
                multiple: false,
                visibility: "public"
            },
            forecastQuantityWeek8: {
                type: "mc.ccp.control.McArrowTextField",
                multiple: false,
                visibility: "public"
            },
            forecastQuantityWeek9: {
                type: "mc.ccp.control.McArrowTextField",
                multiple: false,
                visibility: "public"
            },
        },
        events: {
            'change': {},
            'expand': {},
            'collapse': {},
            'press': {}
        }
    },
    /**
     * Called when Change Request Table is instantiated.
     * Can be used to modify the control before it is displayed, to bind event handlers and do other one-time initialization.
     */
    init: function() {
        // setting Aggregation for Ordered Quantity.
        var oOrderedQuantity = new mc.ccp.control.McArrowTextField();
        oOrderedQuantity.bindProperty("value", "ZCCP_CH_REQ_HEAD_ITEM_NAV/results/3/OrderedQty");
        //oOrderedQuantity.bindProperty("readOnly", "readOnly");
        this.setAggregation('orderedQuantity', oOrderedQuantity);
        // setting Aggregation for Change Request Quantity.
        var oChangeRequestQuantity = new mc.ccp.control.McArrowTextField();
        oChangeRequestQuantity.bindProperty("value", "ZCCP_CH_REQ_HEAD_ITEM_NAV/results/2/Change_Req_Qty");
        oChangeRequestQuantity.bindProperty("pallet", "PalletValue");
        oChangeRequestQuantity.bindProperty("readOnly", "readOnly");
        this.setAggregation('changeRequestQuantity', oChangeRequestQuantity);
        oChangeRequestQuantity.getAggregation("textField").setMaxLength(15);
        // setting Aggregation for forecast Quantity from week 3 to week 9.
        var noOfWeeks = 9;
        for (var i = 2; i <= noOfWeeks -1 ; i++) { //looping from week3 onwards since forecast quantity for current week (week2) & current week -1 (week 1) are non editable.
            var sForecastQuantityWeek = "forecastQuantityWeek" + (i + 1);
            var oForecastQuantity = new mc.ccp.control.McArrowTextField({
                arrows: false
            }).bindProperty("value", "ZCCP_CH_REQ_HEAD_ITEM_NAV/results/" + i + "/DistForecast");
            oForecastQuantity.bindProperty("readOnly", "readOnlyRole");
            this.setAggregation(sForecastQuantityWeek, oForecastQuantity);
            oForecastQuantity.getAggregation("textField").setMaxLength(16);
        }
        // setting Aggregation for SKU Link.
        var oSkuLink = new sap.ui.commons.Link({
            arrows: false
        }).bindProperty("text", "SKU");
        this.setAggregation('skuLink', oSkuLink);
        // setting Aggregation for In Progress Link.
        var oInProgressLink = new sap.ui.commons.Link({
            arrows: false,
            text: MCAPP.getText('CC_CR_ITMTBL_IN_PROG', this)
        });
        this.setAggregation('inProgressLink', oInProgressLink);
        // setting Aggregation for ExpandCollapse Image in the header of each data row.
        var oExpandCollapseImage = new sap.ui.commons.Image({
            src: 'image/expand.png'
        });
        this.setAggregation('expandCollapseImage', oExpandCollapseImage);
    },
    
    /**
     * Similar to onAfterRendering, but this hook is invoked before the custom control is re-rendered
     * (NOT before the first rendering! init() is used for that one!).
     */
    onBeforeRendering: function() {
       // detaching change event for forecast quantity from week3 onwards, since forecast quantity for current week (week2) & current week -1 (week 1) are non editable.
    	var noOfWeeks = 9;
    	for (var i = 2; i <= noOfWeeks - 1; i++) {
            this.getAggregation('forecastQuantityWeek' + (i + 1)).detachChange(this.handleChangeForecastQuantity, this);
        }
        this.getAggregation('changeRequestQuantity').detachChange(this.handleChangeRequestQuantity, this);
        this.getAggregation('skuLink').detachPress(this.handlePressSkuLink, this);
        this.getAggregation('inProgressLink').detachPress(this.handlePressInprogressLink, this);
        this.getAggregation('expandCollapseImage').detachPress(this.handlePressExpandCollapse, this);
    },
    
    /**
     * Called when the custom control has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     */
    onAfterRendering: function() {
       // attaching change event for forecast quantity from week3 onwards, since forecast quantity for current week (week2) & current week -1 (week 1) are non editable.
    	var noOfWeeks = 9;
    	for (var i = 2; i <= noOfWeeks - 1; i++) {
            this.getAggregation('forecastQuantityWeek' + (i + 1)).attachChange(this.handleChangeForecastQuantity, this);
        }
        this.getAggregation('changeRequestQuantity').attachChange(this.handleChangeRequestQuantity, this);
        this.getAggregation('skuLink').attachPress(this.handlePressSkuLink, this);
        this.getAggregation('inProgressLink').attachPress(this.handlePressInprogressLink, this);
        this.getAggregation('expandCollapseImage').attachPress(this.handlePressExpandCollapse, this);
        if (this.getExpand()) {
            this.expand();
        } else {
            this.collapse();
        }
    },
    
    /***
     * Is called to render the change request table control.
     * @param oRm
     * @param oControl
     */
    renderer: function(oRm, oControl) {
        oRm.write("<div ");
        oRm.writeControlData(oControl);
        oRm.addStyle("width", oControl.getWidth());
        oRm.writeStyles();
        oRm.writeClasses();
        oRm.write(">");
        oRm.write("<table border=0 height='100%' width='100%' cellpadding='0' cellspacing='0' class='McCcpChngReqOrdTable' >");
        oRm.write("<tr class='McCcpChngReqOrdTableSpaceTr' height='5px' ><td colspan='10'></td></tr>");
        // to render the header for each data record.
        oControl._renderHeaderRow(oRm, oControl);
        // looped 6 times to render the Suggested, Ordered, Confirmed, Change Request, Projected DOI, Target DOI rows for each record.
        for (var i = 1; i < 7; i++) {
            oControl._renderDataRows(oRm, oControl, i); 
        }
        // to render the forecast row for each record.
        oControl._renderForecastRow(oRm, oControl);
        oRm.write("</table>");
        oRm.write("</div>");
    },
    
    /***
     * Is called to create the header row for each record of the table.
     * @param oRm
     * @param oControl
     */
    _renderHeaderRow: function(oRm, oControl) {
        oRm.write("<tr height='30px' class='McCcpChngReqOrdTableHdrTr'>");
        // creating image column.
        oRm.write("<td colspan=2>"); 
        oRm.renderControl(oControl.getAggregation('expandCollapseImage'));
        oRm.write("</td>");
        // creating Dist SKU column.
        oRm.write("<td title ='"+ oControl.getModel().getProperty(oControl.getBindingContext().getPath()).Dist_SKU +"'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).Dist_SKU + "</td>");
        // creating SKU column.
        oRm.write("<td>");
        oRm.renderControl(oControl.getAggregation('skuLink'));
        oRm.write("</td>");
        // creating Description column.
        oRm.write("<td title ='"+ oControl.getModel().getProperty(oControl.getBindingContext().getPath()).SKU_Desc +"' colspan=2>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).SKU_Desc + "</td>");
        //oRm.write("<td colspan=2 class='tdClassCR'><div class='divClassCR'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).SKU_Desc + "</div></td>");
        // creating Sales Order Number column.
        oRm.write("<td title ='"+ oControl.getModel().getProperty(oControl.getBindingContext().getPath()).Sales_Ord_No +"'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).Sales_Ord_No + "</td>");
        // creating custom ID/PO column.
        oRm.write("<td title ='"+ oControl.getModel().getProperty(oControl.getBindingContext().getPath()).Custom_PO +"'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).Custom_PO + "</td>");
        // creating Ship To column.
        oRm.write("<td title ='"+ oControl.getModel().getProperty(oControl.getBindingContext().getPath()).ShipToId +"'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).ShipToId + "</td>");
        // creating Source column.
        oRm.write("<td title ='"+ oControl.getModel().getProperty(oControl.getBindingContext().getPath()).SourceName +"'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).SourceName + "</td>");
        // creating Est Transit Days column.
        oRm.write("<td>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).EstdTransitDays + "</td>");
        oRm.write("</tr>");
    },
    
    /***
     * Is called to create the forecast row for each record of the table..
     * @param oRm
     * @param oControl
     */
    _renderForecastRow: function(oRm, oControl) {
        var jsonProperty = 'DistForecast';
        oRm.write("<tr id=" + (oControl.sId + '-forecast') + " height='30px' style='' class='McCcpChngReqOrdTableFrctTr'>");
        // creating DistForecast column.
        oRm.write("<td colspan=2 width='19%'>" + this.getModel('i18n').getProperty('GBL_DIST_FORECAST') + "</td>");
        // creating DistForecast week1 column.
        oRm.write("<td width='9%'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/0/' + jsonProperty) + "</td>");
        // creating DistForecast week2 column.
        oRm.write("<td width='9%'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/1/' + jsonProperty) + "</td>");
        // creating DistForecast week3 to week9 column(s).
        var noOfWeeks = 9;
        for (var i = 2; i <= noOfWeeks - 1; i++) {
            oRm.write("<td width='9%' class='McCcpCRItemTblStdHght'>");
            oRm.renderControl(oControl.getAggregation('forecastQuantityWeek' + (i + 1)));
            oRm.write("</td>");
        }
        oRm.write("</tr>");
    },
    
    /***
     * Is called to create the rows for Suggested, Ordered, Confirmed, Change Request, Projected DOI, Target DOI fields of the table..
     * @param oRm
     * @param oControl
     */
    _renderDataRows: function(oRm, oControl, index) {
        var sJsonProperty = '';
        var sRowLabel = '';
        switch (index) {
            case 1:
            	sJsonProperty = "SuggQty";
                sRowLabel = this.getModel('i18n').getProperty('GBL_SUGGESTED');
                break;
            case 2:
            	sJsonProperty = "OrderedQty";
                sRowLabel = this.getModel('i18n').getProperty('GBL_ORDERED');
                break;
            case 3:
            	sJsonProperty = "ConfirmQty";
                sRowLabel = this.getModel('i18n').getProperty('GBL_CONFIRMED');
                break;
            case 4:
            	sJsonProperty = "Change_Req_Qty";
                sRowLabel = this.getModel('i18n').getProperty('GBL_CHANGE_REQ');
                break;
            case 5:
            	sJsonProperty = "ProjDOI";
                sRowLabel = this.getModel('i18n').getProperty('GBL_PROJECTED_DOI');
                break;
            case 6:
            	sJsonProperty = "TargDOI";
                sRowLabel = this.getModel('i18n').getProperty('GBL_TARGET_DOI');
                break;
        }
        oRm.write("<tr id=" + (oControl.sId + sJsonProperty) + " height='30px' class='McCcpChngReqOrdTableTr McCcpChngReqTableTr'>");
        oRm.write("<td colspan=2 width='19%'>" + sRowLabel + "</td>");

        oRm.write("<td width='9%'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/0/' + sJsonProperty) + "</td>");
        oRm.write("<td width='9%'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/1/' + sJsonProperty) + "</td>");
        if (index == 4) {
            // comparing with "Status_Code" = "03", since "03" is the value coming from oData service to show "In Progress"
            if (oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/Status_Code') == "03") {
                oRm.write("<td width='9%' class='McCcpCRItemTblStdHght' height='30px'>");
                oRm.renderControl(oControl.getAggregation('inProgressLink'));
                oRm.write("</td>");
            } else {
                oRm.write("<td width='9%' class='McCcpCRItemTblStdHght' height='30px'>");
                oRm.renderControl(oControl.getAggregation('changeRequestQuantity'));
                oRm.write("</td>");
            }
        } else {
            oRm.write("<td width='9%'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/2/' + sJsonProperty) + "</td>");
        }
        oRm.write("<td width='9%'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/3/' + sJsonProperty) + "</td>");
        oRm.write("<td width='9%'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/4/' + sJsonProperty) + "</td>");
        oRm.write("<td width='9%'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/5/' + sJsonProperty) + "</td>");
        oRm.write("<td width='9%'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/6/' + sJsonProperty) + "</td>");
        oRm.write("<td width='9%'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/7/' + sJsonProperty) + "</td>");
        oRm.write("<td width='9%'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/8/' + sJsonProperty) + "</td>");
    
        oRm.write("</tr>");
    },
    
    doRender : function(){
		 if(this.getForceRender() === true){
			 this.setForceRender(false);
		 }else{
			 this.setForceRender(true);
		 }
	 }
});

	/***
	 * Is called on change of change request quantity.
	 * @param oEvent
	 */
	mc.ccp.changereq.control.ChangeRequestItemTable.prototype.handleChangeRequestQuantity = function(oEvent) {
	    var oChangedData = oEvent.getParameter('changed');
	    var oOriginalData;
	    var oBackUpModel = this.getModel('backup');
	    if (oBackUpModel) {
	    	oOriginalData = oBackUpModel.getProperty(this.getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/2/Change_Req_Qty');
	    } else { 
	    	oOriginalData = this.getParent().getParent().getParent().getModel('backup').getProperty(this.getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/2/Change_Req_Qty');
	    }
	    if (this._isDirty()) {
	        this.setDirtyState(true);
	    } else {
	        this.setDirtyState(false);
	    }
	    this.fireChange({
	        source: 'Change_Req_Qty',
	        changedData: oChangedData,
	        originalData: oOriginalData,
	        dirtyState: this.getDirtyState()
	    });
	    this._calculateProjectedDOI();
	    //this.rerender();
	    this.doRender();
	};

	/***
	 * Is called on press of in progress link for a record.
	 * @param oEvent
	 */
	mc.ccp.changereq.control.ChangeRequestItemTable.prototype.handlePressInprogressLink = function(oEvent) {
	    MCAPP.setBusy(true);
	    var oOkButton = new sap.ui.commons.Button({
	        text: MCAPP.getText('GBL_OK', this),
	        width: "90px",
	        height: '30px'
	    });
	    oOkButton.attachPress(function(oEvent) {
	        oEvent.getSource().getParent().close();
	        MCAPP.setBusy(false);
	    });
	    oCustIdPoDialog = new sap.ui.commons.Dialog({
	        modal: true,
	        width: '40%',
	        height: '60%',
	        title: MCAPP.getText('VW_CR_PRW_TITLE', this) + " " + oEvent.getSource().getBindingContext().getProperty("SKU"),
	        buttons: [oOkButton],
	        closed: function(oEvent) {
	            MCAPP.setBusy(false);
	            this.destroy();
	        }
	    }).addStyleClass('McCcpCustomDialog');
	    oCustIdPoDialog.open();
	    var oCustIdPoView = new sap.ui.view({
	        type: sap.ui.core.mvc.ViewType.JS,
	        viewName: "mc.ccp.changereq.ChangeRequestProgress",
	        viewData: oEvent.getSource().getBindingContext()
	    });
	    oCustIdPoDialog.addContent(oCustIdPoView);
	};

	/***
	 * Is called on press of SKU link in the header of a record.
	 * @param oEvent
	 */
	mc.ccp.changereq.control.ChangeRequestItemTable.prototype.handlePressSkuLink = function() {
	    this.firePress();
	};

	/***
	 * Is called on on change of forecast quantity.
	 * @param oEvent
	 */
	mc.ccp.changereq.control.ChangeRequestItemTable.prototype.handleChangeForecastQuantity = function(oEvent) {
	    var sSource = '';
	    for (var key in this.mAggregations) {
	        if (this.mAggregations.hasOwnProperty(key)) {
	            if (oEvent.getSource().sId == this.mAggregations[key].sId) {
	                sSource = key;
	                break;
	            }
	        }
	    }
	    jQuery.sap.log.info(sSource);
	    var relativeContextPath = '';
	    switch (sSource) {
	        case 'forecastQuantityWeek3':
	        	relativeContextPath = "/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/2/DistForecast";
	            break;
	        case 'forecastQuantityWeek4':
	        	relativeContextPath = "/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/3/DistForecast";
	            break;
	        case 'forecastQuantityWeek5':
	        	relativeContextPath = "/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/4/DistForecast";
	            break;
	        case 'forecastQuantityWeek6':
	        	relativeContextPath = "/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/5/DistForecast";
	            break;
	        case 'forecastQuantityWeek7':
	        	relativeContextPath = "/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/6/DistForecast";
	            break;
	        case 'forecastQuantityWeek8':
	        	relativeContextPath = "/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/7/DistForecast";
	            break;
	        case 'forecastQuantityWeek9':
	        	relativeContextPath = "/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/8/DistForecast";
	            break;
	    }
	    var oChangedData = oEvent.getParameter('changed');
	    var oOriginalData;
	    var oBackUpModel = this.getModel('backup');
	    if (oBackUpModel) {
	    	oOriginalData = oBackUpModel.getProperty(this.getBindingContext().sPath + relativeContextPath);
	    } else {
	    	oOriginalData = this.getParent().getParent().getParent().getModel('backup').getProperty(this.getBindingContext().sPath + relativeContextPath);
	    }
	    if (this._isDirty()) {
	        this.setDirtyState(true);
	       // this.setDirtyState(this._isDirty());
	    } else {
	        this.setDirtyState(false);
	    }
	    this.fireChange({
	        source: sSource,
	        changedData: oChangedData,
	        originalData: oOriginalData,
	        dirtyState: this.getDirtyState()
	    });
	    this._calculateProjectedDOI();
	    //this.rerender();
	    this.doRender();
	};

	/***
	 * Is called to maintain the dirty state of the record in oModel.
	 */
	mc.ccp.changereq.control.ChangeRequestItemTable.prototype._isDirty = function() {
	    var changedModel = this.getModel();
	    var originalModel = this.getModel('backup');
	    if (!originalModel) {
	        originalModel = this.getParent().getParent().getParent().getModel('backup');
	    }
	    if (originalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/2/Change_Req_Qty') == changedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/2/Change_Req_Qty') && originalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/2/DistForecast') == changedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/2/DistForecast') && originalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/3/DistForecast') == changedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/3/DistForecast') && originalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/4/DistForecast') == changedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/4/DistForecast') && originalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/5/DistForecast') == changedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/5/DistForecast') && originalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/6/DistForecast') == changedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/6/DistForecast') && originalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/7/DistForecast') == changedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/7/DistForecast') && originalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/8/DistForecast') == changedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/8/DistForecast')) {
	        return false;
	    } else {
	        return true;
	    }
	};

	/***
	 * helping function within which another private function is called to calculate the projected DOI for each respective week column
	 */
	mc.ccp.changereq.control.ChangeRequestItemTable.prototype._calculateProjectedDOI = function() {

		// step 1: getting the row object which has been tapped on Order Create Screen
		var oCurrentRow = this.getModel().getProperty(this.getBindingContext().sPath);

		// step 2: creating on the fly object
		var oData = {"results" : []};
		var numberOfWeeks = oCurrentRow.ZCCP_CH_REQ_HEAD_ITEM_NAV.results.length;
		for(var i=0; i<numberOfWeeks; i++){
			var oCurrentRowItem = oCurrentRow.ZCCP_CH_REQ_HEAD_ITEM_NAV.results[i];
			var beginningInv = 0;
			if(i === 0){
				beginningInv = parseInt(oCurrentRow.BegINV);
			}
			oData.results.push({
				beginningInventory :beginningInv,
				endingInventory : 0,
				projectedDOI : parseInt(oCurrentRowItem.ProjDOI),
				forecastQuantity : parseInt(oCurrentRowItem.DistForecast),
				arrivedQuantity : parseInt(oCurrentRowItem.ArrivedQty),
				intransitShipments : parseInt(oCurrentRowItem.TransitQty),
				plannedShipments : parseInt(oCurrentRowItem.PlannedQty),
				crQuantity : parseInt(oCurrentRowItem.Change_Req_Qty),
				currentOrderQuantity : 0,
				orderedQuantity : parseInt(oCurrentRowItem.OrderedQty),
				suggestedQuantity : parseInt(oCurrentRowItem.SuggQty),
				confirmedQuantity : parseInt(oCurrentRowItem.ConfirmQty),
				insOuts : 0
			});
		}
		// step 3: creating on the fly model
		var oOnTheFlyModel = new sap.ui.model.json.JSONModel();
		oOnTheFlyModel.setData(oData);

		oOnTheFlyModel = MCAPP.projectedDOI(oOnTheFlyModel, numberOfWeeks);
		for (var k = 0; k < oOnTheFlyModel.getData().results.length; k++) {
			this.getModel().setProperty(this.getBindingContext().sPath + '/ZCCP_CH_REQ_HEAD_ITEM_NAV/results/' + k + '/ProjDOI', oOnTheFlyModel.getProperty('/results/' + k + '/projectedDOI'));
		}
	};

	/***
	 * called to set the expand collapse image on click of the expand/collapse image link.
	 * @param oEvent
	 */
	mc.ccp.changereq.control.ChangeRequestItemTable.prototype.handlePressExpandCollapse = function(oEvent) {
		console.log("handlePressExpandCollapse");
	    if (this.getExpand()) {
	        jQuery.sap.byId(this.getId()).find('tr#' + this.getId() + '-forecast').hide();
	        this.setExpand(false);
	        this.getAggregation('expandCollapseImage').setSrc('image/expand.png');
	        this.fireCollapse();
	    } else {
	        jQuery.sap.byId(this.getId()).find('tr#' + this.getId() + '-forecast').show();
	        this.setExpand(true);
	        this.getAggregation('expandCollapseImage').setSrc('image/collapse.png');
	        this.fireExpand();
	    }
	};
	
	/***
	 * called to set the collapse image to expand image.
	 * @param oEvent
	 */
	mc.ccp.changereq.control.ChangeRequestItemTable.prototype.expand = function(oEvent) {
	    jQuery.sap.byId(this.getId()).find('tr#' + this.getId() + '-forecast').show();
	    this.getAggregation('expandCollapseImage').setSrc('image/collapse.png');
	    this.setExpand(true);
	};
	
	/***
	 * called to set the expand image to collapse image.
	 * @param oEvent
	 */
	mc.ccp.changereq.control.ChangeRequestItemTable.prototype.collapse = function(oEvent) {
	    jQuery.sap.byId(this.getId()).find('tr#' + this.getId() + '-forecast').hide();
	    this.getAggregation('expandCollapseImage').setSrc('image/expand.png');
	    this.setExpand(false);
	};
	
	/***
	 * Use this one to free resources and finalize activities.
	 * @param oEvent
	 */
	mc.ccp.changereq.control.ChangeRequestItemTable.prototype.exit = function(oEvent) {
		//remove attached non-default event handler
		// detaching change event for forecast quantity from week3 onwards, since forecast quantity for current week (week2) & current week -1 (week 1) are non editable.
		var noOfWeeks = 9;
		for (var i = 2; i <= noOfWeeks - 1; i++) {
			this.getAggregation('forecastQuantityWeek' + (i + 1)).detachChange(this.handleChangeForecastQuantity, this);
		}
		this.getAggregation('changeRequestQuantity').detachChange(this.handleChangeRequestQuantity, this);
		this.getAggregation('skuLink').detachPress(this.handlePressSkuLink, this);
		this.getAggregation('inProgressLink').detachPress(this.handlePressInprogressLink, this);
		this.getAggregation('expandCollapseImage').detachPress(this.handlePressExpandCollapse, this);

	};