import React, { Component } from 'react';
import InlineEdit from 'react-edit-inline';
import Moment from 'moment';
import DatePicker from 'react-datepicker';
import Axios from 'axios';
import ReactImageFallback from 'react-image-fallback';
import { Link } from 'react-router-dom';

import 'react-datepicker/src/stylesheets/datepicker-cssmodules.scss';

import Welcome from './welcome';
import User from './user';

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

export default class EditEntry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // entry: this.props.location.state.entry,
      entry: null,
      editMode: false,
      owner: null,
      datePickerActiveCreate: false,
      datePickerActiveExpire: false,
      datePickerDate: null
    };
  }

  componentDidMount() {
    let auth = {
      method: 'GET',
      url: `http://165.227.29.52/api/gleans/${this.props.match.params.glean}`,
      headers: {
        'x-auth-token' : window.localStorage.getItem('token')
      }
    };

    Axios(auth).then((res) => {
      if(res.data.success) {
        this.setState({ entry: res.data.data });
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  save() {
    let auth = {
      method: 'PUT',
      url: `http://165.227.29.52/api/gleans/${this.state.entry.id}`,
      headers: {
        'x-auth-token' : window.localStorage.getItem('token')
      },
      data: this.state.entry
    };

    Axios(auth).then((res) => {
      window.location.reload();
    }).catch((err) => {
      console.log(err);
    });
  }

  loadOwner() {
    console.log(this.state.entry);
    if(this.state.entry.owner == null) {
      this.setState({ owner: {
        contact: {
          first_name: 'No',
          last_name: 'owner'
        }
      }})
    } else {
      let id = this.state.entry.owner.id;

      let auth = {
        method: 'GET',
        url: `http://165.227.29.52/api/users/${id}`,
        headers: {
          'x-auth-token' : window.localStorage.getItem('token')
        }
      };

      Axios(auth).then((res) => {
        if(res.data.success) {
          this.setState({ owner: res.data.data });
        }
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  openDatePicker(type, startDate) {
    if(type === 'create')
      this.setState({ datePickerActiveCreate: true, datePickerDate: startDate });
    else
      this.setState({ datePickerActiveExpire: true, datePickerDate: startDate });
  }

  closeDatePicker(type) {
    if(type === 'create')
      this.setState({ datePickerActiveCreate: false, datePickerDate: null });
    else
      this.setState({ datePickerActiveExpire: false, datePickerDate: null });
  }

  updateDate(property, date) {
    let type = property === 'expiration' ? 'expire' : 'create';
    let tmp = {created_at: date.toISOString()};

    this.setState({ editMode: true, entry: Object.assign(this.state.entry, tmp) });
    this.closeDatePicker(type);
  }

  update(data) {
    if(!this.state.editMode)
      this.setState({ editMode: true });

    if(Object.getOwnPropertyNames(data)[0] === 'price') {
      data.price = Number(data.price.replace(/[^0-9]+/g,""));
      this.setState({ entry: Object.assign(this.state.entry, data)});
    } else if(Object.getOwnPropertyNames(data)[0] === 'quantity') {
      data.quantity = parseInt(data.quantity);
      this.setState({ entry: Object.assign(this.state.entry, data)});
    } else {
      this.setState({ entry: Object.assign(this.state.entry, data)});
    }
  }

  convertPrice(price) {
    return `$${price.toString().substring(0, price.toString().length-2)}.${price.toString().slice(-2)}`;
  }

  renderHeader() {
    return (
      <div style={{ backgroundColor: '#ddd' }}>        
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <InlineEdit activeClassName='editing' text={this.state.entry.title} paramName='title' change={this.update.bind(this)} style={styles.title}></InlineEdit>
          <InlineEdit activeClassName='editing' text={this.state.entry.description} paramName='description' change={this.update.bind(this)} style={styles.description}></InlineEdit>
        </div>

        <div style={styles.line}>
          <ReactImageFallback
            src={this.state.entry.image}
            className='verticalCenter imgCircle'
            fallbackImage='glean.png'>
          </ReactImageFallback>
        </div>
      </div>
    );  
  }

  rightHalf() {
    return (
      <div className='rightHalf'>
        <div className='entryField'>
          <label className='label'>Type: </label>
          <select value={this.state.entry.type} onChange={(ev) => this.update({type: ev.target.value})}>
            <option value="donation">Donation</option>
            <option value="marketplace">Marketplace</option>
          </select>
        </div>

        <div className='entryField'>
          <label className='label'>Price: </label>
          <InlineEdit text={this.convertPrice(this.state.entry.price)} paramName='price' change={this.update.bind(this)}></InlineEdit>
        </div>

        <div className='entryField'>
          <label className='label'>Quantity: </label>
          <InlineEdit text={this.state.entry.quantity.toString()} paramName='quantity' change={this.update.bind(this)}></InlineEdit>
        </div>           
      </div>
    );
  }

  leftHalf() {
    return (
      <div className='leftHalf'>
        <div className='entryField'>
          <label className='label'>Created: </label>
          <p onClick={() => this.openDatePicker('create', this.state.entry.created_at)}>{Moment(this.state.entry.created_at).format('MMMM Do, YYYY')}</p>
          {this.state.datePickerActiveCreate ?
            <DatePicker
              withPortal
              inline
              selected={Moment(this.state.entry.created_at)}
              onChange={(date) => this.updateDate('created_at', date)}
              onClickOutside={() => this.closeDatePicker('create')}
              />
            :
              null}
        </div>

        <div className='entryField'>
          <label className='label'>Expires: </label>
          <p onClick={() => this.openDatePicker('expire', this.state.entry.expiration)}>{Moment(this.state.entry.expiration).format('MMMM Do, YYYY')}</p>
          {this.state.datePickerActiveExpire ?
            <DatePicker
              withPortal
              inline
              selected={Moment(this.state.entry.expiration)}
              onChange={(date) => this.updateDate('expiration', date)}
              onClickOutside={() => this.closeDatePicker('expire')}
              />
            :
              null}
        </div>

        <div className='entryField'>
          <label className='label'>Owner: </label>
          {/*<a className='owner'>{[this.state.owner.contact.first_name, this.state.owner.contact.last_name].join(' ')}</a>*/}
          {this.state.owner == null ? loader && this.loadOwner() : <Link to={`/user/${this.state.owner.id}`} className='owner'>{[this.state.owner.contact.first_name, this.state.owner.contact.last_name].join(' ')}</Link>}
        </div>
      </div>
    );
  }

  render() {
    if(this.state.entry != null) {
      return (
        <div style={{ width: '100%' }}>
          <Welcome message='edit glean' buttonType={'back'} history={this.props.history}/>

          <div className="col-md-10 col-md-offset-1">
            <div className='gleanContainer'>
              <button style={{ position: 'absolute' }} className={`btn btn-success btn-sq-sm ${this.state.editMode ? 'show' : 'dontShow'}`} onClick={() => this.save()}><i className='fa fa-check fa-3x'></i></button>
              {this.renderHeader()}
              
              <div className='bottomHalf'>
                {this.leftHalf()}
                {this.rightHalf()}
              </div>

            </div>
          </div>

        </div>
      );
    } else {
      return loader;
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
  }
};