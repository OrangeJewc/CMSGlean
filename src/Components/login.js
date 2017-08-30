import React, {Component} from 'react';
import Axios from 'axios';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      status: true
    };
  }

  login() {
    let auth = {
      method: 'POST',
      url: 'http://165.227.29.52/api/auth',
      data: {
        email: this.state.email,
        password: this.state.password
      }
    };

    // console.log(this.state.email, this.state.password);

    return Axios(auth).then((res) => {
      if(res.data.success) {
        //set local storage to id as well and have a check in home comp.
        window.localStorage.setItem('token', res.data.token);
        window.localStorage.setItem('userId', res.data.data.id);
        // this.props.history.push(`/${res.data.data.id}`);
        this.props.history.push('/home');
      }
    }).catch((err) => {
      alert('Incorrect email/password!');
    });
  }

  render() {
    return (
      <div className='verticalCenter'>
        <div style={styles.loginContainer}>
          <div style={styles.header}>ADMIN LOGIN</div>
          <hr style={{border: '1px solid #d3cea7', margin: '10px 0px 10px 0px'}}/>

          <form>
            <div style={styles.input}>
              <i style={{...styles.inside, marginTop: '2px'}} className="fa fa-envelope fa-2x"></i>
              <input type='email' style={{ textIndent: '30px' }} className='form-control' placeholder='Enter email' onChange={(ev) => this.setState({email: ev.target.value})}></input>
            </div>

            <div style={styles.input}>
              <i style={{...styles.inside, marginTop: '4px', marginLeft: '10px'}} className="fa fa-unlock-alt fa-2x"></i>
              <input type='password' style={{ textIndent: '30px' }} className='form-control' placeholder='Enter password' onChange={(ev) => this.setState({password: ev.target.value})}></input>
            </div>

            <div style={styles.input}>
              <button type='button' className='btn btn-primary btn-block' onClick={this.login.bind(this)}>
                LOGIN
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const styles = {
  loginContainer: {
    width: '30vw',
    height: '190px',
    border: '2px solid #d3cea7',
    borderRadius: '5px',
    backgroundColor: '#e0dbb1'
  },
  header: {
    fontSize: '18px',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: '10px',
  },
  input: {
    paddingRight: '15px',
    paddingLeft: '15px',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginBottom: '10px'
  },
  inside: {
    position: 'absolute',
    // marginTop: '2px',
    // transform: 'translateY(10%)',
    marginLeft: '5px'
  }
}