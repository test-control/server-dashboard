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

export interface CreateProjectTreeLeafProps
{
  opened: boolean;
  handleClose: () => void;
  treeLeafId: string;
}

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    minWidth: "600px"
  }
}));

export default function CreateProjectTreeLeafDialog(props : CreateProjectTreeLeafProps)
{
  const classes = useStyles();
  const {t} = useTranslation(['dialogs'])
  const [folderName, setFolderName] = useState<string>('')
  const {successMessage, apiResponse} = useSmallNotify();

  const closeModal = () => {
    setFolderName('');
    props.handleClose();
  }

  const createFolder = async () => {
    const response = await apiResponse(apiBackend.trees.create(
      props.treeLeafId,
      {
        title: folderName
      }
    ), t('createProjectTreeLeaf.created'))

    closeModal();
  }

  return (
    <Dialog open={props.opened} onClose={closeModal} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{t('createProjectTreeLeaf.title')}</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <DialogContentText>
          {t('createProjectTreeLeaf.description')}
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="title"
          label={t('createProjectTreeLeaf.folderName')}
          type="text"
          fullWidth
          value={folderName}
          onChange={(event) => setFolderName(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal} color="primary">
          {t('common.cancel')}
        </Button>
        <Button onClick={createFolder} color="primary">
          {t('common.create')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
