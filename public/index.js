(function () {
    'use strict';

    var apiResponses = Bacon.combineAsArray(getPullRequests(), getDomReadyStream())
        .map(R.prop(0));

    apiResponses.onValue(showResults);
    apiResponses.onError(showError);

    function setSpinning(isSpinning) {
        if (isSpinning) {
            $('.github-logo').addClass('spinning');
        } else {
            $('.github-logo').removeClass('spinning');
        }
    }

    function showResults(results) {
        var pullRequestHtml = createPullRequestListHtml(results);
        $('#result-container').html(pullRequestHtml);

        setSpinning(false);
    }

    function createPullRequestListHtml(results) {
        return R.map(createRepositoryElement, R.keys(results));

        function createRepositoryElement(fullRepoName) {
            const [teamName, repoName] = fullRepoName.split('/');
            const pullRequests = results[fullRepoName];
            const repositoryClasses = hasOutdatedPullRequests(pullRequests) ?
                'repository outdated' :
                'repository';

            return $('<div>', {
                    class: repositoryClasses
                })
                .append($('<div>', {
                    class: 'team-name',
                    text: teamName
                }))
                .append($('<div>', {
                    class: 'repository-name',
                    text: repoName
                }))
                .append($('<div>', {
                    class: 'pr-count',
                    text: pullRequests.length
                }));
        }
    }

    function hasOutdatedPullRequests(pullRequests) {
        return R.find(isPrOlderThanLimit, pullRequests) !== void 0;
    }

    function isPrOlderThanLimit(pr) {
        const updatedAt = moment(pr.updated_at);
        const oldestAllowed = moment().subtract(5, 'days');
        return updatedAt.isBefore(oldestAllowed);
    }

    function showError(error) {
        setSpinning(false);
        console.log('ERROR', error);
    }

    function getDomReadyStream() {
        setSpinning(true);
        return Bacon.fromCallback(function (callback) {
            $(document).ready(callback);
        });
    }

    function getPullRequests() {
        return Bacon.fromPromise($.ajax({
            url: '/prs/',
            type: 'GET',
            dataType: 'json',
            timeout: 10000
        }));
    }
}());
