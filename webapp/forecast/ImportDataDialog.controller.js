/***
 * @Author so97
 * @Date 11/13/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is ImportData Dialog controller
 */
sap.ui.controller("mc.ccp.forecast.ImportDataDialog", {
	/**
	 * onChange function enables the ok button
	 * @param oEvent
	 */
	onChange: function(oEvent) {
		if(oEvent.getSource().oFilePath._lastValue === ""){
			MCAPP.getCurrentView().getController().byId("importOkButtonId").setEnabled(false);
		}
		if(oEvent.getSource().oFilePath._lastValue !="" ){
			MCAPP.getCurrentView().getController().byId("importOkButtonId").setEnabled(true);
		}
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
		}
		else if (oEvent.getParameter("readyStateXHR") == "4" && oEvent.getParameter("status") == "201") 
		{         
			oEvent.getSource().getParent().getParent().close();	
			var failedDataModel = new sap.ui.model.json.JSONModel();
			var oDataFailed = {}; 
			xml = $.parseXML(oEvent.getParameter("responseRaw"));
			$xml = $(xml);
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
						zosku = successDataArray[i].zosku.replace(/^0+/, '');
						zshipto = successDataArray[i].zshipto.replace(/^0+/, '');						
						if ((zosku === currentModelData[j].SKU.trim()) && (zshipto === currentModelData[j].ShipToId)) {
							currentModelData[j].ZCCP_FORE_HEAD_ITEM_NAV.results[5].DistForecast = successDataArray[i].zdist_fcst3;
							currentModelData[j].ZCCP_FORE_HEAD_ITEM_NAV.results[6].DistForecast = successDataArray[i].zdist_fcst4;
							currentModelData[j].ZCCP_FORE_HEAD_ITEM_NAV.results[7].DistForecast = successDataArray[i].zdist_fcst5;
							currentModelData[j].ZCCP_FORE_HEAD_ITEM_NAV.results[8].DistForecast = successDataArray[i].zdist_fcst6;
							currentModelData[j].ZCCP_FORE_HEAD_ITEM_NAV.results[9].DistForecast = successDataArray[i].zdist_fcst7;
							currentModelData[j].ZCCP_FORE_HEAD_ITEM_NAV.results[10].DistForecast = successDataArray[i].zdist_fcst8;
							currentModelData[j].ZCCP_FORE_HEAD_ITEM_NAV.results[11].DistForecast = successDataArray[i].zdist_fcst9;

							//Update the values to Backup Model
							backUpModelData[j].ZCCP_FORE_HEAD_ITEM_NAV.results[5].DistForecast = successDataArray[i].zdist_fcst3;
							backUpModelData[j].ZCCP_FORE_HEAD_ITEM_NAV.results[6].DistForecast = successDataArray[i].zdist_fcst4;
							backUpModelData[j].ZCCP_FORE_HEAD_ITEM_NAV.results[7].DistForecast = successDataArray[i].zdist_fcst5;
							backUpModelData[j].ZCCP_FORE_HEAD_ITEM_NAV.results[8].DistForecast = successDataArray[i].zdist_fcst6;
							backUpModelData[j].ZCCP_FORE_HEAD_ITEM_NAV.results[9].DistForecast = successDataArray[i].zdist_fcst7;
							backUpModelData[j].ZCCP_FORE_HEAD_ITEM_NAV.results[10].DistForecast = successDataArray[i].zdist_fcst8;
							backUpModelData[j].ZCCP_FORE_HEAD_ITEM_NAV.results[11].DistForecast = successDataArray[i].zdist_fcst9;
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
			if (failedDataArray != undefined && failedDataArray.length >= 1) {
				var oImportDataFailedDialogView = new sap.ui.view({
					type: sap.ui.core.mvc.ViewType.JS,
					viewName: "mc.ccp.forecast.ImportDataFailed"
				});
				oImportDataFailedDialog = new sap.ui.commons.Dialog({
					modal: true,
					width: '50%',
					height: '70%',
					content: [oImportDataFailedDialogView],
					closed: function(oEvent) {
						this.destroy();
					}
				}).addStyleClass('McCcpCustomDialog');
				oImportDataFailedDialog.setTitle(MCAPP.getText("VW_IDF_IMPORT_ERROR"), this);
				oImportDataFailedDialog.addButton(new sap.ui.commons.Button({
					text: MCAPP.getText('GBL_OK', this),
					width: "90px",
					height: '30px',
					press: function() {
						oImportDataFailedDialog.close();
					}
				}));
				oImportDataFailedDialog.setModel(failedDataModel);
				oImportDataFailedDialog.open();
				var oTable = oImportDataFailedDialogView.byId("idFileUploadFailed");
				var tempLength = oTable.getBinding().aIndices.length;
				var textView = oImportDataFailedDialogView.byId("errorcount");
				textView.setText(tempLength + " " + MCAPP.getText('VW_IDF_ERROR_ITEMS', this));
			}
		}else{
			sap.ui.commons.MessageBox.show(MCAPP.getText('GBL_DATA_SAVE_ERROR', this), sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', this), [sap.ui.commons.MessageBox.Action.OK]);
		}
	},

	/**
	 * it closes the current screen.
	 * @param oEvent
	 */
	onPressClose: function(oEvent) {
		oEvent.getSource().getParent().close();
	},

	/**
	 * it is validating and uploading the file
	 * @param oEvent
	 */
	onPressUploadFile: function(oEvent) {
		var oDataModelFile = new sap.ui.model.odata.ODataModel(MCAPP.getServiceUrl(MCAPP.getComponent().getModel('service').getProperty('/ForecastFileUpload')));
		var oToken = this.getParent().getAggregation("content")[0].getController()._getXsrfToken(oDataModelFile);
		oDataModelFile.setHeaders({
			"X-Requested-With": "XMLHttpRequest",
			"Content-Type": "application/atom+xml",
			"DataServiceVersion": "2.0",
			"x-csrf-token": oToken
		});
		var oFileUploader = sap.ui.getCore().byId("fileuploader");
		oFileUploader.destroyHeaderParameters();
		oFileUploader.insertHeaderParameter(new sap.ui.unified.FileUploaderParameter({
			name: "slug",
			value: oFileUploader.getValue()
		}));
		//embedding the below header parameters for IE browser : Start	
		oFileUploader.insertHeaderParameter(new sap.ui.unified.FileUploaderParameter({
			name: "content-type",
			value: 'application/x-www-form-urlencoded'
		}));
		var oHeaderParameter = new sap.ui.unified.FileUploaderParameter({
			name: "x-csrf-token",
			value: oToken
		}, {
			name: "Content-Type",
			value: "text/xml",
		});
		oFileUploader.addHeaderParameter(oHeaderParameter);
		oFileUploader.setUploadUrl(oDataModelFile.sServiceUrl + "/ZCCP_IMPORT_FILE_SET");
		//embedding the below header parameters for IE browser : Start	
		oFileUploader.upload(function(){
		}, function(oError){
			sap.ui.commons.MessageBox.show(MCAPP.getText('GBL_DATA_LOAD_ERROR', this), sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', this), [sap.ui.commons.MessageBox.Action.OK]);
		});
	},

	/**
	 * Called to return the security token
	 * @memberOf Forecast
	 * @param oDataModel
	 */
	_getXsrfToken: function(oDataModel) {
		var sToken = oDataModel.getHeaders()['x-csrf-token'];
		if(sToken ==undefined || sToken==""){
		oDataModel.refreshSecurityToken(function(evt, obj) {
			sToken = obj.headers['x-csrf-token'];
		}, function(oError) {
			sap.ui.commons.MessageBox.show(MCAPP.getText('GBL_DATA_LOAD_ERROR', this), sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', this), [sap.ui.commons.MessageBox.Action.OK]);			
		}, false);
		}
		return sToken;
	},
});