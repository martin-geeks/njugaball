from setuptools import setup

setup(
    name='njugaball',
    version='0.9.9',
    description='A web application for playing real lottery.',
    author='Martin Tembo',
    author_email='martintembo.zm@gmail.com',
    url='https://github.com/martin-geeks/njugaball',
    packages=['njugaball'],
    include_package_data=True,
    install_requires=[
        'flask',
        'flask_sqlalchemy',
        'flask_mail',
        'tea_encrypt',
        'scryp',
        'sqlalchemy_serializer',
        'mysql',
        'flask_web_log'
    ],
)