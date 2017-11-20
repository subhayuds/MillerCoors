sap.ui.jsview("mc.ccp.changereq.ChangeReqComment", {

    /** Specifies the Controller belonging to this View. 
     * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
     * @memberOf order.VehicleEstimate
     */
    getControllerName: function() {
        return "mc.ccp.changereq.ChangeReqComment";
    },

    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf order.VehicleEstimate
     */
    createContent: function(oController) {

        // Adding Required Library
        jQuery.sap.require("mc.ccp.control.McHorizontalLayout");
        jQuery.sap.require("mc.ccp.changereq.control.McAccordion");

        // Layout definition for placing control
        var oLayout = new sap.ui.layout.VerticalLayout(this.createId("idDialog"), {});

        // Getting the text of the clicked link
        var clickedStatus = this.getViewData()[0];

        // Condition check to place the content according to the clicked link
        if (clickedStatus === MCAPP.getText('VW_TEXT', this)) {
            var clickedRow = this.getViewData()[1].sPath.split("/");
            clickedRow = clickedRow[2]; // reading the last char of sPath i.e. rowIndex
            var oData = this.getViewData()[1].getModel().getData().results[clickedRow];
            // Checking if the Distributor and MillerCoors Comment Date is Present
            if (oData.Dist_Comment_Date !== "" && oData.MC_Comment_Date !== "") {
            	var oDistComment = oData.Dist_Comment_Text; // Assigning the Distributor Comment to variable
                var oDistUser = new sap.ui.commons.Label({ // Placing distributor user Info into label
                    text: oData.Dist_Comment_User
                });

                var oDistDate = new sap.ui.commons.Label({ // Placing Distributor Comment date in label
                    text: oData.Dist_Comment_Date
                });

                // Placing both labels in horizontal format     
                var oTopContrlsRow = new mc.ccp.control.McHorizontalLayout({
                    height: "50px",
                    width: "100%",
                    widths: ["80%", "20%"],
                    content: [oDistUser, oDistDate]
                });

                // Build Accordion with the horizontal layout content 
                var oAccordion = new mc.ccp.changereq.control.McAccordion(this.createId("accordionA"), {
                    header: oTopContrlsRow,
                    imgName: "ReadMessage.PNG"
                });

                //Building Section 1
                var oSection1 = new sap.ui.commons.AccordionSection(this.createId("Section1"));
                oSection1.setTitle(MCAPP.getText('ACC_SECTION_ONE', this));
                oSection1.setMaxHeight("100px");
                var oDistText = new sap.ui.commons.TextView({
                    text: oDistComment
                });
                oSection1.addContent(oDistText);
                oAccordion.addSection(oSection1);
                oAccordion.setWidth("100%");

                //Building Section 2
                var oData = this.getViewData()[1].getModel().getData().results[clickedRow];
                var oMcComment = oData.MC_Comment_Text;
                var oMcUser = new sap.ui.commons.Label({
                    text: oData.MC_Comment_User
                });
                var oMcDate = new sap.ui.commons.Label({
                    text: oData.MC_Comment_Date
                });

                var oTopContrlsRow1 = new mc.ccp.control.McHorizontalLayout({
                    height: "50px",
                    width: "100%",
                    widths: ["80%", "20%"],
                    content: [oMcUser, oMcDate]
                }).addStyleClass('image');

                var oAccordion1 = new mc.ccp.changereq.control.McAccordion(this.createId("accordionB"), {
                    header: oTopContrlsRow1,
                    imgName: "UnreadMessage.PNG"
                });

                var oSection2 = new sap.ui.commons.AccordionSection(this.createId("Section2"));
                oSection2.setTitle(MCAPP.getText('ACC_SECTION_TWO', this));
                oSection2.setMaxHeight("100px");

                var oMcText = new sap.ui.commons.TextView({
                    text: oMcComment
                });
                oSection2.addContent(oMcText);
                oAccordion1.addSection(oSection2);

                oAccordion1.setWidth("100%");
                
                var accordionArr = [];
                accordionArr.push(oAccordion);
                accordionArr.push(oAccordion1);
                
                this.openViewCRCommentDialog(oData,accordionArr,"");
            } else if(oData.Dist_Comment_Date !== ""){
            	var oDistComment = oData.Dist_Comment_Text; // Assigning the Distributor Comment to variable
                var Label = new sap.ui.commons.Label({ // Distributor info in Label
                    text: oData.Dist_Comment_User
                });
                
                var oDistDate = new sap.ui.commons.Label({ // Distributor comment date in Label
                    text: oData.Dist_Comment_Date,
                }).addStyleClass('DateAlign');

                var oUserInfoRow = new mc.ccp.control.McHorizontalLayout({ // Placing both Label in horizontal Layout
                    height: "25px",
                    width: "100%",
                    ptop: "5px",
                    widths: ["25%", "60%", "15%"],
                    content: [Label, new sap.ui.core.HTML(), oDistDate]
                });
                
                var oTextArea = new sap.ui.commons.TextArea({ // Text Area for editing the comment
                    width: '520px',
                    height: '100px',
                    value: oDistComment
                });
                
                var viewArr = [];
                viewArr.push(oUserInfoRow);
                viewArr.push(oTextArea);
                this.openViewCRCommentDialog(oData,"",viewArr);
            }

        } else if (clickedStatus === MCAPP.getText('AD_TEXT', this)) { //Code for clicked object "Add"
            var clickedRow = this.getViewData()[1].sPath.split("/");
            clickedRow = clickedRow[2]; // reading the last char of sPath i.e. rowIndex

            var oUserIdLabel = new sap.ui.commons.Label({ // Distributor info in Label
                text: "abc@xyz.com" // need to get it from global var: logged in user info
            });
            
            var oDistDate = new sap.ui.commons.Label({ // Distributor comment date in Label
                text: this.getCurrentDate(),
            }).addStyleClass('DateAlign');

            var oUserInfoRow = new mc.ccp.control.McHorizontalLayout({ // Placing both Label in horizontal Layout
                height: "25px",
                width: "100%",
                ptop: "5px",
                widths: ["25%", "60%", "15%"],
                content: [oUserIdLabel, new sap.ui.core.HTML(), oDistDate]
            });

            sap.ui.getCore().byId(this.createId("idDialog")).addContent(oUserInfoRow);

            var oTextArea = new sap.ui.commons.TextArea({ // Text area for adding comment
                width: '520px',
                height: '100px'
            });
            sap.ui.getCore().byId(this.createId("idDialog")).addContent(oTextArea);

        } else if (clickedStatus === MCAPP.getText('EDT_TEXT', this)) { // Code for clicked object "Edit"
            var clickedRow = this.getViewData()[1].sPath.split("/");
            clickedRow = clickedRow[2]; // reading the last char of sPath i.e. rowIndex
            var oDistUser = this.getViewData()[1].getModel().getData().results[clickedRow].Dist_Comment_User;
            var oDistComment = this.getViewData()[1].getModel().getData().results[clickedRow].Dist_Comment_Text;
            var oDistCmtDate = this.getViewData()[1].getModel().getData().results[clickedRow].Dist_Comment_Date;

            if (oDistUser) { 
                var Label = new sap.ui.commons.Label({ // Distributor info in Label
                    text: oDistUser
                });
                
                var oDistDate = new sap.ui.commons.Label({ // Distributor comment date in Label
                    text: oDistCmtDate,
                }).addStyleClass('DateAlign');

                var oUserInfoRow = new mc.ccp.control.McHorizontalLayout({ // Placing both Label in horizontal Layout
                    height: "25px",
                    width: "100%",
                    ptop: "5px",
                    widths: ["25%", "60%", "15%"],
                    content: [Label, new sap.ui.core.HTML(), oDistDate]
                });
                
                sap.ui.getCore().byId(this.createId("idDialog")).addContent(oUserInfoRow);
                var oTextArea = new sap.ui.commons.TextArea({ // Text Area for editing the comment
                    width: '520px',
                    height: '100px',
                    value: oDistComment
                });
                sap.ui.getCore().byId(this.createId("idDialog")).addContent(oTextArea);
            } 
        }
        return oLayout;
    },
    
    getCurrentDate : function(oController){
    	var today = new Date();
    	var currentDate = today.getMonth()+"/"+today.getDate()+"/"+today.getFullYear();
    	return currentDate;
    },
    
    openViewCRCommentDialog : function(oData,accordionArr,viewArr){
    	var oOkButton = new sap.ui.commons.Button({
            text: MCAPP.getText('GBL_OK', this),
            width: "90px",
            height: '30px'
        });
        oOkButton.attachPress(function(oEvent) {
            oEvent.getSource().getParent().close();
        });

        var oViewCommentDialog = new sap.ui.commons.Dialog((this.createId("ViewDialog")), {
            modal: true,
            width: '40%',
            height: '50%',
            title: MCAPP.getText('VEW_CMNT_TITLE', this) + ' ' + oData.SKU,
            buttons: [oOkButton],
            closed: function(oEvent) {
                this.destroy();
            }
        }).addStyleClass('McCustomDialog');
        oViewCommentDialog.open();
        
        if(accordionArr != "" ){
        	 oViewCommentDialog.addContent(accordionArr[0]);
        	 oViewCommentDialog.addContent(accordionArr[1]);
        }else if(viewArr != ""){
        	oViewCommentDialog.addContent(viewArr[0]);
        	oViewCommentDialog.addContent(viewArr[1]);
        }
        
    },


});