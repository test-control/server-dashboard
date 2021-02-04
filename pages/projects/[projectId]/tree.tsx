import {apiBackend} from "../../../services/api";
import {getApiResponseData} from "../../../helpers/api-response-getter";
import {Schemas} from '@test-control/server-api-contracts'
import Layout from "../../../components/layout";
import React, {useEffect, useState} from "react";
import {routes} from "../../../lib/breadcrumbs";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from "@material-ui/core/styles";
import FolderIcon from '@material-ui/icons/Folder';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import ListAltIcon from '@material-ui/icons/ListAlt';
import Box from '@material-ui/core/Box';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import HomeIcon from '@material-ui/icons/Home';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import {useTranslation} from "react-i18next";
import {useSmallNotify} from "../../../helpers";
import CreateProjectTreeLeafDialog from "../../../components/dialogs/create-project-tree-leaf";
import {ALink} from "../../../components/link";

interface TreeParams {
  project: Schemas.Project,
  selectedLeaf: Schemas.Tree
}

const breadcrumbs = [
  routes.mainPage(),
  //@todo
  //add breadcrumbs here
];

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '20px 0'
  },
  subContainer: {
    padding: '5px 15px'
  },
  managerMenu: {
    borderRight: "2px solid #c0c0c030;",
    paddingRight: "10px",
    height: "100%"
  },
  searchInput: {
    width: '100%',
    background: '#dadada69',
    padding: '10px 15px;'
  },
  searchInputText: {
    color: '#6b6b6b'
  },
  fileManagerRow: {
    marginTop: '15px'
  },
  managerMenuContainer: {
    paddingRight: '0px'
  },
  breadCrumbsDivider: {
    height: '2px'
  },
  breadCrumbs: {
    fontSize: "18px"
  },
  breadCrumbsHome: {
    fontSize: "20px"
  },
  breadCrumbsContainer: {
    borderTop: "2px solid #c0c0c01a",
    borderBottom: "2px solid #c0c0c01a",
    padding: "4px 5px;",
    marginTop: "0px",
    paddingLeft: '20px'
  },
  folderRowTitle: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: "wrap"
  },
  folderRowTitleIcon: {
    marginRight: "10px",
    color: "#7d7d7d"
  },
  folderRowCell: {
    color: '#545454'
  },
  fileContainer: {
    background: '#f3f3f3',
    padding: '10px'
  },
  fileContainerTitleBox: {
    color: '#636060',
    padding: '10px 0'
  },
  fileContainerTitleIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  fileContainerTitleIconSvg: {
    fontSize: "40px"
  },
  fileContainerTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: "5px"
  },
  fileContainerInfo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    //color: '#636060',
    fontSize: '13px',
    textAlign: 'center',
    color: 'darkgrey',
  },
  tabsContainer: {
    flexGrow: 1
  }
}));

interface BreadCrumbEntry
{
  tree: Schemas.Tree;
  type: 'home' | 'leaf';
  id: number;
}

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

function Tree(params: TreeParams, el?) {
  const {successMessage, apiResponse} = useSmallNotify();

  const {t} = useTranslation(['project-tree'])
  const classes = useStyles();
  const pageTitle = t('pageTitle', {
    project: params.project
  })

  const [creatingFolder, setCreatingFolder] = useState<boolean>(false)
  const [currentLeaf, setCurrentLeaf] = useState<Schemas.Tree>(params.selectedLeaf)
  const [treeLeaves, setTreeLeaves] = useState<Schemas.Tree[]>([])
  const [treeBreadcrumbs, setTreeBreadcrumbs] = useState<BreadCrumbEntry[]>([])
  const [treeLeavesCount, setTreeLeavesCount] = useState<number>(0)

  const [folderRowsPerPage, setFolderRowsPerPage] = React.useState(10);
  const [folderRowsPage, setFolderRowsPage] = React.useState(0)

  const handleFoldersChangePage = (event, newPage) => {
    setFolderRowsPage(newPage);

    reloadFolders(newPage)
  };

  const handleFoldersChangeRowsPerPage = (event) => {
    setFolderRowsPerPage(event.target.value);
    setFolderRowsPage(0);

    reloadFolders(0, event.target.value);
  };

  const goToLeaf = (leaf) => {
    setCurrentLeaf(leaf);
    setFolderRowsPage(0);
    reloadFolders(0);

  }

  const reloadFolders = (page?:number, perPage?: number) => {
    apiBackend.trees.getLeaves(
      currentLeaf.id,
      (typeof page !== undefined ? page : folderRowsPage) + 1,
      typeof perPage !== undefined? perPage : folderRowsPerPage
    ).then((res) => {
      setTreeLeaves(res.data)
      setTreeLeavesCount(res.meta.total)
    }).then(() => {
      apiBackend.trees.getRootPath(currentLeaf.id).then((res) => {
        const newBreadCrumbs : Array<BreadCrumbEntry> = [];
        let lId = 1;

        for(var leaf of res.data) {
          if(newBreadCrumbs.length == 0 ){
            newBreadCrumbs.push({
              type: 'home',
              tree: leaf,
              id: lId
            })

            lId++;

            continue;
          }

          newBreadCrumbs.push({
            tree: leaf,
            type: 'leaf',
            id: lId
          });

          lId++;
        }

        setTreeBreadcrumbs(newBreadCrumbs);
      });
    })
  }



  if(params.selectedLeaf.id !== currentLeaf.id){
    goToLeaf(params.selectedLeaf);
  }

  useEffect(() => {
    reloadFolders();
  }, [currentLeaf])

  return (
    <Layout breadcrumbs={breadcrumbs} pageTitle={pageTitle} pageTitleEditable={false}>
      <Paper className={classes.container}>
        <Grid container>
          <Grid item xs={2} className={classes.subContainer + ' ' + classes.managerMenuContainer}>
            <Box className={classes.managerMenu}>
            <List component="nav" aria-label="main mailbox folders">
              <ListItem button onClick={() => setCreatingFolder(true)}>
                <ListItemIcon>
                  <CreateNewFolderIcon />
                </ListItemIcon>
                <ListItemText primary={t('menu.newFolder')} />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <ListAltIcon />
                </ListItemIcon>
                <ListItemText primary={t('menu.createTestCase')} />
              </ListItem>
            </List>
            </Box>
          </Grid>
          <Grid item xs={10} className={classes.subContainer}>
            <Box className={classes.fileManagerRow + ' ' + classes.breadCrumbsContainer}>
              <Breadcrumbs aria-label="breadcrumb" className={classes.breadCrumbs}>
                {treeBreadcrumbs.map((row) => {
                    if(row.type === 'home') {
                      return (
                        <ALink href={ `/projects/${params.project.id}/tree?leaf=${row.tree.id}`} key={row.id}>
                          <HomeIcon className={classes.breadCrumbsHome}/>
                        </ALink>
                      )
                    }

                    return (
                      <ALink href={ `/projects/${params.project.id}/tree?leaf=${row.tree.id}`} key={row.id}>
                        {row.tree.title}
                      </ALink>
                    )
                  }
                )}
              </Breadcrumbs>
            </Box>
            <Box className={classes.fileManagerRow}>
              <TableContainer>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.folderRowCell}>Folder name</TableCell>
                      <TableCell align="center" className={classes.folderRowCell}>{t('leaves.elements')}</TableCell>
                      <TableCell align="center" className={classes.folderRowCell}>{t('leaves.createdAt')}</TableCell>
                      <TableCell align="center" className={classes.folderRowCell}>{t('leaves.actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {treeLeaves.map((row) => (
                      <TableRow hover key={row.id}>
                        <TableCell component="th" scope="row" className={classes.folderRowTitle + ' ' + classes.folderRowCell}>
                          <FolderIcon  className={classes.folderRowTitleIcon}/>
                          <ALink href={ `/projects/${params.project.id}/tree?leaf=${row.id}`}>
                            <p>{row.title}</p>
                          </ALink>
                        </TableCell>
                        <TableCell align="center" className={classes.folderRowCell}>-</TableCell>
                        <TableCell align="center" className={classes.folderRowCell}>-</TableCell>
                        <TableCell align="center" className={classes.folderRowCell}>actions</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={treeLeavesCount}
                rowsPerPage={folderRowsPerPage}
                page={folderRowsPage}
                onChangePage={handleFoldersChangePage}
                onChangeRowsPerPage={handleFoldersChangeRowsPerPage}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>
      <CreateProjectTreeLeafDialog
        opened={creatingFolder}
        handleClose={() => setCreatingFolder(false)}
        treeLeafId={currentLeaf.id}
        onFolderCreated={reloadFolders}
      />
    </Layout>
  )
}

Tree.getInitialProps = async ({query}) => {
  const projectId = query.projectId;
  const project = await apiBackend.project.get(projectId)

  let selectedLeaf;

  if(query.leaf){
    selectedLeaf =  await apiBackend.trees.get(query.leaf)
  } else {
    selectedLeaf =  await apiBackend.project.getTreeRoot(projectId)
  }

  return {
    project: getApiResponseData<Schemas.Project>(project),
    selectedLeaf: getApiResponseData<Schemas.Tree>(selectedLeaf),
  }
}

export default Tree
