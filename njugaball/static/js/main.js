var components,user,header,navigation,main,root,lastErrorData;
//var socket = io();

var myNav = {"states":{"state":"people"},"is":"div","class":"uk-width-auto","id":"offcanvas-flip","props":{"uk-offcanvas":"flip: false; overlay: true; mode: push;width:100;"},"nodes":[
			  {
			    "is":"div",
			    "class":"uk-offcanvas-bar",
			    "nodes":[
			      {
			        "is":"ul",
			        "class":"flx-r clickable-blue p10 rd",
			        "nodes":[
			          {"is":"span","props":{"uk-icon":"user"}},
			          {"is":"span","class":"uk-strong","nodes":["@navigationData.username"]}
			          ]
			      },
			     {
			            "is":"ul",
			            "class":"",
			            "props":{"uk-accordion":" multiple: true"},
			            "nodes":[
			              {
			                "is":"li",
			                "class":" clickable-blue",
			                "nodes":["Draws"],
			                "events":{"click":["@handlers.loadSlots"]}
			              }
			              ,
			              {
			                "is":"li",
			                "class":"",
			                "nodes":[
			                  {
			                  "is":"a",
			                  "class":"uk-accordion-title clickable-blue pd5 rd",
			                  "nodes":[" My Account"]
			                  },
			                  {
			                    "is":"ul",
			                    "class":" uk-accordion-content",
			                    "nodes":[
			                      {
			                        "is":"li","class":" clickable-grey pd5 rd",
			                        "nodes":[
			                          "Deposit"
			                          ]
			                      }
			                      ]
			                  }
			                  ]
			              }
			              ]
			          }
			      ]
			  }
			  ]}




components = {
	"main": {
		"states":{"username":" 5"},
		"is":"div",
		"class":"",
		"nodes":[
			{"is":"div","id":"headerContainer","class":"","nodes":[]},
			{"is":"div","id":"mainContainer","class":"","nodes":["main"]},
			{"is":"div","id":"popUp","class":"","nodes":[]},
			{"is":"div","id":"navBar","class":"none","nodes":[]},
		myNav
		]
	},
	"reset": {
		"states":{},
		"is":"div",
		"class":"",
		"nodes":[]
	}
}
root = document.getElementById('root');
var ui = Moult.component(components.main);

Moult.utilities.clearNodes(root);
Moult.render(ui,root);
main = Moult.component(components.reset)
Moult.render(main,mainContainer);
header = Moult.component(components.reset);
Moult.render(header,headerContainer);
popup = Moult.component({states:{msg:"No Message","state":"mb-100"},is:"div",class:"p10 bg-default trans gfont9 c-dark pt8 tc z15 flx-r fxd b-0 w70m w100 @state no-fxd ",nodes:[{is:"i",class:"ic ic-info"}," @msg"]});
Moult.render(popup,popUp);
navigation = Moult.component(components.reset);
Moult.render(navigation,navBar);
function requestData(data, next, l) {
data.params = data.params || {}; l={};
data.method = data.method.toLowerCase();
data.type = data.type || "text";
if(data.method === "post") {
data.body = new FormData();
if(data.params instanceof FormData) {
data.body = data.params;
} else {
Moult.utilities.entries(data.params, function(param) {
data.body.append(param[0], param[1]);
});
}} else if(data.method === "get") {
data.body = {};
Moult.utilities.entries(data.params, function(param,i) {
data.url += (i === 0 && !/\?/.test(data.url) ? "?" : "&")+param[0]+"="+param[1];
});}
data.xhr = new XMLHttpRequest();
data.xhr.timeout = 150000;
data.xhr.ontimeout = function() {

};
data.xhr.upload.onprogress = data.progress || function() {

};
data.xhr.onerror = function() {

};
data.xhr.onloadend = function(e) {
if(data.stack) {
e.i = data.stack.requests.active.indexOf(data.xhr);
if(e.i+1) {
data.stack.requests.active = data.stack.requests.active.slice(0,e.i).concat(data.stack.requests.active.slice(e.i+1));
}
}
};
data.xhr.onload = function(ret) {
// alert(data.xhr.responseText);
if(data.type === "text") { next(data.xhr.responseText); }
else if(data.type === "json") {
try {
ret = JSON.parse(data.xhr.responseText);
} catch(e) {
ret = { error: true, message: "Invalid response from server" };
}
next(ret);
} else { next(data.response); }
};
data.xhr.open(data.method,data.url);
data.xhr.send(data.body);
if(data.stack) {
data.stack.requests.active.push(data.xhr);
}
}
function loadComponent(url,states,next) {
	states = states || {};
	if(components[url] && components[url].id !== 'component.error') return next(component[url]);
	requestData({method: 'get',url: '/static/components/'+url+".json",type: 'json'},function(component) {
		if(component.error) return next(component);
		components[url] = component;
		component.states = states || {};
		Moult.utilities.assign(component.states,states);
		next(component);
	})
}
function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
function setPopup(message) {
  
  popup.update({states: {state:'',msg:message}});
  setTimeout(function() {
      
        popup.update({states:{state:'mb-100'}})
    }, 1600);
}

function pushState(component_name,title, url) {history.pushState({component:component_name},title,url);document.title=title}
function cookiesData(data) {
  if(this.firstChild.innerHTML === 'Yes')
  {
    localStorage['saved'] = true;
  } else {
    
  }
  header.update({states: {state:'none'}})
}
components.error = {
  "states":{"icon":"","msg":" No Message"},
  "is":"div",
  "class":"bg-dark c-grey h100 fxd z15 w100 tc",
  "nodes":[
    {
      "is":"div",
      "class":"mt-30",
      "nodes":[
        {"is":"i","class":"ic ic-sad pt25"},
        {"is":"h3","class":"mt-5 c-grey","nodes":["@msg"]}
        ]
    }
  ]
}
components.loader = {
  "states": {},
  "is":"div",
  "class":"mt-30 tc pt8",
  "nodes":[
    {
      "is":"div",
      "class":"rotate-C circle-50 bd-black bdl-none ma",
      "nodes":[]
    },
    "processing..."
    ]
}
function showError(data={icon:'ic ic-sad',msg:'No Message'}) {
  lastErrorData = data;
  main.update(components.error);
  main.update({states: {icon:data.icon,msg:data.msg}});
  pushState('error',data.msg,'/component/error');
  
}

var handlers = {
  gotoTermsConditions : function() {
    loadComponent('terms&conditions',{},function(component){
      if(component.error) return showError(data={msg:'Error while processing component'});
      components.terms_and_conditions = component;
      
      main.update(components.terms_and_conditions);
      pushState('terms_and_conditions','Terms and Conditions','/t&c');
      
    });
    requestData({"method":"get","url":"/termsandconditions","type":"json"},function(response){
      if(response.error) return showError(data={msg:response.message});
      main.update({ states :{terms:response.terms,conditions: response.conditions}})
    })
  },
  showSignUp: function() {
    
    signup()
  },
  signup: function() {
    username = this.parentElement.username.value;
    phone = this.parentElement.phone.value;
    email = this.parentElement.email.value
    password = this.parentElement.password.value;
    main.update(components.loader)
    requestData({method:'post',url:'/sign_user',params:{username:username,phone:phone,email:email,password:password,'njuball':true},type:'json'},function(response){
      if(response.error) return showError(data={msg:response.message});
      if(response.exists) return M.toast({html: response.message, classes: 'rounded'}); //setPopup(response.message);
      
      var OTP = prompt('Enter One-Time-Pin');
      if(response.otp === OTP){
        delete response.otp
        user = response;
        
        requestData({url:'/create_user',method:'post',params:{'verified':true}},function(response){
          if(response.error) return setPopup('Could not sign you up');
          setCookie('njugaball',JSON.stringify(user));
          handlers.auth(user);
        });
      } else {
      main.update(components.signup);
      setPopup('You have entered a wrong OTP.');
      }
    });
  },
  auth : function(data){
    requestData({method:'post',url:'/auth',params:data,type:'json'},function(response){
      if(response.error) return showError(data={msg:response.message});
      if(response.auth) return buildAllUI()
    });
  },
  login : function(){
    username = this.parentElement.username.value
    password = this.parentElement.password.value;
    requestData({method:"post",url:"/login",params:{"username":username,"password":password},type:"json"},function(response){
    if(response.error) return setPopup('Wrong Username or Password')
    setCookie('njugaball',JSON.stringify(response),24);
    if(JSON.parse(getCookie('njugaball'))) {
      main.update(components.reset);
      main.update(components.loader);
      
      handlers.auth(response)
      //buildAllUI();
      
    } else {
      alert("Error")
    }
  })
  },
  logout: function(){
    if(this.textContent == ' Logout' ) {
      btn = this;
      requestData({method:'post',url:'/logout',type:'json'},function(response){
        if(response.error) return showError(data={msg:response.message});
        eraseCookie('njugaball');
    
    myAccount.classList.add('none');
    myAccountOptions.classList.add('none')
    myTokens.classList.add('none')
    btn.innerHTML = '<span>Log In</span>'
    btn.classList.add('bg-blue');
    
      });
    
    } else {
      window.location.reload()
    }
  },
  continueTo : function() {
    main.update(components.loader)
    
    login()
    
  },
  toggleNavBar : function() {
    //M.toast({html: 'I am a toast!', classes: 'rounded'});
    /*var list = navBar.classList;
    if(list.contains('ml-100')) {
      navBar.classList.remove('ml-100');
    } else {
      navBar.classList.add('ml-100');
    }
    */
    UIkit.nav().toggle(2,true)
  },
  clearCookies: function() {
    delete localStorage['saved']
  },
  toggleSubMenu: function() {
    
    var list2 = this.lastChild.classList;
    if(list2.contains('ic-chevron-down')) {
      this.lastChild.classList.remove('ic-chevron-down');
      this.lastChild.classList.add('ic-chevron-up');
      if(this.nextElementSibling.tagName === 'OL') {
        this.nextElementSibling.classList.remove('none');
      }
    } else {
      this.lastChild.classList.add('ic-chevron-down');
      this.lastChild.classList.remove('ic-chevron-up');
      if(this.nextElementSibling.tagName === 'OL') {
        this.nextElementSibling.classList.add('none');
      }
    }
  },
  loadSlots: function() {
    main.update(components.loader)
    requestData({method:'get',url:'/draws',params :{},type:'json'},function(response){
      if(response.error) return showError(data={msg:'Broken Page'});
      if(response.slots) {
        
        main.update(components.reset);
        main.update(components.slots);
        main.update({states: {slots:response.slots,available:response.available}})
        pushState('slots','Slots','/slots')
      } else {
         main.update(components.reset);
         main.update(components.noslots)
         main.update({states :{slots : response}});
        pushState('noslots','No Slots','/noslots')
      }
    });
   
  },
  accountSubOptions: function() {
    switch (this.lastChild.innerHTML) {
      case ' Deposit':
        main.update(components.reset);
        main.update(components.deposit);
        pushState('deposit','Make Your Deposit',"/deposit");
        
        break;
      case ' Withdraw':
        alert(true)
        break
      case ' Transaction Summary':
        alert(true)
        break
     case ' Settings':
       alert(true)
       break
      default:
        //alert(this.lastChild.innerHTML)
    }
  },
  mobileWallet: function() {
    wallet = this.dataset.wallet;
    colors = this.dataset.colors;
    phone = this.dataset.phone;
    payment({wallet:wallet,colors:colors,phone:phone})
  },
  closePaymentProcessor: function(){
    paymentProcessor.classList.add('mb-100');
  },
  makeMobilePayment: function(){
    var data = {
   "tx_ref":"MC-158523s09v5050e8",
   "amount":"1500",
   "currency":"ZMW",
   "network":"MTN",
   "email":"user@gmail.com",
   "phone_number":"054709922220",
   "fullname":"John Madakin"
}
    main.update(components.loader)
    
  },
  makeCardPayment: function() {
    main.update(components.loader)
  },
  showNotifications: function() {
    main.update(components.loader);
requestData({method:'get',url:'/getNotifications',type:'json'},function(response){
  if(response.error) return showError(data={msg:'Could not fetch  notifications'});
  if(response.notifications.length === 0) {
    main.update(components.reset);
    main.update(components.notifications)
    main.update({states: {message:"No Notifications",notifications:[]}});
  } else if(response.notifications.length >= 1) {
     main.update(components.reset);
     main.update(components.notifications)
main.update({states: {message:'',notifications:response.notifications}});
  }
  //alert(JSON.stringify(response))
})

    pushState('notifications','Notifications','/notifications');
  },
  refreshNotifications: function(){
    
    handlers.showNotifications();
  },
  notificationOption: function() {
    notification_id = this.parentElement.parentElement.previousSibling.dataset.id;
    action = this.dataset.action;
    seen = this.dataset.seen;
    requestData({method:'post',url:'/notifications_handle?action='+action+'&notification_id='+notification_id,params:{action:action,key:notification_id,seen:seen},type:'json'},function(response){
      if(response.error) return setPopup("Couldn't process.")
      main.update({states: {notifications:response}})
    });
  },
  closeNotification: function(e){
    dist = e.changedTouches[0]
    x = dist.clientX
    if(x >= 150 && x <= 300) {
      this.style.marginLeft = '15px'
    }
  },
  seenNotification: function(e) {
  seen = this.dataset.action;
  id = this.dataset.id;
requestData({method:'post',url:'/notifications_handle',params:{action:'seen',key:id,seen:seen},type:'json'},function(response){
      if(response.error) return setPopup("Couldn't process.")
      main.update({states: {notifications:response}})
    });
  },
  ballOptions: function(){
    code = this.parentElement.dataset.code;
    number = this.dataset.number;
    alert(number)
    action = this.dataset.action;
    switch(action) {
      case 'buyNow':
        requestData({method:'post',url:'/balls',params:{'action':action,code:code,number:number},type:'json'},function(response){
          if (response.error) return setPopup('Couldn\'t purchase');
          main.update({states: {slots:response.slots}})
        })
    }
  }
}
window.onload =  function() {
  var userData = getCookie('njugaball');
  
  if(userData != null) {
    var userDetails = JSON.parse(userData);
    
    handlers.auth(userDetails);
   // buildAllUI();
   
  } else {
  loadComponent("welcome",handlers,function(component) {
    if(component.error) return showError(data={msg:'Error while processing component'});
    components.welcome = component;
    
    main.update(components.welcome);
    pushState('welcome','Welcome | Njuga - Ball','/');
requestData({method: 'post',url:'/sessions',params:{component:true},type:'json'},function(response){
      if(response.component) {
        if(response.component == 'noslots') {
          handlers.loadSlots()
        } else if(response.component == 'form'){
          login()
        } else if(response.component == 'signup') {
          signup()
        
        } else {
          main.update(components.reset);
        
        
       Object.keys(components).forEach(e =>{
         if( response.component == e ) {
           main.update(components[response.component]);
       pushState(response.component,response.title,response.url)
         } else {
           main.update(components.welcome)
         }
          
       })
       
       var i = 0;
       /*
       do {
         alert('None')
       } while (i <Object.keys(components).length) {
         if(response.component === Object.keys(components)[i]) {
           alert('FOUND ')
           return 0
         } else {
           
           //i = + 1
           
         }
         i =+1;
         break;
       }*/
       
        }
       
      } else {
        
      }
    });
    
    setTimeout(function(){
    header.update({"states":{"state":""},"is":"div","class":" m2 bd-white pt8 flx-r p5 gfont9 @state","nodes":["This site uses cookies data that it will store on your device. Do you agree to the storing of data?",{"is":"div","class":"bd-white m2 flx-r w30 ","nodes":[{"is":"button","class":"pd5 bd-dark ","nodes":["Yes"],"events":{"click":[cookiesData]}},{"is":"button","class":"pd5","nodes":["No"],"events":{"click":[cookiesData]}}]}]})
    },1000);
  })
  }
  
  
}
window.onpopstate = function(e) {
  if(e.state) {
    
    switch (e.state.component) {
      case 'error':
        main.update(components.reset)
        main.update(components[e.state.component]);
        main.update({states:{msg:lastErrorData.msg}});
        break;
      
      default:
        main.update(components.reset)
          main.update(components[e.state.component]);
    }
    
  }
}

function buildAllUI() {
  requestData({method:'get',url:'/user-info',type:'json'},function(response){
      if(response.error) return showError(data={msg:response.message});
 
      user = response;
      ui.update({states:{navigationData:user,handlers:handlers}})
      
    });
    
  loadComponent('header',handlers,function(component){
    if(component.error) return showError(data={msg:'Error while processing component'});
    header.update(components.reset);
    header.update(component);
    //document.title = 'Home | Njuga - Ball'
    main.update(components.loader)
    requestData({method:'post',url:'/notifications_handle',params:{action:'number',key:false,seen:false},type:'json'},function(response){
      if(response.error) alert('OK')
      if (response.unseen == 0){
        response.state = 'bg-dark'
      } else {
        response.state = 'uk-button-danger'
      }
      header.update({states:{notifications:response}});
    });
  });
  loadComponent('navigation',handlers,function(component){
    if(component.error) return showError(data={msg:'Error while processing component'});
    
    navigation.update(component);
    navigation.update({states:user})
    
    
  });
  loadComponent('index',handlers,function(component){
    if(component.error) return showError(data={msg:'Error while processing component'});
    components.index = component
    main.update(component);
    
    pushState('index','Njuga Ball ','/')
    main.update(components.loader);
    requestData({method: 'post',url:'/sessions',params:{component:true},type:'json'},function(response){
      main.update(components.reset);
      if(response.component) {
        if(response.component == 'noslots') {
          handlers.loadSlots()
        } else if(response.component === "slots"){
          handlers.loadSlots()
        } else if(response.component == 'notifications') {
           //main.update(components.reset)
           handlers.showNotifications()
         } else {
          main.update(components.reset);
       main.update(components[response.component]);
       pushState(response.component,response.title,response.url)
        }
       
      } else {
        
        requestData({method:'get',url:'/user-info',type:'json'},function(response){
      if(response.error) return showError(data={msg:response.message});
      //main.update(components.reset)
      main.update(components.index)
      main.update({states:response});
      user = response;
      
      navigation.update({states: user})
    });
      }
    })
    
  })
  loadComponent("noslots",handlers,function(component){
     if(component.error) return showError(data={msg:'Error while processing component'});
     components.noslots = component
  });
  loadComponent('deposit',handlers,function(component){
    if(component.error) return showError(data={msg:'Error while processing component'});
     components.deposit = component;
     
  });
  loadComponent('slots',handlers,function(component){
    if(component.error) return showError(data={msg: 'Error while processing component'});
    components.slots = component;
  });
  loadComponent('notifications',handlers,function(component){
    if(component.error) return showError(data={msg:'Error while processing component'});
    
    components.notifications = component;
    
    
  });
}

function signup(){
  main.update(components.loader);
  
  loadComponent('signup',handlers,function(component){
    if(component.error) return showError(data={msg: 'Error while processing component'});
   main.update(components.reset);
    components.signup= component;
    main.update(components.signup);
    pushState('signup','Sign Up to Njuball','/signup');
  });
  /*
  requestData({method:"post",url:"/login",params:{"username":"martintembo1","password":"543027"},type:"json"},function(response){
    if(response.error)  showError(msg="Not Sure")
    alert(response.password)
  })*/
}
function login(){
  main.update(components.loader);
  loadComponent('form',handlers,function(component){
    if(component.error) return showError(data={msg: 'Error while processing component'});
    components.form = component;
    main.update(components.reset);
    main.update(components.form);
    pushState('form','Login to Njuball','/form');
  });
  /*
  requestData({method:"post",url:"/login",params:{"username":"martintembo1","password":"543027"},type:"json"},function(response){
    if(response.error)  showError(msg="Not Sure")
    alert(response.password)
  })*/
}
function payment(data) {
  if(paymentProcessor.classList.contains('mb-100')) {
    paymentProcessor.classList.remove('mb-100');
    
    main.update({states: {payment:{provider:data.wallet,colors:data.colors,demo:data.phone}}});
  } else {
    paymentProcessor.classList.add('mb-100');
  }
}

function parseComponent() {
  requestData({method: 'post',url:'/sessions',params:{component:true},type:'json'},function(response){
      if(response.component) {
        if(response.component == 'noslots') {
          handlers.loadSlots()
        } else {
          main.update(components.reset);
       main.update(components[response.component]);
       pushState(response.component,response.title,response.url)
        }
       
      } else {
        
      }
    })
}

var routes = {
  "noslots": function() {}
}