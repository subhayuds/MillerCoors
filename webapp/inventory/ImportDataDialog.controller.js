/***
 * @Author SO97
 * @Date 11/13/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is ImportData Dialog controller
 */
sap.ui.controller("mc.ccp.inventory.ImportDataDialog", {
    /**
     * onChange function enables the button
     * @param oEvent
     */
    onChange: function(oEvent) {
    	MCAPP.getCurrentView().getController().byId("importOkButtonId").setEnabled(true);
    },
    
    /**
     * fileUploaderUploadComplete function checks the file upload is successful/unSuccessful
     * if the response is success/failure respectively.
     * @param oEvent
     */
    fileUploaderUploadComplete: function(oEvent) {
        var xml = $.parseXML(oEvent.getParameter("responseRaw"));
        $xml = $(xml);
        if (oEvent.getParameter("readyStateXHR") == "4" && oEvent.getParameter("status") == "400") {
            	var errorText = $xml.context.childNodes[0].childNodes[2].childNodes[3].childNodes[2].childNodes[1].textContent;
                sap.ui.commons.MessageBox.show(errorText, sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText("GBL_ERROR", this));
        } else if (oEvent.getParameter("readyStateXHR") == "4" && oEvent.getParameter("status") == "201") {
            var failedDataModel = new sap.ui.model.json.JSONModel();
            var oDataFailed = {};
            var failedRecords = "";
            var successRecords = "";
            failedRecords = $xml.context.childNodes[0].childNodes[6].childNodes[3].textContent;
            successRecords = $xml.context.childNodes[0].childNodes[6].childNodes[4].textContent;
            var failedDataArray = eval(failedRecords);
            var successDataArray = eval(successRecords);
            oDataFailed.results = failedDataArray;
            failedDataModel.setData(oDataFailed);
            // Merging the success records data with existing view model data
            if (successDataArray !== undefined && successDataArray.length >= 1) {
                var currentModelData = this.getView().getModel().getData().results;
                var backUpModelData = this.getView().getModel('backup').getData().results;
                for (var i = successDataArray.length - 1; i >= 0; i--) {
                    for (var j = 0; j < currentModelData.length; j++) {
                        if (successDataArray[i].zzsku === currentModelData[j].SKU &&
                        		successDataArray[i].zzkunnr === currentModelData[j].ShipToId) {
                            if(filter === "SALE"){
                            	currentModelData[j].LastWeekSales = successDataArray[i].zzsales;
                            	currentModelData[j].dirtyState = false;
                            	backUpModelData[j].LastWeekSales = successDataArray[i].zzsales;
                            	backUpModelData[j].dirtyState = false;
                            	
                            }else{
                            	currentModelData[j].BegINV = successDataArray[i].zzinventory;
                            	currentModelData[j].dirtyState = false;
                            	backUpModelData[j].BegINV = successDataArray[i].zzinventory;
                            	backUpModelData[j].dirtyState = false;
                            }
                        }
                    }
                }
                sap.m.MessageToast.show(MCAPP.getText('GBL_DATA_SAVE_MSG', this), {
                    duration: MCAPP.getAppConfigAsInt('MsgToastDurationOnNavigation')
                });
                this.getView().getModel().refresh(true);
                this.getView().getModel('backup').refresh(true);
                this.getView().getViewData().rerender();
            }
            //Displaying the failed records data 
            if (failedDataArray !== undefined && failedDataArray.length >= 1) {
                var oImportDataFailedDialogView = new sap.ui.view({
                    type: sap.ui.core.mvc.ViewType.JS,
                    viewName: "mc.ccp.inventory.ImportDataFailed"
                });
                var oImportDataFailedDialog = new sap.ui.commons.Dialog({
                    modal: true,
                    width: '70%',
                    height: '63%',
                    content: [oImportDataFailedDialogView],
                    closed: function(oEvent) {
                        this.destroy();
                    }
                }).addStyleClass('McCcpCustomDialog');
                oImportDataFailedDialog.setTitle(MCAPP.getText("VW_IDF_IMPORT_ERROR"), this);
                oImportDataFailedDialog.addButton(new sap.ui.commons.Button("okButton", {
                    text: MCAPP.getText('GBL_OK', this),
                    press: function() {
                        oImportDataFailedDialog.close();
                    }
                }));
                oImportDataFailedDialog.setModel(failedDataModel);
                oImportDataFailedDialog.open();
                var oTable = sap.ui.getCore().byId("idFileUploadFailedTable");
                var tempLength = failedDataArray.length;
                oTable.setVisibleRowCount(parseInt(tempLength));
                var textView = sap.ui.getCore().byId("errorcount");
                textView.setText(tempLength + " " + MCAPP.getText('VW_IDF_ERROR_ITEMS', this));
            }
        }
    },
    
    /**
     * onPressClose it closes the current screen.
     * @param oEvent
     */
    onPressClose: function(oEvent) {
        oEvent.getSource().getParent().close();
    },
    
    /**
     * onPress upload it is validating and uploading the file
     * @param oEvent
     */
    onPressUploadFile: function(oEvent) {
    	var oDataModelFile = new sap.ui.model.odata.ODataModel(MCAPP.getServiceUrl(MCAPP.getComponent().getModel('service').getProperty('/InventoryFileUpload')));
		var oToken = this.getParent().getAggregation("content")[1].getController()._getXsrfToken(oDataModelFile);
		oDataModelFile.setHeaders({
			"X-Requested-With": "XMLHttpRequest",
			"Content-Type": "application/atom+xml",
			"DataServiceVersion": "2.0",
			"x-csrf-token": oToken
		});
        filter = "SALE";
        if (MCAPP.getCurrentView().byId("idradioInventory").getSelected() === true) {
            filter = "INV";
        }
        var oFileUploader = sap.ui.getCore().byId("fileuploader");
        oFileUploader.insertHeaderParameter(new sap.ui.unified.FileUploaderParameter({
            name: "slug",
            value: filter
        }));
        //embedding the below header parameters for IE browser : Start
        var oHeaderParameter = new sap.ui.unified.FileUploaderParameter({
     	   name: "x-csrf-token",
    	   value: oToken
       }, {
    	   name: "Content-Type",
    	   value: "text/xml",
       });
       //embedding the below header parameters for IE browser : End
       oFileUploader.addHeaderParameter(oHeaderParameter);
       oFileUploader.setUploadUrl(oDataModelFile.sServiceUrl + "/ZCCP_IMPORT_FILE_SET");//: oDataModelFile.sServiceUrl + "/ZCCP_IMPORT_FILE_SET",
       oFileUploader.upload();
    },
    
    /**
	 * Called to return the security token
	 * @param oDataModel
	 */
	_getXsrfToken: function(oDataModel) {
		var sToken = oDataModel.getHeaders()['x-csrf-token'];
		oDataModel.refreshSecurityToken(function(evt, obj) {
			sToken = obj.headers['x-csrf-token'];
		}, function() {
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message: sap.ca.scfld.md.app.Application.getImpl().getResourceBundle().getText('VW_FORECAST_XSRF_TOKEN'),
				details: ''
			});
		}, false);
		return sToken;
	},
});