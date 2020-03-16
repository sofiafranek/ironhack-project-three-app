import React, { Component } from 'react';
import './style.scss';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: ''
    };
    this.startSearch = this.startSearch.bind(this);
  }

  startSearch(event) {
    const search = event.target.value;
    console.log(search, 'SEARCH');
    this.setState({
      search
    });
    this.props.search(search);
  }

  render() {
    return (
      <div className="search-box">
        <form className="col-12">
          <input
            type="search"
            name="search"
            value={this.state.search}
            onChange={this.startSearch}
            placeholder="Search Accounts"
            autoComplete="off"
          />
        </form>
      </div>
    );
  }
}

export default Search;