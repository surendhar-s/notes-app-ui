import { ClickAwayListener, MenuItem, MenuList, Paper, Popper } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { red } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ShareIcon from '@material-ui/icons/Share';
import clsx from 'clsx';
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
    // transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
})

class Notes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
      moreIcon: false,
      open: false,
      noteData: this.props.noteData
    }
  }

  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  }

  handleMoreIconClick = () => {
    this.setState({ moreIcon: !this.state.moreIcon });
  }

  handleClose = () => {
    this.setState({ moreIcon: false });
  };

  getFormattedDateTime = () => {
    let date = this.state.noteData.dateCreated
    let momentTime = moment(date, 'YYYY-MM-DD HH:mm:ssZ')
    let formattedDate = momentTime.format('MMM Do YY')
    return formattedDate;
  }
  render() {
    const { classes } = this.props
    return (
      <div className="note-card">
        <Card className={classes.card}>
          <CardHeader
            avatar={
              <Avatar aria-label="recipe" className={classes.avatar}>
                R
          </Avatar>
            }
            action={
              <IconButton
                className={clsx(classes.expand, {
                  [classes.expandOpen]: this.state.moreIcon,
                })}
                onClick={this.handleMoreIconClick}
                aria-expanded={this.state.moreIcon}
                aria-label="settings">
                <MoreVertIcon />
                <Popper open={this.state.moreIcon} placement="top" role={undefined} disablePortal>
                  {/* {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{ transformOrigin: placement === 'bottom' ? 'right' : 'center bottom' }}
                    > */}
                  <Paper className="paper-option">
                    <ClickAwayListener onClickAway={this.handleClose}>
                      <MenuList autoFocusItem={this.state.moreIcon} id="menu-list-grow">
                        <MenuItem onClick={this.handleClose}>Edit</MenuItem>
                        <MenuItem onClick={this.handleClose}>Completed</MenuItem>
                        <MenuItem onClick={this.handleClose}>Delete</MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                  {/* </Grow>
                  )} */}
                </Popper>
              </IconButton>
            }
            title={this.state.noteData.title}
            subheader={this.getFormattedDateTime()}
          />

          {/* <CardMedia
            className={classes.media}
            image="/static/images/cards/paella.jpg"
            title="Paella dish"
          /> */}
          <CardContent>
            <Typography variant="body2" color="textPrimary" component="p">
              {this.state.noteData.briefContent}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton aria-label="add to favorites">
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
            {/* <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: this.state.expanded,
              })}
              onClick={this.handleExpandClick}
              aria-expanded={this.state.expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </IconButton> */}
          </CardActions>
          {/* <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography paragraph>Brief note</Typography>
              <Typography paragraph>
                Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
                minutes.
          </Typography>
              <Typography paragraph>
                Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high
                heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly
                browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken
                and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and
                pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add
                saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
          </Typography>
              <Typography paragraph>
                Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook
                without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to
                medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook
                again without stirring, until mussels have opened and rice is just tender, 5 to 7
                minutes more. (Discard any mussels that don’t open.)
          </Typography>
              <Typography>
                Set aside off of the heat to let rest for 10 minutes, and then serve.
          </Typography>
            </CardContent>
          </Collapse> */}
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(Notes);
