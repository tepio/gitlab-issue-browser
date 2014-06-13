<?php

use Silex\Application;
use Silex\Provider\TwigServiceProvider;
use Silex\Provider\UrlGeneratorServiceProvider;
use Silex\Provider\ValidatorServiceProvider;
use Silex\Provider\ServiceControllerServiceProvider;
use Silex\Provider\GitlabServiceProvider;

Dotenv::load(__DIR__ . '/..');
Dotenv::required('GITLAB_URL');
Dotenv::required('GITLAB_KEY');


$app = new Application();
$app->register(new UrlGeneratorServiceProvider());
$app->register(new ValidatorServiceProvider());
$app->register(new ServiceControllerServiceProvider());
$app->register(new TwigServiceProvider());
$app->register(new GitlabServiceProvider(), array(
    'gitlab.url' => $_ENV['GITLAB_URL'],
    'gitlab.key' => $_ENV['GITLAB_KEY']
));

if($_ENV['GITLAB_PROJECTS_INCLUDE']) {
    $app['gitlab.projects.include'] = explode(',', $_ENV['GITLAB_PROJECTS_INCLUDE']);
}

return $app;
