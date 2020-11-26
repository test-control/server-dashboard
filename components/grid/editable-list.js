import React, { Component, useState } from "react";
import ReactDOM from "react-dom";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  ListItemSecondaryAction,
  TextField,
  Grid,
  Button,
  makeStyles
} from "@material-ui/core";
import RootRef from "@material-ui/core/RootRef";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import InboxIcon from "@material-ui/icons/Inbox";
import EditIcon from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";
import Divider from '@material-ui/core/Divider';
import ReorderIcon from '@material-ui/icons/Reorder';
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles((theme) => ({
  item: {
    border: '1px solid #e6e6e6;'
  },
  reorderButton: {
    color: '#c3c3c3'
  },
  editRowContainer: {
    background: '#e8e8e8'
  },
  editDiscard: {
    color: 'silver',
  },
  editSave: {
    color: '#72bd2d'
  },
  createNewItemContainer: {
    paddingTop: "10px"
  },
  deleteItemQt: {
    background: '#e2e2e2',
    fontStyle: 'italic',
    padding: '10px',
    color: '#716b6b',
    fontSize: '14px'
  }
}));

const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    primary: `item ${k}`,
    secondary: k % 2 === 0 ? `Whatever for ${k}` : undefined
  }));

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  ...draggableStyle,
    ...(isDragging && {
      background: "rgb(235,235,235)"
      }
    ),
    border: '1px solid #e4e4e4',
    margin: '10px 0'
});

const getListStyle = isDraggingOver => ({
});


export function EditableList({items, saveItemTitle, changeItemOrder, deleteItem, createNewItem})
{
  const classes = useStyles();

  const [stateItems, setItems] = useState(
    () => items
  );

  const [editItemId, setEditItemId] = useState(
    () => null
  );

  const [editItemText, setEditItemText] = useState(() => null);

  const [displayIcons, setDisplayIcons] = useState(
    () => true
  );

  const [newItemText, setNewItemText] = useState(() => '');

  const [deleteItemDialogOpen, setDeleteItemDialogOpen] = React.useState(false);
    const [itemToDelete, setItemToDelete] = React.useState(null);

   const handleClickOpenDeleteItemDialog = (itemId) => {
     setDeleteItemDialogOpen(true);

     for(var it of stateItems){
       if(it.id === itemId){
         setItemToDelete(it);
       }
     }
   };

   const handleCloseDeleteItemDialog = () => {
     setDeleteItemDialogOpen(false);
     setItemToDelete(null);
   };

   const handleConfirmDeleteItemDialog = () => {

       onDeleteItem(itemToDelete.id);

       setDeleteItemDialogOpen(false);
       setItemToDelete(null);
   }

  const onDragStart = () => {
    setDisplayIcons(false);
  }

   const onDragEnd = (result) => {
    setDisplayIcons(true);

    if (!result.destination) {
      return;
    }

    const newItems = reorder(
      stateItems,
      result.source.index,
      result.destination.index
    );

    setItems(
      newItems
    );

    changeItemOrder(
      stateItems[result.source.index].id,
      stateItems[result.destination.index].id,
      result.source.index < result.destination.index ? 'down' : 'up'
    );
  }

  const startEditingItem = itemId => {
    setEditItemId(itemId)

          for(var it of items){
            if(it.id !== itemId){
              continue;
            }
            setEditItemText(it.title)
          }


  }

  const stopEditingItem = itemId => {
    setEditItemId(false)
  }

  const saveEditedItem = itemId => {
      const lsItems = Array.from(items);

      for(var it of lsItems){
        if(it.id !== itemId){
          continue;
        }
        it.title = editItemText
      }

    saveItemTitle(itemId, editItemText)
    setEditItemId(false)
    setItems(lsItems)
  }

  const onChangeValue = (val, itemId) => {
    setEditItemText(val.target.value);
  }
  const onCreateNewItem = async () => {
    const lastId = stateItems[stateItems.length - 1]?.id;

    setNewItemText('');

    const newItem = await createNewItem(newItemText, lastId);

    const lsItems = Array.from(stateItems);
    lsItems.push(newItem);

    setItems(lsItems);
  }

  const onDeleteItem = itemId => {
    deleteItem(itemId);


    const lsItems = Array.from(stateItems);
    var i = 0;

    while( i < lsItems.length){
      if(lsItems[i].id === itemId){
        lsItems.splice(i, 1);
      } else {
        i++;
      }
    }

    setItems(lsItems);
  }

  return  (
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <RootRef rootRef={provided.innerRef}>
              <List style={getListStyle(snapshot.isDraggingOver)}>
                {stateItems.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <ListItem
                        ContainerComponent="li"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <ListItemIcon>
                          <ReorderIcon className={classes.reorderButton}/>
                        </ListItemIcon>
                        <ListItemText>
                        {editItemId === item.id
                          ?  (
                           <div>
                            <TextField fullWidth={true}  id="outlined-basic" margin="dense" variant="outlined" value={editItemText} onChange={ (val) => onChangeValue(val, item.id) }/>
                              <IconButton onClick={()=> saveEditedItem(item.id)} className={classes.editSave}>
                                <SaveIcon />
                              </IconButton>
                              <IconButton onClick={()=> stopEditingItem(item.id)} className={classes.editDiscard}>
                                <CancelIcon />
                              </IconButton>
                            </div>
                          ) : (
                            <span>{item.title}</span>
                          )
                        }
                        </ListItemText>
                        {displayIcons &&
                        <ListItemSecondaryAction>
                        {editItemId !== item.id ?
                           <>
                            <IconButton onClick={()=> startEditingItem(item.id)}>
                              <EditIcon />
                            </IconButton>

                            <IconButton onClick={()=>handleClickOpenDeleteItemDialog(item.id)}>
                              <Delete />
                            </IconButton>
                           </> :

                           <>
                           </>
                        }
                        </ListItemSecondaryAction>
                      }
                      </ListItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
              <Divider />
              <Grid container spacing={1} className={classes.createNewItemContainer} justify="center" alignItems="center">
                <Grid item xs={8}>
                  <TextField id="standard-basic" multiline label="Add new..." fullWidth={true} value={newItemText} onChange={(t) => setNewItemText(t.target.value)}/>
                </Grid>
                <Grid item xs={1}>
                { newItemText &&
                  <IconButton onClick={onCreateNewItem}>
                    <AddCircleOutlineIcon/>
                  </IconButton>
                }
                </Grid>
              </Grid>
            </RootRef>
          )}
        </Droppable>
        <Dialog
           open={deleteItemDialogOpen}
           onClose={handleCloseDeleteItemDialog}
           aria-labelledby="alert-dialog-title"
           aria-describedby="alert-dialog-description"
         >
           <DialogTitle id="alert-dialog-title">{"Are you sure about that?"}</DialogTitle>
           <DialogContent>
             <DialogContentText id="alert-dialog-description">
               Are you sure that you want to remove above item?
               {itemToDelete &&
               <p className={classes.deleteItemQt}>
                {itemToDelete.title}
               </p>
             }
             </DialogContentText>
           </DialogContent>
           <DialogActions>
             <Button onClick={handleCloseDeleteItemDialog} color="primary">
               No
             </Button>
             <Button onClick={handleConfirmDeleteItemDialog} color="primary" autoFocus>
               Yes
             </Button>
           </DialogActions>
         </Dialog>
      </DragDropContext>
    );
}
