import React, { Component } from 'react';
import './style.scss';
import { Link } from 'react-router-dom';

import Layout from '../../Components/Layout';
import Transaction from '../../Components/Transaction';

import Button from '@material-ui/core/Button';

import Breadcrumb from 'react-bootstrap/Breadcrumb';

import { deleteAccount } from './../../Services/account';
import { allTransactionsAccount } from './../../Services/transaction';

class SingleAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: null,
      transactions: []
    };
    this.deleteAnAccount = this.deleteAnAccount.bind(this);
  }

  deleteAnAccount(event) {
    event.preventDefault();
    const accountID = this.props.match.params.id;
    deleteAccount(accountID)
      .then(() => {
        this.props.history.push({
          pathname: '/accounts'
        });
      })
      .catch(error => console.log(error));
  }

  componentDidMount() {
    const accountID = this.props.match.params.id;
    const account = this.props.location.state;

    allTransactionsAccount(accountID)
      .then(transactions => {
        this.setState({
          transactions,
          account
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
  x;

  render() {
    const accountID = this.props.match.params.id;
    return (
      <Layout>
        {this.state.account && (
          <>
            <Breadcrumb>
              <Breadcrumb.Item href="/accounts">Accounts</Breadcrumb.Item>
              <Breadcrumb.Item className="disable-breadcrumb">
                {this.state.account.accountNumber}
              </Breadcrumb.Item>
            </Breadcrumb>
            <section className="single-account">
              <h1>{this.state.account.balance}€</h1>
              <h5>
                {this.state.account.type === 'Current'
                  ? 'Available Balance'
                  : this.state.account.type === 'Savings'
                  ? 'Available Balance'
                  : 'Total Credit Limit'}
              </h5>
              <hr></hr>
              <h5>IBAN Number : {this.state.account.accountNumber}</h5>
              <h5>Account Type : {this.state.account.type}</h5>
              <h5>Card Number : 1234 1234 1234 1234</h5>
              <h5>Card Expirty : 12 / 04</h5>
              <hr></hr>
              <section className="pt-2">
                {/* <h4 className="pb-3">Transactions for this Account</h4> */}
                {this.state.transactions.map(transaction => (
                  <Transaction {...transaction} />
                ))}
              </section>
              <div className="action-container">
                <Link 
                 to={{
                  pathname:`/accounts/${accountID}/add-money`,
                  state: {
                    accountNumber: this.state.account.accountNumber
                  }
                }}>
                  <Button variant="contained" className="primary">
                    <i className="fas fa-plus"></i>
                  </Button>
                </Link>
                <Button variant="contained" className="secondary">
                  <i className="fas fa-link"></i>
                </Button>
                <Button
                  variant="contained"
                  className="third"
                  onClick={event => this.deleteAnAccount(event)}
                >
                  <i className="fas fa-times"></i>
                </Button>
              </div>
            </section>
          </>
        )}
      </Layout>
    );
  }
}

export default SingleAccount;
