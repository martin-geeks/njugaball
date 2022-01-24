from njugaball import SQLAlchemy,hash_password,check_password,DateString,inspect
import time,datetime
class Serializer(object):
  def serialize(self):
    return {c: getattr(self,c) for c in inspect(self).attrs.keys()}
  @staticmethod
  def serialize_list(l):
    return [m.serialize() for m in l]
db = SQLAlchemy()
class User(db.Model,Serializer):
  id = db.Column(db.Integer,primary_key=True)
  username = db.Column(db.String(200),unique=True,nullable=False)
  phone = db.Column(db.String(100),unique=True,nullable=False)
  draw = db.relationship('Draw',backref='user',lazy=True)
  notifications = db.relationship('Notifications',backref='user',lazy=True)
  password = db.Column(db.String(200),unique=True,nullable=False)
  date = db.Column(db.String(30),unique=False,nullable=False)
  def temp_set(self,user,number,password,email=None):
    self.session_user = User(username=user,phone=number,password=hash_password(password),date=User.Date())
    print(self.session_user)
    db.session.add(self.session_user)
    #EMPTY LINE
    db.session.commit()
    return self.session_user
  def saveNow(self):
    db.session.commit()
  def temp_del(self,user=None):
    if user is not None:
      db.session.delete(user)
      db.session.commit()
      db.make_transient()
    else:
      db.session.delete(self.session_user)
      db.commit()
      db.make_transient()
  def save():
    db.session.commit()
  @staticmethod
  def User():
    usr = User.query.all()
    return usr
  @staticmethod
  def Date():
    t = time.localtime()
    year = str(t.tm_year)
    month = str(t.tm_mon)
    day = str(t.tm_mday)
    hour = str(t.tm_hour)
    mins = str(t.tm_min)
    secs = str(t.tm_sec)
    full_time = hour+':'+mins+':'+secs
    full_date = day+'-'+month+'-'+year
    full_date_time = full_time +' '+time.tzname[0] +' '+full_date
    return full_date_time
  def byUsername(username=None):
    usr = User.query.filter_by(username=username).first()
    if usr is not None:
      user = {'username':usr.username,'phone':usr.phone,'password':usr.password,'date':usr.date}
      return user
    else:
      return usr
  @staticmethod
  def Username(username):
    return User.query.filter_by(username=username).first()
  @staticmethod
  def byColumn(column):
    phones = User.query.with_entities(column).all()
    return phones

class Draw(db.Model,Serializer):
  id = db.Column(db.Integer,primary_key=True)
  draw_code = db.Column(db.String(2000),nullable=False,unique=True)
  player_id = db.Column(db.String(2000),nullable=True,unique=False)
  picked = db.Column(db.Integer,nullable=True,unique=True)
  state = db.Column(db.Boolean,unique=False,nullable=False,default=False)
  date = db.Column(db.DateTime(),default=datetime.datetime.utcnow(),nullable=False)
  user_id = db.Column(db.Integer,db.ForeignKey('user.id'))
  DATA = None
  def create():
    draw = Draw(state=False,draw_code='2CF08XE')
    db.session.add(draw)
    return draw
  @staticmethod
  def byColumn(column):
    return User.query.with_entities(column).all()
  def save():
    db.session.commit()
  def getAll():
    draws = Draw.query.all()
    return draw
  def test():
    pass

class Notifications(db.Model,Serializer):
  id = db.Column(db.Integer,primary_key=True)
  title = db.Column(db.String(50),nullable=False)
  text = db.Column(db.String(1000),nullable=False)
  seen = db.Column(db.Boolean,default=False)
  date = db.Column(db.DateTime(),default=datetime.datetime.utcnow(),nullable=False)
  user_1 = db.Column(db.Integer,db.ForeignKey('user.id'))
  @staticmethod
  def getByUsername(username):
    user = User.query.filter_by(username=username)
    return user
  @staticmethod
  def remove(notification):
    db.session.delete(notification)