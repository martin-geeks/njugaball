from njugaball import create_app
from njugaball import db,Serializer,DateString,render_template,jsonify,request,make_response,redirect,session,time,inspect,json,encrypt,decrypt,hash_password,check_password,User,Draw,Mail,Message,generateOTP,Notifications
import time,os
from urllib.parse import parse_qs
app = create_app()
mail = Mail(app)

KEY = "de1182b0f4203cad8d2ec629e35403d7"
"""
def hash_password(password):
  salt = uuid.uuid4().hex
  return hashlib.sha256(salt.encode() + password.encode()).hexdigest() + ':' + salt

def check_password(hashed,password_):
  password,salt = hashed.split(':')
  return password == hashlib.sha256(salt.encode() + password_.encode()).hexdigest()
"""
dbUser = User()

def f():
  if request.path == '/':
    pass

app.before_request(f)
"""
def handle_notification(data):
  json = {'hi':'Worked'}
  print(data)
  emit('notification',json)
  print('Emmited')
"""


@app.route('/')
def home():
  db.create_all()
  res = make_response()
  #res.set_cookie('test',value='YES',max_age=None,path='/',domain='127.0.0.1')
  #socketio.on_event('notification',handle_notification)
  print('COOKIE >>>',request.cookies.get('njugaball'))
  return render_template('root.html')

@app.route('/welcome')
def welcome():
  
  return render_template('root.html')
  
@app.route('/termsandconditions')
def termsConditions():
  terms = {
    'text':'Our Terms',
    'last_updated':'Today'
  }
  conditions = {
    'text':'Our Condtions',
    'last_updated':'4 months ago'
  }
  
  return jsonify({'terms':terms,'conditions':conditions})

@app.route('/login',methods=['POST'])
def login():
  response = make_response()
  
  if request.form['username']:
    username = request.form['username']
    password = request.form['password']
    user = User.byUsername(username=username)
    print(check_password(user['password'],password))
    if user is not None and check_password(user['password'],password):
      response.set_cookie('njugaball',json.dumps(user),max_age=86400,httponly=True)
      d = encrypt(password,KEY)
      print(d)
      return jsonify({'username':user['username'],'password':str(d)})
    return jsonify({'error':True,'message':'Something went wrong!'})

@app.route('/logout',methods=["POST"])
def logout():
  del session['user']
  return jsonify({'delete':True})


@app.route('/sign_user',methods=['POST'])
def signup_user():
  if request.form['njuball']:
    username = request.form['username']
    phone = request.form['phone']
    email = request.form['email']
    password = request.form['password']
    user = User.byUsername(username)
    phones = User.byColumn(User.phone)
    phoneAuth = None
    for i in phones:
      if i == phone[0]:
        phoneAuth = False
    print(user,phones,phoneAuth)
    if user is None and phoneAuth is None:
      #usr = User.temp_add(username,phone,password)
      d = encrypt(password,KEY)
      otp = generateOTP()
      session['otp'] = otp
      msg = Message('Verification Code',sender='martintembo.zm@gmail.com',recipients=['martin.mt.geek@gmail.com'])
      msg.subject = 'Njuga - Ball: Verification Code'
      msg.body = 'Verification Code: '+otp
      mail.send(msg)
      dbUser.temp_set(username,phone,password,email=email)
      dbUser.saveNow()
      return jsonify({'username':username,'phone':phone,'password':str(d),'otp':otp})
    elif user is not None:
      return jsonify({'exists':True, 'message':'username exists.'})
    elif phoneAuth == False:
      print("NOT YYYYY")
      return jsonify({'exists':True,'message':'Phone number already registered. Use a different phone number.'})
    else:
      return jsonify({"error":True,'message':'Something went wrong. Oops!'})
@app.route('/create_user',methods=['POST'])
def create_user():
  if request.form['verified']:
    User.save()
    print(dbUser.saveNow())
    return jsonify({'data':True})
  else:
    return jsonify({'error':True,'message':"Could'nt sign you up. Please reload the page"})

@app.route("/draws")
def slots():
  if session['user']:
    print(session)
    user = json.loads(session['user'])
    data = User.query.filter_by(username=user['username']).first().draw
    draws = Draw.serialize_list(data)
    for draw in draws:
      del draw['user']
      del draw['user_id']
      del draw['id']
    return jsonify({'slots':draws})
  else:
    return jsonify({'slots':False,'msg':'No Slots Available'})



#ERROR HANDLERS
@app.errorhandler(404)
def page_not_found(error):
  res = make_response()
  path = request.path.split('/')
  component = path[1]
  components_ = os.listdir(os.path.abspath(os.path.join('njugaball','static','components')))
  components = []
  for c in components_:
    components.append(c.split('.')[0])
  if component in components:
    print('set component')
    session['component'] = json.dumps({'url':request.path,'component':component,'title':component.title()})
    return redirect('/',302)
  else:
    print('Not A component')
    print(session)
    return "hi"

@app.route('/sessions',methods=['POST'])
def sessions():
  component = None
  try:
    component = session['component']
    print("TESTED")
  except KeyError:
    component = False
  print('TEST COMPONENT:', component)
  if request.form['component']:
    if component:
      print('Recent Found')
      session.pop('component',None)
      return jsonify(json.loads(component))
    else:
      print('Recent not found')
      return jsonify({'error':'No recent'})
  else:
    return jsonify({'error':True})

@app.route('/auth',methods=["POST"])
def auth():
  username = request.form['username']
  password = request.form['password']
  user = User.byUsername(username)
  d = decrypt(password,KEY)
  if user['username'] is not None and check_password(user['password'],d):
    session['user'] = json.dumps(user)
    return jsonify({'auth':True})
  return jsonify({'error':True,'message':'Authentication Failed'})

@app.route('/user-info',methods=['GET'])
def user():
  if session['user']:
    user = json.loads(session['user']);
    data = User.query.filter_by(username=user['username']).first().draw
    draws = Draw.serialize_list(data)
    for draw in draws:
      del draw['user']
      del draw['user_id']
      del draw['id']
    print(draws)
    user = {
      'username':user['username'],
      'phone':user['phone'],
      "draws": draws,
      'date':user['date']
    }
    return jsonify(user)
  else:
    return jsonify({'error':True,'message':'Permission Denied'})
@app.route('/getNotifications',methods=['GET'])
def getNotifications():
  username = json.loads(session['user'])['username']
  #user = User.query.filter_by(username=username).first()
  #noti = Notifications(title='Win Millions',text='Better late than never.')
  #user.notifications.append(noti)
  #User.save();
  data = User.query.filter_by(username=username).first().notifications
  notifications = Notifications.serialize_list(data)
  for notification in notifications:
    if notification['seen'] == False:
      notification['color'] = 'bg-blue-200 c-dark'
    else:
      notification['color'] = ''
    notification['id'] = encrypt(str(notification['id']),KEY)
    del notification['user']
    del notification['user_1']
  notifications.reverse()
  return jsonify({'notifications':notifications})
@app.route('/notifications_handle',methods=['POST'])
def notifications_a():
  username = json.loads(session['user'])['username']
  data = parse_qs(request.query_string.decode(),encoding="utf-8")
  notifications_raw = User.query.filter_by(username=username).first().notifications
  notifications = Notifications.serialize_list(notifications_raw)
  if request.form['action'] == 'dismiss':
    notifications_id = decrypt(request.form['key'],KEY)
    for n in notifications_raw:
      if int(notifications_id) == n.id:
        Notifications.remove(n)
        User.save()
    data = User.query.filter_by(username=username).first().notifications
    notifications_updated = Notifications.serialize_list(data)
    print(notifications_updated)
    for notification in notifications_updated:
      del notification['user_1']
      del notification['user']
      notification['id'] = encrypt(str(notification['id']),KEY)
    notifications_updated.reverse()
    return jsonify(notifications_updated)
  elif request.form['action'] == 'toggleseen':
    seen = request.form['seen']
    notifications_id = decrypt(request.form['key'],KEY)
    notification_picked = None
    for n in notifications_raw:
      if int(notifications_id) == n.id:
        notification_picked = n
    #EMPTY LINE
    if seen == 'false':
      print('Not Seen')
      notification_picked.seen = True
      User.save()
    elif seen == 'true':
      print('Seen')
      notification_picked.seen = False
      User.save()
    data = User.query.filter_by(username=username).first().notifications
    notifications_updated = Notifications.serialize_list(data)
    for notification in notifications_updated:
      if notification['seen'] == False:
        notification['color'] = 'bg-blue-200 c-dark'
      else:
        notification['color'] = ''
      del notification['user']
      del notification['user_1']
      notification['id'] = encrypt(str(notification['id']),KEY)
    notifications_updated.reverse()
    return jsonify(notifications_updated)
  elif request.form['action'] == 'number':
    unseen = []
    sawn = []
    for i in notifications:
      if i['seen'] == False:
        unseen.append(i)
      else:
        sawn.append(i)
    return jsonify({'total':len(notifications),'seen':len(sawn),'unseen':len(unseen)})
"""
@app.route('/notify',methods=['POST'])
def notify():
  socketio.on_event('notification',handle_notification)
  print("SENT")
  #emit('notification',{'data':"Worked!"},namespace='/notification')
  return jsonify({})
#SOCKET IO
@socketio.on('my event')
def handle_message(data):
  print('Message ',data)
def ack():
  print("Sent MSG")

@socketio.on('notification')
def data_handle(data):
  print(11111111)
  emit('notification',{'hi':True})
  print(data)
"""