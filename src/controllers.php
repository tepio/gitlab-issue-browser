<?php

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

//Request::setTrustedProxies(array('127.0.0.1'));

$app->error(function (\Exception $e, $code) use ($app) {
    if ($app['debug']) {
        return;
    }

    // 404.html, or 40x.html, or 4xx.html, or error.html
    $templates = array(
        'errors/'.$code.'.html',
        'errors/'.substr($code, 0, 2).'x.html',
        'errors/'.substr($code, 0, 1).'xx.html',
        'errors/default.html',
    );

    return new Response($app['twig']->resolveTemplate($templates)->render(array('code' => $code)), $code);
});

///////

$app->before(function(Request $req) use($app) {
    if(strpos($req->attributes->get('_route'), '_api_projects_id')) {
        if(!in_array($req->attributes->get('id'), $app['gitlab.projects.include'])) {
            return $app->json(false, 404);
        }
    }
});

///////

$app->get('/', function () use ($app) {
    return $app['twig']->render('index.html', array());
});

////////

$filterProject = function($project) {
    $filter = array('id' => 1, 'name' => 1, 'description' => 1);

    return array_intersect_key($project, $filter);
};

$filterIssue = function($issue) {
    $filter = array('id' => 1, 'iid' => 1, 'project_id' => 1
                , 'title' => 1, 'name' => 1, 'description' => 1
                , 'created_at' => 1, 'updated_at' => 1, 'labels' => 1
                , 'milestone' => 1, 'state' => 1);

    return array_intersect_key($issue, $filter);
};

////////

$app->get('/', function(Request $req) use($app) {
    return $app['twig']->render('index.twig', array(
    ));
});

////////

$app->get('/api/projects', function(Request $req) use($app, $filterProject) {

    $projects = array();
    foreach($app['gitlab.projects.include'] as $id) {
        $project = $app['gitlab']->api('projects')->show($id);

        $projects[] = $filterProject($project);
    }

    return $app->json($projects);

});

$app->get('/api/projects/{id}', function(Request $req, $id) use($app, $filterProject) {

    $project = $groups = $app['gitlab']->api('projects')->show($id);

    $project = $filterProject($project);

    return $app->json($project);

});

$app->get('/api/projects/{id}/milestones', function(Request $req, $id) use($app, $filterProject) {

    $milestones = $app['gitlab']->api('milestones')->all($id);

    return $app->json($milestones);

});

$app->get('/api/projects/{id}/issues', function(Request $req, $id) use($app, $filterIssue) {

    $issues = $app['gitlab']->api('issues')->all($id);

    $issues = array_map($filterIssue, $issues);

    return $app->json($issues);

});
