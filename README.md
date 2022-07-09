# Njugaball
A web application for playing real Lottery. 
#### Installation
```shell
git clone https://github.com/martin-geeks/njugaball
cd njugaball
pip install -r requirements.txt
pip install -e .
```
#### Database Setup
Using your editor open __init__ . py and modify the following:
Put your MYSQL Username and Password; and hostname.
##### Do not forget the database name
```python
SQLALCHEMY_DATABASE_URI = "mysql://{username}:{password}@{hostname}/{databasename}".format(
    username="u0_a110",
    password="",
    hostname="localhost",
    databasename="njuball",
)
```
#### Mail Setup
This web application requires an email address for it to verify user login details when creating an account.
Modify the following line in __init__.py
```python
app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'martintembo.zm@gmail.com'
app.config['MAIL_PASSWORD'] = '$martin_tembo&'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
```
Make sure the database server is up and running and the mail server as well.

#### Finally Run the application entering the following:
##### UNIX/LINUX SHELL
```shell
export FLASK_APP=njugaball
export FLASK_ENV=DEVELOPMENT
export FLASK_DEBUG=TRUE
flask run
```powershell
##### Windows Powershell
```
$Env:FLASK_APP = 'njugaball'
$Env:FLASK_ENV = 'DEVELOPMENT'
$Env:FLASK_DEBUG = 'TRUE'
flask run
```

