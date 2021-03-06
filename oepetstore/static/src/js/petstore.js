odoo.define("oepetstore", function(require){
    'use strict';

    var translation = require('web.translation'),
        core = require('web.core'),
        field_registry = require('web.field_registry'),
        FieldManagerMixin = require('web.FieldManagerMixin'),
        widgetRegistry = require('web.widget_registry');
    const _t = translation._t,
        QWeb = core.qweb,
        Widget = require('web.Widget'),
        AbstractAction = require('web.AbstractAction'),
        ajax = require('web.ajax'),
        AbstractField = require('web.AbstractField');


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
            // var products = new ProductsWidget(this,
            //     ['cpu', 'mouse', 'keyboard', 'graphic card', 'screen'], "#00FF00");
            // products.appendTo(this.$el);

            // var confirmWidget = new ConfirmWidget(this);
            // confirmWidget.on("user_chose", this, this.user_chose);
            // confirmWidget.appendTo(this.$el);
            //
            this.$el.append(QWeb.render("HomePage"));
            this.colorInput = new ColorInputWidget(this);
            this.colorInput.on("change:color", this, this.color_changed);
            this.colorInput.appendTo(this.$el);
            var self = this;
            this._rpc({
                model: "oepetstore.message_of_the_day",
                method: "my_method",
            }).then(function (result) {
                self.$el.append("<div>Hello " + result["hello"] + "</div>");
            });
            this.messageOfTheDay = new MessageOfTheDay(this);
            this.messageOfTheDay.appendTo(this.$el);
            this.petToysList = new PetToysList(this);
            this.petToysList.appendTo(this.$el);
            this.WidgetCoordinates = new WidgetCoordinates(this);
            this.WidgetCoordinates.appendTo(this.$el)
            this.WidgetCoordinates.on("change:coordinates", this, this.display_map);
            return
        },
        color_changed: function () {
            this.$(".oe_color_div").css("background-color", this.colorInput.get("color"));
        },
        display_map: function() {
             this.$el.html(QWeb.render("WidgetCoordinatesMap", {
                "latitude": this.coordinates.latitude,
                "longitude": this.coordinates.longitude,
            }));
        }
        // user_chose: function(confirm) {
        //     // console.log(confirm ? "The user agreed to continue" : "The user refused to continue");
        //     if (confirm) {
        //         console.log("The user agreed to continue");
        //     } else {
        //         console.log("The user refused to continue");
        //     }
        // },
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

    var ConfirmWidget = Widget.extend({
        events: {
            'click button.ok_button': function () {
                this.trigger('user_chose', true);
            },
            'click button.cancel_button': function () {
                this.trigger('user_chose', false);
            }
        },
        start: function() {
            this.$el.append("<div>Are you sure you want to perform this action?</div>" +
                "<button class='ok_button'>Ok</button>" +
                "<button class='cancel_button'>Cancel</button>");
        },
    });

    var ColorInputWidget = Widget.extend({
        template: "ColorInputWidget",
        events: {
             'change input': 'input_changed',
        },
        start: function () {
            this.input_changed();
            return this._super();
        },
        input_changed: function () {
            var color = [
                "#",
                this.$(".oe_color_red").val(),
                this.$(".oe_color_green").val(),
                this.$(".oe_color_blue").val()
            ].join('');
            this.set("color", color);
        },
    });

    // Exercises
    var MessageOfTheDay = Widget.extend({
        start: function() {
            var self = this;
            ajax.post('/oepetstore/messages', self).then(function(view) {
                self.$el.append(view);
            })
            return
        }
    });

    var PetToysList = Widget.extend({
        events: {
            'click .oe_petstore_pettoy': 'selected_item',
        },
        start: function() {
            var self = this;
            ajax.post('/oepetstore/pettoylist', self).then(function(view) {
                self.$el.append(view);
            })
            return
        },
        selected_item: function (event) {
            var self = this;
            var data = $(event.currentTarget)[0].id;
            ajax.post('/oepetstore/pettoy', {petId: parseInt(data)}).then(function(view) {
                $('.oe_petstore_homepage').html(view);
                // self.$el.load(view);
                // self.$el.append(view);
            })

        }
    });

    var FieldColor = AbstractField.extend({
        events: {
            'change input': function (e) {
                if ($(e.currentTarget).parents('.o_form_readonly').length == 0) {
                    this.value = $(e.currentTarget).val();
                    this.render_value();
                }
            },
        },
        init: function() {
            this._super.apply(this, arguments);
            this.value ="#000000";
        },
        start: function() {
            this.render_value();
            this.display_field();
            return this._super();
        },
        display_field: function() {
            var self = this;
            this.$el.html(QWeb.render("FieldColor", {widget: this}));
        },
        render_value: function() {
            if (this.getParent().mode == 'readonly') {
                // This isn't working as expected
                this.$(".oe_field_color_content").css("background-color", this.value);
            } else {
                // This isn't working as expected
                this.$("input").val(this.value);
            }
        }
    });

    field_registry.add('color', FieldColor);

    var WidgetCoordinates = Widget.extend({
        template: "WidgetCoordinates",
        events: {
            'change input': 'get_coordinates',
        },
        start: function() {
            this.get_coordinates();
            return this._super();
        },
        get_coordinates: function() {
            var coordinates = {
                "latitude": this.$(".oe_coordinate_latitude").val(),
                "longitude": this.$(".oe_coordinate_longitude").val(),
            }
            this.set("coordinates", coordinates)
        }
    });
    widgetRegistry.add('coordinates', WidgetCoordinates);
});
