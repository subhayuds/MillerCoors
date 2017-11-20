 /*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2013 SAP AG. All rights reserved
 */
//jQuery.sap.declare('sap.ui.commons.ComboBoxRenderer');
jQuery.sap.require('sap.ui.core.Renderer');
jQuery.sap.require('mc.ccp.control.McComboTextFieldRenderer');

mc.ccp.control.McComboBoxRenderer = sap.ui.core.Renderer.extend(mc.ccp.control.McComboTextFieldRenderer);
mc.ccp.control.McComboBoxRenderer.renderOuterAttributes = function(r, c) {
    r.addClass('sapUiTfCombo');
    this.renderComboARIAInfo(r, c);
};
mc.ccp.control.McComboBoxRenderer.renderOuterContentBefore = function(r, c) {
    this.renderExpander(r, c);
    this.renderSelectBox(r, c, '-1');
};
mc.ccp.control.McComboBoxRenderer.renderExpander = function(r, c) {
    r.write('<div  ');
    r.writeAttributeEscaped('id', c.getId() + '-icon');
    r.writeAttribute('unselectable', 'on');
    if (sap.ui.getCore().getConfiguration().getAccessibility()) {
        r.writeAttribute('role', 'presentation');
    }
    r.addClass('sapUiTfComboIcon McComboBox-style1');
    r.writeClasses();
    r.write('>&#9660;</div>');
};
mc.ccp.control.McComboBoxRenderer.renderSelectBox = function(r, c, t) {
    if (c.mobile) {
        r.write('<select');
        r.writeAttributeEscaped('id', c.getId() + '-select');
        r.writeAttribute('tabindex', t);
        if (!c.getEnabled() || !c.getEditable()) {
            r.writeAttribute('disabled', 'disabled');
        }
        r.write('>');
        for (var i = 0; i < c.getItems().length; i++) {
            var I = c.getItems()[i];
            r.write('<option');
            r.writeAttributeEscaped('id', c.getId() + '-' + I.getId());
            if (!I.getEnabled()) {
                r.writeAttribute('disabled', 'disabled');
            }
            r.write('>' + I.getText() + '</option>');
        }
        r.write('</select>');
    }
};
mc.ccp.control.McComboBoxRenderer.renderInnerAttributes = function(r, c) {
    if (c.mobile) {
        r.writeAttribute('autocapitalize', 'off');
        r.writeAttribute('autocorrect', 'off');
    }
};
mc.ccp.control.McComboBoxRenderer.renderComboARIAInfo = function(r, c) {
    var l = c.getListBox();
    if (!l && c._oListBox) {
        l = c._oListBox.getId();
    }
    var p = {role: 'combobox',owns: c.getId() + '-input ' + l};
    if (!c.getEnabled()) {
        p['disabled'] = true;
    }
    r.writeAccessibilityState(null, p);
};
mc.ccp.control.McComboBoxRenderer.renderARIAInfo = function(r, c) {
    var p = -1;
    if (c.getSelectedItemId()) {
        for (var i = 0; i < c.getItems().length; i++) {
            var I = c.getItems()[i];
            if (I.getId() == c.getSelectedItemId()) {
                p = i + 1;
                break;
            }
        }
    }
    var P = {autocomplete: 'inline',live: 'polite',setsize: c.getItems().length,posinset: (p >= 0) ? p : undefined};
    if (c.getValueState() == sap.ui.core.ValueState.Error) {
        P['invalid'] = true;
    }
    r.writeAccessibilityState(c, P);
};

