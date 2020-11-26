import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from "@material-ui/core/styles";
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  header: {
    fontSize:'20px',
    borderBottom: '1px solid #e6e6e6',
    paddingBottom: '5px',
    fontWeight: 200
  },
  container: {
    padding: '10px 20px',
    marginBottom: '20px'
  },
  content: {
  }
}))

export function PageSection({ className = '', title, children})
{
  const classes = useStyles();

  return (
    <Paper className={className + ' ' + classes.container}>
      <Typography variant="body1" className={classes.header}>
        # {title}
      </Typography>
      <Box className={classes.content}>
       {children}
      </Box>
    </Paper>
  );
}
