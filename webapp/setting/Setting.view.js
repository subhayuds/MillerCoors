/***
 * @Author DS05
 * @Date 10/13/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is Setting view
 */
sap.ui.jsview("mc.ccp.setting.Setting", {
    /** Specifies the Controller belonging to this View. 
     * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
     * @memberOf setting.Settting
     */
    getControllerName: function() {
        return "mc.ccp.setting.Setting";
    },
    
    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf setting.Settting
     * @param oController
     */
    createContent: function(oController) {
        //Required Library
        jQuery.sap.require("mc.ccp.order.control.OrderItemTable");
        jQuery.sap.require("mc.ccp.control.McDateHeader");
        jQuery.sap.require("mc.ccp.control.McHorizontalLayout");
        jQuery.sap.require("mc.ccp.control.McPaginator");
        jQuery.sap.require("mc.ccp.control.McComboBox");
        jQuery.sap.require("mc.ccp.control.McTable");
        jQuery.sap.require("mc.ccp.control.McColumn");
        jQuery.sap.require("mc.ccp.control.McDialog");
      
        var oPageControlsTopRow = this._createPageControlsRow(oController, "");
        oPageControlsTopRow.addStyleClass('settingTopRowPadding');
        var oSettingTable = this._createSettingTable('SettingTable', oController);
        var oPageControlsBottomRow = this._createPageControlsRow(oController, 'Bottom');
        oPageControlsBottomRow.addStyleClass('settingBottomRowPadding');
        var oVerticalLayout = new sap.ui.layout.VerticalLayout({
            content: [oPageControlsTopRow, oSettingTable, oPageControlsBottomRow]
        });
        return oVerticalLayout;
    },
    
    /**
     * method to create the page controls row in the order page
     * @param oController
     * @param pos
     * @returns {mc.ccp.control.McHorizontalLayout}
     */
    _createPageControlsRow: function(oController, id) {
        var oTotalTxt = new sap.ui.commons.TextView(this.createId('totalTxtId' + id)).addStyleClass('settingVwlabels');
        var oComboBox = new mc.ccp.control.McComboBox(this.createId('comboBoxId' + id), {
            width: "85px",
            height: "35px",
            selectedKey: "10",
            editable: true,
        });
        oComboBox.attachChange(oController.onChangeDropdown, oController);
        var oPaginator = new mc.ccp.control.McPaginator(this.createId('paginatorId' + id), {
            showSave: true
        });
        oPaginator.attachPage(oController.onPageSaveAndNavigate, oController);
        var oCancelButton = new sap.ui.commons.Button(this.createId("idCancelBtn" + id),{
            text: "{i18n>GBL_CANCEL}",
            height: "35px",
            width: "90px"
        });
        oCancelButton.attachPress(oController.onPressCancel, oController);
        var oSaveButton = new sap.ui.commons.Button(this.createId("idSaveBtn" + id),{
            text: "{i18n>GBL_SAVE}",
            height: "35px",
            width: "90px"
        });
        oSaveButton.attachPress(oController.onPressSave, oController);
        var oLayout = new mc.ccp.control.McHorizontalLayout(this.createId("idComboPaginatorRow" + id),{
            height: "50px",
            width: "100%",
            ptop: "5px",
            widths: ["10%", "25%", "45%", "10%", "10%"],
            content: [oComboBox, oTotalTxt, oPaginator, oCancelButton, oSaveButton]
        });
        return oLayout;
    },
    
    /** This is used to display the Setting Table.
     * @memberOf setting.Setting
     * @param oController
     */
    _createSettingTable: function(id, oController) { 
        var oTable = new mc.ccp.control.McTable(this.createId(id), {
            width: '100%',
            selectionMode: sap.ui.table.SelectionMode.None,
            navigationMode: sap.ui.table.NavigationMode.Paginator,
        });
        oTable.addStyleClass("settingTable");
        //Define the columns and the control templates to be used
        this._createColumnSetting(oTable, "idDistSKUCol", "TextView", "Dist_SKU", "5%", "VW_SETTING_DIST_SKU");
        this._createColumnSetting(oTable, "idSKUCol", "TextView", "SKU", "5%", "VW_SETTING_SKU");
        this._createColumnSetting(oTable, "idDescCol", "TextView", "SKU_Desc", "20%", "VW_SETTING_DESCRIPTION");
        this._createColumnSetting(oTable, "idShipToCol", "TextView", "ShipToId", "5%", "VW_SETTING_SHIP_TO");        
        
        var colCheckDoNotPlan = new sap.ui.commons.CheckBox({
        	checked:{
                path: "DoNotPlanFlag",
                formatter: function(fValue) {                 	
                    if (fValue === 'X') {
                        return true;
                    }
                    else {
                        return false;
                    }
                },
            }
        }).attachChange(oController.onChangeDoNotPlanFlag, oController);  
        colCheckDoNotPlan.bindProperty("enabled", "readOnly");
        oTable.addColumn(new mc.ccp.control.McColumn("ColCheckDoNotPlan", {
            label: new sap.ui.commons.Label({
                text: MCAPP.getText("VW_SETTING_DO_NOT_PLAN", this),
            }).addStyleClass("settingHeaderCellPadding"),
            template: colCheckDoNotPlan,
            width: "5%",
            hAlign: "Center",
            vAlign: "Center",
            resizable: false,
            sortProperty: "DoNotPlanFlag"            
        }));   
        var colCheckHide = new sap.ui.commons.CheckBox({
        	checked:{
        		 path: "HideFlag",                
        		 formatter: function(fValue) {                	
                    if (fValue === 'X') {
                        return true;
                    }
                    else {
                        return false;
                    }
                },
            }            
        });        
        colCheckHide.bindProperty("enabled", "readOnly");
        colCheckHide.attachChange(oController.onChangeDoNotPlanAndHideFlag, oController);        
        oTable.addColumn(new mc.ccp.control.McColumn("ColChkHide", {
            label: new sap.ui.commons.Label({
                text: MCAPP.getText("VW_SETTING_HIDE", this),
            }).addStyleClass("settingHeaderCellPadding"),
            template: colCheckHide,
            width: "4%",
            hAlign: "Center",
            vAlign: "Center",
            resizable: false,
            sortProperty: "HideFlag"            
        }));
        oTable.bindRows('/results');
        oTable.attachSort(oController.onSortColumn, oController);
        oTable.attachFilter(oController.onFilterColumn, oController);
        return oTable;
    },
    
    /** This  prepares columns for table as per their template type.
     * @memberOf setting.Setting
     * @param oTable
     * @param colId
     * @param template
     * @param jsonField
     * @param resBundleVal
     */
    
    _createColumnSetting: function(oTable, colId, template, jsonField, width, resBundleVal) {
        var newTemplate = "";
        if (template === "TextView") {
            newTemplate = new sap.ui.commons.TextView().bindProperty("text", jsonField);
        }
        //creating column and adding to oTable        
        oTable.addColumn(new mc.ccp.control.McColumn(this.createId(colId), {
            label: new sap.ui.commons.Label({
                text: MCAPP.getText(resBundleVal, this),
            }).addStyleClass("settingHeaderCellPadding"),
            template: newTemplate,
            width: width,
            hAlign: "Center",
            vAlign: "Center",
            resizable: false,
            sortProperty: jsonField,
            filterProperty: jsonField
        }));
    },
});