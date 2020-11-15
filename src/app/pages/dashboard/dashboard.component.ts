import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/model/user';
import { first } from 'rxjs/operators';
import { HighchartsService } from 'src/app/services/highcharts.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit , AfterViewInit, OnDestroy{
  @ViewChild('charts') public chartEl: ElementRef;
  loading = false;
  users: User[];
  currentUser: User;
  options: any;
  chartsList;
   myCustomOptions = {
    chart: {
      type: 'bar'
    },
    title: {
      text: 'Stacked bar chart'
    },
    xAxis: {
      categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Total fruit consumption'
      }
    },
    legend: {
      reversed: true
    },
    plotOptions: {
      series: {
        stacking: 'normal'
      }
    },
    series: [{
      name: 'John',
      data: [5, 3, 4, 7, 2]
    }, {
      name: 'Jane',
      data: [2, 2, 3, 2, 1]
    }, {
      name: 'Joe',
      data: [3, 4, 4, 2, 5]
    }]
  };

  constructor(private userService: UserService,private hcs: HighchartsService, private changeDetectionRef: ChangeDetectorRef, private router: Router,
    private authenticationService: AuthenticationService) { 
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

  ngOnInit() {
      this.loading = true;
      this.userService.getAll().pipe(first()).subscribe(users => {
          this.loading = false;
          this.users = users;
      });
  }

  public ngAfterViewInit() {
  }

  public ngOnDestroy() {
  }

  rmFirst() {
    this.hcs.removeFirst();
    this.changeDetectionRef.detectChanges();
    if (!!document.getElementById("test").firstChild) document.getElementById("test").firstChild.outerHTML = '';
    console.log('rm first', this.hcs.getCharts());
  }

  // rmLast() {
  //   this.hcs.removeLast();
  //   this.changeDetectionRef.detectChanges();
  //   if (!!document.getElementById("test").lastChild) document.getElementById("test").lastChild.outerHTML = '';
  //   console.log('rm last', this.hcs.getCharts());
  // }

  createChart() {
    this.hcs.createChart(this.chartEl.nativeElement);
  }

  createCustomChart(myOpts: Object) {
    this.hcs.createChart(this.chartEl.nativeElement, myOpts);
  }
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
}
}
