from setuptools import setup

setup(
    name='njugaball',
    packages=['njugaball'],
    include_package_data=True,
    install_requires=[
        'flask',
        'bcrypt',
        'flask_sqlalchemy',
        'tea_encrypt',
        'scryp',
        'sqlalchemy_serializer',
        'mysql'
    ],
)