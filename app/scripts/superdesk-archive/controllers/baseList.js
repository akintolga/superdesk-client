define(['lodash'], function(_) {
    'use strict';

    BaseListController.$inject = ['$scope', '$location', 'superdesk', 'api', 'search', 'desks', 'preferencesService', 'notify'];
    function BaseListController($scope, $location, superdesk, api, search, desks, preferencesService, notify) {
        var self = this;

        var lastQueryParams = {};

        $scope.selected = {};

        $scope.openLightbox = function openLightbox() {
            $scope.selected.view = $scope.selected.preview;
        };

        $scope.closeLightbox = function closeLightbox() {
            $scope.selected.view = null;
        };

        $scope.$on('$routeUpdate', function(e, data) {
            if (!$location.search()._id) {
                $scope.selected.preview = null;
            }
        });

        this.buildQuery = function(params, filterDesk) {

            var query = search.query(params.q || null);

            if (filterDesk) {
                if (desks.getCurrentStageId()) {
                    query.filter({term: {'task.stage': desks.getCurrentStageId()}});
                } else if (desks.getCurrentDeskId()) {
                    query.filter({term: {'task.desk': desks.getCurrentDeskId()}});
                }
            }

            return query.getCriteria();
        };

        this.getQuery = function getQuery(params, filterDesk) {
            if (!_.isEqual(_.omit(params, 'page'), _.omit(lastQueryParams, 'page'))) {
                $location.search('page', null);
            }
            var query = this.buildQuery(params, filterDesk);
            lastQueryParams = params;
            return query;
        };

        this.fetchItems = function(criteria) {
            console.log('no api defined');
        };

        this.refresh = function refresh(filterDesk) {
        	var query = self.getQuery(_.omit($location.search(), '_id'), filterDesk);
            self.fetchItems({source: query});
        };
    }

    return BaseListController;
});
