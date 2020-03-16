import React, { Component, Fragment } from 'react';

import Layout from '../../Components/Layout';
import { RadioGroup, Button, TextField, FormControl, Select, Grid, FormControlLabel , FormLabel, Radio} from '@material-ui/core';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { createTransaction, createListTransactions } from '../../Services/transaction';
import { userIDAccounts } from './../../Services/account';

const useStyles = makeStyles({
  root: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  icon: {
    borderRadius: '50%',
    width: 16,
    height: 16,
    boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#f5f8fa',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
    },
  },
  checkedIcon: {
    backgroundColor: '#137cbd',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: '#106ba3',
    },
  },
});

function StyledRadio(props) {
  const classes = useStyles();

  return (
    <Radio
      className={classes.root}
      disableRipple
      color="default"
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      {...props}
    />
  );
}

class AddTransaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountNumber: '',
      totalAmount: 0,
      reference: '',
      accountIDFrom: '',
      accountInfo: '',
      accounts: [],
      categories: ['Housing', 'Transport', 'Food & Dining', 'Utility bills', 'Cell phone', 'Childcare and school costs', 'Pet food', 'Pet insurance', 'Clothing', 'Health insurance', 'Fitness', 'Auto insurance', 'Life insurance', 'Fun stuff', 'Travel', 'Student loans', 'Credit-card debt', 'Retirement', 'Emergency fund', 'Large purchases', 'Other'],
      category: 'Housing',
      schedule: false,
      schedulePeriod: 'Hour',
      schedulePeriods: ['Hour', 'Week', 'Month'],
      time: 'Month',
      times: ['Month', 'Trimester', 'Semester'],
      dateTransaction: new Date()
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleAccountFromChange = this.handleAccountFromChange.bind(this);
    this.getData = this.getData.bind(this);
  }

  weeklyTransaction(weeks, currentMonth, currentDay){
    let i = 1;
    let newDate = null;
    let day = currentDay;
    let month = currentMonth;
    const allDates = [];

    while(i < weeks) {
      if(day > 23){
        console.log("greater");
        month++;
        day = 30 - day + 7;
        newDate = new Date(2020, month, day);
      }
      else{
        console.log(" not greater");
        console.log("DAYYY", day);
        day = day + 7;
        newDate = new Date(2020, month, day);
      }
      day = newDate.getDate();
      i++;
      allDates.push(newDate);
    }

    return allDates;
  }

  monthlyTransaction(months, currentMonth, currentDay){
    let i = 0;
    let newDate = null;
    const allDates = [];

    while(i < months){
      newDate = new Date(2020, currentMonth + i, currentDay);
      allDates.push(newDate);
      i++;
    }

    return allDates;
  }

  calculateTransactions(){
    const schedulePeriod = this.state.schedulePeriod;
    const time = this.state.time;
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth();
    let allDates = [];
    const allTransactions = [];

    if(schedulePeriod === 'Week'){
      switch(time){
        case 'Month':
          allDates = this.weeklyTransaction(4, month, day);
          break;
        case 'Trimester':
          allDates = this.weeklyTransaction(12, month, day);
          break;
        case 'Semester':
          allDates = this.weeklyTransaction(24, month, day);
          break;
        default:
          break;
      }
    }
    else if(schedulePeriod === 'Month'){
      switch(time){
        case 'Trimester':
          allDates = this.monthlyTransaction(3, month, day);
          break;
        case 'Semester':
          allDates = this.monthlyTransaction(6, month, day);
          break;
        default:
          break;
      }
    }

    let transaction = null;
    for(let j = 0; j < allDates.length; j++){
      transaction = Object.assign({}, this.state);
      if(j === 0){
        transaction.status = 'Executed';
      }
      else {
        transaction.status = 'Pending';
      }
      transaction.dateTransaction = allDates[j];
      allTransactions.push(transaction);
    }
    return allTransactions;
  }

  handleAccountFromChange(event) {
    const inputName = event.target.name;
    const value = event.target.value;

    const accountSplitted = value.split(' ');
    const accountIDFrom = accountSplitted[0];

    this.setState({
      accountIDFrom
    });
  }

  handleInputChange(event) {
    const inputName = event.target.name;
    let value = event.target.value;
    if(inputName === 'schedule')
      (value === 'No') ? value = false : value = true;

    this.setState({
      [inputName]: value
    });

  }

  componentDidMount() {
    this.props.changeActiveNav();
    this.getData();
  }

  getData() {
    const userID = this.props.userID;

    userIDAccounts(userID)
      .then(account => {
        this.setState({
          accounts: account,
          type: account[0].type,
          accountIDFrom: account[0]._id
        });
      })
      .catch(error => console.log(error));
  }

  createOneTransaction(){
    const transaction = Object.assign({}, this.state);
    delete transaction.categories;
    delete transaction.accounts;
    delete transaction.schedulePeriods;
    delete transaction.times;
    delete transaction.accountInfo;
    transaction.status = 'Executed';

    createTransaction(transaction)
      .then(transaction => {
        if (transaction.res) {
        }
        this.props.history.push({
          pathname: '/transactions'
        });
      })
      .catch(error => console.log(error));
  }

  createListTransactions(){
    const allT = this.calculateTransactions();
    createListTransactions(allT)
    .then(() => {

    })
    .catch((error) => {
      console.log(error);
    })
  }

  setData(event) {
    event.preventDefault();
    if(this.state.schedule) {
      this.createListTransactions();
    }
    else {
      this.createOneTransaction();
    }
  }

  render() {
    return (
      <Layout>
        <h1 className="mb-4">Creating a new transaction</h1>
        <form onSubmit={event => this.setData(event)} className="add-account-form">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
            <FormControl>
                <h4 className="pt-3 pb-2">Account From</h4>
                <Select
                  name="accountInfo"
                  native
                  onChange={event => this.handleAccountFromChange(event)}
                >
                  {this.state.accounts.map(acc => (
                    <option value={acc._id + ' ' + acc.type} key={acc.accountNumber}>
                      {acc.accountNumber + ' ' + acc.type}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12}>
              <h4 className="pt-3 pb-2">IBAN Number that you want to transfer</h4>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="accountNumber"
                label="Account Number To"
                name="accountNumber"
                onChange={event => this.handleInputChange(event)}
              />
            </Grid>
            <h4 className="pl-2 pt-3 pb-2">Amount</h4>
            <Grid item xs={12} sm={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="totalAmount"
                label="Total Amount"
                name="totalAmount"
                type="number"
                onChange={event => this.handleInputChange(event)}
              />
            </Grid>
            <FormControl>
                <h4 className="pt-3 pb-2">Category</h4>
                <Select
                    name="category"
                    native
                    onChange={event => this.handleInputChange(event)}
                  >
                    {this.state.categories.map(category => (
                      <option value={category} key={category}>
                        {category}
                      </option>
                    ))}
                  </Select>
            </FormControl>
            <h4 className="pl-2 pt-3 pb-2">Reference</h4>
            <Grid item xs={12} sm={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="reference"
                label="Reference"
                name="reference"
                onChange={event => this.handleInputChange(event)}
              />
            </Grid>       
          <FormControl component="fieldset">
            <h4 className="pl-2 pt-3 pb-2">Scheduled</h4>
            <RadioGroup defaultValue="female" aria-label="gender" name="schedule">
              <FormControlLabel value="Yes" control={<StyledRadio />} label="Yes" onChange={event => this.handleInputChange(event)}/>
              <FormControlLabel value="No" control={<StyledRadio />} label="No" onChange={event => this.handleInputChange(event)}/>
            </RadioGroup>
          </FormControl>
          </Grid>
          {
            this.state.schedule && (
            <Fragment>
            <Grid item xs={12} sm={12}>
            <FormControl>
                <h4 className="pt-3 pb-2">Period</h4>
                <Select
                  name="schedulePeriod"
                  native
                  required
                  onChange={event => this.handleInputChange(event)}
                >
                  {this.state.schedulePeriods.map(schedulePeriod => (
                    <option value={schedulePeriod} key={schedulePeriod}>
                    {schedulePeriod}
                  </option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12}>
            <FormControl>
                <h4 className="pt-3 pb-2">How long</h4>
                <Select
                  name="time"
                  native
                  required
                  onChange={event => this.handleInputChange(event)}
                >
                  {this.state.times.map(time => (
                    <option value={time} key={time}>
                    {time}
                  </option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            </Fragment> 
            )}
          <Button type="submit" fullWidth variant="contained" color="primary" className="mt-4">
            Create Transaction
          </Button>
        </form>
      </Layout>
    );
  }
}

export default AddTransaction;