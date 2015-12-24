Ext.define("AddressBook.view.ContactForm", {
	extend : "Ext.form.Panel",
	alias : "widget.contactform",

	requires : ['AddressBook.view.PhoneField'],

	controller : 'main',

	config : {
		currentContact : null
	},

	bind : {
		currentContact : '{currentContact}',
		title : '{currentContact.full_name}'
	},

	closeAction : 'hide',
	closable : true,
	defaultType : 'textfield',
	bodyPadding : '10',
	defaults : {
		anchor : '100%',
		selectOnFocus : true
	},

	buttons : [{
		xtype : 'button',
		text : 'Delete',
		handler : 'onDeleteClick',
		cls : 'del-btn',
		bind : {
			disabled : '{isPhantom}'
		}
	},'->',{
		text : 'Reject Changes',
		itemId : 'reject',
		bind : {
			disabled : '{!isDirtyAndValid}'
		},
		handler : 'onFormButtonClick'
	}, {
		text : 'Save Changes',
		itemId : 'save',
		bind : {
			disabled : '{!isDirtyAndValid}'
		},
		handler : 'onFormButtonClick'
	}],
	items : [{
		xtype : 'container',
		layout : {
			type : 'hbox',
			align : 'end'
		},
		items : [{
			xtype : 'image',
			reference : 'profileImage',
			cls : 'profile-pic',
			margin : '0 5 0 0',
			src : 'resources/images/userpics/blank.jpg',
			bind : {
				src : '{profilePicPath}'
			},
			listeners : {
				el : {
					click : 'onProfileImgClick'
				},
				afterrender : function(c) {
					Ext.create('Ext.tip.ToolTip', {
						target : c.getEl(),
						html : 'Click to upload an image'
					});
				}
			}
		}, {
			xtype : 'fieldcontainer',
			layout : {
				type : 'vbox',
				align : 'stretchmax'
			},
			items : [{
				xtype : 'textfield',
				fieldLabel : 'First Name',
				allowBlank : false,
				maxLength : 15,
				bind : {
					value : '{currentContact.first_name}'
				}
			}, {
				xtype : 'textfield',
				fieldLabel : 'Last Name',
				maxLength : 35,
				allowBlank : false,
				bind : {
					value : '{currentContact.last_name}'
				}
			}, {
				xtype : 'textfield',
				fieldLabel : 'Email',
				vtype : 'email',
				bind : {
					value : '{currentContact.email}'
				}
			}, {
				xtype : 'phonefield',
				fieldLabel : 'Home Phone',
				bind : {
					value : '{currentContact.home_phone}'
				}
			}, {
				xtype : 'phonefield',
				fieldLabel : 'Work Phone',
				bind : {
					value : '{currentContact.work_phone}'
				}
			}, {
				xtype : 'fieldcontainer',
				fieldLabel : 'Address',
				layout : 'vbox',
				defaults : {
					hideLabel : true,
					anchor : '100%' //TODO not working!
				},
				items : [{
					xtype : 'textfield',
					maxLength : 95,
					width : 250, //because anchor is not working
					margin : '0 0 5 0',
					bind : {
						value : '{currentContact.address1}'
					}
				}, {
					xtype : 'textfield',
					maxLength : 95,
					width : 250, //because anchor is not working
					bind : {
						value : '{currentContact.address2}'
					}
				}]
			}, {
				xtype : 'textfield',
				fieldLabel : 'City',
				maxLength : 40,
				bind : {
					value : '{currentContact.city}'
				}
			}, {
				xtype : 'fieldcontainer',
				layout : 'hbox',
				defaults : {
					flex : 1
				},
				items : [{
					xtype : 'combo',
					fieldLabel : 'State',
					displayField : 'name',
					valueField : 'abbreviation',
					forceSelection : true,
					bind : {
						store : '{states}',
						value : '{currentContact.state}'
					}
				}, {
					xtype : 'textfield',
					regex : /^\d{5}(?:[-\s]\d{4})?$/,
					fieldLabel : 'Zip',
					flex : 1,
					labelAlign : 'right',
					name : 'zip',
					bind : {
						value : '{currentContact.zip}'
					}
				}]
			}]
		}]
	}],
	listeners : {
		beforeclose : 'beforeTabClose',
		activate : 'onTabActivate'
	}
});
