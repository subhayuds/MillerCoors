/***
 * @Author EA45
 * @Date 10/07/2014
 * @Version 1.0
 */
sap.ui.controller("mc.ccp.header.ShipTo", {
    /**
     * Called when a controller is instantiated and its View controls (if
     * available) are already created. Can be used to modify the View before it
     * is displayed, to bind event handlers and do other one-time
     * initialization.
     * Get the globally saved shipto data based on that create a model and assign it to current view
     * @memberOf shipto.ShipTo
     */
    onInit: function() {
        var data = MCAPP.getShipTos();
        var oModel = new sap.ui.model.json.JSONModel();
        oModel.setData(data);
        this.getView().setModel(oModel);
    },
    
    /**
     * Called when the View has been rendered (so its HTML is part of the
     * document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     *Calculate number of selected Shiptos and update the label and also update the
     *number of rows in table
     * @memberOf shipto.ShipTo
     */
    onAfterRendering: function() {
        var shipTodetails = MCAPP.getShipTos();
        var n = 0,
            i = 0;
        for (i = 0; i < shipTodetails.length; i++) {
            if (shipTodetails[i].selectFlagBkup === true) {
                n++;
            }
        }
        //Set the Header text
        this.byId('topLabelId').setText(n + ' ' + MCAPP.getText('GBL_OF', this) + ' ' + shipTodetails.length + ' ' + MCAPP.getText('ST_SELECTED', this));
        // set the no of records shown in the table
        this.byId('Shiptotable').setVisibleRowCount(shipTodetails.length);

        //Set the Top CheckBox, as per row checkboxes
        var oTable = this.byId('Shiptotable');
        var flag = false;
        var oRows = oTable.getRows();
        var topCheck = this.byId('topCheckId');
        for (i = 0; i < shipTodetails.length; i++) {
            var oCells = oRows[i].getCells();
            if (oCells[0].getChecked() === false) {
                flag = true;
                break;
            }
        }
        if (!flag) {
            topCheck.setChecked(true);
        } else {
            topCheck.setChecked(false);
        }

    },
    
    /***
     * This method selects or deselects column label level check box
     * @param oEvent
     * @memberOf shipto.ShipTo
     */
    selectAll: function(oEvent) {
    	var oTable = this.byId('Shiptotable');
        var oRows = oTable.getRows();
        var oCells;
        var noOfShipTo = oRows.length;
        var selected = 0;        
        for (var i = 0; i < oRows.length; i++) {        	
        	oCells = oRows[i].getCells();        	
        	oCells[0].setChecked(oEvent.getParameter('checked'));            
        }
        if (oEvent.getParameter('checked') === true) {
        	selected = noOfShipTo;
        	this.getView().getParent().getAggregation("buttons")[1].setEnabled(true);
        }else{
        	this.getView().getParent().getAggregation("buttons")[1].setEnabled(false);
        }
        
        this.byId('topLabelId').setText(selected + ' ' + MCAPP.getText('GBL_OF', this) + ' ' + noOfShipTo + ' ' + MCAPP.getText('ST_SELECTED', this));
        
    },
    
    /***
     * This method is called when the individual checkbox is selected.
     * @param oEvent
     * @memberOf shipto.ShipTo
     */
    select: function(oEvent) {
        var topCheck = this.byId('topCheckId');
        var oRows, oCells, oTable, i = 0, selected = 0, noOfShipTo = 0;
        if (oEvent.getParameter('checked') === false) {
            topCheck.setChecked(false);
        } else {
            oTable = this.byId('Shiptotable');
            var flag = false;
            oRows = oTable.getRows();
            for (i = 0; i < oRows.length; i++) {
                oCells = oRows[i].getCells();
                if (oCells[0].getChecked() === false) {
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                topCheck.setChecked(true);
            }
        }
        
        oTable = this.byId('Shiptotable');
        oRows = oTable.getRows();
        noOfShipTo = oRows.length;
        for (i = 0; i < oRows.length; i++) {
        	oCells = oRows[i].getCells();
        	if (oCells[0].getChecked() === true) {
        		selected++;
            }
        }
        if(selected > 0){
        	this.getView().getParent().getAggregation("buttons")[1].setEnabled(true);
        }else{
        	this.getView().getParent().getAggregation("buttons")[1].setEnabled(false);
        }
        //Set the Header text
        this.byId('topLabelId').setText(selected + ' ' + MCAPP.getText('GBL_OF', this) + ' ' + noOfShipTo + ' ' + MCAPP.getText('ST_SELECTED', this));
    },
    
    /***
     * This method is called when the cancel button is clicked
     * revert the changes from the backup and close the dialog
     * @param oEvent
     * @memberOf shipto.ShipTo
     */
    onPressCancel: function(oEvent) {
        var data = this.getView().getModel().getData();
        var that = this;
        var thatController = this.getView().getController();
        var i = 0;
        //Check if any record is changed
        var changedFlag = false;
        var shiptodata;
        for (i = 0; i < data.length; i++) {
            if (data[i].selectFlag !== data[i].selectFlagBkup) {
                changedFlag = true;
                break;
            }
        }

        for (i = 0; i < data.length; i++) {
            data[i].selectFlag = data[i].selectFlagBkup;
        }
        if (oEvent.getId() === "closeClicked") {
            //Cross X is clicked
            oEvent.getSource().close();
            oEvent.getSource().destroy();
        } else {
            oEvent.getSource().getParent().close();
            oEvent.getSource().getParent().destroy();
        }
        
//        if (changedFlag === true) {
//            sap.ui.commons.MessageBox.confirm(MCAPP.getText('ST_SAVE_MESSAGE', this), function(bResult) {
//                if (bResult) {
//                    //Save the Ship Tos
//                    shiptodata = that.getView().getModel().getData();
//                    MCAPP.setShipTos(shiptodata);
//                    var n = 0;
//                    for (i = 0; i < shiptodata.length; i++) {
//                        shiptodata[i].selectFlagBkup = shiptodata[i].selectFlag;
//                        if (shiptodata[i].selectFlag === true) {
//                            n++;
//                        }
//                    }
//                    MCAPP.getHeaderView().oController.byId('shiptolink').setText(n + ' ' + MCAPP.getText('GBL_OF', this) + ' ' + shiptodata.length);
//
//                    thatController.getView().getParent().close();
//                    thatController.getView().getParent().destroy();
//                }
//                else{
////                	alert("test");
//                	n = 0;
//                	shiptodata = that.getView().getModel().getData();
//                    for (i = 0; i < shiptodata.length; i++) {
//                        shiptodata[i].selectFlag = shiptodata[i].selectFlagBkup;
//                        if (shiptodata[i].selectFlag === true) {
//                            n++;
//                        }
//                    }
//                    MCAPP.setShipTos(shiptodata);
//                    
//                    var oTable = that.getView().getController().byId('Shiptotable');
//                    var oRows = oTable.getRows();
//                    var oCells;
//                    var noOfShipTo = oRows.length;
//                    for (i = 0; i < shiptodata.length; i++) {
//                		oCells = oRows[i].getCells();
//                		oCells[0].setChecked(shiptodata[i].selectFlag);                    	
//                    }
//                    //Set Top Check
//                    if(n === noOfShipTo)
//                    	that.getView().getController().byId('topCheckId').setChecked(true);
//                    else
//                    	that.getView().getController().byId('topCheckId').setChecked(false);
//                    
//                    //Set the Header text
//                    that.getView().getController().byId('topLabelId').setText(n + ' ' + MCAPP.getText('GBL_OF', this) + ' ' + noOfShipTo + ' ' + MCAPP.getText('ST_SELECTED', this));
//                    
//                }
//            }, MCAPP.getText('GBL_CONFIRM', this));
//        } else {
//            for (i = 0; i < data.length; i++) {
//                data[i].selectFlag = data[i].selectFlagBkup;
//            }
//            if (oEvent.getId() === "closeClicked") {
//                //Cross X is clicked
//                oEvent.getSource().close();
//                oEvent.getSource().destroy();
//            } else {
//                oEvent.getSource().getParent().close();
//                oEvent.getSource().getParent().destroy();
//            }
//        }
    },
    
    /***
     * This method is called when save button is clicked.
     * Update the Label and close the dialog, reload the currently loaded view
     * @param oEvent
     * @memberOf shipto.ShipTo
     */
    onPressSave: function(oEvent) {
        var shiptodata = this.getView().getModel().getData();
        MCAPP.setShipTos(shiptodata);
        var n = 0;
        for (var i = 0; i < shiptodata.length; i++) {
            shiptodata[i].selectFlagBkup = shiptodata[i].selectFlag;
            if (shiptodata[i].selectFlag === true) {
                n++;
            }
        }
        MCAPP.getHeaderView().oController.byId('shiptolink').setText(n + ' ' + MCAPP.getText('GBL_OF', this) + ' ' + shiptodata.length);
        oEvent.getSource().getParent().close();
        oEvent.getSource().getParent().destroy();
        MCAPP.refreshCurrentView();
    },
    
	/***
	 * Event Handler for Sort Option
	 * @param evt
	 */
	onSortColumn: function(evt) {
			var oData = this.getView().getModel().getData();
			$.each(oData, function(i, item) {
				item.ShipToId = parseInt(item.ShipToId);
			});
			var oTable = this.byId('Shiptotable');
			oTable.rerender();
	},
	
	/**
	 * Called when user tries to filter the records in the CR preview table
	 * @memberOf changereq.ChangeRequestPreview
	 * @Param evt
	 */
	onFilterColumn: function(evt) {
			var oData = this.getView().getModel().getData();
			var filterValue = evt.getParameter('value').trim();
			oFilterValue = filterValue;
			var oTable = this.byId('Shiptotable');
			var column = this._getJsonColumn(evt.getParameter('column').sId.split("--")[1]);
			var oparator = sap.ui.model.FilterOperator.Contains;
			if (column == 'ShipToId') {
				oparator = sap.ui.model.FilterOperator.EQ;
			}
			var oTableFilters = oTable.mBindingInfos.rows.filters;
			var collect = [];
			if (oTableFilters !== undefined) {
				var filters = oTableFilters;
				for (var i = 0; i < filters.length; i++) {
					if (filters[i].sPath != evt.getParameter('column').getFilterProperty()) {
						collect.push(filters[i]);
					}
				}
				if (filterValue !== '') {
					var newFilter = new sap.ui.model.Filter(column, oparator, filterValue);
					collect.push(newFilter);
				}
				oTable.bindRows({
					path: "/",
					filters: collect
				});
			}
			else {
				if (filterValue !== '') {
					oTable.bindRows({
						path: "/",
						filters: [new sap.ui.model.Filter(column, oparator, filterValue)]
					});
				}
			}
			$.each(oData, function(i, item) {
				item.ShipToId = "" + item.ShipToId;
				
			});
			oTable.rerender();
	},
	
	/**
	 *  method to retrive json properties based on column name
	 * @param col
	 * @returns {String}
	 */
	_getJsonColumn: function(col) {
		var result = '';
		switch (col) {
		case 'ShipTo' :
			result = 'ShipToId';
			break;
		case 'ShipToName':
			result = 'ShipToName';
			break;
		case 'City':
			result = 'City';
			break;
		case 'State':
			result = 'State';
			break;
		}
		return result;
	}
});