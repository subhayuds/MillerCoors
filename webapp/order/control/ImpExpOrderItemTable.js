/***
 * @Author OD79
 * @Date 11/20/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is responsible to create the import / export order item table which is a custom control.
 */
//Required libraries
jQuery.sap.declare('mc.ccp.order.control.ImpExpOrderItemTable');
jQuery.sap.require("mc.ccp.control.McArrowTextField");
sap.ui.core.Control.extend('mc.ccp.order.control.ImpExpOrderItemTable', {
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
            }
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
            expandCollapseImage: {
                type: "sap.ui.commons.Image",
                multiple: false,
                visibility: "public"
            },
            //Aggregating forecast quantity from week 3 onwards, since forecast quantity for current week (week2) & current week -1 (week 1) are non editable.
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
            forecastQuantityWeek10: {
                type: "mc.ccp.control.McArrowTextField",
                multiple: false,
                visibility: "public"
            },
            forecastQuantityWeek11: {
                type: "mc.ccp.control.McArrowTextField",
                multiple: false,
                visibility: "public"
            },
            forecastQuantityWeek12: {
                type: "mc.ccp.control.McArrowTextField",
                multiple: false,
                visibility: "public"
            },
            forecastQuantityWeek13: {
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
     * Called when an ImpExpOrderItemTable control is instantiated.
     * It will bind the various oModel aggregation to this custom control.
     */
    init: function() {
        //setting Aggregation for Ordered Quantity.
        var oOrderedQuantity = new mc.ccp.control.McArrowTextField();
        //oOrderedQuantity.bindProperty("value", "ZCCP_ORD_CR_HEAD_ITM_NAV/results/12/OrderedQty");
        oOrderedQuantity.bindProperty("pallet", "PalletValue");
        oOrderedQuantity.bindProperty("readOnly", "readOnly");
        this.setAggregation('orderedQuantity', oOrderedQuantity);
        oOrderedQuantity.getAggregation("textField").setMaxLength(16);
        //setting Aggregation for forecast Quantity from week 3 to week 13.
        var noOfWeeks = 13;
        for (var i = 2; i <= noOfWeeks - 1; i++) { //looping from week3 onwards since forecast quantity for current week (week2) & current week -1 (week 1) are non editable.
            var sForecastQuantityWeek = "forecastQuantityWeek" + (i + 1);
            var oForecastQuantity = new mc.ccp.control.McArrowTextField({
                arrows: false
            }).bindProperty("value", "ZCCP_ORD_CR_HEAD_ITM_NAV/results/" + i + "/DistForecast");
            //oForecastQuantity.bindProperty("readOnly", "readOnly");
            oForecastQuantity.bindProperty("readOnly", "readOnlyRole");
            this.setAggregation(sForecastQuantityWeek, oForecastQuantity);
            oForecastQuantity.getAggregation("textField").setMaxLength(16);
        }
        //setting Aggregation for SKU Link.
        var oSkuLink = new sap.ui.commons.Link({
            arrows: false
        }).bindProperty("text", "SKU");
        this.setAggregation('skuLink', oSkuLink);
        //setting Aggregation for ExpandCollapse Image in the header of each data row.
        var oExpandCollapseImage = new sap.ui.commons.Image({
            src: 'image/expand.png'
        });
        this.setAggregation('expandCollapseImage', oExpandCollapseImage);
    },
    
    /***
     * Is called before rendering the ImpExpOrderItemTable Control.
     * This method is used to detach the change and press events on the links and other controls of ImpExpOrderItemTable.
     */
    onBeforeRendering: function() {
        //detaching change event for ordered quantity
        this.getAggregation('orderedQuantity').detachChange(this.handleChangeOrderQuantity, this);
        //detaching change event for forecast quantity from week3 onwards, since forecast quantity for current week (week2) & current week -1 (week 1) are non editable.
        var noOfWeeks = 13;
        for (var i = 2; i <= noOfWeeks - 1; i++) {
            this.getAggregation('forecastQuantityWeek' + (i + 1)).detachChange(this.handleChangeForecastQuantity, this);
        }
        //detaching press event for SKU Link
        this.getAggregation('skuLink').detachPress(this.handlePressSkuLink, this);
        //detaching press event for Expand Collapse Image
        this.getAggregation('expandCollapseImage').detachPress(this.handlePressExpandCollapse, this);
    },
    
    /***
     * Is called after rendering the ImpExpOrderItemTable Control.
     * This method is used to attach the change and press events on the links and other controls of ImpExpOrderItemTable.
     */
    onAfterRendering: function() {
        //attaching change event for ordered quantity
        this.getAggregation('orderedQuantity').attachChange(this.handleChangeOrderQuantity, this);
        //attaching change event for forecast quantity from week3 onwards, since forecast quantity for current week (week2) & current week -1 (week 1) are non editable.
        var noOfWeeks = 13;
        for (var i = 2; i <= noOfWeeks - 1; i++) {
            this.getAggregation('forecastQuantityWeek' + (i + 1)).attachChange(this.handleChangeForecastQuantity, this);
        }
        //attaching press event for SKU Link
        this.getAggregation('skuLink').attachPress(this.handlePressSkuLink, this);
        //attaching press event for Expand Collapse Image
        this.getAggregation('expandCollapseImage').attachPress(this.handlePressExpandCollapse, this);
        if (this.getExpand()) {
            this.expand();
        } else {
            this.collapse();
        }
    },
    
    /***
     * Is called to render the Order Item Table control.
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
        oRm.write("<table class='McCcpOrderItemTbl'>");
        oRm.write("<tr class='McCcpOrderItemTblSpaceTr'><td colspan='10'></td></tr>");
        //to render the header for each data set
        oControl._renderHeaderRow(oRm, oControl);
        //looped 5 times to render the Suggested, Ordered, Confirmed, Projected DOI, Target DOI rows for each record.
        var noOfRows = 5;
        for (var i = 1; i <= noOfRows; i++) {
            oControl._renderDataRows(oRm, oControl, i);
        }
        //to render the forecast row for each data set
        oControl._renderForecastRow(oRm, oControl);
        oRm.write("</table>");
        oRm.write("</div>");
    },
    
    /***
     * Is called to render the Header Row. Called with in renderer method.
     * @param oRm
     * @param oControl
     */
    _renderHeaderRow: function(oRm, oControl) {
        oRm.write("<tr class='McCcpOrderItemTblHdrTr'>");
        //creating image column.
        oRm.write("<td>");
        oRm.renderControl(oControl.getAggregation('expandCollapseImage'));
        oRm.write("</td>");
        //creating Dist SKU column.
        oRm.write("<td title ='"+ oControl.getModel().getProperty(oControl.getBindingContext().getPath()).Dist_SKU +"'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).Dist_SKU + "</td>");
        //creating SKU column.
        oRm.write("<td>");
        oRm.renderControl(oControl.getAggregation('skuLink'));
        oRm.write("</td>");
        //creating Description column.
        oRm.write("<td title ='"+ oControl.getModel().getProperty(oControl.getBindingContext().getPath()).SKU_Desc +"' colspan=7>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).SKU_Desc + "</td>");
        //creating Ship To column.
        oRm.write("<td title ='"+ oControl.getModel().getProperty(oControl.getBindingContext().getPath()).ShipToId +"'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).ShipToId + "</td>");
        //creating Source column.
        oRm.write("<td title ='"+ oControl.getModel().getProperty(oControl.getBindingContext().getPath()).SourceId +"'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).SourceId + "</td>");
        //creating Est Transit Days column.
        oRm.write("<td>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath()).EstdTransitDays + "</td>");
        oRm.write("<td> </td>");
        oRm.write("</tr>");
    },
    
    /***
     * Is called to render the Forecast Row . Called with in renderer method.
     * @param oRm
     * @param oControl
     */
    _renderForecastRow: function(oRm, oControl) {
        var sJsonProperty = 'DistForecast';
        oRm.write("<tr id=" + (oControl.sId + '-forecast') + " class='McCcpImportOrderItemTblFrctTr'>");
        //oRm.write("<tr id=" + (oControl.sId + '-forecast') + " >");
        //creating DistForecast column.
        oRm.write("<td class='McCcpImportOrderItemTblLblCol'>" + this.getModel('i18n').getProperty('GBL_DIST_FORECAST') + "</td>");
        //creating DistForecast week1 column.
        oRm.write("<td class='McCcpImportOrderItemTblDataCol'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/0/' + sJsonProperty) + "</td>");
        //creating DistForecast week2 column.
        oRm.write("<td class='McCcpImportOrderItemTblDataCol'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/1/' + sJsonProperty) + "</td>");
        //creating DistForecast week3 to week9 column(s).
        var noOfWeeks = 13;
        for (var i = 2; i <= noOfWeeks - 1; i++) {
            oRm.write("<td width='6.5%' height='30px' class = 'McCcpImportOrderItemTblStdHght'>");
            oRm.renderControl(oControl.getAggregation('forecastQuantityWeek' + (i + 1)));
            oRm.write("</td>");
        }
        oRm.write("</tr>");
    },
    
    /***
     * Is called to render the rows. Called with in renderer method.
     * This will create the Suggested, Ordered, Confirmed, Projected DOI and Target DOI rows as per the case.
     * @param oRm
     * @param oControl
     */
    _renderDataRows: function(oRm, oControl, index) {
        var sJsonProperty = '';
        var sRowLabel = '';
        var projectedDOIvalue;
        var targetDOIvalue;
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
                sJsonProperty = "ProjDOI";
                sRowLabel = this.getModel('i18n').getProperty('GBL_PROJECTED_DOI');
                break;
            case 5:
                sJsonProperty = "TargDOI";
                sRowLabel = this.getModel('i18n').getProperty('GBL_TARGET_DOI');
                break;
        }
        oRm.write("<tr id=" + (oControl.sId + sJsonProperty) + "  class='McCcpImportOrderItemTblTr McCcpImportOrderItemTblStdHght'>");
        oRm.write("<td class='McCcpImportOrderItemTblLblCol'>" + sRowLabel + "</td>");
        var noOfWeeks = 13;
        for (var i = 0; i <= noOfWeeks - 1; i++) {
            var headerLevelWeekNo = oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/Week_No');
            var itemLevelWeekNo = oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/' + i + '/Week_No');
            if (index == 2) {
                if (oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/' + i + '/BlockPrdFlag') == 'X') {
                    if (headerLevelWeekNo == itemLevelWeekNo) {
                        oControl.getAggregation('orderedQuantity').setReadOnly(true);
                        oRm.write("<td class='McCcpImportOrderItemTblDataCol McCcpImportOrderItemTblStdHght McCcpControlArrowTextFieldColor'>");
                        oControl.getAggregation('orderedQuantity').bindProperty("value", "ZCCP_ORD_CR_HEAD_ITM_NAV/results/" + i + "/OrderedQty");
                        oRm.renderControl(oControl.getAggregation('orderedQuantity'));
                        oRm.write("</td>");
                    } else {
                        oRm.write("<td class='McCcpImportOrderItemTblDataCol McCcpOrderItemTblCellProdBlock'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/' + i + '/' + sJsonProperty) + "</td>");
                    }
                } else {
                    if (headerLevelWeekNo == itemLevelWeekNo) {
                        oRm.write("<td class='McCcpImportOrderItemTblDataCol McCcpImportOrderItemTblStdHght McCcpImportOrderItemTblDataColColor' >");
                        oControl.getAggregation('orderedQuantity').bindProperty("value", "ZCCP_ORD_CR_HEAD_ITM_NAV/results/" + i + "/OrderedQty");
                        oRm.renderControl(oControl.getAggregation('orderedQuantity'));
                        oRm.write("</td>");
                    } else {
                        oRm.write("<td class='McCcpImportOrderItemTblDataCol'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/' + i + '/' + sJsonProperty) + "</td>");
                    }
                }
            } else {
                if (headerLevelWeekNo == itemLevelWeekNo) {
                    if (index == 4) {
                        projectedDOIvalue = oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/' + i + '/' + sJsonProperty);
                        targetDOIvalue = oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/' + i + '/TargDOI');
                        if (Math.abs(projectedDOIvalue - targetDOIvalue) > 5) {
                            oRm.write("<td class='McCcpImportOrderItemTblDataColColor McCcpImportItemTableTextRed'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/' + i + '/' + sJsonProperty) + "</td>");
                        } else {
                            oRm.write("<td class='McCcpImportOrderItemTblDataColColor'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/' + i + '/' + sJsonProperty) + "</td>");
                        }
                    } else {
                        oRm.write("<td class='McCcpImportOrderItemTblDataColColor'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/' + i + '/' + sJsonProperty) + "</td>");
                    }
                } else {
                    if (index == 4) {
                        projectedDOIvalue = oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/' + i + '/' + sJsonProperty);
                        targetDOIvalue = oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/' + i + '/TargDOI');
                        if (Math.abs(projectedDOIvalue - targetDOIvalue) > 5) {
                            oRm.write("<td class='McCcpImportOrderItemTblDataCol McCcpImportItemTableTextRed'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/' + i + '/' + sJsonProperty) + "</td>");
                        } else {
                            oRm.write("<td class='McCcpImportOrderItemTblDataCol'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/' + i + '/' + sJsonProperty) + "</td>");
                        }
                    } else {
                        oRm.write("<td class='McCcpImportOrderItemTblDataCol'>" + oControl.getModel().getProperty(oControl.getBindingContext().getPath() + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/' + i + '/' + sJsonProperty) + "</td>");
                    }
                }
            }
        }
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
 * Is called on change of Order quantity. Setting the dirty state of changed record to true.
 * Also calculation of projected DOI would be done as per the new quantity entered by the user.
 * @param oEvent
 */
mc.ccp.order.control.ImpExpOrderItemTable.prototype.handleChangeOrderQuantity = function(oEvent) {
    var editableWeek = this.getModel().getProperty(oEvent.getSource().getBindingContext().sPath + '/editableWeek');
    var oChangedData = oEvent.getParameter('changed');
    var oOriginalData;
    var oBackUpModel = this.getModel('backup') || this.getParent().getParent().getParent().getModel('backup');
    oOriginalData = oBackUpModel.getProperty(this.getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/' + (editableWeek - 1) + '/OrderedQty');
    this.setDirtyState(this._isDirty(editableWeek));
    this.fireChange({
        source: 'OrderQty',
        changedData: oChangedData,
        originalData: oOriginalData,
        dirtyState: this.getDirtyState()
    });
    this._calculateProjectedDOI();
    //this.rerender();
    this.doRender();
};

/***
 * Is called on press of SKU Link.
 * @param oEvent
 */
mc.ccp.order.control.ImpExpOrderItemTable.prototype.handlePressSkuLink = function(oEvent) {
    this.firePress({
        sku: oEvent.getSource().getProperty('text')
    });
};

/***
 * Is called on change of forecast quantity. Setting the dirty state of changed record to true.
 * Also calculation of projected DOI would be done as per the quantity entered by the user.
 * @param oEvent
 */
mc.ccp.order.control.ImpExpOrderItemTable.prototype.handleChangeForecastQuantity = function(oEvent) {
	var editableWeek = this.getModel().getProperty(oEvent.getSource().getBindingContext().sPath + '/editableWeek');
    //Identify the Source control(which Forecast object) into Source
    var sSource = '';
    for (var key in this.mAggregations) {
        if (this.mAggregations.hasOwnProperty(key)) {
            if (oEvent.getSource().sId == this.mAggregations[key].sId) {
                sSource = key;
                break;
            }
        }
    }
    var sRelativeContextPath = '';
    switch (sSource) {
        case 'forecastQuantityWeek3':
            sRelativeContextPath = "/ZCCP_ORD_CR_HEAD_ITM_NAV/results/2/DistForecast";
            break;
        case 'forecastQuantityWeek4':
            sRelativeContextPath = "/ZCCP_ORD_CR_HEAD_ITM_NAV/results/3/DistForecast";
            break;
        case 'forecastQuantityWeek5':
            sRelativeContextPath = "/ZCCP_ORD_CR_HEAD_ITM_NAV/results/4/DistForecast";
            break;
        case 'forecastQuantityWeek6':
            sRelativeContextPath = "/ZCCP_ORD_CR_HEAD_ITM_NAV/results/5/DistForecast";
            break;
        case 'forecastQuantityWeek7':
            sRelativeContextPath = "/ZCCP_ORD_CR_HEAD_ITM_NAV/results/6/DistForecast";
            break;
        case 'forecastQuantityWeek8':
            sRelativeContextPath = "/ZCCP_ORD_CR_HEAD_ITM_NAV/results/7/DistForecast";
            break;
        case 'forecastQuantityWeek9':
            sRelativeContextPath = "/ZCCP_ORD_CR_HEAD_ITM_NAV/results/8/DistForecast";
            break;
        case 'forecastQuantityWeek10':
            sRelativeContextPath = "/ZCCP_ORD_CR_HEAD_ITM_NAV/results/9/DistForecast";
            break;
        case 'forecastQuantityWeek11':
            sRelativeContextPath = "/ZCCP_ORD_CR_HEAD_ITM_NAV/results/10/DistForecast";
            break;
        case 'forecastQuantityWeek12':
            sRelativeContextPath = "/ZCCP_ORD_CR_HEAD_ITM_NAV/results/11/DistForecast";
            break;
        case 'forecastQuantityWeek13':
            sRelativeContextPath = "/ZCCP_ORD_CR_HEAD_ITM_NAV/results/12/DistForecast";
            break;
    }
    var oChangedData = oEvent.getParameter('changed');
    var oOriginalData;
    var oBackUpModel = this.getModel('backup');
    if (oBackUpModel) {
        oOriginalData = oBackUpModel.getProperty(this.getBindingContext().sPath + sRelativeContextPath);
    } else {
        oOriginalData = this.getParent().getParent().getParent().getModel('backup').getProperty(this.getBindingContext().sPath + sRelativeContextPath);
    }
    this.setDirtyState(this._isDirty(editableWeek));
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
 * returns the dirty state of the record.
 */
mc.ccp.order.control.ImpExpOrderItemTable.prototype._isDirty = function(editableWeek) {
    editableWeek = editableWeek - 1;
    var oChangedModel = this.getModel();
    var oOriginalModel = this.getModel('backup');
    if (!oOriginalModel) {
        oOriginalModel = this.getParent().getParent().getParent().getModel('backup');
    }
    if (oOriginalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/' + editableWeek + '/OrderedQty') == oChangedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/' + editableWeek + '/OrderedQty') && oOriginalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/2/DistForecast') == oChangedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/2/DistForecast') && oOriginalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/3/DistForecast') == oChangedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/3/DistForecast') && oOriginalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/4/DistForecast') == oChangedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/4/DistForecast') && oOriginalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/5/DistForecast') == oChangedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/5/DistForecast') && oOriginalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/6/DistForecast') == oChangedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/6/DistForecast') && oOriginalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/7/DistForecast') == oChangedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/7/DistForecast') && oOriginalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/8/DistForecast') == oChangedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/8/DistForecast') && oOriginalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/9/DistForecast') == oChangedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/9/DistForecast') && oOriginalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/10/DistForecast') == oChangedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/10/DistForecast') && oOriginalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/11/DistForecast') == oChangedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/11/DistForecast') && oOriginalModel.getProperty(this.getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/12/DistForecast') == oChangedModel.getProperty(this.getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/12/DistForecast')) {
        return false;
    } else {
        return true;
    }
};

/***
 * Is called to set the expand collapse image on click of the expand/Collapse img link.
 * If user clicks on expand, forecast row would be displayed else its display would be hidden.
 * @param oEvent
 */
mc.ccp.order.control.ImpExpOrderItemTable.prototype.handlePressExpandCollapse = function(oEvent) {
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
 * Is a method  to change the collapse image to expand image. Also it will display the forecast row.
 * @param oEvent
 */
mc.ccp.order.control.ImpExpOrderItemTable.prototype.expand = function(oEvent) {
    jQuery.sap.byId(this.getId()).find('tr#' + this.getId() + '-forecast').show();
    this.getAggregation('expandCollapseImage').setSrc('image/collapse.png');
    this.setExpand(true);
};

/***
 * Is a method to change the expand image to collapse image. Also it will hide the forecast row from ImpExpOrderItemTable.
 * @param oEvent
 */
mc.ccp.order.control.ImpExpOrderItemTable.prototype.collapse = function(oEvent) {
    jQuery.sap.byId(this.getId()).find('tr#' + this.getId() + '-forecast').hide();
    this.getAggregation('expandCollapseImage').setSrc('image/expand.png');
    this.setExpand(false);
};

/***
 * Is called implicitly by the framework to clean up the resource.
 * @param oEvent */
mc.ccp.order.control.ImpExpOrderItemTable.prototype.exit = function(oEvent) {
    //detaching attached non-default event handler 
    //detaching change event for ordered quantity
    this.getAggregation('orderedQuantity').detachChange(this.handleChangeOrderQuantity, this);
    //detaching change event for forecast quantity from week3 onwards, since forecast quantity for current week (week2) & current week -1 (week 1) are non editable.
    var noOfWeeks = 13;
    for (var i = 2; i <= noOfWeeks - 1; i++) {
        this.getAggregation('forecastQuantityWeek' + (i + 1)).detachChange(this.handleChangeForecastQuantity, this);
    }
    //detaching press event for SKU Link
    this.getAggregation('skuLink').detachPress(this.handlePressSkuLink, this);
    //detaching press event for Expand Collapse Image
    this.getAggregation('expandCollapseImage').detachPress(this.handlePressExpandCollapse, this);
};

/***
 * Is called to calculate the projected DOI.
 */
mc.ccp.order.control.ImpExpOrderItemTable.prototype._calculateProjectedDOI = function() {
	// step 1: getting the row object which has been tapped on Order Create Screen
	var oCurrentRow = this.getModel().getProperty(this.getBindingContext().sPath);

	// step 2: creating on the fly object
	var oData = {"results" : []};
	var numberOfWeeks = oCurrentRow.ZCCP_ORD_CR_HEAD_ITM_NAV.results.length;
	for(var i=0; i<numberOfWeeks; i++){
		var oCurrentRowItem = oCurrentRow.ZCCP_ORD_CR_HEAD_ITM_NAV.results[i];
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
			crQuantity : 0,
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
		this.getModel().setProperty(this.getBindingContext().sPath + '/ZCCP_ORD_CR_HEAD_ITM_NAV/results/' + k + '/ProjDOI', oOnTheFlyModel.getProperty('/results/' + k + '/projectedDOI'));
	}
};