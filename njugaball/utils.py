import time,uuid,hashlib,math,random

def DateString():
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

def hash_password(password):
  salt = uuid.uuid4().hex
  return hashlib.sha256(salt.encode() + password.encode()).hexdigest() + ':' + salt
def check_password(hashed,password_):
  password,salt = hashed.split(':')
  return password == hashlib.sha256(salt.encode() + password_.encode()).hexdigest()

def generateOTP():
  digits = '0123456789'
  OTP = ''
  for i in range(5):
    OTP += digits[math.floor(random.random() * 10)]
  return OTP