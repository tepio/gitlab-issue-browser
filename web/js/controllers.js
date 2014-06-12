function compareVersions(v1, comparator, v2) {
    "use strict";

    v1 = v1.replace(/^(v)/, '');
    v2 = v2.replace(/^(v)/, '');

    comparator = comparator == '=' ? '==' : comparator;
    var v1parts = v1.split('.'), v2parts = v2.split('.');
    var maxLen = Math.max(v1parts.length, v2parts.length);
    var part1, part2;
    var cmp = 0;
    for(var i = 0; i < maxLen && !cmp; i++) {
        part1 = parseInt(v1parts[i], 10) || 0;
        part2 = parseInt(v2parts[i], 10) || 0;
        if(part1 < part2)
            cmp = 1;
        if(part1 > part2)
            cmp = -1;
    }
    return eval('0' + comparator + cmp);
}


angular.module('app')

.controller('AppCtrl', [
  '$scope', '$location', '$timeout', 'Restangular'
  , function($scope, $location, $timeout, Restangular) {

    $scope.projectsDropdown = [
      {
        text: "<i class=\"fa fa-spinner fa-spin\"></i>&nbsp;Loading projects",
        href: '#'
      }
    ];

    $scope.reloadPage = function() {
      $scope.pageReloading = true;

      $timeout(function() {
        window.location.reload();
      }, 1000);
    }

    Restangular.all('projects').getList()
      .then(function(res) {
        $scope.projects = res;

        var projectsDropdown = [];
        angular.forEach(res, function(project) {
          projectsDropdown.push({
            text: project.name,
            href: '#/project/' + project.id
          })
        });

        $scope.projectsDropdown = projectsDropdown;
      }, function(res) {
        $scope.xhrError = true;
      });

    $scope.refreshIssues = function() {
      $scope.loadingIssues = true;

      if($scope.selectedProject) {
        Restangular.one('projects', $scope.selectedProject).all('issues').getList()
          .then(function(res) {
            $scope.loadingIssues = false;

            $scope.issues = res;
          }, function(res) {
            $scope.xhrError = true;
          });
      }
      else {
        $scope.issues = [];
      }
    }

    $scope.milestoneDropdown = {
      opened: [],
      closed: []
    };

    $scope.testConsole = function(message) {
      console.group();
      if(message) console.log(message);
      else console.log('Test message');
      console.groupEnd();
    };

    $scope.refreshMilestones = function() {
      if($scope.selectedProject) {
        Restangular.one('projects', $scope.selectedProject).all('milestones').getList()
          .then(function(res) {

            res.sort(function(a, b) {
              return compareVersions(a.title, '<=', b.title);
            });

            $scope.milestones = res;

            $scope.milestoneDropdown = {
              all: [],
              opened: [
              ],
              closed: [
              ]
            };

            angular.forEach(res, function(milestone) {
              if(angular.isArray($scope.milestoneDropdown[milestone.state])) {
                $scope.milestoneDropdown[milestone.state].push({
                  'text': milestone.title,
                  'href': '#' + $location.path() + '?m=' + milestone.id
                });
              }
            });

            $scope.milestoneDropdown.all = $scope.milestoneDropdown.opened.concat(
              [{divider: true}],
              $scope.milestoneDropdown.closed
            );
            $scope.milestoneDropdown.all
              .unshift({
                divider: true
              });
            $scope.milestoneDropdown.all
              .unshift({
                text: '<span class="text-muted"><i class="fa fa-times"></i>&nbsp;Clear Milestone</span>',
                href: '#' + $location.path()
              });

          }, function(res) {
            $scope.xhrError = true;
          });
      }
      else {
        $scope.issues = [];
      }
    }

    $scope.projectTitle = function() {
      var project = _.find($scope.projects, function(project) { return project.id == $scope.selectedProject })

      return project ? project.name : 'Select Project';
    };

    $scope.milestoneTitle = function(id) {
      var milestone = _.find($scope.milestones, function(milestone) { return milestone.id == $scope.issueFilter.milestone })

      return milestone ? milestone.title : 'Milestone';
    };

    $scope.issueFilter = {
      state: ''
    };

    $scope.filterIssues = function(issue) {

      if($scope.issueFilter.milestone) {
        if(!issue.milestone || issue.milestone.id !== $scope.issueFilter.milestone) {
          return;
        }
      }

      if($scope.issueFilter.state) {
        if(issue.state !== $scope.issueFilter.state) {
          return;
        }
      }

      return issue;
    };

    $scope.issueProgress = function(issue) {
      var progress = _.find(issue.labels, function(label) { return label.match(/^progress-/); });

      return progress ? progress.replace(/^(progress-)/, '') : false;
    }

    $scope.labelColor = function(label) {
      var defaultColor = 'primary';
      var labelColors = {
        bug: 'danger',
        critical: 'danger',
        feature: 'success',
        enhancement: 'info'
      }

      return 'label-' + labelColors[label] ? labelColors[label] : defaultColor;
    }

    $scope.$watch(function() { return $location.path() }, function(nVal, oVal) {
      var path = nVal.split('/');

      $scope.issueFilter = {
        state: $scope.issueFilter.state
      };

      if(path[1] === 'project' && path[2]) {
        $scope.selectedProject = path[2];
        $scope.refreshIssues();
        $scope.refreshMilestones();
      }

      else if(nVal !== '/') {
        $location.path('/');
      }

    });

    $scope.$watch(function() { return $location.search() }, function(nVal, oVal) {

      if(nVal.m) {
        $scope.issueFilter.milestone = nVal.m;
      }
      else {
        $scope.issueFilter.milestone = '';
      }

    });

  }
])
