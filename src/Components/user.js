import React, { Component } from 'react';
import Welcome from './welcome';
import Axios from 'axios';

const loader = (
  <div className="sk2-cube-grid">
    <div className="sk2-cube sk-cube1"></div>
    <div className="sk2-cube sk-cube2"></div>
    <div className="sk2-cube sk-cube3"></div>
    <div className="sk2-cube sk-cube4"></div>
    <div className="sk2-cube sk-cube5"></div>
    <div className="sk2-cube sk-cube6"></div>
    <div className="sk2-cube sk-cube7"></div>
    <div className="sk2-cube sk-cube8"></div>
    <div className="sk2-cube sk-cube9"></div>
  </div>
);

export default class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null
    };
  }

  componentWillMount = () => {
    let auth = {
      method: 'GET',
      url: `http://165.227.29.52/api/users/${this.props.match.params.id}`,
      headers: {
        'x-auth-token' : window.localStorage.getItem('token')
      }
    };

    Axios(auth).then((res) => {
      if(res.data.success)
        this.setState({ user: res.data.data });
    }).catch((err) => {
      console.log(err);
    });
  }
  
  renderHeader() {
    let me = this.state.user;
    console.log(me);
    return (
      <div style={{ backgroundColor: '#ddd' }}>        
        <div style={{ display: 'flex', justifyContent: 'center', height: '100px' }}>
          <div style={styles.title}>{me.contact.first_name.concat(` ${me.contact.last_name}`)}</div>
          <div style={styles.description}>{me.type}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100px' }}>
          <div style={styles.field}>
            <div>
              <span className='fa fa-envelope fa-2x' style={{display: 'inline-flex'}}><p style={styles.text}>{me.email}</p></span>
            </div>
          </div>

          <div style={styles.field}>
            <div>
              <span className='fa fa-building fa-2x' style={{display: 'inline-flex'}}><p style={styles.text}>{me.org.name}</p></span>
            </div>
          </div>
        </div>
      </div>
    );  
  }

  render() {
    if(this.state.user == null)
      return loader;
    else {
      return (
        <div style={{ width: '100%' }}>
          <Welcome message='view user' buttonType={'back'} history={this.props.history}/>

          <div className="col-md-10 col-md-offset-1">
            <div className='userContainer'>
              {this.renderHeader()}
            </div>
          </div>
        </div>
      );
    }
  }
}

const styles = {
  line: {
    display: 'block',
    height: '200px',
    width: '100%',
    // border: '0',
    // borderTop: '5px solid #f5f5f5',
    padding: '0',
    position: 'relative',
    top: '200px',
    backgroundColor: '#f5f5f5'
  },
  title: {
    position: 'absolute',
    margin: '0 auto',
    marginTop: '5px',
    fontSize: '40px',
    fontWeight: '500'
  },
  description: {
    position: 'absolute',
    marginTop: '65px',
    fontStyle: 'italic',
    fontSize: '20px'
  },
  edit: {
    position: 'relative',
    width: '50%',
    margin: '0 auto',
    marginTop: '10px'
  },
  field: {
    display: 'flex',
    // flexDirection: 'column',
    justifyContent: 'center',
    // width: '50%',
    // height: '100px'
  },
  text: {
    marginLeft: '10px'
  }
};