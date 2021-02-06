import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {useTranslation} from "react-i18next";
import {makeStyles} from "@material-ui/core/styles";
import {useSmallNotify} from "../../helpers";
import {apiBackend} from "../../services/api";
import {Schemas} from '@test-control/server-api-contracts';
import Router from 'next/router'
import {routes} from "../../lib/breadcrumbs";

export interface CreateProjectTreeLeafProps
{
  opened: boolean;
  handleClose: () => void;
  treeLeafId: string;
  onFolderCreated?: () => void;
}

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    minWidth: "600px"
  }
}));

export default function CreateTestCaseLeafDialog(props : CreateProjectTreeLeafProps)
{
  const classes = useStyles();
  const {t} = useTranslation(['dialogs'])
  const [testCaseTitle, setTestCaseTitle] = useState<string>('')
  const {successMessage, apiResponse} = useSmallNotify();

  const closeModal = () => {
    setTestCaseTitle('');
    props.handleClose();
  }

  const create = async () : Promise<Schemas.TestCase> => {

    const response = await apiResponse(apiBackend.testCase.create({
      title: testCaseTitle,
      treeId: props.treeLeafId
    }), t('createTestCaseLeaf.created'));

    closeModal();

    if (props.onFolderCreated){
      props.onFolderCreated();
    }

    return response.data;
  }

  const createAndStartEditing = async() => {
    const testCase = await create();

    Router.push(routes.testCases.show(testCase.id).href);
  }

  return (
    <Dialog open={props.opened} onClose={closeModal} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{t('createTestCaseLeaf.title')}</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <DialogContentText>
          {t('createTestCaseLeaf.description')}
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="title"
          label={t('createTestCaseLeaf.testCaseTitle')}
          type="text"
          fullWidth
          value={testCaseTitle}
          onChange={(event) => setTestCaseTitle(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal} color="primary">
          {t('common.cancel')}
        </Button>
        <Button onClick={create} color="primary">
          {t('common.create')}
        </Button>
        <Button onClick={createAndStartEditing} color="primary">
          {t('common.createAndEditing')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
