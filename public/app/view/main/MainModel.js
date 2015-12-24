/**
 * This class is the view model for the Main view of the application.
 */
Ext.define('AddressBook.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.main',

    data: {
        name: 'AddressBook',
        currentContact : null
    },
    formulas : {
    	isDirtyAndValid : {
    		bind : {
    			bindTo : '{currentContact}',
    			deep : true
    		},
    		get : function(contact) {
    			var status = {
    				dirty : contact ? contact.dirty : false,
    				valid : contact && contact.isModel ? contact.isValid() : false
    			};
    			return status.dirty && status.valid;
    		}
    	},
    	isPhantom : {
    		bind : {
    			bindTo : '{currentContact}',
    			deep : true
    		},
    		get : function(contact) {
    			if (contact && contact.isModel) {
    				return contact.phantom;
    			}
    			return false;
    		}
    	},
    	profilePicPath : {
    		bind : {
    			bindTo : '{currentContact.picturefile}',
    			deep : true
    		},
    		get : function(data) {
    			return data ? 'resources/images/userpics/' + data : 'resources/images/userpics/blank.jpg';
    		}
    	}
    },

   	stores : {
    	contacts : {
    		model : 'Contact',
    		autoLoad : true,
			remoteFilter:true,
			remoteSort: true,
			sorters:[
				{
					property:'first_name',
					direction:'ASC'
				}
			],
			totalProperty:'total',
			pageSize:15
    	},
    	contactsChained : {
    		source : '{contacts}'
    	},
    	states : {
    		model : 'State',
    		autoLoad : true
    	}
    }
});
