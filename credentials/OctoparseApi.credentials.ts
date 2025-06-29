import {
	ICredentialType,
	INodeProperties,
	IAuthenticateGeneric,
	ICredentialTestRequest,
} from 'n8n-workflow';

export class OctoparseApi implements ICredentialType {
	name = 'octoparseApi';
	displayName = 'Octoparse API';
	documentationUrl = 'https://openapi.octoparse.com/docs';

	properties: INodeProperties[] = [
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://openapi.octoparse.com',
			description: 'Base URL for the Octoparse API',
			required: true,
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			description: 'Your Octoparse account email address or username',
			required: true,
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Your Octoparse account password',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'Authorization': 'Bearer {{$credentials.access_token}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/token',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: {
				username: '={{$credentials.username}}',
				password: '={{$credentials.password}}',
				grant_type: 'password',
			},
		},
	};
}
