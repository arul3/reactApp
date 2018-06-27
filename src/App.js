import React, { Component } from 'react';
import './App.css';
import './LeftPanel.css';
import './login.css';

import LeftPanel from './components/LeftPanel';


global.f ;

global.CrossAjax = class CrossAjax{

  static   getInit = {

                                            method: 'GET',
                                            mode : 'cors',
                                            cache : 'no-cache',
                                            credentials: 'include'
                          } 


  static GET = ((url) =>{ return fetch(url,CrossAjax.getInit).then(response =>{  CrossAjax.LOG("get "+response); return response.json()} )
                            .catch(error => { console.log(error) })

    }  

    );

  static LOG = ((logData) => { console.log(logData); });

  static POST = ((url,bodyObject) => {

          var MyInit = {

                                            method: 'POST',
                                            mode : 'cors',
                                            cache : 'no-cache',
                                            credentials: 'include'
          };

          MyInit.body = JSON.stringify(bodyObject);

            CrossAjax.LOG(MyInit);
            CrossAjax.LOG(bodyObject);

          return fetch(url,MyInit).then(response => {

                    CrossAjax.LOG("post "+response);
                    return response.json();
          })
            .catch(error => console.log(error))

  });
}
global.Ajax = class Ajax{

  static   getInit = {

                                            method: 'GET',
                                            mode : 'same-origin',
                                            cache : 'no-cache',
                                            credentials: 'same-origin'
                          } 


  static GET = ((url) =>{ return fetch(url,Ajax.getInit).then(response =>{  Ajax.LOG("get "+response); return response.json()} )
                            .catch(error => { console.log(error) })

    }  

    );

  static LOG = ((logData) => { console.log(logData); });

  static POST = ((url,bodyObject) => {

          var MyInit = {

                                            method: 'POST',
                                            mode : 'same-origin',
                                            cache : 'no-cache',
                                            credentials: 'same-origin'
          };

          MyInit.body = JSON.stringify(bodyObject);

            Ajax.LOG(MyInit);
            Ajax.LOG(bodyObject);

          return fetch(url,MyInit).then(response => {

                    Ajax.LOG("post "+response);
                    return response.json();
          })
            .catch(error => console.log(error))

  });
}


class App extends Component {

  constructor(){
    super();

    this.state={

        status : "starting",
        loggedIn: false,
        dataLoaded: false,
        username : "",
        password : ""

       
    }


    this.updateChatApp = this.updateChatApp.bind(this);
    this.cancelDynamic = this.cancelDynamic.bind(this);
    this.userLogIn = this.userLogIn.bind(this);

    this.setUserName = this.setUserName.bind(this);
    this.setPassWord = this.setPassWord.bind(this); 

    this.logout = this.logout.bind(this);
  }

 setUserName(e)
 {
  let userName = e.target.value;

          this.setState({ username : userName});
          console.log(this.state);
          
 }

 setPassWord(e){
  let password = e.target.value;

  this.setState({password : password });

  console.log(this.state.password);
 }

  userLogIn(e)
  {
    alert("userLogIn");

    e.preventDefault();


         global.CrossAjax.POST("http://localhost/chat-app/login.php",this.state)
         .then((result) => { this.setState(result); alert(result); })

  }

  updateChatApp(user)
  {

   let messages ;

        global.CrossAjax.POST("http://localhost/chat-app/messages.php",user)
        .then((result) => { this.setState((prevState)=> ({ status  : prevState.status, leftPanel : prevState.leftPanel,chatApp: { name : user.name, receiverId:user.id ,sse : true, data: result}}))
              })
}

  cancelDynamic()
  {
  
   this.setState((prevState)=> ({ status  : prevState.status, leftPanel : prevState.leftPanel,chatApp: { sse : false }}))
        
  }

  logout()
  {
    
  global.CrossAjax.GET("http://localhost:80/chat-app/logout.php")
  .then(result => { 

              if(result.logout == true)
                                alert("loggedOUt");

          });
  }



   componentWillMount() {
      console.log('Component WILL MOUNT! - application')


   }
   componentDidMount() {
                            console.log('DID MOUNT!- application');
                        


                           if(this.state.loggedIn == false && this.state.dataLoaded == false)
                            {

                   global.CrossAjax.GET("http://localhost:80/chat-app/alreadyLoggedIn.php")
                          .then((result) => { if(result.loggedIn == true) 
                                this.setState({loggedIn : true});
                              })

                            }    

              
               

   }

      componentWillUpdate(nextProps, nextState) {
      console.log('  WILL UPDATE - Application');
   }
   componentDidUpdate(prevProps, prevState) {
    
                  if(this.state.loggedIn && this.state.dataLoaded == false)
                     {
                    console.log("loading data...");

             global.CrossAjax.GET("http://localhost:80/chat-app/main.php")
             .then(result => { this.setState(result); } )

               }
                            
      console.log(' DID UPDATE!- Application')
   }
                        


  render() {



            if(this.state.loggedIn && this.state.dataLoaded)
            {
              return(
          <div className="MainAppBox">
          <div className="LeftPanelContainer"  >
          <LeftPanel  data= {this.state.leftPanel } event={ this.updateChatApp  } logout = {this.logout} />

          </div>

          <div className="App">
          <AppHeader   data ={this.state.chatApp}/>
          <AppBody data ={this.state.chatApp}    />

          <AppSender data = { this.state.chatApp }  cancel={ this.cancelDynamic } />

          </div>      

          </div>


          );


            }
            if( this.state.dataLoaded == false && this.state.loggedIn == true){  return (<h3>dfsdfld </h3> );  }
            

            if(this.state.loggedIn == false ) {
              return(<div className="login-page">
  <div className="form">
    <form className="register-form">
      <input type="text" placeholder="name"/>
      <input type="password" placeholder="password" />
      <input type="text" placeholder="email address"/>
      <button>create</button>
      <p className="message">Already registered? <a href="#">Sign In</a></p>
    </form>
    <form className="login-form">
      <input type="text" placeholder="username"   value ={this.state.username} onChange = { this.setUserName }/>
      <input type="password" placeholder="password" value = { this.state.password }  onChange={ this.setPassWord } />
      <button onClick = { this.userLogIn }>login</button>

      <button>Guest Login</button>
      <p className="message">Not registered? <a href="#">Create an account</a></p>
    </form>
  </div>
</div>


                );
            }
    

  }
}


class AppHeader extends Component{

    componentDidMount() {
     
      console.log('Chat Header  -- DID MOUNT!')
   }
    componentWillUpdate(nextProps, nextState) {
      console.log('App-header  WILL UPDATE!');
   }
   componentDidUpdate(prevProps, prevState) {
      console.log('App Header -  DID UPDATE!')
   }


  render(){

    return (
            <div className="App-header">
              <div className="App-headerAvatarDiv">
                  <img src="./img/default.png"  className="App-headerAvatar"  />
              </div>
              <div className="App-headerNameDiv">
                <div className="NameDiv">

                  <div className="NameDivTextContainer">
                    { this.props.data.name  }
                    </div>
                </div>
                <div className="LastSeenDiv">
                  <div className="LastSeenTextContainer">
                    5 minutes ago...
                    </div>
                </div>

              </div> 

              <div className="App-headerOptionDiv">

                <div className="optionBox1">

                <i className="material-icons searchBox" >search</i>
                </div>

                <div className="optionBox2">


                <i className="material-icons attachFile" >attach_file</i>

                </div>
                <div className="optionBox3">
                </div>

              </div>
            </div>
    );
  }
}

class AppBody extends Component{

    constructor(props){
      super();

      let txt = [];

      console.log("calling CONSTRUCTOR().... ");

      this.state = { messages : [ { date : "28 March", messages : [] }] };

 

     this.state.previousUserId = 0;

     this.state.evtSource =null;

    }

   

    

   componentWillMount() {


      console.log(' WILL MOUNT! - AppBody')


   }
   componentDidMount() {
     


      console.log(' DID MOUNT -AppBody')
   }



   componentWillReceiveProps(newProps) {  

   
      global.f =true;
      
  if(this.state.evtSource != null )
   this.state.evtSource.close();
 

   }
   shouldComponentUpdate(newProps, newState) {
      return true;
   }
   componentWillUpdate(nextProps) {
     

    console.log(" prev userid "+this.state.previousUserId +" props id "+nextProps.data.receiverId);

    if(this.state.evtSource != null )
   this.state.evtSource.close();
   

   }
   componentDidUpdate(prevProps, prevState) {

   
      let data1;

      let flag = 1;

     //alert(prevProps.receiverId);

      let receiverId = this.props.data.receiverId;

      if (global.f == true) {

        global.f = false;

         this.setState({ messages : [ { date : "Today", messages : [] }]});

      } else {

         let url ="http://localhost/chat-app/ssedemo.php?id="+receiverId; 
      console.log("url is "+url);

     this.state.evtSource = new EventSource(url);

      this.state.evtSource.onopen = function() {
                console.log("Connection to server opened.");
     };


    this.state.evtSource.addEventListener("ping", function(e) {
 
  let obj = JSON.parse(e.data);
  
  console.log("chekingsf.."+e.data);

 data1 = this.state.messages[0].messages;
  
 if(global.f == true )
  {
     // this.setState({ messages : [ { date : "28 March", messages : [] }] , previousUserId : this.props.receiverId });

     data1 =[];
    
     global.f = false;

  } 

      


           


if(obj.length > 0)
{
      let data = data1.concat(obj);

  this.setState({ messages : [ { date : "Today", messages : data }]});

;
}
  
}.bind(this), false);

   this.state.evtSource.onerror = function() {
    console.log("EventSource failed.");
  };
  

      }

       
     // alert(receiverId);

     


  
      console.log('DID UPDATE - App-Body ')
   }
   componentWillUnmount() {
      console.log(' WILL UNMOUNT - Component')
   }



  render(){
    return(
        <div className="App-Body">

        <div className="App-bodyInside">
        {

          this.props.data.data.map((messageObject,key)=> <AppBodyMessages messageObject = {messageObject} key={ key} /> )

         }  
          {

          this.state.messages.map((messageObject,key)=> <AppBodyMessages messageObject = {messageObject} key={ key} /> )

         }

         </div>

        </div>

    );
  }


  
}

class AppBodyMessages extends Component{

  render(){

    return(
            <div style={{display : 'inline'}}>
             <DayInfo date = {this.props.messageObject.date} />
             {

                this.props.messageObject.messages.map((message,key) => <MessageElement messageObject ={ message} key={ key} /> )
            }

            </div>
            

    );
  }
}


class DayInfo extends Component{

  render(){

    return ( 
              <div className="DateBox" >
              <div className="DateBoxInside">

                  <div className="DateBoxLeft">
                  </div>

                  <div className="DateBoxMain">

                    <div className="DateBoxText">
                        { this.props.date }
                    </div>
                    
                  </div>
                  <div className="DateBoxRight">
                  </div>
              </div>
              </div>

    );
  }
}


class MessageElement extends Component{

componentWillMount() {
      console.log('Component WILL MOUNT!')

  

   }

  render(){
    if(this.props.messageObject.type == "send")
    {
      return(
            <SendMessage messageObject={this.props.messageObject} />
      );

    }

    else{
      return( <ReceiveMessage messageObject={this.props.messageObject} /> );
    }
    
  }
}

class SendMessage extends Component{

  componentWillMount() {
      console.log('SendMessage  --- WILL MOUNT! -- ')
      

   }

  render(){
    return(
            <div className="send">
            <div className="sendBox">
            { this.props.messageObject.message  }
            </div>
            <div className="sendDetail" >
              {
                this.props.messageObject.time
              }
            </div>
          </div>


    );
  }
}


class ReceiveMessage extends Component{
  render(){
    return(
          <div className="receive">
            <div className="receiveBox">
            { this.props.messageObject.message}
            </div>
            <div className="receiveDetail" >
              {this.props.messageObject.time }
            </div>
          </div>
    );
  }
}


class AppSender extends Component{

  constructor(props){
    super(props);

      this.state = { message : "", id : null , };

      this.updateMessage = this.updateMessage.bind(this);
      this.sendingMessage = this.sendingMessage.bind(this);
      }

     sendingMessage()
      {

             global.CrossAjax.POST("http://localhost/chat-app/sendMessage.php",this.state)
               .then( result => {  if(result.status == "success") {  this.setState({ message : "" }); }   } )

      }


      updateMessage(e)
      {
          let message = e.target.value;

          this.setState({ message : message});

          console.log(this.state);

      }


     componentWillReceiveProps(newProps) {    
       this.setState({ id : newProps.data.receiverId});


    
   }

  render(){

    return(

        <div className="AppSender">

          <div className="senderBox">
            <div className="senderBoxInput">

            <input type="text" name ="sendingMessage" value={ this.state.message }className="sendingMessage" id="sendingMessage" onChange={this.updateMessage} />
            </div>

            <div className="senderBoxButton">

                <div className="senderButton" onClick= { this.sendingMessage  }>
                  <div className="textContainer">

                        SEND
                  </div>

                </div>

            </div>

          </div>
        </div>

    );
  }
}
export default App;
