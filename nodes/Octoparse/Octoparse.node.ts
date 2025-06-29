import { INodeType, INodeTypeDescription, IExecuteFunctions, NodeApiError, NodeOperationError } from 'n8n-workflow';

export class Octoparse implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Octoparse',
        name: 'octoparse',
        icon: 'file:logo.png',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"]}}',
        description: 'Interact with Octoparse API',
        defaults: {
            name: 'Octoparse',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'octoparseApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                options: [
                    { name: 'Tasks', value: 'tasks' },
                    { name: 'Cloud Extraction', value: 'cloudExtraction' },
                    { name: 'Data', value: 'data' },
                ],
                default: 'tasks',
                required: true,
            },
            // Operation dropdown for Tasks
            {
                displayName: 'Operation',
                name: 'operationTasks',
                type: 'options',
                options: [
                    { name: 'Get Task Groups', value: 'getTaskGroups' },
                    { name: 'Copy Task', value: 'copyTask' },
                    { name: 'Move Task To Group', value: 'moveTaskToGroup' },
                    { name: 'Search Task', value: 'searchTask' },
                ],
                default: 'getTaskGroups',
                displayOptions: { show: { resource: ['tasks'] } },
                required: true,
            },
            // Operation dropdown for Cloud Extraction
            {
                displayName: 'Operation',
                name: 'operationCloudExtraction',
                type: 'options',
                options: [
                    { name: 'Task Status', value: 'cloudTaskStatus' },
                    { name: 'Task Status V2', value: 'cloudTaskStatusV2' },
                    { name: 'Start Task', value: 'cloudextractionStart' },
                    { name: 'Stop Task', value: 'cloudextractionStop' },
                    { name: 'Get Subtask Status', value: 'cloudextractionGetSubtasks' },
                    { name: 'Start Subtasks', value: 'cloudextractionStartSubtasks' },
                    { name: 'Stop Subtasks', value: 'cloudextractionStopSubtasks' },
                ],
                default: 'cloudTaskStatus',
                displayOptions: { show: { resource: ['cloudExtraction'] } },
                required: true,
            },
            // Operation dropdown for Data
            {
                displayName: 'Operation',
                name: 'operationData',
                type: 'options',
                options: [
                    { name: 'Get Data by Offset', value: 'getDataByOffset' },
                    { name: 'Get Data From Batch by Offset', value: 'getDataFromBatchByOffset' },
                    { name: 'Get Non-Exported Data', value: 'getNonExportedData' },
                    { name: 'Mark Data as Exported', value: 'markDataExported' },
                    { name: 'Remove Data', value: 'removeData' },
                ],
                default: 'getDataByOffset',
                displayOptions: { show: { resource: ['data'] } },
                required: true,
            },
            {
                displayName: 'Task Group ID',
                name: 'taskGroupId',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        resource: ['tasks'],
                        operationTasks: ['copyTask', 'moveTaskToGroup'],
                    },
                },
                required: true,
            },
            {
                displayName: 'Task ID',
                name: 'taskId',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        resource: ['tasks'],
                        operationTasks: ['copyTask', 'moveTaskToGroup'],
                    },
                },
                required: true,
            },
            {
                displayName: 'Task Group ID',
                name: 'searchTaskGroupId',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        resource: ['tasks'],
                        operationTasks: ['searchTask'],
                    },
                },
                required: true,
            },
            {
                displayName: 'Task IDs',
                name: 'cloudTaskIds',
                type: 'fixedCollection',
                typeOptions: {
                    multipleValues: true,
                },
                options: [
                    {
                        name: 'taskId',
                        displayName: 'Task ID',
                        values: [
                            {
                                displayName: 'Task ID',
                                name: 'value',
                                type: 'string',
                                default: '',
                            },
                        ],
                    },
                ],
                default: {},
                displayOptions: {
                    show: {
                        resource: ['cloudExtraction'],
                        operationCloudExtraction: ['cloudTaskStatus', 'cloudTaskStatusV2'],
                    },
                },
                required: true,
            },
            {
                displayName: 'Task ID',
                name: 'cloudTaskId',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        resource: ['cloudExtraction'],
                        operationCloudExtraction: ['cloudextractionStart', 'cloudextractionStop'],
                    },
                },
                required: true,
            },
            {
                displayName: 'Task ID',
                name: 'cloudSubtaskTaskId',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        resource: ['cloudExtraction'],
                        operationCloudExtraction: ['cloudextractionGetSubtasks'],
                    },
                },
                required: true,
            },
            {
                displayName: 'Page',
                name: 'cloudSubtaskPage',
                type: 'string',
                default: '1',
                displayOptions: {
                    show: {
                        resource: ['cloudExtraction'],
                        operationCloudExtraction: ['cloudextractionGetSubtasks'],
                    },
                },
                required: true,
            },
            {
                displayName: 'Size',
                name: 'cloudSubtaskSize',
                type: 'string',
                default: '10',
                displayOptions: {
                    show: {
                        resource: ['cloudExtraction'],
                        operationCloudExtraction: ['cloudextractionGetSubtasks'],
                    },
                },
                required: true,
            },
            {
                displayName: 'Task ID',
                name: 'cloudSubtaskActionTaskId',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        resource: ['cloudExtraction'],
                        operationCloudExtraction: ['cloudextractionStartSubtasks', 'cloudextractionStopSubtasks'],
                    },
                },
                required: true,
            },
            {
                displayName: 'Subtask IDs',
                name: 'cloudSubtaskIds',
                type: 'fixedCollection',
                typeOptions: {
                    multipleValues: true,
                },
                options: [
                    {
                        name: 'subTaskId',
                        displayName: 'Subtask ID',
                        values: [
                            {
                                displayName: 'Subtask ID',
                                name: 'value',
                                type: 'string',
                                default: '',
                            },
                        ],
                    },
                ],
                default: {},
                displayOptions: {
                    show: {
                        resource: ['cloudExtraction'],
                        operationCloudExtraction: ['cloudextractionStartSubtasks', 'cloudextractionStopSubtasks'],
                    },
                },
                required: true,
            },
            {
                displayName: 'Task ID',
                name: 'dataTaskId',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        resource: ['data'],
                        operationData: ['getDataByOffset', 'getNonExportedData', 'markDataExported', 'removeData'],
                    },
                },
                required: true,
            },
            {
                displayName: 'Offset',
                name: 'dataOffset',
                type: 'string',
                default: '0',
                displayOptions: {
                    show: {
                        resource: ['data'],
                        operationData: ['getDataByOffset'],
                    },
                },
                required: true,
            },
            {
                displayName: 'Size',
                name: 'dataSize',
                type: 'string',
                default: '100',
                displayOptions: {
                    show: {
                        resource: ['data'],
                        operationData: ['getDataByOffset', 'getNonExportedData'],
                    },
                },
                required: true,
            },
            {
                displayName: 'Batch ID',
                name: 'dataLotno',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        resource: ['data'],
                        operationData: ['getDataFromBatchByOffset'],
                    },
                },
                required: true,
            },
            {
                displayName: 'Offset',
                name: 'dataLotnoOffset',
                type: 'string',
                default: '0',
                displayOptions: {
                    show: {
                        resource: ['data'],
                        operationData: ['getDataFromBatchByOffset'],
                    },
                },
                required: true,
            },
            {
                displayName: 'Size',
                name: 'dataLotnoSize',
                type: 'string',
                default: '100',
                displayOptions: {
                    show: {
                        resource: ['data'],
                        operationData: ['getDataFromBatchByOffset'],
                    },
                },
                required: true,
            },
        ],
    };

    async getAccessToken(this: IExecuteFunctions, credentials: any): Promise<string> {
        if (credentials.access_token) {
            return credentials.access_token;
        }
        const baseUrl = credentials.baseUrl || 'https://openapi.octoparse.com';
        const response = await this.helpers.httpRequest({
            method: 'POST',
            url: `${baseUrl}/token`,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: {
                username: credentials.username,
                password: credentials.password,
                grant_type: 'password',
            },
            json: true,
        });
        if (response && response.data && response.data.access_token) {
            return response.data.access_token;
        }
        throw new NodeApiError(this.getNode(), { message: 'Could not obtain access token from Octoparse API' });
    }

    async execute(this: IExecuteFunctions) {
        const returnData = [];
        const resource = this.getNodeParameter('resource', 0) as string;
        let operation: string;
        if (resource === 'tasks') {
            operation = this.getNodeParameter('operationTasks', 0) as string;
        } else if (resource === 'cloudExtraction') {
            operation = this.getNodeParameter('operationCloudExtraction', 0) as string;
        } else if (resource === 'data') {
            operation = this.getNodeParameter('operationData', 0) as string;
        } else {
            throw new NodeOperationError(this.getNode(), 'Unknown resource');
        }
        const credentials = await this.getCredentials('octoparseApi');
        const baseUrl = credentials.baseUrl || 'https://openapi.octoparse.com';
        const accessToken = await Octoparse.prototype.getAccessToken.call(this, credentials);

        if (resource === 'tasks') {
            if (operation === 'getTaskGroups') {
                const response = await this.helpers.httpRequest({
                    method: 'GET',
                    url: `${baseUrl}/taskGroup`,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                });
                if (Array.isArray(response.data)) {
                    // Transform array to object with index keys
                    const indexedObj: Record<string, any> = {};
                    response.data.forEach((item: any, idx: number) => {
                        indexedObj[idx] = item;
                    });
                    returnData.push({ json: indexedObj });
                } else {
                    returnData.push({ json: response });
                }
            }
            if (operation === 'copyTask') {
                const taskGroupId = this.getNodeParameter('taskGroupId', 0) as string;
                const taskId = this.getNodeParameter('taskId', 0) as string;
                const response = await this.helpers.httpRequest({
                    method: 'POST',
                    url: `${baseUrl}/task/copy?taskGroupId=${encodeURIComponent(taskGroupId)}&taskId=${encodeURIComponent(taskId)}`,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                });
                if (Array.isArray(response.data)) {
                    // Transform array to object with index keys
                    const indexedObj: Record<string, any> = {};
                    response.data.forEach((item: any, idx: number) => {
                        indexedObj[idx] = item;
                    });
                    returnData.push({ json: indexedObj });
                } else {
                    returnData.push({ json: response });
                }
            }
            if (operation === 'moveTaskToGroup') {
                const taskGroupId = this.getNodeParameter('taskGroupId', 0) as string;
                const taskId = this.getNodeParameter('taskId', 0) as string;
                const response = await this.helpers.httpRequest({
                    method: 'POST',
                    url: `${baseUrl}/task/moveToGroup?taskGroupId=${encodeURIComponent(taskGroupId)}&taskId=${encodeURIComponent(taskId)}`,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                });
                if (Array.isArray(response.data)) {
                    // Transform array to object with index keys
                    const indexedObj: Record<string, any> = {};
                    response.data.forEach((item: any, idx: number) => {
                        indexedObj[idx] = item;
                    });
                    returnData.push({ json: indexedObj });
                } else {
                    returnData.push({ json: response });
                }
            }
            if (operation === 'searchTask') {
                const taskGroupId = this.getNodeParameter('searchTaskGroupId', 0) as string;
                const response = await this.helpers.httpRequest({
                    method: 'GET',
                    url: `${baseUrl}/task/search?taskGroupId=${encodeURIComponent(taskGroupId)}`,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                });
                if (Array.isArray(response.data)) {
                    // Transform array to object with index keys
                    const indexedObj: Record<string, any> = {};
                    response.data.forEach((item: any, idx: number) => {
                        indexedObj[idx] = item;
                    });
                    returnData.push({ json: indexedObj });
                } else {
                    returnData.push({ json: response });
                }
            }
        }
        if (resource === 'cloudExtraction') {
            if (operation === 'cloudTaskStatus') {
                const taskIdsRaw = this.getNodeParameter('cloudTaskIds', 0) as any;
                const taskIds = (taskIdsRaw.taskId || []).map((t: any) => t.value);
                const response = await this.helpers.httpRequest({
                    method: 'POST',
                    url: `${baseUrl}/cloudextraction/statuses`,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: {
                        taskIds,
                    },
                    json: true,
                });
                if (Array.isArray(response.data)) {
                    // Transform array to object with index keys
                    const indexedObj: Record<string, any> = {};
                    response.data.forEach((item: any, idx: number) => {
                        indexedObj[idx] = item;
                    });
                    returnData.push({ json: indexedObj });
                } else {
                    returnData.push({ json: response });
                }
            }
            if (operation === 'cloudTaskStatusV2') {
                const taskIdsRaw = this.getNodeParameter('cloudTaskIds', 0) as any;
                const taskIds = (taskIdsRaw.taskId || []).map((t: any) => t.value);
                const response = await this.helpers.httpRequest({
                    method: 'POST',
                    url: `${baseUrl}/cloudextraction/statuses/v2`,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: {
                        taskIds,
                    },
                    json: true,
                });
                if (Array.isArray(response.data)) {
                    // Transform array to object with index keys
                    const indexedObj: Record<string, any> = {};
                    response.data.forEach((item: any, idx: number) => {
                        indexedObj[idx] = item;
                    });
                    returnData.push({ json: indexedObj });
                } else {
                    returnData.push({ json: response });
                }
            }
            if (operation === 'cloudextractionStart') {
                const taskId = this.getNodeParameter('cloudTaskId', 0) as string;
                const response = await this.helpers.httpRequest({
                    method: 'POST',
                    url: `${baseUrl}/cloudextraction/start`,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: { taskId },
                    json: true,
                });
                if (Array.isArray(response.data)) {
                    // Transform array to object with index keys
                    const indexedObj: Record<string, any> = {};
                    response.data.forEach((item: any, idx: number) => {
                        indexedObj[idx] = item;
                    });
                    returnData.push({ json: indexedObj });
                } else {
                    returnData.push({ json: response });
                }
            }
            if (operation === 'cloudextractionStop') {
                const taskId = this.getNodeParameter('cloudTaskId', 0) as string;
                const response = await this.helpers.httpRequest({
                    method: 'POST',
                    url: `${baseUrl}/cloudextraction/stop`,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: { taskId },
                    json: true,
                });
                if (Array.isArray(response.data)) {
                    // Transform array to object with index keys
                    const indexedObj: Record<string, any> = {};
                    response.data.forEach((item: any, idx: number) => {
                        indexedObj[idx] = item;
                    });
                    returnData.push({ json: indexedObj });
                } else {
                    returnData.push({ json: response });
                }
            }
            if (operation === 'cloudextractionGetSubtasks') {
                const taskId = this.getNodeParameter('cloudSubtaskTaskId', 0) as string;
                const page = this.getNodeParameter('cloudSubtaskPage', 0) as string;
                const size = this.getNodeParameter('cloudSubtaskSize', 0) as string;
                const response = await this.helpers.httpRequest({
                    method: 'GET',
                    url: `${baseUrl}/cloudextraction/task/subtasks?taskId=${encodeURIComponent(taskId)}&page=${encodeURIComponent(page)}&size=${encodeURIComponent(size)}`,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                });
                if (Array.isArray(response.data)) {
                    // Transform array to object with index keys
                    const indexedObj: Record<string, any> = {};
                    response.data.forEach((item: any, idx: number) => {
                        indexedObj[idx] = item;
                    });
                    returnData.push({ json: indexedObj });
                } else {
                    returnData.push({ json: response });
                }
            }
            if (operation === 'cloudextractionStartSubtasks') {
                const taskId = this.getNodeParameter('cloudSubtaskActionTaskId', 0) as string;
                const subTaskIdsRaw = this.getNodeParameter('cloudSubtaskIds', 0) as any;
                const subTaskIds = (subTaskIdsRaw.subTaskId || []).map((s: any) => s.value);
                const response = await this.helpers.httpRequest({
                    method: 'POST',
                    url: `${baseUrl}/cloudextraction/subtasks{start}`,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: { taskId, subTaskIds },
                    json: true,
                });
                if (Array.isArray(response.data)) {
                    // Transform array to object with index keys
                    const indexedObj: Record<string, any> = {};
                    response.data.forEach((item: any, idx: number) => {
                        indexedObj[idx] = item;
                    });
                    returnData.push({ json: indexedObj });
                } else {
                    returnData.push({ json: response });
                }
            }
            if (operation === 'cloudextractionStopSubtasks') {
                const taskId = this.getNodeParameter('cloudSubtaskActionTaskId', 0) as string;
                const subTaskIdsRaw = this.getNodeParameter('cloudSubtaskIds', 0) as any;
                const subTaskIds = (subTaskIdsRaw.subTaskId || []).map((s: any) => s.value);
                const response = await this.helpers.httpRequest({
                    method: 'POST',
                    url: `${baseUrl}/cloudextraction/subtasks{stop}`,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: { taskId, subTaskIds },
                    json: true,
                });
                if (Array.isArray(response.data)) {
                    // Transform array to object with index keys
                    const indexedObj: Record<string, any> = {};
                    response.data.forEach((item: any, idx: number) => {
                        indexedObj[idx] = item;
                    });
                    returnData.push({ json: indexedObj });
                } else {
                    returnData.push({ json: response });
                }
            }
        }
        if (resource === 'data') {
            if (operation === 'getDataByOffset') {
                const taskId = this.getNodeParameter('dataTaskId', 0) as string;
                const offset = this.getNodeParameter('dataOffset', 0) as string;
                const size = this.getNodeParameter('dataSize', 0) as string;
                const response = await this.helpers.httpRequest({
                    method: 'GET',
                    url: `${baseUrl}/data/all?taskId=${encodeURIComponent(taskId)}&offset=${encodeURIComponent(offset)}&size=${encodeURIComponent(size)}`,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                });
                returnData.push({ json: response });
            }
            if (operation === 'getDataFromBatchByOffset') {
                const taskId = this.getNodeParameter('dataTaskId', 0) as string;
                const lotno = this.getNodeParameter('dataLotno', 0) as string;
                const offset = this.getNodeParameter('dataLotnoOffset', 0) as string;
                const size = this.getNodeParameter('dataLotnoSize', 0) as string;
                const response = await this.helpers.httpRequest({
                    method: 'GET',
                    url: `${baseUrl}/data/lotno/all?taskId=${encodeURIComponent(taskId)}&lotno=${encodeURIComponent(lotno)}&offset=${encodeURIComponent(offset)}&size=${encodeURIComponent(size)}`,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                });
                returnData.push({ json: response });
            }
            if (operation === 'getNonExportedData') {
                const taskId = this.getNodeParameter('dataTaskId', 0) as string;
                const size = this.getNodeParameter('dataSize', 0) as string;
                const response = await this.helpers.httpRequest({
                    method: 'GET',
                    url: `${baseUrl}/data/notexported?taskId=${encodeURIComponent(taskId)}&size=${encodeURIComponent(size)}`,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                });
                if (response.data && Array.isArray(response.data.data)) {
                    // Transform array to object with index keys
                    const indexedObj: Record<string, any> = {};
                    response.data.data.forEach((item: any, idx: number) => {
                        indexedObj[idx] = item;
                    });
                    returnData.push({ json: indexedObj });
                } else {
                    returnData.push({ json: response });
                }
            }
            if (operation === 'markDataExported') {
                const taskId = this.getNodeParameter('dataTaskId', 0) as string;
                const response = await this.helpers.httpRequest({
                    method: 'POST',
                    url: `${baseUrl}/data/markexported`,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: { taskId },
                    json: true,
                });
                returnData.push({ json: response });
            }
            if (operation === 'removeData') {
                const taskId = this.getNodeParameter('dataTaskId', 0) as string;
                const response = await this.helpers.httpRequest({
                    method: 'POST',
                    url: `${baseUrl}/data/remove`,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: { taskId },
                    json: true,
                });
                returnData.push({ json: response });
            }
        }
        return this.prepareOutputData(returnData);
    }
}
