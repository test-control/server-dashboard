import React, {useState, useEffect} from 'react';
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

export interface EditProjectTreeLeafProps
{
  opened: boolean;
  handleClose: () => void;
  treeLeafId: string|null;
  onFolderEdited?: () => void;
}

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    minWidth: "600px"
  }
}));

export default function CreateProjectTreeLeafDialog(props : EditProjectTreeLeafProps)
{
  const classes = useStyles();
  const {t} = useTranslation(['dialogs'])
  const [folderName, setFolderName] = useState<string>('')
  const {successMessage, apiResponse} = useSmallNotify();

  const closeModal = () => {
    setFolderName('');
    props.handleClose();
  }


  useEffect(() => {
    if(!props.opened || props.treeLeafId === null){
      return;
    }

    apiBackend.trees.get(props.treeLeafId).then((response) => {
      setFolderName(response.data.title)
    });
  }, [props.opened]);

  const onSubmit = async () => {

    closeModal();

    await apiResponse(apiBackend.trees.update(
      props.treeLeafId,
      {
        title: folderName
      }
    ), t('editProjectTreeLeaf.edited'))

    if (props.onFolderEdited){
      props.onFolderEdited();
    }
  }

  return (
    <Dialog open={props.opened} onClose={closeModal} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{t('editProjectTreeLeaf.title')}</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <DialogContentText>
          {t('editProjectTreeLeaf.description')}
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="title"
          label={t('editProjectTreeLeaf.folderName')}
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
        <Button onClick={onSubmit} color="primary">
          {t('common.update')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
