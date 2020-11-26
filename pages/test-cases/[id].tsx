import Layout from "../../components/layout";
import { makeStyles } from '@material-ui/core/styles';
import { useState, useEffect } from 'react';
import { routes } from "../../lib/breadcrumbs";
import { PageSection, RichEditor } from '../../components';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import {apiBackend} from "../../services/api";
import { Map } from 'immutable';
import { EditableList} from '../../components';
import { resetServerContext } from "react-beautiful-dnd";
import {useSmallNotify} from "../../helpers";
import {Schemas} from '@test-control/server-api-contracts'
import React from 'react';
import {useTranslation} from "react-i18next";
import {IListItem} from "../../components/grid/editable-list";

const useStyles = makeStyles((theme) => ({
  description: {
    fontSize: '15px'
  },
  descriptionContent: {
    paddingBottom: '20px'
  }
}));

function ShowTestCase({testCase, preconditions, steps}) {
  const {successMessage, apiResponse} = useSmallNotify();
  Map<Schemas.TestCase>(testCase);

  const [editableTestCase, setEditableTestCase] = React.useState<Map<string, string>>(
    () => Map(testCase),
  );
  const breadcrumbs = [
    routes.mainPage(),
    routes.testCases.show(
      editableTestCase.get('id'),
      editableTestCase.get('title')
    )
  ];

  const {t} = useTranslation('test-case')

  var state;
  const description = editableTestCase.get('description') || '';

  if(description){
    const contentState = convertFromRaw(JSON.parse( description));
    state =  EditorState.createWithContent(contentState);
  } else {
    state = EditorState.createEmpty();
  }

  const [editorState, setEditorState] = React.useState(
    () => state,
  );

  const [showEditorState, setShowEditorState] = React.useState(false);
  const [onSsrState, setOnSsrState] = React.useState(
    () => true
  );

  const classes = useStyles();

  useEffect(() => {
    setOnSsrState(false);
  });

  const onSavePreconditionTitle = async (itemId, title) : Promise<void> => {
    return apiResponse(apiBackend.testCase.preconditions.update(
      itemId,
      {
        title: title
      }
    ),t('precondition.updated'));
  }

  const onChangePreconditionItemOrder = (itemId: string, displayDestination:string, direction: 'up' | 'down') : Promise<void> => {
    return apiResponse(apiBackend.testCase.preconditions.update(
      itemId,
      {
        displayDestination: displayDestination,
        displayMoveDirection: direction
      }
    ), t('precondition.updated'));
  }

  const onDeletePreconditionItem = (itemId: string) : Promise<any> => {
    return apiResponse(apiBackend.testCase.preconditions.delete(
      itemId
    ), t('precondition.deleted'));
  }

  const onCreatePreconditionItem = async (itemTitle: string, displayAfter:string) : Promise<IListItem> => {
      const resp = await apiResponse(apiBackend.testCase.preconditions.create(
        testCase.id,
        {
          title: itemTitle,
          displayAfter: displayAfter
        }
      ), t('precondition.created'));

      return resp.data;
  }

  const onSaveTestCaseStepTitle = (itemId: string, title: string) : Promise<any> => {
  /*  apiBackend.testCase.steps.update(
      itemId,
      {
        title: title
      }
    ).then(apiResponse(t('step.updated')));*/
    return;
  }

  const onChangeTestCaseStepItemOrder = (itemId:string, displayDestination:string, direction: 'up' | 'down') : Promise<any> => {
    /*apiBackend.testCase.steps.update(
      itemId,
      {
        displayDestination: displayDestination,
        displayMoveDirection: direction
      }
    ).then(apiResponse(t('step.updated')));*/

    return
  }

  const onDeleteTestCaseStepItem = (itemId: string) : Promise<any> => {
    /*apiBackend.testCase.steps.delete(
      itemId
    ).then(apiResponse(t('step.deleted')));*/
    return
  }

  const onCreateTestCaseStepItem = async (itemTitle: string, displayAfter: string) : Promise<IListItem> => {
    /*
    const resp = await apiBackend.testCase.steps.create(
      testCase.id,
      {
        title: itemTitle,
        displayAfter: displayAfter
      }
    )

    apiResponse(t('step.created'))(resp);*/
    return {
      id: 'asddd',
      title: 'xczxc'
    }
  }

    const onSave = () => {
    /*
      const content = JSON.stringify(convertToRaw(
        editorState.getCurrentContent()
      ));

      setEditableTestCase(editableTestCase.set('description', content));

      apiBackend.testCase.update(
        testCase.id,
        {
          description: content
        }
      ).then(apiResponse(t('testCase.updated')));*/
    }

    const onChangePageTitle = (pageTitle) => {
/*
      setEditableTestCase(editableTestCase.set('title', pageTitle));
        apiBackend.testCase.update(
          testCase.id,
          {
            title: pageTitle
          }
      ).then(apiResponse(t('testCase.updated')), apiResponse(t('testCase.createFail')));*/
    }

    return <Layout breadcrumbs={breadcrumbs} pageTitle={editableTestCase.get('title')} pageTitleEditable={true} onChangePageTitle={onChangePageTitle}>
    <PageSection title={t('description')} className={classes.description}>
     {!onSsrState &&
     <div className={classes.descriptionContent}>
      <RichEditor
        editorState={editorState}
        setEditorState={setEditorState}
        showEditorState={showEditorState}
        setShowEditorState={setShowEditorState}
        onSave={onSave}
      />
       </div>
     }
    </PageSection>
    <PageSection title={t('preconditions')}>
     <EditableList
      items={preconditions}
      saveItemTitle={onSavePreconditionTitle}
      changeItemOrder={onChangePreconditionItemOrder}
      deleteItem={onDeletePreconditionItem}
      createNewItem={onCreatePreconditionItem}
     />
   </PageSection>
    <PageSection title={t('steps')}>
        <EditableList
            items={steps}
            saveItemTitle={onSaveTestCaseStepTitle}
            changeItemOrder={onChangeTestCaseStepItemOrder}
            deleteItem={onDeleteTestCaseStepItem}
            createNewItem={onCreateTestCaseStepItem}
        />
    </PageSection>
    </Layout>
}

type SortableItems = Schemas.TestCasePrecondition | Schemas.TestCaseStep

const sortDisplayAfter = (items: Array<SortableItems>, sorted?: Array<SortableItems>, deep?: number) => {

  if(!sorted){
    sorted = [];
  }

  if(!deep){
    deep = 1;
  } else {
    deep++;
  }

  if(deep > 1000) {
    return sorted;
  }

  for(var it of items)
  {
    if(sorted.find((elem) => elem.id === it.id)){
      continue;
    }

    if(!it.displayAfter){
      sorted.unshift(it);
      continue;
    }

    for(var sit of Object.keys(sorted))
    {
      if(sorted[sit].id === it.displayAfter){
        sorted.splice(Number(sit) + 1, 0, it);
        break;
      }
    }
  }

  if(sorted.length === items.length){
    return sorted;
  }

  return sortDisplayAfter(items, sorted, deep);
}

ShowTestCase.getInitialProps = async ({query}) => {

  const preconditions = (await apiBackend.testCase.preconditions.get(query.id)).data;
  const steps = (await apiBackend.testCase.steps.get(query.id)).data;
  const sortedPreconditions = sortDisplayAfter(preconditions);
  const sortedSteps = sortDisplayAfter(steps);

  resetServerContext();

  return {
    testCase: (await apiBackend.testCase.get(query.id)).data,
    preconditions: sortedPreconditions,
    steps: sortedSteps
  };
}

export default ShowTestCase;
