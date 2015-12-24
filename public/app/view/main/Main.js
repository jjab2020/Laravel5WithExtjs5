Ext.define('AddressBook.view.main.Main', {
	extend : 'Ext.container.Container',
	requires : ['AddressBook.view.*', 'AddressBook.model.*'],

	xtype : 'app-main',

	controller : 'main',
	viewModel : {
		type : 'main'
	},

	layout : {
		type : 'border'
	},

	items : [{
		xtype : 'contactgrid',
		title : 'Address Book',
		region : 'west',
		width : 450,
		split : true
	}, {
		region : 'center',
		xtype : 'tabpanel',
		reference : 'mainTabPanel',
		referenceHolder : true,
		autoScroll : true,
		activeTab : 0,
		items : [{
			xtype : 'dataview',
			title : 'Dashboard',
			emptyText : 'No Contacts to Display',
			bind : '{contactsChained}',
			overItemCls : 'contact-tn-over',
			trackOver : true,
			itemSelector : 'div.contact-tn',
			tpl: [
                '<tpl for=".">',
                    '<div class="contact-tn">',
                    	'<tpl if="picturefile" >',
                        	'<img src="resources/images/userpics/{picturefile}" />',
                        '</tpl>',
                    	'<tpl if="picturefile == null" >',
                        	'<img src="resources/images/userpics/blank.jpg" />',
                        '</tpl>',
                    '</div>',
                '</tpl>'
            ],
            listeners : {
            	itemclick : 'onTnClick'
            }
		},{
			xtype : 'contactform',
			reference : 'contactForm',
			hidden : true,
			listeners : {
				hide : 'onContactTabClose'
			}
		}]
	}]
});
