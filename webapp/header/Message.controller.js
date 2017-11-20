/***
 * @Author EO19
 * @Date 09/15/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is Message view controller
 */
sap.ui.controller("mc.ccp.header.Message", {
    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * Call from Header.View for Message Model. Set the Message Model for Message View
     * @memberOf header.Message
     */
    onInit: function() {
        var msgModel = MCAPP.getHeaderView().getModel('message');
        var oModel = new sap.ui.model.json.JSONModel();
        var oData = msgModel.getData();
        oModel.setData(oData);
        this.getView().setModel(msgModel);
    },
    
    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     * The default first open section of the accordion is marked read here
     * @memberOf header.Message
     */
    onAfterRendering: function() {
        var acc = this.byId('msgAccordionId');
        var sections = acc.getSections();
        //acc.getModel().setProperty(sections[0].getBindingContext().sPath + '/isReadFlag', true);
    },
    
    /**
     * This method is to make the first default open section and other open message sections to read
     */
    onSectionOpen: function(oEvent) {
        //make first section one read
        var acc = this.byId('msgAccordionId');
        var sections = acc.getSections();
        //make opened section one read
        var SecId = oEvent.getParameter('openSectionId');
        var oSection = sap.ui.getCore().byId(SecId);
        acc.getModel().setProperty(oSection.getBindingContext().sPath + '/isReadFlag', true);
        //change label to reflect which section index is open
        var accindex = acc.indexOfSection(oSection);
        var oIndex = accindex + 1;
        this.getView().getParent().setProperty('title', MCAPP.getText('MESSAGES', this) + ' ( ' + oIndex +' '+ MCAPP.getText('GBL_OF', this)+' ' + sections.length + ' )');
    },
    
    /**
     * On Section close set the message read
     * @param event
     */
    onSectionClose: function(event) {
        var SecId = event.getParameter('closeSectionId');
        var oSection = sap.ui.getCore().byId(SecId);
        var accrd = this.byId('msgAccordionId');
        accrd.getModel().setProperty(oSection.getBindingContext() + '/isReadFlag', true);
    },
    
    /***
     * Event handler for on Press Print. This method prints all messages
     */
    onPressPrint: function() {
        var printWindow = window.open();
        var oSections = this.getView().getModel().getData().results;
        var arr = [];
        for (var i = 0; i < oSections.length; i++) {
            arr[0] = oSections[i].TDLine;
            arr[1] = oSections[i].Description;
            arr[2] = oSections[i].Date;
            printWindow.document.write('<p>'+MCAPP.getText('MESSAGES_SCREEN_SUMMARY', this)  + arr[0] + '<br>'+MCAPP.getText('MESSAGES_SCREEN_DESCRIPTION', this) + arr[1] + '<br>'+MCAPP.getText('MESSAGES_SCREEN_DATE', this) + arr[2] + '</p>');
        }
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
    },
    
    /***
     * This method is called to save IsRead flag for read messages, get the changed records and push them to backend
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
            //var oIsSave = msg[i].IsSave;
            var oGUID = msg[i].GUID;
            var oIsRead = msg[i].IsRead;
            oSections.push({
                MssgId: oMsgId,
                TDLine: oTdLine,
                Description: oDescription,
                Date: oDate,
                IsRead: oIsRead,
               // IsSave: oIsSave,
                GUID: oGUID
            });
        }
        var changedrec = [];
        for (var j = 0; j < msg.length; j++) {
            if ((msg[j].IsRead === 'X' && msg[j].isReadFlag === false) || (msg[j].IsRead !== 'X' && msg[j].isReadFlag === true)) {
                oSections[j].IsRead = 'X';
               // oSections[j].IsSave = 'X';
                oSections[j].ProcessType = 'ZMSG';
                this.getView().getModel().setProperty('/results/'+j+'/IsRead','X');
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
    
    /***
     *  This method is used to update the count in the Message icon in Dashboard Header
     */
    _onCloseUpdCount: function() {
        var msgs = this.getView().getModel().getData().results;
        var unreadCount = 0;
        for (var i = 0; i < msgs.length; i++) {
            if (msgs[i].isReadFlag === false) {
                unreadCount++;
            }
        }
        //Set the Number in the Icon
        if (unreadCount !== 0) {
            MCAPP.getHeaderView().oController.byId('countCarrier').setContent("<div  align = 'center' class='McCcpHeaderMessageCount'>" + unreadCount + "</div>");
        }
        else {
            MCAPP.getHeaderView().oController.byId('countCarrier').setContent("");
        }
    },
    
    /***Event Handler for Close Button. Call methods to Save and Update message count in Dashboard Header
     * @param evt
     */
    onPressClose: function(evt) {
        this._save();
        this._onCloseUpdCount();
        evt.getSource().getParent().close();       
    }
});