import Layout from "../../components/layout";
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import AccountTree from '@material-ui/icons/AccountTree';
import Typography from '@material-ui/core/Typography';
import {ButtonLink} from '../../components/link';
import {apiBackend} from "../../services/api";
import Pagination from '@material-ui/lab/Pagination';
import PaginationContainer from "../../components/pagination-container";
import NoDataContainer from "../../components/no-data-conainter";
import { useState } from 'react';
const useStyles = makeStyles((theme) => ({

}));
import React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import { ALink } from '../../components/link';
import { routes } from "../../lib/breadcrumbs";

const columns = [
  { id: 'id', label: 'ID', 'width': 50 , align: 'center'},
  { id: 'name', label: 'Name', 'width': 100, align: 'center' },
  { id: 'description', label: 'Description', 'width': 100, align:'center' }
];

const pageButtons = [
  {
    buttonVariant: 'contained',
    text: '+ Create project',
    href: '/projects/create',
    buttonSize: 'small',
    buttonColor: 'primary',
  }
];

const breadcrumbs = [
  routes.mainPage(),
  routes.projects.list()
];

function ProjectsIndex(props) {
  const classes = useStyles();

  const [projectsList, setProjects] = useState(props.projects);
  const [perPage, setPerPage] = useState(props.perPage);
  const [page, setPage] = useState(props.currentPage || 0);
  const [total, setTotal] = useState(props.total);

  const handleChangePage = async (event, newPage) => {
    setPage(newPage);
    await reloadPage(newPage, perPage);
  };

  const handleChangeRowsPerPage = async (event) => {
    const lPerPage = parseInt(event.target.value, 10);
    setPerPage(lPerPage);
    await reloadPage(0, lPerPage);
  };

  const reloadPage = async (lPage, lPerPage) => {
    const projects = await apiBackend.project.list(lPage + 1, lPerPage);

    setProjects(projects.data);

    const meta = projects.meta;

    setPerPage(meta.perPage);
    setPage(meta.currentPage - 1);
  }

  return <Layout pageButtons={pageButtons} breadcrumbs={breadcrumbs}>
    {props.total === 0 &&
    <NoDataContainer header="No project exists" description="Add projects to organize your tests">
      <ButtonLink href="/projects/create" passHref buttonColor="primary" buttonVariant="contained">
        Create project
      </ButtonLink>
    </NoDataContainer>
    }
    {props.total !== 0 &&
    <TableContainer component={Paper}>
      <Table aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                style={{ maxWidth: column.width, width: column.width }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {projectsList.map((row) => (
            <TableRow key={row.id} hover>
              <TableCell
                style={{maxWidth: columns[0].width, width: columns[0].width}}
                align={columns[0].align}
              >
                {row.id}
              </TableCell>
              <TableCell
                style={{maxWidth: columns[1].width, width: columns[1].width}}
                align={columns[1].align}
              >
                <ALink href={'/projects/' + row.id + '/tree'}>
                  {row.title}
                </ALink>
              </TableCell>
              <TableCell
                style={{maxWidth: columns[2].width, width: columns[2].width}}
                align={columns[2].align}
              >
                {row.description}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 20]}
              colSpan={3}
              count={total}
              rowsPerPage={perPage}
              page={page}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
    }
  </Layout>

}

ProjectsIndex.getInitialProps = async (ctx) => {

  const projects = await apiBackend.project.list(1, 20);
  const projectsList = projects.data;
  const meta = projects.meta;

  return {
    projects: projectsList,
    total: meta.total,
    lastPage: meta.lastPage,
    perPage: meta.perPage,
    currentPage: meta.currentPage - 1
  };
}

export default ProjectsIndex
