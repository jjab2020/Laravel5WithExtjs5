Ext.define('AddressBook.model.Base', {
	extend : 'Ext.data.Model',
	// identifier : 'negative',
	idProperty : 'id',

	schema : {
		namespace : 'AddressBook.model',
		proxy : {
			//url : '{prefix}/{entityName:uncapitalize}',
			page : '',
			start : '',
			limit : ''
		}
	}
});