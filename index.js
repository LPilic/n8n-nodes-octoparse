const { OctoparseApi } = require('./dist/credentials/OctoparseApi.credentials');
const { Octoparse } = require('./dist/nodes/Octoparse/Octoparse.node');

module.exports = {
	credentials: [OctoparseApi],
	nodes: [Octoparse],
};
