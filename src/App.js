import React, { Component } from 'react';
import './App.css';
import './LeftPanel.css';


import LeftPanel from './components/LeftPanel';


class App extends Component {

  constructor(){
    super();

    this.state={

        status : "starting",

       
    }


    this.updateChatApp = this.updateChatApp.bind(this);
    this.cancelDynamic = this.cancelDynamic.bind(this);
  }


  updateChatApp(user)
  {

  

    let messages ;

     // fetch("http://localhost/chat-app/messages.php",{ method : 'POST',body: JSON.stringify(user) , mode : 'cors', cache: 'no-cache',headers: { 'Accept': 'application/json','Content-Type': 'application/json' }})

          fetch("./data/message.json")
          .then(response => response.json())
          .then((result) => { this.setState((prevState)=> ({ status  : prevState.status, leftPanel : prevState.leftPanel,chatApp: { name : user.name, receiverId:user.id ,sse : true, data: result}}))
        })

          .catch(error => console.log(error));



    
  }

  cancelDynamic()
  {
  
   this.setState((prevState)=> ({ status  : prevState.status, leftPanel : prevState.leftPanel,chatApp: { sse : false }}))
        
  }



   componentWillMount() {
      console.log('Component WILL MOUNT! - application')


   }
   componentDidMount() {
                            console.log('DID MOUNT!- application')


               let MyInit = {

                              method: 'GET',
                              mode : 'cors',
                              cache : 'no-cache'
               }             

            fetch("./data/main.json",MyInit)
            .then(response => response.json())
            .then((result)  =>{ this.setState(result) })
            .catch(error => console.log(error));



   }

      componentWillUpdate(nextProps, nextState) {
      console.log('  WILL UPDATE - Application');
   }
   componentDidUpdate(prevProps, prevState) {
      console.log(' DID UPDATE!- Application')
   }
                        


  render() {
            if(this.state.status != "starting")
            {
              return(
          <div className="MainAppBox">
          <div className="LeftPanelContainer"  >
          <LeftPanel  data= {this.state.leftPanel } event={ this.updateChatApp  } />

          </div>

          <div className="App">
          <AppHeader   data ={this.state.chatApp}/>
          <AppBody data ={this.state.chatApp}    />

          <AppSender data = { this.state.chatApp }  cancel={ this.cancelDynamic } />

          </div>      

          </div>


          );


            }
            else{
              return(<h3> App is Starting ......</h3>);
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

 

      this.state.evtSource = new EventSource("http://localhost/chat-app/ssedemo.php");



    }

    

   componentWillMount() {


      console.log(' WILL MOUNT! - AppBody')


   }
   componentDidMount() {
     


      console.log(' DID MOUNT -AppBody')
   }



   componentWillReceiveProps(newProps) {    


   }
   shouldComponentUpdate(newProps, newState) {
      return true;
   }
   componentWillUpdate(nextProps) {
     



      this.state.evtSource.onopen = function() {
    console.log("Connection to server opened.");
  };


  this.state.evtSource.addEventListener("ping", function(e) {
 
  let obj = JSON.parse(e.data);
  
  console.log("chekingsf.."+e.data);

if(obj.length > 0)
  this.setState({ messages : [ { date : "Today", messages : obj }]});

  

}.bind(this), false);

  this.state.evtSource.onerror = function() {
    console.log("EventSource failed.");
  };

   }
   componentDidUpdate(prevProps, prevState) {

      let dataNeed;

  


     // setInterval(this.setinter,3000)
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


        let Init = { method: 'POST', body : JSON.stringify(this.state), mode: 'cors',cache : 'no-cache', headers: { 'Content-Type': 'application/json'} };

        fetch("http://localhost/chat-app/sendMessage.php",Init)
        .then(response => response.text())
        .then( result => {  if(result == "success") {  this.setState({ message : "" }); }   } )
        .catch(error => console.log(error));

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
