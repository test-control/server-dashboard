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
import React, { useRef } from "react"

const useStyles = makeStyles((theme) => ({
  pageTitle: {
    color: '#303c54',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  }
}));


export default function PageTitle ({pageTitle, onChangePageTitle, pageTitleEditable}){

  const classes = useStyles();
  const titleRef = useRef();

  const [editableTitle, setEditableTitle] = React.useState(
    () => false
  );

  const [changedPageTitle, setChangedPageTitle]  = React.useState(
    () => pageTitle
  );

  const onPageTitleClick = () => {
    if(pageTitleEditable){
      setEditableTitle(true);
      setChangedPageTitle(pageTitle);
    }
  }

  const onChangeValue = (event) => {
    setChangedPageTitle(event.target.value);
  }

  const onPageTitleBlur = () => {
    setEditableTitle(false);

    if(onChangePageTitle){
      onChangePageTitle(changedPageTitle);
    }
  }

  return (
    <Typography component="div" onBlur={onPageTitleBlur} >
      <Box fontSize="h5.fontSize" className={classes.pageTitle} onClick={onPageTitleClick}>
      { !editableTitle
        ? pageTitle
        : <form noValidate autoComplete="off">
            <TextField margin="dense" autoFocus={true} id="standard-basic" label="Standard" value={changedPageTitle} onChange={onChangeValue} fullWidth={true} variant="outlined" ></TextField>
        </form>
      }
      </Box>
    </Typography>
  );
}
