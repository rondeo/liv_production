import {Component, OnInit} from '@angular/core';
import {LoaderService} from './loader/loader.service';
import {EnvironmentService} from './environment.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  loader: Boolean = false;

  constructor(private loaderService: LoaderService, private envServiceProvider: EnvironmentService) {
  }

  public ngOnInit(): void {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.
    this.loaderService.status.subscribe((val: boolean) => {
      this.loader = val;
    });
    this.envServiceProvider.config({
      domains: {
        local: ['192.168.2.2', 'localhost'],
        betaSmartButler: ['beta-smartbutler.unificationengine.com'],
        liveSmartButler: ['smartbutler.unificationengine.com']
      },
      vars: {
        local: {
          appName: 'smart-butler',
          vCardFile: 'smart-butler.vcf',
          apiUrl: 'http://192.168.2.2:6363',
          Authorization: 'dJHmhcWQYrSKWLj67VHUF2jKPRwVT5vSbHPB69hq3rjDgWsLvYj975VtPzbRZyha',
          statusKey: 'C7646E98438F7FC2AD6C2717DFE9D',
          smartContactImage: [
            {url: 'uib-blue.png', height: '80px', margin: '20px'}
          ]
        },
        betaSmartButler: {
          appName: 'smart-butler',
          vCardFile: 'smart-butler.vcf',
          apiUrl: 'https://beta-smartbutler-api.unificationengine.com/',
          Authorization: 'dJHmhcWQYrSKWLj67VHUF2jKPRwVT5vSbHPB69hq3rjDgWsLvYj975VtPzbRZyha',
          statusKey: 'C7646E98438F7FC2AD6C2717DFE9D',
          smartContactImage: [
            {url: 'uib-blue.png', height: '80px', margin: '20px'}
          ]
        },
        liveSmartButler: {
          appName: 'smart-butler',
          vCardFile: 'smart-butler.vcf',
          apiUrl: 'https://smartbutler-api.unificationengine.com/',
          Authorization: 'dJHmhcWQYrSKWLj67VHUF2jKPRwVT5vSbHPB69hq3rjDgWsLvYj975VtPzbRZyha',
          statusKey: 'C7646E98438F7FC2AD6C2717DFE9D',
          smartContactImage: [
            {url: 'uib-blue.png', height: '80px', margin: '20px'}
          ]
        },
        defaults: {
          appName: 'smart-butler',
          vCardFile: 'smart-butler.vcf',
          apiUrl: 'https://iot-app.unificationengine.com',
          Authorization: 'dJHmhcWQYrSKWLj67VHUF2jKPRwVT5vSbHPB69hq3rjDgWsLvYj975VtPzbRZyha',
          statusKey: 'C7646E98438F7FC2AD6C2717DFE9D',
          smartContactImage: [
            {url: 'uib-blue.png', height: '80px', margin: '20px'}
          ]
        }
      }
    });

    this.envServiceProvider.check();

    console.log('this.envServiceProvider.get()', this.envServiceProvider.get());
    console.log('this.envServiceProvider.read()', this.envServiceProvider.read());

  }
}
