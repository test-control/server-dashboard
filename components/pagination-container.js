import {makeStyles} from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: '40px'
  }
}))

export default function PaginationContainer (props) {
  const classes = useStyles();

  return <Grid container alignContent="center" justify="center" className={classes.container}>
    {props.children}
  </Grid>
}