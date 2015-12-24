Ext.define('AddressBook.view.PhoneField', {
	extend : 'Ext.form.field.Text',

	alias : 'widget.phonefield',

	enableKeyEvents : true,
	listeners : {
		focus : function(field) {
			field.setValue(field.getValue().replace(/\D/g, ''));
		},
		blur : function(field) {
			var value = field.getValue();
			if (value.length == 0) {
				return;
			}
			if (value.length != 10) {
				field.markInvalid('Invalid phone number');
				return;
			}
			field.setValue(value.replace(/^(\d{3})(\d{3})(\d{4})$/, '($1) $2-$3'));
		},
		keyup : function(field, e) {
			return field.setValue(field.value.replace(/\D/g, ''));
		}
	}
}); 