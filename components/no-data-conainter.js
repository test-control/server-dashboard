import {makeStyles} from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import AccountTree from "@material-ui/icons/AccountTree";
import Typography from "@material-ui/core/Typography";
import {ButtonLink} from "./link";

const useStyles = makeStyles((theme) => ({
  noDataContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: 50
  },
  headerIcon: {
    fontSize: 200,
    color: '#d1d2d3'
  },
  headerText: {
    color: '#303c54'
  },
  descriptionText: {
    color: '#8e95a2',
    fontSize: 14
  },
  divider: {
    height:20
  }
}));

export default function NoDataContainer(props)
{
  const classes = useStyles();

  return <Box component="div" className={classes.noDataContainer}>
    <Box component="div">
      <AccountTree className={classes.headerIcon}/>
    </Box>
    <Typography component="div">
      <Box fontSize="h5.fontSize" className={classes.headerText}>{props.header}</Box>
    </Typography>
    <Typography component="div">
      <Box fontSize="h5.fontSize" className={classes.descriptionText}>{props.description}</Box>
    </Typography>
    <Box component="div" className={classes.divider} />
    <Box component="div">
      {props.children}
    </Box>
  </Box>
}