Ext.define('AddressBook.view.main.MainController', {
	extend : 'Ext.app.ViewController',

	requires : ['Ext.window.MessageBox'],

	alias : 'controller.main',

	onContactSelect : function(row, rec) {
		this.getView().setCurrentContact(rec);
		this.getView().up('app-main').lookupReference('mainTabPanel').lookupReference('contactForm').show();
	},

	onFormButtonClick : function(btn) {
		console.log('onFormButtonClick', arguments);
		var contact = this.getViewModel().get('currentContact'), action = btn.getItemId();
		if (contact && contact.isModel) {
			if (action == 'reject') {
				contact.reject();
			}
			if (action == 'save') {
				contact.store.sync();
				//TODO add callback
			}
		}
	},

	onAddNewClick : function(btn) {
		var grid = btn.up('grid'), rec = new grid.store.model;
		grid.store.insert(0, [rec]);
		grid.setCurrentContact(rec);
		grid.up('app-main').lookupReference('mainTabPanel').lookupReference('contactForm').show();
	},
	
	onSearchKeyUp : function(field) {
		var store = field.up('grid').store, searchValue = Ext.util.Format.lowercase(field.getValue());
		store.clearFilter();
		store.filterBy(function(rec,id) {
			var found = false;
			if (Ext.util.Format.lowercase(rec.get('last_name')).indexOf(searchValue) > -1) {
				found = true;
			}
			if (Ext.util.Format.lowercase(rec.get('first_name')).indexOf(searchValue) > -1) {
				found = true;
			}
			return found;
		});
	},

	onProfileImgClick : function() {
		console.log('img clicked', arguments);
		var win = Ext.create('Ext.window.Window', {
			title : 'Upload a Photo',
			width : 400,
			// height : 400,
			closable : true,
			items : [{
				xtype : 'form',
				// width : 400,
				bodyPadding : 10,
				// frame : true,
				items : [{
					xtype : 'filefield',
					name : 'photo',
					fieldLabel : 'Photo',
					labelWidth : 50,
					msgTarget : 'side',
					allowBlank : false,
					anchor : '100%',
					buttonText : 'Select Photo...'
				}],

				buttons : [{
					text : 'Upload',
					handler : this.onUploadBtnClick,
					scope : this
				}]
			}]
		});

		win.show();
	},
	
	onTnClick : function(view,rec) {
		view.up('app-main').down('grid').selModel.select(rec);
	},

	onUploadBtnClick : function(btn) {
		var form = btn.up('form').getForm();
		if (form.isValid()) {
			form.submit({
				params : {
					contact_id : this.getView().getCurrentContact().get('id')
				},
				url : 'photo',
				waitMsg : 'Uploading your photo...',
				success : this.onUploadSuccess,
				failure : this.onUploadFail,
				scope : this
			});
		}
	},

	onUploadSuccess : function(form, o) {
		console.log('onUploadSuccess', this,arguments);
		var rec = this.getView().getCurrentContact();
		rec.set({picturefile:o.result.filename});
		rec.store.sync();//TODO add callback
		Ext.Msg.alert('Success', 'Your photo has been uploaded.');
	},

	onUploadFail : function(form, o) {
		Ext.Msg.alert('Failure', 'Your photo failed to upload.');
	},

	onDeleteClick : function(btn) {
		Ext.Msg.confirm('Delete?','Are you sure you want to delete this contact?',function(answer) {
			if(answer == 'yes') {
				this.onDelete(btn);
			}
		},this);
	},
	
	onDelete : function(btn) {
		console.log('onDeleteClick', arguments);
		var rec = this.getViewModel().get('currentContact'), store = rec.store;
		rec.drop();
		store.sync();
		//TODO add callback
		btn.up('form').close();
	},
	
	onContactTabClose : function(form) {
		var contact = form.getCurrentContact();
		contact.phantom ? contact.drop() : contact.reject();
	},

	beforeTabClose : function(panel) {//Ext bug? Hiding and showing tabpanels doesn't hide show the tab in tabbar
		panel.up().setActiveTab(0);
		panel.tab.hide();
		panel.hide();
		return false;
	},

	onTabActivate : function(panel) {//Ext bug? Hiding and showing tabpanels doesn't hide show the tab in tabbar
		panel.tab.show();
	},
	onClearFilters:function(btn){
	var grid = btn.up('grid');
	grid.filters.clearFilters();

},	

	onShowFilters: function (btn) {
	var grid = btn.up('grid');
        var data = [];

        // The actual record filters are placed on the Store.
        grid.store.getFilters().each(function (filter) {
            data.push(filter.serialize());
        });

        // Pretty it up for presentation
        data = Ext.JSON.encodeValue(data, '\n').replace(/^[ ]+/gm, function (s) {
            for (var r = '', i = s.length; i--; ) {
                r += '&#160;';
            }
            return r;
        });
        data = data.replace(/\n/g, '<br>');

        Ext.Msg.alert('Filter Data', data);
    }
});
