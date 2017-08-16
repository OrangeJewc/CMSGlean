import React, {Component} from 'react';
import Axios from 'axios';

import Loader from './loader';
import Welcome from './welcome';
import Table from './table';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      width: window.innerWidth
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions.bind(this));
  }

  componentWillMount() {
    this.updateDimensions();
  }

  updateDimensions() {
    this.setState({ width: window.innerWidth });
  }

  /*renderButtons() {
    let relativeWidth = (this.state.width - (0.05*this.state.width)); //1368
    let totalButtonPadding = relativeWidth*0.3; //410.4
    let remainingWidth = relativeWidth - totalButtonPadding; //957.6
    let buttonWidth = remainingWidth/3; //319.2

    return (
      <div className='buttonRow' style={{ height: `${buttonWidth}px` }}>
      
        <div className='buttonContainer' style={{ width: `${buttonWidth}px` }}>
          <a href='#' className='btn btn-primary bigButton'>
            <div className='buttonContentCenter'>
              <i className='fa fa-eye fa-5x iconSize'></i>
              <br />
              <div className='buttonText'>{'View Gleans'}</div>
            </div>
          </a>
        </div>

        <div className='buttonContainer' style={{ width: `${buttonWidth}px` }}>
          <a href='#' className='btn btn-info bigButton'>
            <div className='buttonContentCenter'>
              <i className='fa fa-user fa-5x iconSize'></i>
              <br />
              <div className='buttonText'>{'View Users'}</div>
            </div>
          </a>
        </div>

        <div className='buttonContainer' style={{ width: `${buttonWidth}px` }}>
          <a href='#' className='btn btn-danger bigButton'>
            <div className='buttonContentCenter'>
              <i className='fa fa-sign-out fa-5x iconSize'></i>
              <br />
              <div className='buttonText'>{'Logout'}</div>
            </div>
          </a>
        </div>

      </div>
    );
  }*/
  
  getProps() {
    return this.props;
  }

  renderTable() {
    return (
      <Table parentProps={() => this.getProps()} userID={this.state.user.id}/>
    );
  }

  loadUser() {
    let auth = {
      method: 'GET',
      url: 'http://165.227.29.52/api/users',
      headers: {
        'x-auth-token' : window.localStorage.getItem('token')
      }
    };

    return Axios(auth).then((res) => {
      if(res.data.success)
        this.setState({ user: res.data.data });
    }).catch((err) => {
      console.log(err);
    });
  }

  initialize() {
    if(window.localStorage.getItem('token') == null/* || window.localStorage.getItem('userId') !== this.props.location.state.id*/) {
      this.props.history.push('/');
    } else {
      console.log(this);
      this.loadUser();
    }
  }

  render() {
    if(this.state.user == null || window.localStorage.length == 0)
      this.initialize();

    let { user } = this.state;

    return (
      <div style={{ width: '100%' }}>
        {this.state.user == null ? <Loader /> : 
        
        <div>
          <Welcome message={`welcome ${user.contact.first_name}`} buttonType='logout' history={this.props.history}/>
          {this.renderTable()}
        </div>
        }
      </div>
    );
  }
}
