odoo.define("oepetstore", function(require){
    'use strict';

    var translation = require('web.translation'),
        core = require('web.core');
    const _t = translation._t,
        QWeb = core.qweb,
        Widget = require('web.Widget'),
        AbstractAction = require('web.AbstractAction');


    // console.log("pet store home page loaded");
    var HomePageClientAction =  AbstractAction.extend({
        className: 'oe_petstore_homepage',
        start: function() {
            // this.$el.append("<div>Hello dear Odoo user!</div>");
            // var greeting = new GreetingsWidget(this);
            // greeting.appendTo(this.$el);
            // console.log(this.getChildren()[0].$el);

            // First way to use a template
            // this.$el.append(QWeb.render("HomePageTemplate", {name: "Klaus"}));
            var products = new ProductsWidget(this,
                ['cpu', 'mouse', 'keyboard', 'graphic card', 'screen'], "#00FF00");
            products.appendTo(this.$el);
        },
    });

    // Second way to use a template
    // var HomePageClientAction =  AbstractAction.extend({
    //     template: "HomePageTemplateWidget",
    //     xmlDependencies: ['static/src/xml/petstore.xml'],
    //     init: function(parent) {
    //         this._super(parent);
    //         this.name = "Mordecai";
    //     },
    // });
    core.action_registry.add('petstore-homepage', HomePageClientAction);

    var GreetingsWidget = Widget.extend({
        className: 'oe_petstore_greetings',
        start: function() {
            this.$el.append("<div>We are so happy to see you again in this menu!</div>");
            // console.log(this.getParent().$el);
        },
    });

    var ProductsWidget = Widget.extend({
        template: "ProductsWidget",
        init: function(parent, products, color) {
            this._super(parent);
            this.products = products;
            this.color = color;
        },
    });
});
