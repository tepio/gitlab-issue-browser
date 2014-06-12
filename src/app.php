<?php

use Silex\Application;
use Silex\Provider\TwigServiceProvider;
use Silex\Provider\UrlGeneratorServiceProvider;
use Silex\Provider\ValidatorServiceProvider;
use Silex\Provider\ServiceControllerServiceProvider;

$app = new Application();
$app->register(new UrlGeneratorServiceProvider());
$app->register(new ValidatorServiceProvider());
$app->register(new ServiceControllerServiceProvider());
$app->register(new TwigServiceProvider());
$app['twig'] = $app->share($app->extend('twig', function($twig, $app) {
    // add custom globals, filters, tags, ...

    return $twig;
}));

$app['gitlab.projects'] = array(3, 6, 17, 18);

$app['gitlab'] = $app->share(function() {
  $client = new \Gitlab\Client('http://gitlab.hatch.is/api/v3/'); // change here
  $client->authenticate('fd1EZ7xsxMyNcFUiN3U5', \Gitlab\Client::AUTH_URL_TOKEN); // change here

  return $client;
});

return $app;
