import { Button, InputBase } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { createMuiTheme, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import axios from 'axios';
import clsx from 'clsx';
import decode from 'jwt-decode';
import React, { Component } from 'react';
import LoadingOverlay from 'react-loading-overlay';
import { Link } from 'react-router-dom';
import Notes from '../Notes/Notes';
import AuthHelperMethods from "../utils/AuthHelperMethods";
import './home.css';

const drawerWidth = 180;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  addNotePanel: {
    width: 500,
    '& > *': {
      margin: theme.spacing(1),
      width: 480,
    },
  },
  textFieldSize: {
    width: 480
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    // backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      // backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
})

class Home extends Component {
  Auth = new AuthHelperMethods();

  constructor(props) {
    super(props)
    this.state = {
      confirm: null,
      loaded: false,
      addNoteExpand: false,
      open: false,
      noteData: null,
      dataLoading: false,
      addNoteTitle: null,
      addNoteContent: null,
      noteType: 'Notes'
    }
    this.refreshComponent = this.refreshComponent.bind(this)
  }

  handleDrawerOpen = () => {
    this.setState({
      open: true
    })
  };

  handleDrawerClose = () => {
    this.setState({
      open: false
    })
  };

  getNoteData = async (userId) => {
    this.setState({
      dataLoading: true
    })
    const data = await axios.post("http://localhost:3201/api/notes/getNoteByUserId", {
      userId: userId,
      type: this.state.noteType
    }, { headers: { "Authorization": `Bearer ${this.Auth.getToken()}` } })
    this.setState({
      noteData: data.data.message,
      dataLoading: false
    })
  }

  handleLogout = () => {
    this.Auth.logout()
  }
  componentDidMount() {
    // Authentication function starts
    if (!this.Auth.loggedIn()) {
      this.props.history.replace("/login");
    } else {
      try {
        const confirm = this.Auth.getConfirm();
        this.setState({
          confirm: confirm,
          loaded: true
        });
        // User function starts
        this.getNoteData(decode(this.Auth.getToken()).userId)       // Need to implement context here
      } catch (err) {
        console.log(err);
        this.Auth.logout();
        this.props.history.replace("/login");
      }
    }
  }

  getFilteredNotes = (e) => {
    this.setState({ noteType: e.target.innerText }, () => {
      this.getNoteData(decode(this.Auth.getToken()).userId)       // Need to implement context here
    })
  }

  handleAddNoteChange = () => {
    this.setState({
      addNoteExpand: !this.state.addNoteExpand
    })
  }

  setNoteTitle = (e) => {
    if (e.target.value !== '') {
      this.setState({
        addNoteTitle: e.target.value
      })
    }
    else {
      this.setState({
        addNoteTitle: null
      })
    }
  }

  setNoteContent = (e) => {
    if (e.target.value) {
      this.setState({
        addNoteContent: e.target.value
      })
    }
    else {
      this.setState({
        addNoteContent: null
      })
    }
  }

  refreshComponent = () => {
    this.setState({ addNoteExpand: false })
    this.componentDidMount()
  }

  handleAddNote = async () => {
    await axios.post("http://localhost:3201/api/notes/createNote", {
      userId: decode(this.Auth.getToken()).userId,       // Need to implement context here
      title: this.state.addNoteTitle,
      briefContent: this.state.addNoteContent
    }, { headers: { "Authorization": `Bearer ${this.Auth.getToken()}` } })
    this.refreshComponent()
  }

  render() {
    const { classes } = this.props;
    const theme = createMuiTheme()
    if (this.state.loaded === true) {
      if (this.state.confirm) {
        return (
          <div className={classes.root}>
            <CssBaseline />
            <AppBar
              position="fixed"
              className={clsx(classes.appBar, {
                [classes.appBarShift]: this.state.open,
              })}
            >
              <Toolbar className="header-con">
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={this.handleDrawerOpen}
                  edge="start"
                  className={clsx(classes.menuButton, this.state.open && classes.hide)}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap>
                  Notes
                </Typography>
                <div className={classes.search}>
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>
                  <InputBase
                    placeholder="Search…"
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                    inputProps={{ 'aria-label': 'search' }}
                  />
                </div>
                <Typography variant="h6" noWrap>
                  <Link style={{ textDecoration: "none", color: "black" }} to={{ pathname: "/login" }}><button className="button logout-button" onClick={this.handleLogout}>Logout</button></Link>
                </Typography>
              </Toolbar>
            </AppBar>
            <Drawer
              className={classes.drawer}
              variant="persistent"
              anchor="left"
              open={this.state.open}
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              <div className={classes.drawerHeader}>
                <IconButton onClick={this.handleDrawerClose}>
                  {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
              </div>
              <Divider />
              <List>
                {['Notes', 'Important', 'Archived', 'Shared'].map((text, index) => (
                  <ListItem button key={text} >
                    <ListItemText primary={text} onClick={this.getFilteredNotes.bind()} />
                  </ListItem>
                ))}
              </List>
            </Drawer>
            <main
              className={clsx(classes.content, {
                [classes.contentShift]: this.state.open,
              })}
            >
              <LoadingOverlay
                active={this.state.dataLoading}
                spinner
                text='Loading Notes...'>
                <div className={classes.drawerHeader} />
                <div>
                  <ExpansionPanel style={{ margin: "auto" }} className={classes.addNotePanel} expanded={this.state.addNoteExpand} onChange={this.handleAddNoteChange} >
                    <ExpansionPanelSummary
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                    >
                      <TextField className={classes.textFieldSize} id="outlined-basic" label="Title" variant="outlined" onChange={this.setNoteTitle} />
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <TextField className={classes.textFieldSize} id="standard-basic" label="Note" onChange={this.setNoteContent} />
                      <Button onClick={this.handleAddNote} disabled={!(this.state.addNoteTitle !== null && this.state.addNoteContent !== null)}>ADD NOTE</Button>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                  {this.state.noteData !== null ?
                    <div>
                      {this.state.noteData.length !== 0 ? <div>
                        <div className="note-con">
                          {
                            this.state.noteData.map((data) => {
                              return <Notes noteData={data} auth={this.Auth} key={Math.random()} />
                            })
                          }
                        </div>
                      </div> : <div><p style={{ fontSize: "25px", fontWeight: "bold", display: "flex", justifyContent: "center" }}>No notes found!</p></div>}
                    </div> : <div><p style={{ fontSize: "25px", fontWeight: "bold", display: "flex", justifyContent: "center" }}>No notes found!</p></div>}
                </div>
              </LoadingOverlay>
            </main>
          </div >
        );
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
}

export default withStyles(styles)(Home);
