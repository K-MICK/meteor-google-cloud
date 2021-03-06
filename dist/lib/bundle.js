"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = compileBundle;

var _tmp = _interopRequireDefault(require("tmp"));

var _path = _interopRequireDefault(require("path"));

var _shelljs = _interopRequireDefault(require("shelljs"));

var _winston = _interopRequireDefault(require("winston"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Bundle compilation method
function compileBundle() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      dir = _ref.dir,
      _ref$workingDir = _ref.workingDir,
      workingDir = _ref$workingDir === void 0 ? _tmp.default.dirSync().name : _ref$workingDir,
      ci = _ref.ci,
      keep = _ref.keep;

  var customMeteorProjectDirShellEx = `cd ${dir} &&`;

  _winston.default.info('Compiling application bundle'); // Generate Meteor build


  _winston.default.debug(`generate meteor build at ${workingDir}`);

  if (!keep) {
    _winston.default.debug(`removing ${workingDir}`);

    _shelljs.default.exec(`rm -rf ${workingDir}`);
  } else {
    _winston.default.debug(`keeping ${workingDir}, if it exists`);
  }

  _shelljs.default.exec(`${dir ? customMeteorProjectDirShellEx : ''} meteor build ${workingDir} ${ci ? '--allow-superuser' : ''} --directory --server-only --architecture os.linux.x86_64`); // Cleanup broken symlinks


  _winston.default.debug('checking for broken symlinks');

  _shelljs.default.find(_path.default.join(workingDir, 'bundle')).forEach(function (symlinkPath) {
    // Matches symlinks that do not exist
    if (_shelljs.default.test('-L', symlinkPath) && !_shelljs.default.test('-e', symlinkPath)) {
      // Delete file
      _shelljs.default.rm('-f', symlinkPath);

      _winston.default.debug(`deleted symlink at '${symlinkPath}'`);
    }
  });

  return {
    workingDir
  };
}