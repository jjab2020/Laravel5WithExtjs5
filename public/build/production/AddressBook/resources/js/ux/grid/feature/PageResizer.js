/**
 * Created by root on 22/12/15.
 */
Ext.define('Ext.ux.grid.feature.PageResizer', {
    extend: 'Ext.toolbar.Paging',
    alias: 'widget.PageResizer',
    displayInfo: true,
    prependButtons: true,
    dock: 'bottom',
    initComponent: function () {
        var me = this;
        me.items = [{
            xtype: 'combobox',
            itemId:'comboPage',
            fieldLabel: 'Size',
            width: 120,
            editable: false,
            labelWidth: 60,
            store: ['5','10','15','25', '30','40','50','60','70','80','90','100','110'],
            listeners: {
                afterrender: function (combo, eOpts) {
                    //combo.setValue(combo.ownerCt.getStore().getPageSize());
                    combo.setValue('15');
                },
                select: function (combo, records, eOpts) {
                    var ownerCt = combo.ownerCt, store = ownerCt.getStore();
                    store.pageSize = combo.getValue();
                    store.currentPage = 1;
                    ownerCt.doRefresh();
                }
            }
        }];
        me.callParent();
        me.on('afterrender', function () {
            me.ownerCt.on('reconfigure', function () {
                me.bindStore(me.ownerCt.store || 'ext-empty-store', true);
            });

        });
    }
})