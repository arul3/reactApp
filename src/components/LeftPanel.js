import React, { Component } from 'react';



class LeftPanel extends Component{

	  componentWillMount() {
      								console.log("data in LeftPanel componentWillMount ")

   							}

	render(){

		return(

		<div className="left_panel">
           
			<LeftPanelHeader  logout = {this.props.logout}/>
            
           
            <Search />
            
            
            <ChatPanel data={ this.props.data } event = {this.props.event} />
         
            
        </div>


			);
	}

}




class LeftPanelHeader extends Component{

render(){

	return(
			 <div className="header">
                <img src="./img/default.png" className="avatar" />
                
                <i className="material-icons chat_icon" >chat</i>
                <i className="material-icons menu" onClick= {this.props.logout }>more_vert</i>
            </div>

		);
}

}


class Search extends Component{
	render(){
		return(
			 <div className="search">
                <div className="search_bar">
                    <i className="material-icons" style={{fontSize: '18px' , display: 'inline' , float: 'left' , position: 'relative' , top: '8px' , left: '8px' }}>search</i>
                    <input type="text" className="search_input" />
                </div>
                
            </div> 

		);
	}
}


class ChatPanel extends  Component{

	render(){

		return(
				  <div className="chat_panel" data = {this.props.data} >
           				{
					this.props.data.chatList.map((usersObject,i) => <User  usersObject={usersObject} key={i}  updateF={this.props.event}/> )
						}

         		 </div>
				
		);
	}
}

class User extends Component{

	render(){
		return(

		<div className="user_area" onClick={() => this.props.updateF(this.props.usersObject)}  >
           
            <div className="icon">
                <img className="avatar_small" src={ this.props.usersObject.avatar } />
            </div>
           
            
           <div className="title">
               <div className="title_name_bar">
                   <div className="title_name"> { this.props.usersObject.name} 			</div>
                   <div className="time_stamp"> { this.props.usersObject.lastTime }			</div>
               </div>
               <div className="title_msg_bar">
                   <div className="title_msg"> { this.props.usersObject.lastMessage }		</div>
               </div>
           </div>
           
        </div> 

			);
	}
}


export default LeftPanel;