{
    'name' : 'OpenERP Pet Store',
    'version': '1.0',
    'summary': 'Sell pet toys',
    'category': 'Tools',
    'description':
        """
OpenERP Pet Store
=================

A wonderful application to sell pet toys.
        """,
    'data': [
        'security/ir.model.access.csv',
        "views/petstore.xml",
        "data/petstore_data.xml",
        "data/oepetstore.message_of_the_day.csv",
    ],
    'depends' : ['sale_stock'],
    'qweb': ['static/src/xml/*.xml'],
    'application': True,
}
