import Layout from "../../components/layout";
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import {ButtonLink} from '../../components/link';
import { useState } from 'react';
import {apiBackend} from "../../services/api";
import { useSnackbar } from 'notistack';
import {errorSnackBar, successSnackBar} from "../../lib/snackbars";
import {handleApiErrors, handleApiNotOkResponse} from "../../lib/errors";
import Router from 'next/router'
import { routes } from "../../lib/breadcrumbs";

const useStyles = makeStyles((theme) => ({
  modalContainer: {
    display: 'flex',
    justifyContent: 'center'
  },
  root: {
    background: 'white',
    width: 800
  },
  modalHeader: {
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    padding: '10px 0'
  },
  formRoot: {
    '& .MuiTextField-root': {
      marginTop: 30
    },
  }

}));

const breadcrumbs = [
  routes.mainPage(),
  routes.projects.list(),
  routes.projects.create()
];

export default function CreateProject() {
  const classes = useStyles();

  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const submitForm = event => {

    event.preventDefault();

    apiBackend.project.create({
      title: projectName,
      description: projectDescription
    }).then((res) => {
       enqueueSnackbar('Project created.', successSnackBar);
       Router.push('/projects')
    }).catch(err => {
      enqueueSnackbar(handleApiErrors(err), errorSnackBar);
    })

  };

  return <Layout breadcrumbs={breadcrumbs}>
    <Box component="div" className={classes.modalContainer}>
      <Card className={classes.root}>
        <form className={classes.formRoot} noValidate onSubmit={submitForm} autoComplete="off">
          <CardContent>
            <Typography component="div" className={classes.modalHeader}>
              <Box fontSize="h6.fontSize">&nbsp;Create new project</Box>
            </Typography>
              <TextField
                id="outlined-basic"
                label="Project name"
                fullWidth size="small"
                placeholder="Sample project name"
                InputLabelProps={{
                  shrink: true,
                }}
                value={projectName}
                onChange={e => setProjectName(e.target.value) }
              />
              <TextField
                id="outlined-basic"
                label="Project description"
                fullWidth size="small"
                placeholder="My awesome project has many test cases."
                multiline
                rowsMax={10}
                rows={10}
                InputLabelProps={{
                  shrink: true,
                }}
                value={projectDescription}
                onChange={e => setProjectDescription(e.target.value)}
              />
          </CardContent>
          <CardActions>
            <ButtonLink href="/projects" buttonVariant="contained" buttonSize="small">
              cancel
            </ButtonLink>
            <Button variant="contained" type="submit" size="small" color="primary">Create project</Button>
          </CardActions>
        </form>
      </Card>
    </Box>
  </Layout>
}
