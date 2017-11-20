/***
 * @Author DU09
 * @Date 10/13/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is Change Request Comment View controller.
 */
sap.ui.controller("mc.ccp.changereq.ChangeRequestComment", {
    /**
     * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
     * (NOT before the first rendering! onInit() is used for that one!).
     * @memberOf changeReq.ChangeRequestComment
     */
    	onBeforeRendering: function() {
    		crCommentViewFlag = false;
    		MCAPP.setDirtyFlag(false);
    	},
	
    /**
     * used to close the dialog box
     * @param oEvent
     * @memberOf changeReq.ChangeRequestComment
     */
	onPressCancelComment: function(oEvent) {
		if(crCommentViewFlag === true){
			MCAPP.clearDirtyFlag();
		}
		oEvent.getSource().getParent().close();
    },
    
    /**
     * Called when user clicks on save button after adding/editing any comment.
     * @param oEvent
     * @memberOf changeReq.ChangeRequestComment
     */
    onPressSaveComment: function(oEvent) {
    	var comment = this.byId("idDialog").getContent()[1].getProperty("value").trim();
        if (comment !== "") {
        	if(MCAPP.getDirtyFlag() === false){
        		crCommentViewFlag = true;
        		MCAPP.setDirtyFlag(true);
        	}
        	var index = (this.getView().getViewData()[1].sPath).split("/")[2];
            this.getView().getViewData()[2].getProperty(this.getView().getViewData()[1].sPath).Dist_Comment_Text = comment;
            this.getView().getViewData()[2].getProperty(this.getView().getViewData()[1].sPath).Dist_Comment_Date = this.getCurrentDate();
            this.getView().getViewData()[2].getProperty(this.getView().getViewData()[1].sPath).Dist_Comment_User = MCAPP.getDistributorName(); 
            this.getView().getViewData()[2].getProperty(this.getView().getViewData()[1].sPath).dirtyState= MCAPP.getCurrentView().getController()._getDirtyStateFlag(index);
            this.getView().getViewData()[2].refresh(true);
            oEvent.getSource().getParent().close();
        } else if (comment === "") {
            sap.ui.commons.MessageBox.show(MCAPP.getText('VW_CR_COMMENT_SAVE_ERR', this), sap.ui.commons.MessageBox.Icon.ERROR, MCAPP.getText('GBL_ERROR', this), [sap.ui.commons.MessageBox.Action.OK], function(action) {
                if (action == MCAPP.getText('GBL_OK')) {
                }
            });
        }
    },
    
    /**
     * method to create the dialog for viewing the comment
     * @param oData
     * @param commentArray
     * @param viewArray
     */
    _createViewCRCommentDialog: function(oData, commentArray, viewArray) {
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
            title: MCAPP.getText('COMMENT_TITLE', this) + ' ' + oData.SKU,
            buttons: [oOkButton],
            closed: function(oEvent) {
                this.destroy();
            }
        }).addStyleClass('McCcpCustomDialog');
        oViewCommentDialog.open();
        if (commentArray !== "") {
            oViewCommentDialog.addContent(commentArray[0]);
            oViewCommentDialog.addContent(commentArray[1]);
        } else if (viewArray !== "") {
            oViewCommentDialog.addContent(viewArray[0]);
            oViewCommentDialog.addContent(viewArray[1]);
        }
    },
    
    /** return date in mm/dd/yyyy format.
     * @memberOf changeReq.ChangeRequestComment
     */
    getCurrentDate : function(oController){
    	var today = new Date();
    	var month = "" + today.getMonth();
    	var currDate = "" + today.getDate();
    	if(month.length === 1){
    		month = "0" + month;	
    	}
    	if(currDate.length === 1){
    		currDate = "0" + currDate;	
    	}
    	var currentDate = month+"/"+currDate+"/"+today.getFullYear();
    	return currentDate;
    },
});