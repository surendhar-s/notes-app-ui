import { Button, ClickAwayListener, MenuItem, MenuList, Paper, Popper } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Collapse from '@material-ui/core/Collapse';
import { red } from '@material-ui/core/colors';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ShareIcon from '@material-ui/icons/Share';
import axios from 'axios';
import clsx from 'clsx';
import decode from 'jwt-decode';
import moment from 'moment/moment.js';
import React, { Component } from 'react';
import './Notes.css';

const styles = theme => ({
  card: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
  },
  avatar: {
    backgroundColor: red[500],
  },
  textFieldSize: {
    width: 280
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

class Notes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
      moreIcon: false,
      open: false,
      noteData: this.props.noteData,
      updateNoteFlag: false,
      addNoteContent: this.props.noteData.briefContent,
      addNoteTitle: this.props.noteData.title,
      shareIcon: false,
      shareEmail: null,
      shareStatus: false
    }
    this.Auth = this.props.auth
  }

  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  }

  handleMoreIconClick = () => {
    this.setState({ moreIcon: !this.state.moreIcon });
  }

  handleNoteOption = async (e) => {
    this.setState({ moreIcon: false });
    if (e.target.innerText === "Edit") {
      this.setState({ updateNoteFlag: true })
      // this.updateNote()
    }
    else if ((e.target.innerText === "Archive") || (e.target.innerText === "Not Archive")) {
      await axios.get("http://localhost:3201/api/notes/toggleArichive/" + this.state.noteData._id, { headers: { "Authorization": `Bearer ${this.Auth.getToken()}` } })
    }
    else if (e.target.innerText === "Delete") {
      await axios.get("http://localhost:3201/api/notes/deleteNote/" + this.state.noteData._id, { headers: { "Authorization": `Bearer ${this.Auth.getToken()}` } })
      window.location.reload()
    }
  }

  getFormattedDateTime = () => {
    let date = this.state.noteData.dateCreated
    let momentTime = moment(date, 'YYYY-MM-DD HH:mm:ssZ')
    let formattedDate = momentTime.format('MMM Do YY')
    return formattedDate;
  }

  toggleImp = async () => {
    await axios.get("http://localhost:3201/api/notes/toggleImportant/" + this.state.noteData._id, { headers: { "Authorization": `Bearer ${this.Auth.getToken()}` } })
    window.location.reload()
  }

  setNoteTitle = (e) => {
    if (e.target.value) {
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

  setEmailId = (e) => {
    if (e.target.value) {
      this.setState({
        shareEmail: e.target.value
      })
    }
    else {
      this.setState({
        shareEmail: null
      })
    }
  }

  updateNote = async () => {
    const data = await axios.post("http://localhost:3201/api/notes/updateNote", {
      noteId: this.state.noteData._id,
      noteTitle: this.state.addNoteTitle,
      noteDescription: this.state.addNoteContent
    }, { headers: { "Authorization": `Bearer ${this.Auth.getToken()}` } })
    this.setState({ updateNoteFlag: false })
    if (data !== null) {
      window.location.reload()
    }
  }

  cancelUpdate = () => {
    this.setState({ updateNoteFlag: false })
  }

  handleShareIconClick = () => {
    this.setState({ shareIcon: !this.state.shareIcon })
  }

  shareNote = async () => {
    const check = await axios.get("http://localhost:3200/api/users/checkUserEmail/" + this.state.shareEmail)
    if (check.data.message.success) {
      const data = await axios.post("http://localhost:3201/api/notes/shareNote", {
        currentNoteId: this.state.noteData._id,
        shareUserId: check.data.message.userId,
        senderName: decode(this.Auth.getToken()).name
      },
        { headers: { "Authorization": `Bearer ${this.Auth.getToken()}` } })
      const data1 = await axios.post("http://localhost:3200/api/users/pushNotificationIntoUser", {
        userId: check.data.message.userId,
        notificationTitle: decode(this.Auth.getToken()).name + " shared a note with you",
        noteId: this.state.noteData._id
      }, { headers: { "Authorization": `Bearer ${this.Auth.getToken()}` } })
      if (data.data.message.success && data1.data.message.success) {
        this.setState({ shareStatus: true })
      }
      else {
        if (!data.data.message.err) {
          console.log(data.data.message.err)
        }
        if (!data1.data.message.err)
          console.log(data1.data.message.err)
      }
    }
  }

  render() {
    const { classes } = this.props
    return (
      <div>
        {this.state.updateNoteFlag ?
          <ExpansionPanel style={{ marginTop: "15px" }} className={classes.addNotePanel} expanded={true} onChange={this.handleAddNoteChange} >
            <ExpansionPanelSummary
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <TextField className={classes.textFieldSize} defaultValue={this.state.noteData.title} id="outlined-basic" label="Title" variant="outlined" onChange={this.setNoteTitle} />
              <Button className={classes.primarybutton} onClick={this.updateNote} disabled={!(this.state.addNoteTitle !== null && this.state.addNoteContent !== null)}>Update<br />Note</Button>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <TextField className={classes.textFieldSize} defaultValue={this.state.noteData.briefContent} id="standard-basic" label="Note" onChange={this.setNoteContent} />
              <Button className={classes.dangerButton} onClick={this.cancelUpdate} disabled={!(this.state.addNoteTitle !== null && this.state.addNoteContent !== null)}>Cancel</Button>
            </ExpansionPanelDetails>
          </ExpansionPanel> : <div className="note-card">
            <Card className={classes.card}>
              <CardHeader
                avatar={
                  <Avatar aria-label="recipe" className={classes.avatar}>
                    {decode(this.Auth.getToken()).name.charAt(0).toUpperCase()}
                    {/* {this.props.isShared ? this.props.createrName.charAt(0).toUpperCase() :decode(this.Auth.getToken()).name.charAt(0).toUpperCase()} */}
                  </Avatar>
                }
                action={
                  !this.props.isShared ? <IconButton
                    className={clsx(classes.expand, {
                      [classes.expandOpen]: this.state.moreIcon,
                    })}
                    onClick={this.handleMoreIconClick}
                    aria-expanded={this.state.moreIcon}
                    aria-label="settings">
                    <MoreVertIcon />
                    <Popper open={this.state.moreIcon} placement="top" role={undefined} disablePortal>
                      <Paper className="paper-option">
                        <ClickAwayListener onClickAway={this.handleNoteOption.bind()}>
                          <MenuList autoFocusItem={this.state.moreIcon} id="menu-list-grow">
                            <MenuItem onClick={this.handleNoteOption.bind()}>Edit</MenuItem>
                            {!(this.state.noteData.status === "ACR") ? <MenuItem onClick={this.handleNoteOption.bind()}>Archive</MenuItem> : <MenuItem onClick={this.handleNoteOption.bind()}>Not Archive</MenuItem>}
                            <MenuItem onClick={this.handleNoteOption.bind()}>Delete</MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Popper>
                  </IconButton> : <div></div>
                }
                title={this.state.noteData.title}
                subheader={this.getFormattedDateTime()}
              />
              <CardContent>
                <Typography variant="body2" color="textPrimary" component="p">
                  {this.state.noteData.briefContent}
                </Typography>
              </CardContent>
              {this.props.isShared ? <CardContent><Typography paragraph >
                This note is shared by <b>{this.props.createrName}</b>
              </Typography> </CardContent> :
                <CardActions disableSpacing>
                  <IconButton aria-label="add to favorites" onClick={this.toggleImp} >
                    {this.state.noteData.status === "IMP" ? <FavoriteIcon color="error" /> : <FavoriteIcon color="primary" />}
                  </IconButton>
                  <IconButton
                    className={clsx(classes.expand, {
                      [classes.expandOpen]: this.state.shareIcon,
                    })}
                    onClick={this.handleShareIconClick}
                    aria-expanded={this.state.shareIcon}
                    aria-label="share">
                    <ShareIcon />
                  </IconButton>
                </CardActions>
              }
              <Collapse in={this.state.shareIcon} timeout="auto" unmountOnExit>
                <CardContent>
                  <Typography paragraph>Whom do you want to share the note?</Typography>
                  {this.state.shareStatus ?
                    <Typography paragraph>This note is successfully shared with {this.state.shareEmail}</Typography>
                    : <div>
                      <TextField className={classes.textFieldSize} id="standard-basic" label="Email" onChange={this.setEmailId} />
                      <Button className={classes.primarybutton} onClick={this.shareNote} disabled={this.state.shareEmail === null}>Share note</Button>
                    </div>}
                </CardContent>
              </Collapse>
            </Card>
          </div>}
      </div>
    );
  }
}

export default withStyles(styles)(Notes);
