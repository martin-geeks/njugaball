from flask import Flask,render_template,jsonify,request,make_response,redirect,session
from flask_mail import Mail,Message
import uuid,hashlib,json,bcrypt
from flask_sqlalchemy import SQLAlchemy
import time
from njugaball.utils import DateString,check_password,hash_password,generateOTP
from scryp import encrypt,decrypt
from sqlalchemy.inspection import inspect
from njugaball.models import db,User,Draw

KEY = "de1182b0f4203cad8d2ec629e35403d7"

class Serializer(object):
  def serialize(self):
    return {c: getattr(self,c) for c in inspect(self).attrs.keys()}
  @staticmethod
  def serialize_list(l):
    return [m.serialize() for m in l]
#encrypt_bytes = EncryptStr(v, k)
#original_bytes = DecryptStr(encrypt_bytes, k)



app = Flask(__name__,static_folder='static')
app.secret_key = '23627853741284421'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['SQLALCHEMY_POOL_RECYCLE'] = 1
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://u0_a128: @localhost/njuball'
app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'martintembo.zm@gmail.com'
app.config['MAIL_PASSWORD'] = '$martin_tembo&'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

#import njugaball.models
def create_app():
  db.init_app(app)
  return app
import njugaball.views