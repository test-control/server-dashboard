import {ApiResponse, create} from 'apisauce';
import {ApiConnectionError} from "../helpers/exceptions";
import {Api} from '@test-control/server-api-contracts'

const connection = create({
  baseURL: process.env.TEST_CONTROL_DASHBOARD_API_URL + '/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});


export const apiErrorHandler  = async <T,U=T>(pResponse: Promise<ApiResponse<T,U>>) : Promise<T> => {
  const response = await pResponse;

  if(response.ok) {
    return response.data;
  }

  throw new ApiConnectionError(
    response
  )
}

export const apiBackend = {
  project: {
    create: async (data) => {
      return apiErrorHandler(connection.post<Api.CreateProject.ResponseBody>('/projects', data))
    },
    update: async (projectId, data) => {
      return apiErrorHandler(connection.post<Api.UpdateProject.ResponseBody>('/projects/' + projectId, data))
    },
    list: async(page, perPage) => {
      return apiErrorHandler(connection.get<Api.ListProjects.ResponseBody>('/projects', {
          page: page,
          perPage: perPage
      }))
    }
  },
  testCase: {
    get: async (testCaseId) => {
      return apiErrorHandler(connection.get<Api.GetTestCase.ResponseBody>('/test-cases/' + testCaseId))
    },
    update: async (testCaseId, data) => {
      return apiErrorHandler(connection.patch<Api.UpdateTestCases.ResponseBody>('/test-cases/' + testCaseId, data))
    },
    preconditions: {
      update: async(preconditionId, data) => {
        return apiErrorHandler(connection.patch<Api.UpdateTestCasePreconditions.ResponseBody>('/test-case-preconditions/' + preconditionId, data))
      },
      get: async (testCaseId)  => {
        return apiErrorHandler(connection.get<Api.ListTestCasePreconditions.ResponseBody>('/test-cases/' + testCaseId + "/preconditions"))
      },
      delete: async (preconditionId) => {
        return apiErrorHandler(connection.delete<Api.DeleteTestCasePreconditions.ResponseBody>('/test-case-preconditions/' + preconditionId))
      },
      create: async (testCaseId,data) => {
        return apiErrorHandler(connection.post<Api.CreateTestCasePreconditions.ResponseBody>('/test-cases/' + testCaseId + "/preconditions", data))
      }
    },
    steps: {
      update: async(stepId, data) => {
        return apiErrorHandler(connection.patch<Api.UpdateTestCaseSteps.ResponseBody>('/test-case-steps/' + stepId, data))
      },
      get: async (stepId) => {
        return apiErrorHandler(connection.get<Api.ListTestCaseSteps.ResponseBody>('/test-cases/' + stepId + "/steps"))
      },
      delete: async (stepId) => {
        return apiErrorHandler(connection.delete<Api.DeleteTestCaseSteps.ResponseBody>('/test-case-steps/' + stepId))
      },
      create: async (stepId,data) => {
        return apiErrorHandler(connection.post<Api.CreateTestCaseSteps.ResponseBody>('/test-cases/' + stepId + "/steps", data))
      }
    }
  }
}