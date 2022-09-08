const createDMG = require('electron-installer-dmg');

async function buildDMG() {
    await createDMG({
      appPath: './reachaio-gui-v2-master-darwin-arm64/ReachAIO.app',
      name: 'ReachAIO'
    });
}

buildDMG();
