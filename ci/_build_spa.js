require('dotenv').config();

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
    prod: { servers: server },
  });

  // DEPLOY
  shipit.on('updated', () => shipit.start(
    'spa.install', 'spa.build',
  ));

  // COMMANDS
  shipit.blTask('spa.install', async () => {
    await shipit.remote(`pnpm -C "${shipit.releasePath}" install --prefer-offline`);
  });
  shipit.blTask('spa.build', async () => {
    await shipit.remote(`pnpm -C "${shipit.releasePath}" build`);
  });
};
