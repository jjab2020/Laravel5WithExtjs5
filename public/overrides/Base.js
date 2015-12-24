/**
 * Created by root on 17/12/15.
 */
Ext.define('Ext.override.grid.filters.filter.Base', {
    override: 'Ext.grid.filters.filter.Base',
    createFilter: function(config, key) {
        var me = this,
            filter = me.callParent(arguments),
            type = me.getInitialConfig('type');
        filter.type = type;
        return filter;
    }
});
Ext.define('Ext.override.util.Filter', {
    override: 'Ext.util.Filter',
    getState: function() {
        var me = this,
            state = this.callParent(arguments);
        if (me.type) {
            state.type = me.type;
        }
        return state;
    }
});