'use strict';

const TerraformCommand = require('../terraform-command');
const os = require('os');
const path = require('path');
const cluster = require('cluster');
const logger = require('./logger');
const { uuid, physicalCpuCount } = require('./util');
const { config } = require('../parameters');

class Distributor {
  /**
   * @param {Object} configObject
   */
  constructor(configObject) {
    this.THUB_RUN_ID = uuid();
    this._config = Object.assign({}, configObject);
    this._worker = path.join(__dirname, 'worker.js');
    this._workersCount = 0;
    this._threadsCount = config.usePhysicalCpu ? physicalCpuCount() : os.cpus().length;
    cluster.setupMaster({ exec: this._worker });
  }

  /**
   * @param {Object} config
   * @param {Number} direction
   * @return {Object}
   * @private
   */
  _buildDependencyTable(config, direction) {
    const result = {};
    const keys = Object.keys(config);

    keys.forEach(key => {
      result[key] = {};
    });

    switch (direction) {
      case TerraformCommand.FORWARD:
        keys.forEach(key => {
          Object.assign(result[key], config[key].dependsOn);
        });
        break;

      case TerraformCommand.REVERSE:
        keys.forEach(key => {
          Object.keys(config[key].dependsOn).forEach(hash => {
            result[hash][key] = null;
          });
        });
        break;
    }

    return result;
  }

  /**
   * @param {String} hash
   * @private
   */
  _createWorker(hash) {
    const cfgThread = this._config[hash];

    const worker = cluster.fork(Object.assign({
      THUB_RUN_ID: this.THUB_RUN_ID,
      TERRAFORM_ACTIONS: this.TERRAFORM_ACTIONS
    }, this._env));

    delete this._dependencyTable[hash];

    this._workersCount++;
    worker.send(cfgThread);
  }

  /**
   * Remove dependencies on this component
   * @param {String} hash
   * @private
   */
  _removeDependencies(hash) {
    Object.keys(this._dependencyTable).forEach(key => {
      delete this._dependencyTable[key][hash];
    });
  }

  /**
   * @private
   */
  _distributeConfigs() {
    const hashes = Object.keys(this._dependencyTable);

    for (let index = 0; this._workersCount < this._threadsCount && index < hashes.length; index++) {
      const hash = hashes[index];
      const dependsOn = Object.keys(this._dependencyTable[hash]);

      if (!dependsOn.length) {
        this._createWorker(hash);
      }
    }
  }

  /**
   * @param {String[]} actions
   * @param {Object} options
   * @return {Promise}
   */
  runActions(actions, options) {
    const {
      silent = false,
      format = '',
      planDestroy = false,
      dependencyDirection = null
    } = options;

    this._env = {
      silent: silent,
      format: format,
      planDestroy: planDestroy
    };

    this._results = [];
    this._dependencyTable = this._buildDependencyTable(this._config, dependencyDirection);
    this.TERRAFORM_ACTIONS = actions;

    return new Promise((resolve, reject) => {
      this._distributeConfigs();

      cluster.on('message', (worker, data) => {
        if (data.isError) {
          this._error = this._handleError(data.error);
          return;
        }

        if (data.data) {
          this._results.push(data.data);
        }

        this._removeDependencies(data.hash);
      });

      cluster.on('exit', (worker, code) => {
        this._workersCount--;

        if (code === 0) {
          this._distributeConfigs();
        }

        const hashes = Object.keys(this._dependencyTable);
        const workersId = Object.keys(cluster.workers);

        if (!workersId.length && !hashes.length) {
          if (this._error) {
            reject(this._error);
          } else {
            let message = 'Done';
            if (format) {
              this._handleOutput(format);
              message = '';
            }

            resolve(message);
          }
        }
      });
    });
  }

  /**
   * Prints the output data for the 'output' command
   * @param {String} format
   * @return {*}
   * @private
   */
  _handleOutput(format) {
    const outputs = this._results.filter(it => it.action === 'output');

    if (!outputs.length) {
      return;
    }

    switch (format) {
      case 'json':
        const result = {};

        outputs.forEach(it => {
          let stdout = (Buffer.from(it.buffer)).toString('utf8');
          if (stdout[0] !== '{') {
            stdout = stdout.slice(stdout.indexOf('{'));
          }
          result[it.component] = JSON.parse(stdout);
        });

        logger.log(JSON.stringify(result));
        break;

      default:
        outputs.forEach(it => logger.raw(`[${it.component}] ${(Buffer.from(it.buffer).toString('utf8'))}`));
        break;
    }
  }

  /**
   * Kill parallel workers and build an error
   * @param {Error|Object} err
   * @return {Error}
   * @private
   */
  _handleError(err) {
    Object.keys(cluster.workers).forEach(id => {
      const worker = cluster.workers[id];
      worker.kill();
    });

    this._dependencyTable = {};
    if (err instanceof Array) {
      err = err.map(it => Buffer.from(it).toString('utf8')).join(os.EOL);
    }
    return (err.constructor === Error) ? err : new Error(`Worker error: ${JSON.stringify(err)}`);
  }
}

module.exports = Distributor;
