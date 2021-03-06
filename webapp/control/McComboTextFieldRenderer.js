
jQuery.sap.require('sap.ui.core.Renderer');
jQuery.sap.require('sap.ui.core.ValueStateSupport');
mc.ccp.control.McComboTextFieldRenderer = {};

mc.ccp.control.McComboTextFieldRenderer.render = function(R, t) {
    var a = R, r = mc.ccp.control.McComboTextFieldRenderer;
    if (!t.getVisible()) {
        return
    }
    var w = t.getWidth();
    var b = sap.ui.core.ValueStateSupport.enrichTooltip(t, t.getTooltip_AsString());
    var c = t._getRenderOuter();
    if (c) {
        a.write('<div height='+t.getHeight());
        a.writeControlData(t);
        a.addClass('sapUiTfBack');
        this.renderStyles(a, t);
        if (b) {
            a.writeAttributeEscaped('title', b)
        }
        var s;
        if (w && w != '') {
            s = 'width: ' + w + ';'
        }
        if (this.renderOuterAttributes) {
            this.renderOuterAttributes(a, t)
        }
        if (s) {
        	var mcS = 'height: ' + t.getHeight() + ';border-radius: 4px; border-width: 2px;' /////////////////////EMK
        	s = s + mcS ;                             /////////////////////EMK
            a.writeAttribute('style', s)
        }

        a.writeStyles();
        a.writeClasses();
        a.write('>');
        if (this.renderOuterContentBefore) {
            this.renderOuterContentBefore(a, t)
        }
    }
    if (this.getInnerTagName) {
        a.write('<' + this.getInnerTagName())
    } else {
    	a.write('<input readonly="readonly"')
    }
    a.addClass('sapUiTf McComboBox-style2');
    if (!c) {
        a.writeControlData(t);
        a.addClass('sapUiTfBack');
        this.renderStyles(a, t);
        if (w && w != '') {
            a.addStyle('width', w)
        }
    } else {
        a.writeAttribute('id', t.getId() + '-input');
        a.addClass('sapUiTfInner');
        a.addStyle('width', '85%');
    }
    if (b) {
        a.writeAttributeEscaped('title', b)
    }
    if (t.getName()) {
        a.writeAttributeEscaped('name', t.getName())
    }
    if (!t.getEditable()) {
        a.writeAttribute('readonly', 'readonly')
    }
    if (this.renderTextFieldEnabled) {
        this.renderTextFieldEnabled(a, t)
    } else if (!t.getEnabled()) {
        a.writeAttribute('disabled', 'disabled');
        a.writeAttribute('tabindex', '-1')
    } else if (!t.getEditable()) {
        a.writeAttribute('tabindex', '0')
    } else {
        a.writeAttribute('tabindex', '0')
    }
    var T = t.getTextDirection();
    if (T) {
        a.writeAttribute('dir', T)
    }
    var o = t.getTextAlign();
    if (o) {
        a.addStyle('text-align', r.getTextAlign(o, T))
    }
    switch (t.getImeMode()) {
        case sap.ui.core.ImeMode.Inactive:
            a.addStyle('ime-mode', 'inactive');
            break;
        case sap.ui.core.ImeMode.Active:
            a.addStyle('ime-mode', 'active');
            break;
        case sap.ui.core.ImeMode.Disabled:
            a.addStyle('ime-mode', 'disabled');
            break
    }
    if (t.getDesign() == sap.ui.core.Design.Monospace) {
        a.addClass('sapUiTfMono')
    }
    if (t.getMaxLength()) {
        a.writeAttribute('maxLength', t.getMaxLength())
    }
    if (this.renderInnerAttributes) {
        this.renderInnerAttributes(a, t)
    }
    if (this.renderARIAInfo) {
        this.renderARIAInfo(a, t)
    }
    if (t.getPlaceholder()) {
        var p = t.getPlaceholder();
        if (this.convertPlaceholder) {
            p = this.convertPlaceholder(t)
        }
        a.writeAttributeEscaped('placeholder', p)
    }
    a.writeStyles();
    a.writeClasses();
    if (this.getInnerTagName) {
        a.write('>')
    } else {
        a.write(" value=\"");
        a.writeEscaped(t.getValue());
        a.write("\"");
        a.write('/>')
    }
    if (this.getInnerTagName) {
        if (this.renderInnerContent) {
            this.renderInnerContent(a, t)
        }
        a.write('</' + this.getInnerTagName() + '>')
    }
    if (c) {
        if (this.renderOuterContent) {
            this.renderOuterContent(a, t)
        }
        a.write('</div>')
    }
};
mc.ccp.control.McComboTextFieldRenderer.renderStyles = function(r, t) {
    r.addClass('sapUiTfBrd');
    if (t.getEnabled()) {
        if (!t.getEditable()) {
            r.addClass('sapUiTfRo')
        } else {
            r.addClass('sapUiTfStd')
        }
    } else {
        r.addClass('sapUiTfDsbl')
    }
    switch (t.getValueState()) {
        case (sap.ui.core.ValueState.Error):
            r.addClass('sapUiTfErr');
            break;
        case (sap.ui.core.ValueState.Success):
            r.addClass('sapUiTfSucc');
            break;
        case (sap.ui.core.ValueState.Warning):
            r.addClass('sapUiTfWarn');
            break
    }
    if (t.getRequired()) {
        r.addClass('sapUiTfReq')
    }
};
mc.ccp.control.McComboTextFieldRenderer.onfocus = function(t) {
    var T = jQuery.sap.byId(t.getId());
    T.addClass('sapUiTfFoc')
};
mc.ccp.control.McComboTextFieldRenderer.onblur = function(t) {
    var T = jQuery.sap.byId(t.getId());
    T.removeClass('sapUiTfFoc')
};
mc.ccp.control.McComboTextFieldRenderer.setValueState = function(t, o, n) {
    var T = jQuery.sap.byId(t.getId());
    var r = t._getRenderOuter();
    if (r) {
        var a = jQuery.sap.byId(t.getId() + '-input')
    } else {
        var a = T
    }
    switch (o) {
        case (sap.ui.core.ValueState.Error):
            T.removeClass('sapUiTfErr');
            a.removeAttr('aria-invalid');
            break;
        case (sap.ui.core.ValueState.Success):
            T.removeClass('sapUiTfSucc');
            break;
        case (sap.ui.core.ValueState.Warning):
            T.removeClass('sapUiTfWarn');
            break
    }
    switch (n) {
        case (sap.ui.core.ValueState.Error):
            T.addClass('sapUiTfErr');
            a.attr('aria-invalid', true);
            break;
        case (sap.ui.core.ValueState.Success):
            T.addClass('sapUiTfSucc');
            break;
        case (sap.ui.core.ValueState.Warning):
            T.addClass('sapUiTfWarn');
            break
    }
    var b = sap.ui.core.ValueStateSupport.enrichTooltip(t, t.getTooltip_AsString());
    if (b) {
        T.attr('title', b);
        if (r) {
            jQuery.sap.byId(t.getId() + '-input').attr('title', b)
        }
    } else {
        T.removeAttr('title');
        if (r) {
            jQuery.sap.byId(t.getId() + '-input').removeAttr('title')
        }
    }
};
mc.ccp.control.McComboTextFieldRenderer.setEditable = function(t, e) {
    if (!t.getEnabled()) {
        return
    }
    var T = jQuery.sap.byId(t.getId());
    if (t._getRenderOuter()) {
        var o = jQuery.sap.byId(t.getId() + '-input')
    } else {
        var o = T
    }
    if (e) {
        T.removeClass('sapUiTfRo').addClass('sapUiTfStd');
        o.removeAttr('readonly')
    } else {
        T.removeClass('sapUiTfStd').addClass('sapUiTfRo');
        o.attr('readonly', 'readonly')
    }
    o.attr('aria-readonly', !e)
};
mc.ccp.control.McComboTextFieldRenderer.setEnabled = function(t, e) {
    var T = jQuery.sap.byId(t.getId());
    if (t._getRenderOuter()) {
        var o = jQuery.sap.byId(t.getId() + '-input')
    } else {
        var o = T
    }
    if (e) {
        if (t.getEditable()) {
            T.removeClass('sapUiTfDsbl').addClass('sapUiTfStd').removeAttr('aria-disabled');
            o.removeAttr('disabled').removeAttr('aria-disabled').attr('tabindex', '0')
        } else {
            T.removeClass('sapUiTfDsbl').addClass('sapUiTfRo').removeAttr('aria-disabled');
            o.removeAttr('disabled').removeAttr('aria-disabled').attr('tabindex', '0').attr('readonly', 'readonly')
        }
    } else {
        if (t.getEditable()) {
            T.removeClass('sapUiTfStd').addClass('sapUiTfDsbl').attr('aria-disabled', 'true');
            o.attr('disabled', 'disabled').attr('aria-disabled', 'true').attr('tabindex', '-1')
        } else {
            T.removeClass('sapUiTfRo').addClass('sapUiTfDsbl').attr('aria-disabled', 'true');
            o.removeAttr('readonly').attr('disabled', 'disabled').attr('aria-disabled', 'true').attr('tabindex', '-1')
        }
    }
};
mc.ccp.control.McComboTextFieldRenderer.removeValidVisualization = function(t) {
    var T = jQuery.sap.byId(t.getId());
    if (T) {
        T.removeClass('sapUiTfSucc')
    } else {
        jQuery.sap.delayedCall(1000, sap.ui.commons.TextFieldRenderer, 'removeValidVisualization', [t])
    }
};
mc.ccp.control.McComboTextFieldRenderer.setDesign = function(t, d) {
    jQuery.sap.byId(t.getId()).toggleClass('sapUiTfMono', (d == sap.ui.core.Design.Monospace))
};
mc.ccp.control.McComboTextFieldRenderer.setRequired = function(t, r) {
    if (t._getRenderOuter()) {
        var T = jQuery.sap.byId(t.getId() + '-input')
    } else {
        var T = jQuery.sap.byId(t.getId())
    }
    jQuery.sap.byId(t.getId()).toggleClass('sapUiTfReq', r);
    if (r) {
        T.attr('aria-required', true)
    } else {
        T.removeAttr('aria-required')
    }
};
mc.ccp.control.McComboTextFieldRenderer.renderARIAInfo = function(r, t) {
    var p = {role: t.getAccessibleRole().toLowerCase(),multiline: false,autocomplete: 'none'};
    if (t.getValueState() == sap.ui.core.ValueState.Error) {
        p['invalid'] = true
    }
    r.writeAccessibilityState(t, p)
};
mc.ccp.control.McComboTextFieldRenderer.getTextAlign = sap.ui.core.Renderer.getTextAlign;

