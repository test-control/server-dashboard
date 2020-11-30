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
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import ListAltIcon from '@material-ui/icons/ListAlt';
import Box from '@material-ui/core/Box';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import AccountCircle from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import HomeIcon from '@material-ui/icons/Home';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import DescriptionIcon from '@material-ui/icons/Description';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import {useTranslation} from "react-i18next";
import {useSmallNotify} from "../../../helpers";

interface TreeParams {
  project: Schemas.Project,
  projectTreeRoot: Schemas.Tree
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
    fontSize: "13px"
  },
  breadCrumbsHome: {
    fontSize: "15px"
  },
  breadCrumbsContainer: {
    borderTop: "2px solid #c0c0c01a",
    background: '#bfbfbf69',
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
  }
}));

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

function Tree(params: TreeParams) {
  const {successMessage, apiResponse} = useSmallNotify();

  const {t} = useTranslation(['project-tree'])
  const classes = useStyles();
  const pageTitle = t('pageTitle', {
    project: params.project
  })

  const [treeLeaves, setTreeLeaves] = useState<Schemas.Tree[]>([])

  useEffect(() => {
    apiBackend.trees.get(params.projectTreeRoot.id).then((res) => {
      setTreeLeaves(res.data)
    })
  })

  return (
    <Layout breadcrumbs={breadcrumbs} pageTitle={pageTitle} pageTitleEditable={false}>
      <Paper className={classes.container}>
        <Grid container>
          <Grid item xs={2} className={classes.subContainer + ' ' + classes.managerMenuContainer}>
            <Box className={classes.managerMenu}>
            <List component="nav" aria-label="main mailbox folders">
              <ListItem button>
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
            <Box className={classes.fileManagerRow}>
              <FormControl className={classes.searchInput}>
                <InputBase
                  id="input-with-icon-adornment"
                  fullWidth
                  placeholder={t('search')}
                  className={classes.searchInputText}
                  startAdornment={
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Box>
            <Box className={classes.fileManagerRow + ' ' + classes.breadCrumbsContainer}>
              <Breadcrumbs aria-label="breadcrumb" className={classes.breadCrumbs}>
                <Link color="inherit" href="/" >
                  <HomeIcon className={classes.breadCrumbsHome}/>
                </Link>
                <Link color="inherit" href="/" >
                  Path
                </Link>
              </Breadcrumbs>
            </Box>
            <Box className={classes.fileManagerRow}>
              <TableContainer>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.folderRowCell}>Folder name</TableCell>
                      <TableCell align="center" className={classes.folderRowCell}>{t('leaves.elements')}</TableCell>
                      <TableCell align="center" className={classes.folderRowCell}>{t('menu.createdAt')}</TableCell>
                      <TableCell align="center" className={classes.folderRowCell}>{t('menu.actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {treeLeaves.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell component="th" scope="row" className={classes.folderRowTitle + ' ' + classes.folderRowCell}>
                          <FolderIcon  className={classes.folderRowTitleIcon}/> <p>{row.title}</p>
                        </TableCell>
                        <TableCell align="center" className={classes.folderRowCell}>-</TableCell>
                        <TableCell align="center" className={classes.folderRowCell}>-</TableCell>
                        <TableCell align="center" className={classes.folderRowCell}>actions</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Layout>
  )
}

Tree.getInitialProps = async ({query}) => {

  const projectId = query.projectId;
  const project = await apiBackend.project.get(projectId)
  const projectTreeRoot =  await apiBackend.project.getTreeRoot(projectId)

  return {
    project: getApiResponseData<Schemas.Project>(project),
    projectTreeRoot: getApiResponseData<Schemas.Tree>(projectTreeRoot)
  }
}

export default Tree
