import { Button, InputBase } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
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
import Snackbar from '@material-ui/core/Snackbar';
import { createMuiTheme, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CloseIcon from '@material-ui/icons/Close';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import axios from 'axios';
import clsx from 'clsx';
import decode from 'jwt-decode';
import React, { Component } from 'react';
import LoadingOverlay from 'react-loading-overlay';
import { Link } from 'react-router-dom';
import openSocket from 'socket.io-client';
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
    backgroundColor: "#fbc4ff5e"
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
    width: 680,
    '& > *': {
      margin: theme.spacing(1),
      width: 700,
    },
  },
  textFieldSize: {
    width: 680
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
    backgroundColor: '#3434486b',
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1, 1, 1, 7),
    marginTop: "14px",
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
  primarybutton: {
    backgroundColor: "#2121d6ad",
    marginLeft: "10px"
  },
  dangerButton: {
    backgroundColor: "#ff0000bd",
    marginLeft: "10px"
  }
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
      noteType: 'Notes',
      initalNoteData: null,
      createrNames: [],
      newNoteAlert: false,
      newNoteAlertMessage: null,
      viewNewNote: false,
      newNoteContent: {
        data: {
          briefContent: "TestData",
          dateCreated: "TestData",
          sharedNote: ["TestData"],
          status: "TestData",
          title: "TestData",
          userId: "TestData",
          __v: 0,
          _id: "TestData"
        },
        __proto__: Object,
        senderName: "TestData",
      },
      getShareNoteType: "sharedWithYou"
    }
    this.i = 0
    this.refreshComponent = this.refreshComponent.bind(this)
  }

  handleDrawerOpen = () => {
    this.setState({
      open: true
    })
  };

  handleReceivedNewNote = (data) => {
    this.setState({
      newNoteAlert: true,
      newNoteAlertMessage: "You have received \"" + data.data.title + "\" note from " + data.senderName,
      newNoteContent: data,
    })
  }

  handleReceivedNewNoteDummy = () => {
    this.setState({
      newNoteAlert: true,
      newNoteAlertMessage: "You have received data.data.title note from data.senderName",
      newNoteContent: {
        data: {
          briefContent: "Test note",
          dateCreated: "2020-01-20T10:24:47.330Z",
          sharedNote: ["5e2821b06a17164c5c3864b4"],
          status: "IMP",
          title: "Hello world",
          userId: "5e18099b88bc823d64b929df",
          __v: 0,
          _id: "5e257feff1fc91196c159db2"
        },
        __proto__: Object,
        senderName: "Surendhar Sundaram",
      }
    })
  }

  handleNewNoteClose = () => {
    this.setState({
      newNoteAlert: false,
      viewNewNote: false
    })
  }

  handleDrawerClose = () => {
    this.setState({
      open: false
    })
  };

  getNoteData = async (userId, shareType) => {
    this.setState({
      dataLoading: true
    })
    if (this.state.noteType === "Shared") {
      if (shareType === "sharedWithYou") {
        const data = await axios.get("http://localhost:3201/api/notes/getSharedNote/" + userId,
          { headers: { "Authorization": `Bearer ${this.Auth.getToken()}` } })
        if (data.data.message.success) {
          data.data.message.data.map(async (data2) => {
            const data1 = await axios.get("http://localhost:3200/api/users/getUserDetailsById/" + data2.userId, {
              headers: { "Authorization": `Bearer ${this.Auth.getToken()}` }
            })
            let names = this.state.createrNames
            names.push(data1.data.message.name)
            this.setState({
              createrNames: names
            })
            // this.createrNames.push(data1.data.message.name)
          })
          this.setState({
            noteData: data.data.message.data,
            initalNoteData: data.data.message.data,
            dataLoading: false
          })
        }
        else {
          console.log(data.data.message.err)
          this.setState({
            noteData: null,
            initalNoteData: null,
            dataLoading: false
          })
        }
      }
      else {
        const data = await axios.get("http://localhost:3201/api/notes/getNotesSharedByMe/" + userId,
          { headers: { "Authorization": `Bearer ${this.Auth.getToken()}` } })
        if (data.data.message.success) {
          this.setState({
            noteData: data.data.message.data,
            initalNoteData: data.data.message.data,
            dataLoading: false
          })
        }
        else {
          console.log(data.data.message.err)
          this.setState({
            noteData: null,
            initalNoteData: null,
            dataLoading: false
          })
        }
      }
    }
    else {
      const data = await axios.post("http://localhost:3201/api/notes/getNoteByUserId", {
        userId: userId,
        type: this.state.noteType
      }, { headers: { "Authorization": `Bearer ${this.Auth.getToken()}` } })
      this.setState({
        noteData: data.data.message,
        initalNoteData: data.data.message,
        dataLoading: false
      })
    }
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
        this.getNoteData(decode(this.Auth.getToken()).userId, null)
        // User function ends
      } catch (err) {
        console.log(err);
        this.Auth.logout();
        this.props.history.replace("/login");
      }
    }
    let io = openSocket("http://localhost:3201")
    io.on(decode(this.Auth.getToken()).userId, (data) => {
      this.handleReceivedNewNote(data)
      if (this.state.noteType === "Shared") {
        this.setState({
          noteData: this.state.noteData.concat(data.data),
          createrNames: this.state.createrNames.concat(data.senderName)
        })
      }
    })
  }

  getFilteredNotes = (e, shareType) => {
    this.setState({ noteType: e.target.innerText }, () => {
      this.getNoteData(decode(this.Auth.getToken()).userId, shareType)
    })
    this.handleDrawerClose()
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
    // this.setState({ addNoteExpand: false })
    // this.componentDidMount()
    window.location.reload()
  }

  handleAddNote = async () => {
    await axios.post("http://localhost:3201/api/notes/createNote", {
      userId: decode(this.Auth.getToken()).userId,
      title: this.state.addNoteTitle,
      briefContent: this.state.addNoteContent
    }, { headers: { "Authorization": `Bearer ${this.Auth.getToken()}` } })
    this.refreshComponent()
  }

  searchData = (e) => {
    if (e.target.value !== '') {
      let datas = this.state.noteData
      let resultData = []
      datas.map(data => {
        let str = data.title.toLowerCase();
        let str1 = data.briefContent.toLowerCase()
        let str2 = e.target.value.toLowerCase()
        if ((str.includes(str2)) || (str1.includes(str2))) {
          resultData.push(data)
        }
        return 0
      })
      this.setState({ noteData: resultData })
    }
    else {
      this.setState({ noteData: this.state.initalNoteData })
    }
  }

  handleNewNoteView = () => {
    this.setState({ viewNewNote: true })
  }

  handleGetShareNoteType = async (e) => {
    if (e.target.innerText === "SHARED WITH YOU") {
      this.getFilteredNotes({ e: { target: { innerText: "Shared" } } }, "sharedWithYou")
      // this.getNoteData(decode(this.Auth.getToken()).userId, "sharedWithYou")
    }
    else if (e.target.innerText === "SHARED BY YOU") {
      this.getFilteredNotes({ e: { target: { innerText: "Shared" } } }, "sharedByMe")
      // this.getNoteData(decode(this.Auth.getToken()).userId, "sharedByMe")
    }
    else {
      this.getFilteredNotes({ e: { target: { innerText: "Shared" } } }, "sharedWithYou")
      // this.getNoteData(decode(this.Auth.getToken()).userId, "sharedWithYou")
    }
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
                <div style={{ display: "flex" }}>
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={this.handleDrawerOpen}
                    edge="start"
                    className={clsx(classes.menuButton, this.state.open && classes.hide)}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Typography variant="h6" noWrap style={{ padding: "7px" }}>
                    Notes
                </Typography>
                </div>
                <div style={{ display: "flex" }}>
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
                      onChange={this.searchData.bind(this)}
                      inputProps={{ 'aria-label': 'search' }}
                    />
                  </div>
                  <Typography variant="h6" noWrap>
                    <Link style={{ textDecoration: "none", color: "black" }} to={{ pathname: "/login" }}><button className="button logout-button" onClick={this.handleLogout}>Logout</button></Link>
                  </Typography>
                </div>
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
                {['Notes', 'Favourites', 'Archived', 'Shared'].map((text, index) => (
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
                <div style={{ minHeight: "35px" }} />
                <div>
                  <ExpansionPanel style={{ margin: "auto", width: "fit-content" }} className={classes.addNotePanel} expanded={this.state.addNoteExpand} onChange={this.handleAddNoteChange} >
                    <ExpansionPanelSummary
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                    >
                      <TextField className={classes.textFieldSize} id="outlined-basic" label="Title" variant="outlined" autoComplete="off" onChange={this.setNoteTitle} />
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <TextField className={classes.textFieldSize} id="standard-basic" label="Note" onChange={this.setNoteContent} />
                      <Button className={classes.primarybutton} onClick={this.handleAddNote} disabled={!(this.state.addNoteTitle !== null && this.state.addNoteContent !== null)}>ADD NOTE</Button>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                  {this.state.noteData !== null ?
                    <div>
                      {this.state.noteType === "Notes" ? <span style={{ fontSize: "25px", fontWeight: "bold", marginLeft: "20px" }}>All</span> : <span></span>}
                      {this.state.noteType === "Favourites" ? <span style={{ fontSize: "25px", fontWeight: "bold", marginLeft: "20px" }}>Favourites</span> : <span></span>}
                      {this.state.noteType === "Archived" ? <span style={{ fontSize: "25px", fontWeight: "bold", marginLeft: "20px" }}>Archived</span> : <span></span>}
                      {this.state.noteType === "Shared" ? <span style={{ fontSize: "25px", fontWeight: "bold", marginLeft: "20px" }}>Shared</span> : <span></span>}
                      {this.state.noteType === "Shared" ? <div>
                        <Button color="secondary" size="small" onClick={this.handleGetShareNoteType}>Shared by you</Button>
                        <Button color="secondary" size="small" onClick={this.handleGetShareNoteType}>Shared with you</Button>
                      </div> : <div></div>}
                      {this.state.noteData.length !== 0 ? <div>
                        <div className="note-con">
                          {
                            this.state.noteData.map((data, index) => {
                              return <Notes noteData={data} auth={this.Auth} isShared={this.state.noteType === "Shared"} createrName={this.state.createrNames[index]} key={Math.random()} />
                            })
                          }
                        </div>
                      </div> : <div><p style={{ fontSize: "25px", fontWeight: "bold", display: "flex", justifyContent: "center" }}>No notes found!</p></div>}
                    </div> : <div><p style={{ fontSize: "25px", fontWeight: "bold", display: "flex", justifyContent: "center" }}>No notes found!</p></div>}
                </div>
              </LoadingOverlay>
              <div>
                {/* <Button onClick={this.handleReceivedNewNoteDummy}>Open simple snackbar</Button> */}
                <Snackbar
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  open={this.state.newNoteAlert}
                  autoHideDuration={6000}
                  onClose={this.handleNewNoteClose}
                  message={this.state.newNoteAlertMessage}
                  action={
                    <React.Fragment>
                      <Button color="secondary" size="small" onClick={this.handleNewNoteView}>
                        View
                      </Button>
                      <IconButton size="small" aria-label="close" color="inherit" onClick={this.handleNewNoteClose}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                      <Collapse in={this.state.viewNewNote} timeout="auto" unmountOnExit>
                        <CardContent>
                          {/* <Typography paragraph>Whom do you want to share the note?</Typography> */}
                          <Notes noteData={this.state.newNoteContent.data} auth={this.Auth} isShared={true} createrName={this.state.newNoteContent.senderName} key={Math.random()} />
                        </CardContent>
                      </Collapse>
                    </React.Fragment>
                  }
                />
              </div>
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
