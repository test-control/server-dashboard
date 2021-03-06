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

function ShowTestCase({testCase, preconditions, steps, project, treeLeaf}) {
  const {successMessage, apiResponse} = useSmallNotify();
  Map<Schemas.TestCase>(testCase);

  const [editableTestCase, setEditableTestCase] = React.useState<Map<string, string>>(
    () => Map(testCase),
  );
  const breadcrumbs = () => {
    const brd = [
      routes.mainPage(),
      routes.projects.list(),
      routes.projects.dashboard(
        project.id,
        project.title
      ),
    ];

    if(treeLeaf.title !== "root") {
      brd.push(routes.projects.treeLeaf(
        project.id,
        treeLeaf.id,
        treeLeaf.title
      ))
    } else {
      brd.push(routes.projects.tree(
        project.id
      ))
    }

    brd.push(routes.testCases.show(
      editableTestCase.get('id'),
      editableTestCase.get('title')
    ))

    return brd;
  }


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
   return apiResponse(apiBackend.testCase.steps.update(
      itemId,
      {
        title: title
      }
    ), t('step.updated'));
  }

  const onChangeTestCaseStepItemOrder = (itemId:string, displayDestination:string, direction: 'up' | 'down') : Promise<any> => {
    return apiResponse(apiBackend.testCase.steps.update(
      itemId,
      {
        displayDestination: displayDestination,
        displayMoveDirection: direction
      }
    ), t('step.updated'));
  }

  const onDeleteTestCaseStepItem = (itemId: string) : Promise<any> => {
    return apiResponse(apiBackend.testCase.steps.delete(
      itemId
    ), t('step.deleted'));
  }

  const onCreateTestCaseStepItem = async (itemTitle: string, displayAfter: string) : Promise<IListItem> => {

    const resp = await apiResponse(apiBackend.testCase.steps.create(
      testCase.id,
      {
        title: itemTitle,
        displayAfter: displayAfter
      }
    ), t('step.created'));

    return resp.data
  }

    const onSave = async () => {
      const content = JSON.stringify(convertToRaw(
        editorState.getCurrentContent()
      ));

      setEditableTestCase(editableTestCase.set('description', content));

      await apiResponse(apiBackend.testCase.update(
        testCase.id,
        {
          description: content
        }
      ), t('testCase.updated'));
    }

    const onChangePageTitle = async (pageTitle) => {

      await apiResponse(apiBackend.testCase.update(
        testCase.id,
        {
          title: pageTitle
        }
      ), t('testCase.updated'));

      setEditableTestCase(editableTestCase.set('title', pageTitle));
    }

    return <Layout breadcrumbs={breadcrumbs()} pageTitle={editableTestCase.get('title')} pageTitleEditable={true} onChangePageTitle={onChangePageTitle}>
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
  const testCase = await apiBackend.testCase.get(query.id);
  const project = await apiBackend.trees.getProject(testCase.data.treeId);
  const treeLeaf = await apiBackend.trees.get(testCase.data.treeId);

  resetServerContext();

  return {
    testCase: testCase.data,
    preconditions: sortedPreconditions,
    steps: sortedSteps,
    project: project.data,
    treeLeaf: treeLeaf.data
  };
}

export default ShowTestCase;
