import {Api} from '@test-control/server-api-contracts'
import {apiErrorHandler, getDefaultUserConnection} from "./api-services/base";
import authApis from './api-services/auth';
import {NextPageContext} from "next";

export const apiBackend = (ctx?: NextPageContext) => ({
  auth: authApis,
  project: {
    create: async (data) => {
      return apiErrorHandler(getDefaultUserConnection(ctx).post<Api.CreateProject.ResponseBody>('/projects', data))
    },
    update: async (projectId, data) => {
      return apiErrorHandler(getDefaultUserConnection(ctx).post<Api.UpdateProject.ResponseBody>('/projects/' + projectId, data))
    },
    list: async(page, perPage) => {
      return apiErrorHandler(getDefaultUserConnection(ctx).get<Api.ListProjects.ResponseBody>('/projects', {
          page: page,
          perPage: perPage
      }))
    },
    get: async(projectId) => {
      return apiErrorHandler(getDefaultUserConnection(ctx).get<Api.GetProject.ResponseBody>('/projects/' + projectId));
    },
    getTreeRoot: async(projectId) => {
      return apiErrorHandler(getDefaultUserConnection(ctx).get<Api.GetProjectTestSuiteRoot.ResponseBody>('/projects/' + projectId + '/test-suite-root'))
    }
  },
  testCase: {
    create: async (data: Api.CreateTestCase.RequestBody) => {
      return apiErrorHandler(getDefaultUserConnection(ctx).post<Api.CreateTestCase.ResponseBody>('/test-cases', data));
    },
    get: async (testCaseId) => {
      return apiErrorHandler(getDefaultUserConnection(ctx).get<Api.GetTestCase.ApplicationJson200ResponseBody>('/test-cases/' + testCaseId))
    },
    update: async (testCaseId, data) => {
      return apiErrorHandler(getDefaultUserConnection(ctx).patch<Api.UpdateTestCases.ResponseBody>('/test-cases/' + testCaseId, data))
    },
    move: async (testCaseId, data) => {
      return apiErrorHandler(getDefaultUserConnection(ctx).post<Api.MoveTestCase.ResponseBody>('/test-cases/' + testCaseId + '/move', data))
    },
    preconditions: {
      update: async(preconditionId, data) => {
        return apiErrorHandler(getDefaultUserConnection(ctx).patch<Api.UpdateTestCasePreconditions.ResponseBody>('/test-case-preconditions/' + preconditionId, data))
      },
      get: async (testCaseId)  => {
        return apiErrorHandler(getDefaultUserConnection(ctx).get<Api.ListTestCasePreconditions.ResponseBody>('/test-cases/' + testCaseId + "/preconditions"))
      },
      delete: async (preconditionId) => {
        return apiErrorHandler(getDefaultUserConnection(ctx).delete<Api.DeleteTestCasePreconditions.ResponseBody>('/test-case-preconditions/' + preconditionId))
      },
      create: async (testCaseId,data)  => {
        return apiErrorHandler(getDefaultUserConnection(ctx).post<Api.CreateTestCasePreconditions.ResponseBody>('/test-cases/' + testCaseId + "/preconditions", data))
      }
    },
    steps: {
      update: async(stepId, data) => {
        return apiErrorHandler(getDefaultUserConnection(ctx).patch<Api.UpdateTestCaseSteps.ResponseBody>('/test-case-steps/' + stepId, data))
      },
      get: async (stepId) => {
        return apiErrorHandler(getDefaultUserConnection(ctx).get<Api.ListTestCaseSteps.ResponseBody>('/test-cases/' + stepId + "/steps"))
      },
      delete: async (stepId) => {
        return apiErrorHandler(getDefaultUserConnection(ctx).delete<Api.DeleteTestCaseSteps.ResponseBody>('/test-case-steps/' + stepId))
      },
      create: async (stepId,data) => {
        return apiErrorHandler(getDefaultUserConnection(ctx).post<Api.CreateTestCaseSteps.ResponseBody>('/test-cases/' + stepId + "/steps", data))
      }
    }
  },
  trees: {
    get: async (treeId) => {
      return apiErrorHandler(getDefaultUserConnection(ctx).get<Api.GetTestSuite.ApplicationJson200ResponseBody>('/test-suites/' + treeId))
    },
    update: async (treeId: string, data: Api.UpdateTestSuiteLeaf.RequestBody) => {
      return apiErrorHandler(getDefaultUserConnection(ctx).patch<Api.UpdateTestSuiteLeaf.ApplicationJson200ResponseBody>('/test-suites/' + treeId, data))
    },
    getLeaves: async (treeId, pageNumber?:number, rowsPerPage?: number) => {
      return apiErrorHandler(getDefaultUserConnection(ctx).get<Api.ListTestSuiteLeaves.ResponseBody>('/test-suites/' + treeId + '/leaves', {
        page: pageNumber || 0,
        perPage: rowsPerPage || 10
      }))
    },
    getTestCases: async(treeId, pageNumber?:number, rowsPerPage?: number) => {
      return apiErrorHandler(getDefaultUserConnection(ctx).get<Api.ListTestSuiteTestCases.ApplicationJson200ResponseBody>('/test-suites/' + treeId + '/test-cases', {
        page: pageNumber || 0,
        perPage: rowsPerPage || 10
      }))
    },
    create: async (treeId, data) => {
      return apiErrorHandler(getDefaultUserConnection(ctx).post<Api.CreateTestSuiteLeaf.ApplicationJson201ResponseBody>('/test-suites/' + treeId, data))
    },
    getRootPath: async(leafId) => {
      return apiErrorHandler(getDefaultUserConnection(ctx).get<Api.GetTestSuiteRootPath.ApplicationJson200ResponseBody>('/test-suites/' + leafId + '/root-path'))
    },
    getProject: async(leafId) => {
      return apiErrorHandler(getDefaultUserConnection(ctx).get<Api.GetTestSuiteGetProject.ApplicationJson200ResponseBody>('/test-suites/' + leafId + '/get-project'))
    },
    getParent: async(leafId) => {
      return apiErrorHandler(getDefaultUserConnection(ctx).get<Api.GetTestSuiteParent.ApplicationJson200ResponseBody>('/test-suites/' + leafId + '/get-parent'))
    }
  }
})
