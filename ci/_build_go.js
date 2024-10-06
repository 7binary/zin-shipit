require('dotenv').config();

/**
 * @param {string} server - Server user with IP and Port (user@ip:port)
 * @param {string} repositoryUrl - The GitHub repository url
 * @param {string} projectDir - Project directory name
 * @param {string} branch - Branch name (main or dev)
 */
module.exports = (server, repositoryUrl, projectDir, branch = 'main') => (shipit) => {
  require('shipit-deploy')(shipit);
  require('shipit-shared')(shipit);

  shipit.initConfig({
    default: {
      deployTo: `/home/webuser/${projectDir}`,
      key: '~/.ssh/ZIN_IS.pem',
      repositoryUrl,
      branch,
      ignores: ['.git', 'node_modules'],
      keepReleases: 3,
      deleteOnRollback: true,
      shared: {
        overwrite: true,
        files: ['.env'],
      },
    },
    prod: {
      servers: server,
    },
  });

  // DEPLOY
  shipit.on('updated', () => shipit.start(
    'go.build', 'go.restart',
  ));

  // COMMANDS
  shipit.blTask('go.restart', async () => {
    await shipit.remote(`sudo systemctl restart ${projectDir}`);
  });

  shipit.blTask('go.build', async () => {
    const cwd = shipit.releasePath;
    await shipit.remote('/usr/local/go/bin/go mod tidy', { cwd });
    await shipit.remote('/usr/local/go/bin/go generate ./...', { cwd });
    await shipit.remote('/usr/local/go/bin/go build', { cwd });
  });

  shipit.blTask('go.releaser', async () => {
    const cwd = shipit.releasePath;
    await shipit.remote('goreleaser build --snapshot', { cwd });
  });
};
