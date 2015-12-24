Ext.define('AddressBook.model.Contact', {
	extend : 'AddressBook.model.Base',
	// extend : 'Ext.data.Model',

	fields : [{
		name : 'contact_id',
		type : 'auto'
	}, {
		name : 'first_name'
	}, {
		name : 'last_name'
	}, {
		name : 'full_name',
		convert : function(v, record) {
			return record.get('first_name') + " " + record.get('last_name');
		},
		depends : ['last_name', 'first_name']
	}, {
		name : 'dob',
		type : 'date',
		dateFormat : 'Y-m-d'
	}],

	idProperty : 'id',
	
	proxy : {
		type : 'rest',
		url : 'contacts',
		writer : {
			type : 'json',
			rootProperty : 'data',
			totalProperty:'total',
			encode : true,
			writeAllFields : false
		},

		reader : {
			type : 'json',
			rootProperty : 'data',
			totalProperty:'total',
			successProperty : 'success'
		}
	}
});

