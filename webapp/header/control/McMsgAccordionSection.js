/***
 * @Author EO19
 * @Date 09/15/2014
 * @Version 1.0
 * @Version-comments : This is the initial version
 * @Description : This is Accordion Section Custom control for Alert and Message View
 */
jQuery.sap.declare('mc.ccp.header.control.McMsgAccordionSection');
sap.ui.commons.AccordionSection.extend("mc.ccp.header.control.McMsgAccordionSection", {
    metadata: {
        properties: {
            'date': {
                type: 'string'
            },
            'read': {
                type: "boolean",
                defaultValue: false
            },
        }
    }
});