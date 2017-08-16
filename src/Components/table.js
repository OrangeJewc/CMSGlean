import React, { Component } from 'react';
import Axios from 'axios';

import Loader from './loader';

export default class Table extends Component {
  constructor(props) {
    super(props);

    this.state = {
      view: 'Gleans',
      data: [],
      currentPage: 1,
      sortType: 'title',
      sortOrder: 'ascending',
      entriesPerPage: 10
    };
  }

  toggleView() {
    if(this.state.view === 'Gleans') {
      this.setState({ data: [], view: 'Users' });
    } else {
      this.setState({ data: [], view: 'Gleans' });
    }
  }

  getEntries() {
    let auth = {
      method: 'GET',
      url: 'http://165.227.29.52/api/gleans',
      headers: {
        'x-auth-token' : window.localStorage.getItem('token')
      }
    }

    Axios(auth).then((res) => {
      if(res.data.success)
        this.setState({ data: res.data.data });
    }).catch((err) => {
      console.log(err);
    })
  }

  editEntry(entry) {
    let history = this.props.parentProps().history;

    history.push(`/edit/${entry.id}`/*, {entry: entry}*/);
  }

  deleteEntry(id) {
    let auth = {
      method: 'DELETE',
      url: `http://165.227.29.52/api/gleans/${id}`,
      headers: {
        'x-auth-token' : window.localStorage.getItem('token')
      }
    };

    Axios(auth).then((res) => {
      if(res.data.success)
        window.location.reload();
    }).catch((err) => {
      console.log(err);
    });
  }

  renderEntries() {
    return (
      <tbody>
        {this.state.data.map((entry, idx) => {
          console.log(entry);
          let upperBound = idx < (this.state.entriesPerPage * this.state.currentPage);
          let lowerBound = idx >= (this.state.entriesPerPage * (this.state.currentPage-1));
          if (upperBound && lowerBound) {
            return (
              <tr key={idx}>
                <td>
                  <a className="btn btn-default" onClick={() => this.editEntry(entry)}><em className="fa fa-pencil"></em></a>
                  <a className="btn btn-danger" onClick={() => this.deleteEntry(entry.id)}><em className="fa fa-trash"></em></a>
                </td>
                <td>{entry.quantity}</td>
                <td>{entry.type.charAt(0).toUpperCase()+entry.type.slice(1)}</td>
                <td>{entry.title}</td>
                <td>{`$${entry.price.toString().substring(0, entry.price.toString().length-2)}.${entry.price.toString().slice(-2)}`}</td>
              </tr>
            );
          }
        })}
      </tbody>
    );
  }

  sort() {
    let gleans = this.state.data;
    let sortedEntries = [];

    switch(this.state.sortType) {
      case 'title':
      case 'type':
        // console.log('type or title');
        if(this.state.sortOrder === 'ascending') {
          sortedEntries = gleans.sort((a, b) => {
            return a[this.state.sortType].toLowerCase().localeCompare(b[this.state.sortType].toLowerCase());
          });
        } else {
          sortedEntries = gleans.sort((a, b) => {
            return b[this.state.sortType].toLowerCase().localeCompare(a[this.state.sortType].toLowerCase());
          });
        }
        break;

      case 'quantity':
      case 'price':
        // console.log('quantity or price')
        if(this.state.sortOrder === 'ascending') {
          sortedEntries = gleans.sort((a, b) => {
            return a[this.state.sortType] - b[this.state.sortType];
          });
        } else {
          sortedEntries = gleans.sort((a, b) => {
            return b[this.state.sortType] - a[this.state.sortType];
          });
        }
        break;

      default:
        break;
    }

    // console.log(sortedEntries);
    this.setState({data: sortedEntries});
  }

  renderSort() {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <select style={{ height: '30px', marginRight: '10px' }} value={this.state.sortType} onChange={(ev) => this.setState({sortType: ev.target.value})}>
            <option value="title">Title</option>
            <option value="type">Type</option>
            <option value="quantity">Quantity</option>
            <option value="price">Price</option>
          </select>

          <select style={{ height: '30px', marginRight: '10px' }} value={this.state.sortOrder} onChange={(ev) => this.setState({sortOrder: ev.target.value})}>
            <option value="ascending">Ascending</option>
            <option value="descending">Descending</option>
          </select>

          <button type="button" className="btn btn-sm btn-primary btn-create" onClick={() => this.sort()}>Sort</button>
        </div>
      </div>
    );
  }

  updatePage(page) {
    this.setState({currentPage: page});
  }

  pagination() {
    let numPages = Math.ceil(this.state.data.length/this.state.entriesPerPage);
    let tmp = Array.from(Array(numPages).keys());
    
    return (
      <div className="col col-xs-8">
        <ul className="pagination hidden-xs pull-right">
          {this.state.currentPage != 1 ? <li><a className='btn btn-primary-outline' onClick={() => this.updatePage(this.state.currentPage-1)}>«</a></li> : null}

          {tmp.map((page) => {
            return (
              <li key={page+1}>
                <a
                  className={this.state.currentPage == page+1 ? 'btn btn-primary-outline active' : 'btn btn-primary-outline'}
                  onClick={() => this.updatePage(page+1)}>
                    {page+1}
                </a>
              </li>
            );
          })}

          {this.state.currentPage != numPages ? <li><a className='btn btn-primary-outline' onClick={() => this.updatePage(this.state.currentPage+1)}>»</a></li> : null}
        </ul>
        <ul className="pagination visible-xs pull-right">
            {this.state.currentPage != 1 ? <li><a className='btn btn-primary-outline' onClick={() => this.updatePage(this.state.currentPage-1)}>«</a></li> : null}
            {this.state.currentPage != numPages ? <li><a className='btn btn-primary-outline' onClick={() => this.updatePage(this.state.currentPage+1)}>»</a></li> : null}
        </ul>
      </div>
    );
  }

  renderPagesPer() {
    return (
      <select style={{ height: '30px', marginRight: '15px', position: 'absolute', top: '0', right: '0' }} value={this.state.entriesPerPage} onChange={(ev) => this.setState({entriesPerPage: parseInt(ev.target.value)})}>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="20">20</option>
        <option value="25">25</option>
      </select>
    );
  }

  renderTable() {
    return (
      <div className="col-md-10 col-md-offset-1">
      
        <div style={{ width: '100%', height: '50px', display: 'inline-block', paddingBottom: '10px' }}>
          <button className='btn btn-primary bigButton' onClick={() => this.toggleView()}>
            <div className='buttonContentCenter2'>
              <div className='buttonText'>{`View ${this.state.view === 'Gleans' ? 'Users' : 'Gleans'}`}</div>
            </div>
          </button>
        </div>
        
        <div className="panel panel-default panel-table">
          <div className="panel-heading">
            <div className="row">
              <div className="col col-xs-6" style={{position: 'absolute'}}>
                <h3 className="panel-title">{this.state.view === 'Gleans' ? 'Gleans' : 'Users'}</h3>
              </div>
              <div className="col col-xs-6" style={{position: 'absolute', right: '0', marginRight: '15px', width: 'auto'}}>
                <h3 className="panel-title" style={{ position: 'relative', right: '50px' }}>{'Entries Per Page:'}</h3>
                {this.renderPagesPer()}
              </div>
              {this.renderSort()}
            </div>
          </div>
          <div className="panel-body">
            <table className="table table-striped table-bordered table-list">
              <thead>
                <tr>
                    <th><em className="fa fa-cog"></em></th>
                    <th className="col-xs-1">Quantity</th>
                    <th className="col-xs-2">Type</th>
                    <th>Title</th>
                    <th className="col-xs-2">Price</th>
                </tr> 
              </thead>

              {this.renderEntries()}

            </table>
        
          </div>
          <div className="panel-footer">
            <div className="row">
              <div className="col col-xs-4">{`Page ${this.state.currentPage} of ${Math.ceil(this.state.data.length/this.state.entriesPerPage)}`}
              </div>
              {this.pagination()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    if(this.state.data.length == 0) {
      this.getEntries();
      return <Loader />;
    } else {
      return (
        <div>
          {this.renderTable()}
        </div>
      );
    }
  }
}