/***
 * @Author EO19
 * @Date 09/15/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is Alert view controller
 */
sap.ui.controller("mc.ccp.header.Alert", {
    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf mc.ccp.header.Alert
     */
    onInit: function() {
    	var isCalledFromComponent = this.getView().getViewData()[0];
    	var msgModel;
    	if(isCalledFromComponent === true)
    		msgModel = MCAPP.getHeaderView().getModel('alertFirst');
    	else{
    		msgModel = MCAPP.getHeaderView().getModel('alert');
    		/*sap.ui.getCore().byId('closeButtonId').setEnabled(true);*/
    	}
        var oModel = new sap.ui.model.json.JSONModel();
        var oData = msgModel.getData();
        oModel.setData(oData);
        this.getView().setModel(msgModel);
    },
    
    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     * @memberOf mc.ccp.header.Alert
     */
    onAfterRendering: function() {
    	if(this.getView().getViewData()[0] === false){
    		sap.ui.getCore().byId('closeButtonId').setEnabled(true);
    	}else{
    		if(this.getView().getModel().getData().results.length <=1){
    			sap.ui.getCore().byId('closeButtonId').setEnabled(true);
    		}
    	}
        if(this.getView().getModel().getData().results.length === 0){
        	var oTextView = new sap.ui.commons.TextView({text : MCAPP.getText('GBL_NO_MESSAGES', this)});
            MCAPP.getHeaderView().oAlertDialog.removeContent(0);
            MCAPP.getHeaderView().oAlertDialog.addContent(oTextView);
            MCAPP.getHeaderView().oAlertDialog.getButtons()[0].setEnabled(true);
            MCAPP.getHeaderView().oAlertDialog.setTitle(MCAPP.getText('SPLASH_SCREEN', this)+" ( 0 "+ MCAPP.getText('GBL_OF', this) + " 0 )");
        	 
        }
        
    },
    
    /**
     * This method is to make the first default open section and other open message sections to read
     */
    onSectionOpen: function(oEvent) {
        //make first section one read
        var acc = this.byId('alertAccordionId');
        var sections = acc.getSections();
        //make opened section one read
        var SecId = oEvent.getParameter('openSectionId');
        var oSection = sap.ui.getCore().byId(SecId);
        acc.getModel().setProperty(oSection.getBindingContext().sPath + '/isReadFlag', true);
        //change label to reflect which section index is open
        var accindex = acc.indexOfSection(oSection);
        var oIndex = accindex + 1;
        this.getView().getParent().setProperty('title', MCAPP.getText('SPLASH_SCREEN', this) + ' ( ' + oIndex + ' ' + MCAPP.getText('GBL_OF', this) + ' ' + sections.length + ' ) ');
        //Enable Close Button upon reading all Alerts
        var flag = false;
        var splashMsgs = this.getView().getModel().getData().results;
        for (var i = 0; i < splashMsgs.length; i++) {
            if (splashMsgs[i].isReadFlag === false) {
            	flag = true;
            	break;
            }
        }
        if (flag === false) {
            sap.ui.getCore().byId('closeButtonId').setEnabled(true);
            sap.ui.getCore().byId('closeButtonId').addStyleClass('McCcpHeaderButton');
        }
    },
    
    /***
     * Event handler for on Press Print. This method prints all splash messages
     */
    onPressPrint: function() {
        var printWindow = window.open();
        var oSections = this.getView().getModel().getData().results;
        var arr = [];
        for (var i = 0; i < oSections.length; i++) {
            arr[0] = oSections[i].TDLine;
            arr[1] = oSections[i].Description;
            arr[2] = oSections[i].Date;
            printWindow.document.write('<p>'+MCAPP.getText('SPLASH_SCREEN_SUMMARY', this)  + arr[0] + '<br>'+MCAPP.getText('SPLASH_SCREEN_DESCRIPTION', this) + arr[1] + '<br>'+MCAPP.getText('SPLASH_SCREEN_DATE', this) + arr[2] + '</p>');
        }
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
    },
    
    /***
     * This method is called to save IsRead flag for read messages
     * @param
     */
    _save: function() {
        MCAPP.setBusy(true);
        var msgdata = this.getView().getModel().getData();
        //get the JSON to an array
        var msg = msgdata.results;
        //Accordion Values		
        var oSections = [];
        for (var i = 0; i < msg.length; i++) {
            var oMsgId = msg[i].MssgId;
            var oTdLine = msg[i].TDLine;
            var oDescription = msg[i].Description;
            var oDate = msg[i].Date;            
            var oGUID = msg[i].GUID;
            var oIsRead = msg[i].IsRead;
            oSections.push({
                MssgId: oMsgId,
                TDLine: oTdLine,
                Description: oDescription,
                Date: oDate,
                IsRead: oIsRead,
                ProcessType : 'ZSPS',
                GUID: oGUID
            });
        }
        var changedrec = [];
        for (var j = 0; j < msg.length; j++) {
            if ((msg[j].IsRead === 'X' && msg[j].isReadFlag === false) || (msg[j].IsRead !== 'X' && msg[j].isReadFlag === true)) {
                oSections[j].IsRead = 'X';
                this.getView().getModel().setProperty('/results/' + j + '/IsRead', 'X');
                changedrec.push(oSections[j]);
            }
        }
        if (changedrec.length <= 0) {
            MCAPP.setBusy(false);
            return;
        }
        var oDataModel = MCAPP.getHeaderView().data('oMsgModel');
        var dummyHeader = {};
        dummyHeader.ZCCP_DSHBOARD_MSG_DUMMY_NAV = {};
        dummyHeader.ZCCP_DSHBOARD_MSG_DUMMY_NAV.results = changedrec;
        oDataModel.create('/ZCCP_DSHBOARD_MSG_DUMMY_SET', dummyHeader, null, function(oData, response) {
            MCAPP.setBusy(false);
        }, function(oError) {
            MCAPP.setBusy(false);
        });
    },
    
    /***Event Handler for Close Button
     * @param evt
     */
    onPressClose: function(evt) {
        this._save();
        MCAPP.getHeaderView().oAlertDialog.close();
    },
    
    /***
     * 
     * @param oEvent
     */
    onPressEscape: function(oEvent){
    		var splashMsgs = this.getView().getModel().getData().results;
            var flag = false;
            for (var i = 0; i < splashMsgs.length; i++) {
                if (splashMsgs[i].isReadFlag === false) {
                	flag = true;
                	break;
                }
            }
            if (flag === false) {
            	this.onPressClose();
            }else{
            	oEvent.preventDefault();
            }
    	
    }
});