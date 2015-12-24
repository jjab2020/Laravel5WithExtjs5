Ext.define("AddressBook.view.ContactGrid", {
    extend: "Ext.grid.Panel",
    alias: 'widget.contactgrid',
    controller: 'main',

    config: {
        currentContact: null
    },

    publishes: ['currentContact'],

    bind: {
        store: '{contacts}',
        currentContact: '{currentContact}'
    },
    /*features: [{
        ftype: 'searching'

    }]*/
    plugins: [Ext.create('AddressBook.view.GridFilters')],
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',

        items: [{
         text: 'Show Filters...',
         tooltip: 'Show filter data for the store',
         handler: 'onShowFilters'
         }, {
         text: 'Clear Filters',
         glyph:AddressBook.util.Glyphs.getGlyph('clearFilter'),
         tooltip: 'Clear all filters',
         handler: 'onClearFilters'
         },/*{
         xtype: 'textfield',
         name: 'search',
         fieldLabel: 'Search',
         enableKeyEvents: true,
         listeners: {
         keyup: 'onSearchKeyUp'
         }
         },*/ {
            xtype: 'button',
            text: 'Add New',
            handler: 'onAddNewClick'
        }]
    }, /*{
        xtype: 'pagingtoolbar',
        dock: 'bottom',
        bind: {
            store: '{contacts}'
        },
        pageSize: 5,
        displayInfo: true,
        displayMsg: 'Displaying contacts {0} - {1} of {2}',
        emptyMsg: "No contacts to display"
    }*/, {
     xtype: 'PageResizer'
     }],
    columns: [{
        text: 'Name',
        dataIndex: 'first_name',
        flex: 1,
         filter: {
         type: 'string',
         itemDefaults: {
         emptyText: 'Search for...'
         }
         }
    }, {
        xtype: 'actionbuttoncolumn',
        width: 100,

        buttonConfig: {
            //text: 'Actions',
            glyph: AddressBook.util.Glyphs.getGlyph('action'),
            width: 60,
            tooltip: 'Options',
            ui: 'default-toolbar'
        },
        //Build your own menu items based on record
        getMenuItems: function (record) {
            var items = [];
            var action = '';
            //Free way to build menu items
            var element = {}, data = [];
            items.push({
                text: 'Pdf',
                glyph: AddressBook.util.Glyphs.getGlyph('pdf'),
                handler: function (item) {
                    /*data = []
                     action='print';
                     element.id = record.data.id;
                     element.action = action;
                     data.push(element);*/
                    var mainPanel = this.up('grid').up('app-main').lookupReference('mainTabPanel');
                    var newTab = mainPanel.add({
                        xtype: 'panel',
                        closable: true,
                        title: 'contact PDF',
                        layout: 'fit',
                        html: 'loading PDF...',
                        items: [{
                            xtype: 'uxiframe',
                            src: 'contacts/activate/' + record.data.id + '/' + 'print'
                        }]
                    });

                    mainPanel.setActiveTab(newTab);
                }
            });
            items.push({
                text: 'Excel',
                glyph: AddressBook.util.Glyphs.getGlyph('excel'),
                handler: function (item) {
                    /*Ext.Ajax.request({
                     url: 'contacts/activate/' + record.data.id + '/' + 'Excel',
                     method: 'GET',
                     success: function (response) {
                     var res = Ext.decode(response.responseText);
                     /!*
                     * After decoding the response set the data in the viewModel. We change disabled, readOnly and html
                     * and update the password_token value to the response token
                     * *!/

                     }})*/
                    window.open('contacts/activate/' + record.data.id + '/' + 'excel');

                }
            })

            return items;
        }
    }],
    listeners: {
        select: 'onContactSelect'
    }
});
