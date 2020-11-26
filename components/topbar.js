import {AppBar, Toolbar} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import {AppBarBackground} from "./consts";
import AccountTree from '@material-ui/icons/AccountTree';
import {ALink} from './link'
import {useCookies} from 'react-cookie'

const drawerWidth = 240;
const drawerClosed = 73;

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer - 1,
    width: `calc(100% - ${drawerClosed}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    background: 'white',
    height:50,
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    })
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    border: 'none',
    background: '#3c4b64',
    color:'white'
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
    border: 'none',
    background: '#3c4b64',
    color: 'white'
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    background: '#41547c',
    color: 'white',
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
      minHeight:50,
    },
    [theme.breakpoints.up('sm')]: {
      minHeight: 50,
    },
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
  },
  appToolbar: {
    [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
      minHeight:50,
    },
    [theme.breakpoints.up('sm')]: {
      minHeight: 50,
    },
  },
  drawerIcon: {
    color: 'white'
  },
  menuButton: {
    marginRight: theme.spacing(2),
    color: 'white',
    padding: 0
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Topbar() {

  const classes = useStyles();
  const [cookies, setCookie, removeCookie] = useCookies(['topbar-settings']);
  const [sideBarOpen, openSideBar] = React.useState(cookies['topbar-settings'] ? cookies['topbar-settings'].leftNavOpen : true);

  const closeOpenDrawer = () => {
    openSideBar(!sideBarOpen)
    setCookie('topbar-settings', {leftNavOpen: !sideBarOpen})
  }

  return (
    <div>
      <AppBar position="fixed"
              className={clsx(classes.appBar, {
                [classes.appBarShift]: sideBarOpen,
              })}
              elevation={0}
      >
        <Toolbar disableGutters={true} className={classes.appToolbar}>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: sideBarOpen,
          [classes.drawerClose]: !sideBarOpen,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: sideBarOpen,
            [classes.drawerClose]: !sideBarOpen,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={closeOpenDrawer}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: sideBarOpen,
            })}
          >
            <MenuIcon />
          </IconButton>
        </div>
        <List>
          <ListItem button key="Projects" component={ALink} href="/projects">
            <ListItemIcon className={classes.drawerIcon} ><AccountTree /></ListItemIcon>
            <ListItemText primary="Projects" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}
