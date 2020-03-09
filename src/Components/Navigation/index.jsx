import React from 'react';
import './style.scss';

import { Link, NavLink } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  toolbar: theme.mixins.toolbar
}));

const Navigation = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Title of Project
          </Typography>
          <div>
            <Link to="/messages">
              <Button aria-controls="simple-menu" aria-haspopup="true">
                <i className="far fa-envelope"></i>
              </Button>
            </Link>
            <Link to="/notifications">
              <Button aria-controls="simple-menu" aria-haspopup="true">
                <i className="far fa-bell"></i>
              </Button>
            </Link>
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
              <i className="far fa-user"></i>
            </Button>
          </div>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <Link to="/profile">
              <MenuItem onClick={handleClose}>My Account</MenuItem>
            </Link>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.toolbar} />
        <List className="pt-4">
          {['Dashboard'].map((text, index) => (
            <NavLink to="/" key={text} exact>
              <ListItem button>
                <ListItemText primary={text} activeClassName="active" />
              </ListItem>
            </NavLink>
          ))}
        </List>
        <Divider className="mr-3 ml-3" />
        <List>
          {['Accounts', 'Transactions', 'Analytics', 'Payments', 'Cards'].map((text, index) => (
            <NavLink to={`/${text.toLowerCase()}`} key={text} exact>
              <ListItem button>
                <ListItemText primary={text} activeClassName="active" />
              </ListItem>
            </NavLink>
          ))}
        </List>
      </Drawer>
    </div>
  );
};

export default Navigation;
