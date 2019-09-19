odoo.define("oepetstore", function(require, local){
    'use strict';

    var translation = require('web.translation'),
        core = require('web.core');
    const _t = translation._t,
        QWeb = core.qweb,
        Widget = require('web.Widget');


    // console.log("pet store home page loaded");
    local.HomePage = Widget.extend({
        // template: 'website.homepage',
        start: function() {
            console.log("pet store home page loaded");
        },
    });

    // instance.web.client_actions.add('petstore.homepage', 'instance.oepetstore.HomePage');
});
