import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class EnvironmentService {
  /**
   * angular-environment Plugin
   *
   * Rewrite of https://github.com/juanpablob/angular-environment
   */

  environment = 'development'; // default
  data: any = {}; // user defined environments data

  constructor() {
  }
  pregQuote(string, delimiter?) {
    return (string + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
  };


  stringToRegex(string) {
    return new RegExp(this.pregQuote(string).replace(/\\\*/g, '.*').replace(/\\\?/g, '.'), 'g');
  }
  /**
   * config() allow pass as object the
   * desired environments with their domains
   * and variables
   *
   * @param {Object} config
   * @return {Void}
   */
  config(config) {
    this.data = config;
  };

  /**
   * set() set the desired environment
   * based on the passed string
   *
   * @param {String} environment
   * @return {Void}
   */
  set(environment) {
    this.environment = environment;
  };

  /**
   * get() returns the current environment
   *
   * @return {Void}
   */
  get() {
    return this.environment;
  };

  /**
   * read() returns the desired variable based
   * on passed argument
   *
   * @param {String} variable
   * @return {Void}
   */
  read(variable?) {
    console.log('3333333333333333',this.environment)
    console.log('44444444444444444',this.data)
    if (typeof variable === 'undefined' || variable === '' || variable === 'all') {
      return this.data.vars[this.get()];
    }
    else if (typeof this.data.vars[this.get()][variable] === 'undefined') {
      return this.data.vars.defaults[variable];
    }

    return this.data.vars[this.get()][variable];
  };

  /**
   * is() checks if the passed environment
   * matches with the current environment
   *
   * @param {String} environment
   * @return {Boolean}
   */
  is(environment) {
    return (environment === this.environment);
  };

  /**
   * check() looks for a match between
   * the actual domain (where the script is running)
   * and any of the domains under env constant in
   * order to set the running environment
   *
   * @return {Void}
   */
  check() {
    const self = this;
    const location = window.location.host;
    let matches = [];
    let keepGoing = true;

    for (let k in this.data.domains) {
      let v = this.data.domains[k];
      v.forEach(v => {
        if (location.match(this.stringToRegex(v))) {
          matches.push({
            environment: k,
            domain: v
          });
        }
      });
    }

    matches.forEach((v, k) => {
      if (keepGoing) {
        if (location === v.domain) {
          keepGoing = false;
        }
        self.environment = v.environment;
      }
    });

  };

}
