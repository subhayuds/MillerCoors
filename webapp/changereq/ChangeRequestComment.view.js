/***
 * @Author DU09
 * @Date 10/13/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is Comment View, responsible to create the Comment dialog for View/Add/Edit.
 */
sap.ui.jsview("mc.ccp.changereq.ChangeRequestComment", {
	
    /** Specifies the Controller belonging to this View. 
     * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
     * @memberOf changeReq.ChangeRequestComment
     */
    getControllerName: function() {
        return "mc.ccp.changereq.ChangeRequestComment";
    },
    
    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf changeReq.ChangeRequestComment
     */
    createContent: function(oController) {
        // Adding Required Library
        jQuery.sap.require("mc.ccp.control.McHorizontalLayout");
        jQuery.sap.require("mc.ccp.changereq.control.McAccordion");
        // Layout definition for placing control
        var oVerticalLayout = new sap.ui.layout.VerticalLayout(this.createId("idDialog"), {});
        // Getting the text of the clicked link
        var clickedStatus = this.getViewData()[0];
        // Condition check to place the content according to the clicked link
        var clickedRow = this.getViewData()[1].sPath.split("/");
        clickedRow = clickedRow[2];
        var oData = this.getViewData()[1].getModel().getData().results[clickedRow];
        if (clickedStatus === MCAPP.getText('VIEW_TEXT', this)) {
            // Checking if the Distributor and MillerCoors Comment Date is Present
            	if (oData.Dist_Comment_Text !== "" && oData.MC_Comment_Text !== "") {
                var sDistributorComment = oData.Dist_Comment_Text; // Assigning the Distributor Comment to variable
                var oDistributorUser = new sap.ui.commons.Label({ // Placing distributor user Info into Label
                    text: MCAPP.getDistributorName()
                });
                var oDistributorDate = new sap.ui.commons.Label({ // Placing Distributor Comment date in Label
                    text: oData.Dist_Comment_Date
                });
                // Placing both Labels in horizontal layout     
                var oDistributorCommentLayout = new mc.ccp.control.McHorizontalLayout({
                    height: "50px",
                    width: "100%",
                    widths: ["80%", "20%"],
                    content: [oDistributorUser, oDistributorDate]
                });
                // Build Accordion with the horizontal layout content 
                var oDistributorAccordion = new mc.ccp.changereq.control.McAccordion(this.createId("accordionA"), {
                    header: oDistributorCommentLayout,
                    imgName: "ReadMessage.PNG"
                });
                //Building Section for distributor comment
                var oDistributorCommentSection = new sap.ui.commons.AccordionSection(this.createId("DistributorSection"));
                oDistributorCommentSection.setTitle(MCAPP.getText('DISTRIBUTOR_SECTION', this));
                oDistributorCommentSection.setMaxHeight("100px");
                //Placing the comment in a Text View
                var oDistributorText = new sap.ui.commons.TextView({
                    text: sDistributorComment
                });
                //Adding Text VIew to the section.
                oDistributorCommentSection.addContent(oDistributorText);
                oDistributorAccordion.addSection(oDistributorCommentSection);
                oDistributorAccordion.setWidth("100%");
                //Getting Mc comment from oData
                var sMcComment = oData.MC_Comment_Text;
                //Placing MC user Info into label
                var sMcUser = new sap.ui.commons.Label({
                    text: oData.MC_Comment_User
                });
                //Placing MC comment date into label
                var oMcCommentDate = new sap.ui.commons.Label({
                    text: oData.MC_Comment_Date
                });
                //Taking horizontal layout for placing the MC user info and MC comment date.
                var oMCCommentLayout = new mc.ccp.control.McHorizontalLayout({
                    height: "50px",
                    width: "100%",
                    widths: ["80%", "20%"],
                    content: [sMcUser, oMcCommentDate]
                }).addStyleClass('image');
                //Taking accordion to place MC layout as the header of accordion
                var oMcAccordion = new mc.ccp.changereq.control.McAccordion(this.createId("accordionB"), {
                    header: oMCCommentLayout,
                    imgName: "UnreadMessage.PNG"
                });
                //Building section for MC comment
                var oMcCommentSection = new sap.ui.commons.AccordionSection(this.createId("McSection"));
                oMcCommentSection.setTitle(MCAPP.getText('MC_SECTION', this));
                oMcCommentSection.setMaxHeight("100px");
                //Placing the MC comment in a Text View
                var oMcText = new sap.ui.commons.TextView({
                    text: sMcComment
                });
                oMcCommentSection.addContent(oMcText);
                oMcAccordion.addSection(oMcCommentSection);
                oMcAccordion.setWidth("100%");
                var commentArray = [];
                commentArray.push(oDistributorAccordion);
                commentArray.push(oMcAccordion);
                this.oController._createViewCRCommentDialog(oData, commentArray, "");
            } else if (oData.Dist_Comment_Text !== "") {
            	var sDistributorComment = oData.Dist_Comment_Text; // Assigning the Distributor Comment to variable
                var oDistributorUser = new sap.ui.commons.Label({ // Placing distributor user Info into Label
                    text: MCAPP.getDistributorName()
                });
                var oDistributorDate = new sap.ui.commons.Label({ // Placing Distributor Comment date in Label
                    text: oData.Dist_Comment_Date
                });
                // Placing both Labels in horizontal layout     
                var oDistributorCommentLayout = new mc.ccp.control.McHorizontalLayout({
                    height: "50px",
                    width: "100%",
                    widths: ["80%", "20%"],
                    content: [oDistributorUser, oDistributorDate]
                });
                // Build Accordion with the horizontal layout content 
                var oDistributorAccordion = new mc.ccp.changereq.control.McAccordion(this.createId("accordionA"), {
                    header: oDistributorCommentLayout,
                    imgName: "ReadMessage.PNG"
                });
                //Building Section for distributor comment
                var oDistributorCommentSection = new sap.ui.commons.AccordionSection(this.createId("DistributorSection"));
                oDistributorCommentSection.setTitle(MCAPP.getText('DISTRIBUTOR_SECTION', this));
                oDistributorCommentSection.setMaxHeight("100px");
                //Placing the comment in a Text View
                var oDistributorText = new sap.ui.commons.TextView({
                    text: sDistributorComment
                });
                //Adding Text VIew to the section.
                oDistributorCommentSection.addContent(oDistributorText);
                oDistributorAccordion.addSection(oDistributorCommentSection);
                oDistributorAccordion.setWidth("100%");
                var commentArray = [];
                commentArray.push(oDistributorAccordion);
                this.oController._createViewCRCommentDialog(oData, commentArray, "");
            } else if (oData.MC_Comment_Text !== "") {
            	//Getting Mc comment from oData
                var sMcComment = oData.MC_Comment_Text;
                //Placing MC user Info into label
                var sMcUser = new sap.ui.commons.Label({
                    text: oData.MC_Comment_User
                });
                //Placing MC comment date into label
                var oMcCommentDate = new sap.ui.commons.Label({
                    text: oData.MC_Comment_Date
                });
                //Taking horizontal layout for placing the MC user info and MC comment date.
                var oMCCommentLayout = new mc.ccp.control.McHorizontalLayout({
                    height: "50px",
                    width: "100%",
                    widths: ["80%", "20%"],
                    content: [sMcUser, oMcCommentDate]
                }).addStyleClass('image');
                //Taking accordion to place MC layout as the header of accordion
                var oMcAccordion = new mc.ccp.changereq.control.McAccordion(this.createId("accordionB"), {
                    header: oMCCommentLayout,
                    imgName: "UnreadMessage.PNG"
                });
                //Building section for MC comment
                var oMcCommentSection = new sap.ui.commons.AccordionSection(this.createId("McSection"));
                oMcCommentSection.setTitle(MCAPP.getText('MC_SECTION', this));
                oMcCommentSection.setMaxHeight("100px");
                //Placing the MC comment in a Text View
                var oMcText = new sap.ui.commons.TextView({
                    text: sMcComment
                });
                oMcCommentSection.addContent(oMcText);
                oMcAccordion.addSection(oMcCommentSection);
                oMcAccordion.setWidth("100%");
                var commentArray = [];
                commentArray.push(oMcAccordion);
                this.oController._createViewCRCommentDialog(oData, commentArray, "");
            }
        } else if (clickedStatus === MCAPP.getText('ADD_TEXT', this)) { //Code for clicked object "Add"
            var sDistributorAddUser = MCAPP.getDistributorName();
            var oDistributorAddUser = new sap.ui.commons.Label({ // Distributor info in Label
                text: sDistributorAddUser
            });
            var oDistributorAddDate = new sap.ui.commons.Label({ // Distributor comment date in Label
                text: this.oController.getCurrentDate(),
            }).addStyleClass('DateAlign');
            var oDistributorAddCommentLayout = new mc.ccp.control.McHorizontalLayout({ // Placing both Label in horizontal Layout
                height: "25px",
                width: "100%",
                ptop: "5px",
                widths: ["25%", "60%", "15%"],
                content: [oDistributorAddUser, new sap.ui.core.HTML(), oDistributorAddDate]
            });
            sap.ui.getCore().byId(this.createId("idDialog")).addContent(oDistributorAddCommentLayout);
            var oDistributorAddArea = new sap.ui.commons.TextArea(this.createId("idAddComment"), { // Text area for adding comment
                width: '520px',
                height: '100px',
            });
            sap.ui.getCore().byId(this.createId("idDialog")).addContent(oDistributorAddArea);
        } else if (clickedStatus === MCAPP.getText('EDIT_TEXT', this)) { // Code for clicked object "Edit"
            var sDistributorEditUser = MCAPP.getDistributorName();
            var sDistributorEditComment = oData.Dist_Comment_Text;
            var oDistributorEditCommentDate = oData.Dist_Comment_Date;
            if (sDistributorEditComment) {
                var oDistributorEditUser = new sap.ui.commons.Label({ // Distributor info in Label
                    text: sDistributorEditUser
                });
                var oDistributorEditDate = new sap.ui.commons.Label({ // Distributor comment date in Label
                    text: oDistributorEditCommentDate,
                }).addStyleClass('DateAlign');
                var oDistributorEditCommentLayout = new mc.ccp.control.McHorizontalLayout({ // Placing both Label in horizontal Layout
                    height: "25px",
                    width: "100%",
                    ptop: "5px",
                    widths: ["25%", "60%", "15%"],
                    content: [oDistributorEditUser, new sap.ui.core.HTML(), oDistributorEditDate]
                });
                sap.ui.getCore().byId(this.createId("idDialog")).addContent(oDistributorEditCommentLayout);
                var oDistributorEditArea = new sap.ui.commons.TextArea({ // Text Area for editing the comment
                    width: '520px',
                    height: '100px',
                    value: sDistributorEditComment,
                });
                sap.ui.getCore().byId(this.createId("idDialog")).addContent(oDistributorEditArea);
            }
        }
        return oVerticalLayout;
    },
 });