# -*- coding: utf-8 -*-
from odoo import http

class oepetstore(http.Controller):
    @http.route('/oepetstore/messages', auth='public')
    def messageOfTheDay(self, **kw):
        messages = http.request.env['oepetstore.message_of_the_day']
        return http.request.render('oepetstore.MessageOfTheDay', {
            'messages': messages.search([]),
        })

    @http.route('/oepetstore/pettoylist', auth='public')
    def petToyList(self, **kw):
        petToys = http.request.env['product.product']
        return http.request.render('oepetstore.PetToysList', {
            'petToys': petToys.search([('categ_id.name', '=', "Pet Toys")]),
        })

    @http.route('/oepetstore/pettoy', auth='public')
    def petToy(self, petId, **kw):
        petToy = http.request.env['product.product']
        return http.request.render('oepetstore.PetToy', {
            'petToy': petToy.search([('id', '=', petId)]),
        })
