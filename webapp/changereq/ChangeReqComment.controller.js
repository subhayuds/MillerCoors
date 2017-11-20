sap.ui.controller("mc.ccp.changereq.ChangeReqComment", {
	/**
	 * used to close the dialog box
	 * @memberOf changeReq.ChangeReqComment
	 */
	close: function(oEvent) {
		oEvent.getSource().getParent().close();
	},

	/**
	 * Called when user clicks on save button after adding/editing any comment.
	 * @memberOf changeReq.ChangeReqComment
	 */
	saveForAddAndEditLink: function(oEvent) {
		var today = new Date();
		var month = today.getMonth() + 1;
		var systemDate = today.getFullYear() + month + today.getDate();
		this.getView().getViewData()[2].getProperty(this.getView().getViewData()[1].sPath).Dist_Comment_Text = this.byId("idDialog").getContent()[1].getProperty("value");
		this.getView().getViewData()[2].getProperty(this.getView().getViewData()[1].sPath).Dist_Comment_Date = systemDate;
		this.getView().getViewData()[2].getProperty(this.getView().getViewData()[1].sPath).Dist_Comment_Time = today.getMilliseconds();
		this.getView().getViewData()[2].getProperty(this.getView().getViewData()[1].sPath).Dist_Comment_User = "abc@xyz.com";// need to take it from global var
		this.getView().getViewData()[2].refresh(true);
		oEvent.getSource().getParent().close();
	},

});