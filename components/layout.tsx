import Topbar from './topbar';
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../theme';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import {ButtonLink} from "./link";
import {ALink} from "./link";
import TextField from '@material-ui/core/TextField';
import React, { useRef } from "react";
import PageTitle from './page-title';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1
  },
  subContainer: {
    padding: theme.spacing(4),
    paddingTop: 20
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
      minHeight:50,
    },
    [theme.breakpoints.up('sm')]: {
      minHeight: 50,
    }
  },
  pageHeader: {
    background: 'white',
    height:80,
    padding: '0 30px',
  },
  pageInfo: {
    alignSelf: 'flex-start',
    height: 80,
    paddingTop: 7
  },
  pageActions: {
    alignSelf: 'flex-end',
    height: 80,
    textAlign: 'right',
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  breadCrumb: {
    lineHeight: 1
  },
  breadCrumbLink: {
    fontSize:14,
    color: '#b0b0b0'
  },
  breadCrumbLinkPrimary: {
    fontSize:14,
    color: '#626d7f'
  },
  pageTitle: {
    color: '#303c54'
  }
}));

function handleClick(event) {
  event.preventDefault();
}


function Layout({children, pageButtons = [], breadcrumbs, pageTitle, onChangePageTitle=null, pageTitleEditable}) {
  const classes = useStyles();


  return (
        <div className={classes.root}>
          <CssBaseline />
          <Topbar />
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Box className={classes.pageHeader} boxShadow={3}>
              <Grid container>
                <Grid item className={classes.pageInfo} xs={8}>
                  <Box>
                    <PageTitle pageTitle={pageTitle} onChangePageTitle={onChangePageTitle} pageTitleEditable={pageTitleEditable} />
                    <Breadcrumbs aria-label="breadcrumb" className={classes.breadCrumb}>
                      {breadcrumbs && breadcrumbs.map((part, i) => (
                        <ALink href={part.href} key={i} className={i + 1 === breadcrumbs.length ? classes.breadCrumbLinkPrimary : classes.breadCrumbLink}>
                          {part.title}
                        </ALink>
                      ))}
                    </Breadcrumbs>
                  </Box>
                </Grid>
                <Grid item className={classes.pageActions}  xs={4}>
                  <Box>
                    {pageButtons && pageButtons.map((button, i) => (
                      <ButtonLink key={i} buttonVariant={button.buttonVariant} href={button.href} buttonSize={button.buttonSize} buttonColor={button.buttonColor}>
                        {button.text}
                      </ButtonLink>
                    ))}
                    </Box>
                </Grid>
              </Grid>
            </Box>
            <div className={classes.subContainer}>
              {children}
            </div>
          </main>
        </div>
  )
}

export default Layout;
