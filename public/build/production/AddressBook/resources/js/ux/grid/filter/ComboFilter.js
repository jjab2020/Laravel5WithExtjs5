/**
 * List filters are able to be preloaded/backed by an Ext.data.Store to load
 * their options the first time they are shown.
 *
 * List filters are also able to create their own list of values from  all unique values of
 * the specified {@link #dataIndex} field in the store at first time of filter invocation.
 *
 * Example Usage:
 *
 *     var filters = Ext.create('Ext.grid.Panel', {
 *         ...
 *         columns: [{
 *             text: 'Size',
 *             dataIndex: 'size',
 *
 *             filter: {
 *                 type: 'list',
 *                 // options will be used as data to implicitly creates an ArrayStore
 *                 options: ['extra small', 'small', 'medium', 'large', 'extra large']
 *             }
 *         }],
 *         ...
 *     });
 */
Ext.define('Ext.ux.grid.filter.ComboFilter', {
    extend: 'Ext.grid.filters.filter.SingleFilter',
    alias: 'grid.filter.combofilter',
    type: 'combofilter',
    operator: 'in',
    /**
     * @cfg {String} emptyText
     * The empty text to show for each field.
     */
    emptyText: 'Enter Filter Text...',
    itemDefaults: {
        multiSelect: true,
        editable: true,
        hideEmptyLabel: false,
        valueField: 'id',
        displayField: 'name',
        queryMode: 'local',
        iconCls: Ext.baseCSSPrefix + 'grid-filters-find',
        labelSeparator: '',
        labelWidth: 29,
        filterPickList: true
    },
    menuDefaults: {
        // A menu with only form fields needs some body padding. Normally this padding
        // is managed by the items, but we have no normal menu items.
        bodyPadding: 3,
        showSeparator: false
    },
    /**
     * @private
     * Template method that is to initialize the filter and install required menu items.
     */
    createMenu: function (oStore) {
        var me = this,
                config;
        me.callParent();
        var config = Ext.apply({}, me.itemDefaults);
        //config = Ext.apply(config, me);
        Ext.applyIf(config, {
            enableKeyEvents: true,
            iconCls: Ext.baseCSSPrefix + 'grid-filters-find',
            hideLabel: true,
            width: 200,
            grow: true
        });
        var inputItem = Ext.create('Ext.form.field.Tag', config);
        var oStore = Ext.create('GeciApp.store.gridconfig.listRecordsFilterStore');

        oStore.proxy.setExtraParam('champ', me.champ);

        oStore.proxy.setExtraParam('sTable', me.table);
        var aFiltre = GeciApp.Current.getFilters(this.grid.columns, this.dataIndex);
        oStore.proxy.setExtraParam('filter', Ext.encode(aFiltre));
        if (this.grid.up('form').query('#intervenant_task')[0]) {
            oStore.proxy.setExtraParam('res', Ext.encode(this.grid.up('form').query('#intervenant_task')[0].getValue()));
        }
        if (this.grid.up('form').query('#intervenant_dafi')[0]) {
            oStore.proxy.setExtraParam('interv', Ext.encode(this.grid.up('form').query('#intervenant_dafi')[0].getValue()));
        }
        if (typeof me.iType !== "undefined") {
            oStore.proxy.setExtraParam('iType', me.iType);
        }
        if (Ext.ComponentQuery.query('#filtreUser')[0].getValue() == 2 || Ext.ComponentQuery.query('#filtreUser')[0].getValue() == 3) {
            oStore.proxy.setExtraParam('fltr', Ext.ComponentQuery.query('#filtreUser')[0].getValue());
        }
        if (typeof me.refTable !== "undefined") {
            oStore.proxy.setExtraParam('sRefTable', me.refTable);
        }
        if (typeof me.refChamp !== "undefined") {
            oStore.proxy.setExtraParam('sRefChamp', me.refChamp);
        }
        if (typeof me.refIdChamp !== "undefined") {
            oStore.proxy.setExtraParam('sRefIdChamp', me.refIdChamp);
        }
        if (typeof me.mainTable !== "undefined") {
            oStore.proxy.setExtraParam('sMainTable', me.mainTable);
        }
        if (typeof me.mainIdTable !== "undefined") {
            oStore.proxy.setExtraParam('sMainIdTable', me.mainIdTable);
        }


        if (this.champ !== undefined) {
            this.dataIndex = this.champ;
        }

        inputItem.bindStore(oStore);
        inputItem.getStore().load();
        this.inputItem = inputItem;
        this.menu.add(this.inputItem);
        me.inputItem.on('change', this.enableFilter, this);
        //me.inputItem.on('change', this.onCheckChange, this);


    },
    enableFilter: function (oObj) {
        var me = this;
        if (oObj.getValue().length > 0) {
            if (oObj.up('menucheckitem')) {
                oObj.up('menucheckitem').enable();
            }
            this.filter._value = oObj.getValue();
        } else {
            if (oObj.up('menucheckitem')) {
                oObj.up('menucheckitem').disable();
            }
        }
        var is_same = (me.current !== undefined) && (me.current.length == me.inputItem.getValue().length) && me.current.every(function (element, index) {
            return element === me.inputItem.getValue()[index];
        });
        if (!is_same) {
            if (me.inputItem.up('menu').query('#appFilter')[0] !== undefined) {
                me.inputItem.up('menu').query('#appFilter')[0].enable();
            }
        } else {
            if (me.inputItem.up('menu').query('#appFilter')[0] !== undefined) {
                me.inputItem.up('menu').query('#appFilter')[0].disable();
            }
        }
    },
    onCheckChange: function (oObj) {
        var me = this;
        if (oObj.getValue().length > 0) {

            me.current = oObj.getValue();
            this.setValue(oObj.getValue());
        } else {

            me.current = oObj.getValue();
            this.setValue(null);
            this.setActive(false);

        }
        //

    },
    /**
     * @private
     * Handler method called when there is a keyup event on this.inputItem
     */
    onInputKeyUp: function (field, e) {
        if (e.getKey() === e.RETURN && field.isValid()) {
            this.menu.hide();
            return;
        }

        this.setValue(field.getValue());
    },
    /**
     * @private
     * Template method that is to set the value of the filter.
     * @param {Object} value The value to set the filter.
     */
    setValue: function (value) {
        var me = this;
        me.inputItem.store.load({
            callback: function (oRecords) {
                var aValues = [
                ];
                if (value) {
                    for (var ind = 0; ind < value.length; ind++) {

                        if (me.inputItem.store.findExact('id', value[ind]) > -1) {
                            aValues[aValues.length] = value[ind];
                        }
                    }
                }
                me.inputItem.setValue(aValues);

            }
        });
        me.filter.config.property = me.champ;

        me.filter.setValue(value);

        if (value && me.active) {
            me.updateStoreFilter(me.filter);
        } else {
            me.setActive(!!value);
        }
        Ext.defer(function () {
            if (me.inputItem.up('menu').up('menu') !== undefined) {
                me.inputItem.up('menu').up('menu').hide();
            }
        }, 100);
    },
    activateMenu: function () {
        this.inputItem.setValue(this.filter.getValue());
    },
    getValue: function () {
        return this.inputItem.getValue();
    }

});
