/**
 * Created by root on 21/12/15.
 */

/**
 * Search plugin for Ext.grid.GridPanel, Ext.grid.EditorGrid ver. 2.x or subclasses of them
 *
 * @author    Ing. Jozef Sakalos
 * @copyright (c) 2008, by Ing. Jozef Sakalos
 * @date      17. January 2008
 * @version   $Id: Ext.ux.grid.Search.js 220 2008-04-29 21:46:51Z jozo $
 *
 * @license Ext.ux.grid.Search is licensed under the terms of
 * the Open Source LGPL 3.0 license.  Commercial use is permitted to the extent
 * that the code/component(s) do NOT become part of another Open Source or Commercially
 * licensed development library or toolkit without explicit permission.
 *
 * License details: http://www.gnu.org/licenses/lgpl.html
 */

Ext.define('Ext.ux.grid.feature.Searching', {
    extend: 'Ext.grid.feature.Feature',
    alias: 'feature.searching',
    requires: ['Ext.form.field.Text', 'Ext.toolbar.Toolbar', 'Ext.menu.Menu'],
    /**
     * cfg {Boolean} autoFocus true to try to focus the input field on each store load (defaults to undefined)
     */

    /**
     * @cfg {String} searchText Text to display on menu button
     */
    searchText: 'Search',
    buttonTooltip: 'Fields to be included in search',
    fieldUi: 'default',
    hideSearchButton: true,
    checkboxLabel: 'Ignorar filtro',
    createCheckbox: false,
    /**
     * @cfg {String} searchTipText Text to display as input tooltip. Set to '' for no tooltip
     */
    searchTipText: 'Digite o texto para pesquisa e tecle ENTER',
    /**
     * @cfg {String} selectAllText Text to display on menu item that selects all fields
     */
    selectAllText: 'Buscar em todas',
    /**
     * @cfg {String} position Where to display the search controls. Valid values are top and bottom (defaults to bottom)
     * Corresponding toolbar has to exist at least with mimimum configuration tbar:[] for position:top or bbar:[]
     * for position bottom. Plugin does NOT create any toolbar.
     */
    position: 'top',
    /**
     * @cfg {String} iconCls Icon class for menu button (defaults to icon-magnifier)
     */
    iconCls: null,
    glyph: 'xf002@FontAwesome',
    /**
     * @cfg {String/Array} checkIndexes Which indexes to check by default. Can be either 'all' for all indexes
     * or array of dataIndex names, e.g. ['persFirstName', 'persLastName']
     */
    checkIndexes: 'all',
    /**
     * @cfg {Array} disableIndexes Array of index names to disable (not show in the menu), e.g. ['persTitle', 'persTitle2']
     */
    disableIndexes: [],
    /**
     * @cfg {String} dateFormat how to format date values. If undefined (the default)
     * date is formatted as configured in colummn model
     */
    dateFormat: undefined,
    /**
     * @cfg {Boolean} showSelectAll Select All item is shown in menu if true (defaults to true)
     */
    showSelectAll: true,
    /**
     * @cfg {String} menuStyle Valid values are 'checkbox' and 'radio'. If menuStyle is radio
     * then only one field can be searched at a time and selectAll is automatically switched off.
     */
    menuStyle: 'checkbox',
    /**
     * @cfg {Number} minChars minimum characters to type before the request is made. If undefined (the default)
     * the trigger field shows magnifier icon and you need to click it or press enter for search to start. If it
     * is defined and greater than 0 then maginfier is not shown and search starts after minChars are typed.
     */

    /**
     * @cfg {String} minCharsTipText Tooltip to display if minChars is > 0
     */
    minCharsTipText: 'Digite pelo menos {0} caracteres',
    /**
     * @cfg {String} mode Use 'remote' for remote stores or 'local' for local stores. If mode is local
     * no data requests are sent to server the grid's store is filtered instead (defaults to 'remote')
     */
    mode: 'remote',
    /**
     * @cfg {Array} readonlyIndexes Array of index names to disable (show in menu disabled), e.g. ['persTitle', 'persTitle2']
     */

    /**
     * @cfg {Number} width Width of input field in pixels (defaults to 100)
     */
    width: 230,
    /**
     * @cfg {Object} paramNames Params name map (defaults to {fields:'fields', query:'query'}
     */
    paramNames: {
        fields: 'fields',
        query: 'query'
    },
    /**
     * @cfg {String} shortcutKey Key to fucus the input field (defaults to r = Sea_r_ch). Empty string disables shortcut
     */
    shortcutKey: 'r',
    /**
     * @cfg {String} shortcutModifier Modifier for shortcutKey. Valid values: alt, ctrl, shift (defaults to alt)
     */
    shortcutModifier: 'alt',
    /**
     * @cfg {String} align 'left' or 'right' (defaults to 'left')
     */

    /**
     * @cfg {Number} minLength force user to type this many character before he can make a search
     */

    /**
     * @cfg {Ext.Panel/String} toolbarContainer Panel (or id of the panel) which contains toolbar we want to render
     * search controls to (defaults to this.grid, the grid this plugin is plugged-in into)
     */


    init: function(grid) {
        this.grid = grid;
        if (this.grid.rendered) {
            this.onRender();
        } else {
            this.grid.on('render', this.onRender, this);
        }
    },
    onRender: function() {
        var me = this;
        var panel = this.toolbarContainer || this.grid;
        var tb = 'bottom' === this.position ? panel.getDockedItems('toolbar[dock="bottom"]') : panel.getDockedItems('toolbar[dock="top"]');
        if (tb.length > 0) tb = tb[0];
        else {
            tb = Ext.create('Ext.toolbar.Toolbar', {
                dock: this.position
            });
            panel.addDocked(tb);
        }

        // add menu
        this.menu = Ext.create('Ext.menu.Menu');

        // handle position
        if ('right' === this.align) {
            tb.add('->');
        } else {
            if (0 < tb.items.getCount()) {
                //                tb.add('-');
            }
        }

        // add menu button
        tb.add({
            text: this.searchText,
            tooltip: this.buttonTooltip,
            hidden: this.hideSearchButton,
            menu: this.menu,
            iconCls: this.iconCls,
            glyph: this.glyph
        });

        this.field = Ext.create('Ext.form.field.Text', {
            width: this.width,
            value: this.value,
            emptyText: 'Search',
            ui: this.fieldUi,
            //            fieldStyle: 'border-top-left-radius:7px;input::-webkit-input-border-top-left-radius:7px;border-bottom-left-radius:7px;input::-webkit-input-border-bottom-left-radius:7px;',
            selectOnFocus: undefined === this.selectOnFocus ? true : this.selectOnFocus,
            triggers: {
                clear: {
                    cls: 'x-form-clear-trigger',
                    handler: Ext.bind(me.onTriggerClear, me)
                },
                search: {
                    cls: 'x-form-search-trigger',
                    handler: Ext.bind(me.onTriggerSearch, me)
                }
            },
            minLength: this.minLength
        });


        // install event handlers on input field
        this.field.on('render', function() {
            if (this.value) {
                this.onTriggerSearch();
            }

            var qtip = this.minChars ? Ext.String.format(this.minCharsTipText, this.minChars) : this.searchTipText;
            Ext.QuickTips.register({
                target: this.field.inputEl,
                text: qtip
            });

            if (this.minChars) {
                this.field.el.on({
                    scope: this,
                    buffer: 300,
                    keyup: this.onKeyUp
                });
            }

            // install key map
            var map = new Ext.KeyMap(this.field.el, [{
                key: Ext.event.Event.ENTER,
                scope: this,
                fn: this.onTriggerSearch
            }, {
                key: Ext.event.Event.ESC,
                scope: this,
                fn: this.onTriggerClear
            }]);
            map.stopEvent = true;
        }, this, {
            single: true
        });
        this.checkIgnorar = Ext.create('Ext.form.field.Checkbox', {
            itemId: 'checkIgnorar',
            boxLabel: this.checkboxLabel,
            listeners: {
                scope: this,
                change: function(f, newValue, oldValue) {}
            }
        });
        if (this.createCheckbox) {
            tb.add(this.checkIgnorar);

        }
        tb.add(this.field);
        // reconfigure
        this.reconfigure();

        // keyMap
        if (this.shortcutKey && this.shortcutModifier) {
            var shortcutEl = this.grid.getEl();
            var shortcutCfg = [{
                key: this.shortcutKey,
                scope: this,
                stopEvent: true,
                fn: function() {
                    this.field.focus();
                }
            }];
            shortcutCfg[0][this.shortcutModifier] = true;
            this.keymap = new Ext.KeyMap(shortcutEl, shortcutCfg);
        }

        if (true === this.autoFocus) {
            this.grid.getStore().on({
                scope: this,
                load: function() {
                    this.field.focus();
                }
            });
        }
        this.grid.getStore().on({
            scope: this,
            beforeload: function(st) {
                st.getProxy().setExtraParam('ignorarFiltro', this.checkIgnorar.getValue());
            }
        });

    }
    /**
     * field el keypup event handler. Triggers the search
     * @private
     */,
    onKeyUp: function() {
        var length = this.field.getValue().toString().length;
        //    if(0 === length || this.minChars <= length) {
        if (0 === length) {
            this.onTriggerSearch();
        }
    }
    /**
     * private Clear Trigger click handler
     */,
    onTriggerClear: function() {
        if (this.field.getValue()) {
            this.field.setValue('');
            this.field.focus();
            this.onTriggerSearch();
        }
    }
    /**
     * private Search Trigger click handler (executes the search, local or remote)
     */,
    onTriggerSearch: function() {
        if (!this.field.isValid()) {
            return;
        }

        var val = this.field.getValue(),
            store = this.grid.getStore(),
            proxy = store.getProxy();

        // grid's store filter
        if ('local' === this.mode) {
            store.clearFilter();
            if (val) {
                store.filterBy(function(r) {
                    var retval = false;
                    this.menu.items.each(function(item) {
                        if (!item.checked || retval) {
                            return;
                        }
                        var rv = r.get(item.dataIndex);
                        rv = rv instanceof Date ? Ext.Date.format(rv, this.dateFormat || r.fields.get(item.dataIndex).dateFormat) : rv;
                        var re = new RegExp(val, 'gi');
                        retval = re.test(rv);
                    }, this);
                    if (retval) {
                        return true;
                    }
                    return retval;
                }, this);
            } else {}
        }
        // ask server to filter records

        // your proxy must be a Server proxy
        else {
            // clear start (necessary if we have paging)
            if (store.lastOptions && store.lastOptions.params) {
                store.lastOptions.params[store.paramNames.start] = 0;
            }

            // get fields to search array
            var fields = [];
            this.menu.items.each(function(item) {
                if (item.checked && item.dataIndex) {
                    if (item.searchCfg) {
                        fields.push(item.searchCfg.table + '.' + item.searchCfg.column);
                    } else {
                        fields.push(item.dataIndex);
                    }
                }
            });
            // add fields and query to baseParams of store
            if (proxy.extraParams) {
                delete(proxy.extraParams[this.paramNames.fields]);
                delete(proxy.extraParams[this.paramNames.query]);
            }

            if (proxy.lastOptions && proxy.lastOptions.params) {
                delete(proxy.lastOptions.params[this.paramNames.fields]);
                delete(proxy.lastOptions.params[this.paramNames.query]);
            }
            if (fields.length) {
                proxy.setExtraParam(this.paramNames.fields, Ext.encode(fields));
                proxy.setExtraParam(this.paramNames.query, val);
            }
            store.loadPage(1);
        }

    }
    /**
     * @param {Boolean} true to disable search (TwinTriggerField), false to enable
     */,
    setDisabled: function() {
        this.field.setDisabled.apply(this.field, arguments);
    }
    /**
     * Enable search (TwinTriggerField)
     */,
    enable: function() {
        this.setDisabled(false);
    }
    /**
     * Enable search (TwinTriggerField)
     */,
    disable: function() {
        this.setDisabled(true);
    }
    /**
     * private (re)configures the plugin, creates menu items from column model
     */,
    reconfigure: function() {

        var menu = this.menu;
        menu.removeAll();

        if (this.showSelectAll && 'radio' !== this.menuStyle) {
            menu.add({
                xtype: 'menucheckitem',
                text: this.selectAllText,
                checked: !(this.checkIndexes instanceof Array),
                hideOnClick: false,
                handler: function(item) {
                    var checked = item.checked;
                    item.parentMenu.items.each(function(i) {
                        if (item !== i && i.setChecked && !i.disabled) {
                            i.setChecked(checked);
                        }
                    });
                }
            }, '-');
        }

        var columns = this.grid.headerCt.items.items;
        var group = undefined;
        if ('radio' === this.menuStyle) {
            group = 'g' + (new Date).getTime();
        }

        Ext.each(columns, function(column) {
            var disable = false;
            if (column.text && column.dataIndex && column.dataIndex != '') {
                Ext.each(this.disableIndexes, function(item) {
                    disable = disable ? disable : item === column.dataIndex;
                });
                if (!disable) {
                    menu.add({
                        xtype: 'menucheckitem',
                        text: column.text,
                        hideOnClick: false,
                        group: group,
                        checked: 'all' === this.checkIndexes,
                        searchCfg: column.searchCfg,
                        dataIndex: column.dataIndex
                    });
                }
            }
        }, this);
        if (this.checkIndexes instanceof Array) {
            Ext.each(this.checkIndexes, function(di) {
                var item = menu.items.find(function(itm) {
                    return itm.dataIndex === di;
                });
                if (item) {
                    item.setChecked(true, true);
                }
            }, this);
        }
        if (this.readonlyIndexes instanceof Array) {
            Ext.each(this.readonlyIndexes, function(di) {
                var item = menu.items.find(function(itm) {
                    return itm.dataIndex === di;
                });
                if (item) {
                    item.disable();
                }
            }, this);
        }

    }

});
