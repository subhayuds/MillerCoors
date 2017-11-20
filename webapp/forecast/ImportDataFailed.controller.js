/***
 * @Author so97
 * @Date 11/13/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is ImportData Failed controller
 */
sap.ui.controller("mc.ccp.forecast.ImportDataFailed", {
	/***
	 * Event Handler for Sort Option
	 * @param evt
	 */
	onSortColumn: function(evt) {
		if (MCAPP.getDirtyFlag()) {
			sap.ui.commons.MessageBox.alert(MCAPP.getText('GBL_SAVE_PROMP_SORT', this));
			evt.preventDefault();
			return;
		}
		else {
			var oData = this.getView().getModel().getData();
			$.each(oData.results, function(i, item) {
				if(item.zdsku !== ""){
					item.zdsku = parseInt(item.zdsku);
				}
				item.zshipto = parseInt(item.zshipto);
				item.zdist_fcst1 = parseInt(item.zdist_fcst1);
			});
			var oTable = this.byId('idFileUploadFailed');
			oTable.rerender();
		}
	},
	
	/**
	 * Called when user tries to filter the records in the CR preview table
	 * @memberOf changereq.ChangeRequestPreview
	 * @Param evt
	 */
	onFilterColumn: function(evt) {
		if (MCAPP.getDirtyFlag()) {
			sap.ui.commons.MessageBox.alert(MCAPP.getText('GBL_SAVE_PROMP_FILTER', this));
			evt.preventDefault();
			return;
		}
		else {
			var oData = this.getView().getModel().getData();
			var dataLength = "";
			var filterValue = evt.getParameter('value').trim();
			oFilterValue = filterValue;
			var oTable = this.byId('idFileUploadFailed');
			var column = this._getJsonColumn(evt.getParameter('column').sId.split("--")[1]);
			var oparator = sap.ui.model.FilterOperator.EQ;
			if (column == 'zsku_desc' || column == 'zsourceid'  || column =='zerror_msg') {
				oparator = sap.ui.model.FilterOperator.Contains;
			}
			if(column == 'zdsku' || column == 'zosku' || column == 'zshipto' || column == 'zdist_fcst1'){
				filterValue = this._convertFilterValue(column,filterValue);
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
					path: "/results",
					filters: collect
				});
			}
			else {
				if (filterValue !== '') {
					oTable.bindRows({
						path: "/results",
						filters: [new sap.ui.model.Filter(column, oparator, filterValue)]
					});
				}
			}
			$.each(oData.results, function(i, item) {
				item.zdsku = "" + item.zdsku;
				item.zosku = "" + item.zosku;
				item.zsourceid = "" + item.zsourceid;
				item.zshipto = "" + item.zshipto;
				item.zdist_fcst1 = "" + item.zdist_fcst1;
			});
			
			oTable.rerender();
			MCAPP.setBusy(false);
		}
	},
	/**
	 * Method to convert the filter value from String to Integer.
	 * @param column
	 * @param filterValue
	 * @returns {Integer}
	 */
	_convertFilterValue : function(column, filterValue){
		if(filterValue != ""){  
			filterValue = parseInt(filterValue);
		}
		return filterValue;
	},


	/**
	 * Method to retrive json properties based on column name.
	 * @param col
	 * @returns {String}
	 */
	_getJsonColumn: function(col) {
		var result = '';
		switch (col) {
		case 'idDistSKUCol':
			result = 'zdsku';
			break;
		case 'idSKUCol':
			result = 'zosku';
			break;
		case 'idSourceCol':
			result = 'zsourceid';
			break;
		case 'idShipToCol':
			result = 'zshipto';
			break;
		case 'idConfirmedCol':
			result = 'zdist_fcst1';
			break;
		case 'idDescCol':
			result = 'zsku_desc';
			break;
		case 'idErrorCol':
			result = 'zerror_msg';
			break;
		
		}
		return result;
	},

});