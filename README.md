# Gitlab Issue Browser

A simple issue browser for Gitlab. Helpful for showing just enough information
to clients about various projects without jepordizing your security or business.

## Install

Installing is quite simple.

1. Clone this repo
2. Copy `.env.example` to `.env`
3. Configure your `.env`
4. Install bower components: `bower install`
5. Install composer requirements: `composer install`
6. Add to webserver
7. Done

## Features & Preview

Features include

- show filtered issues in repo
- browse open, closed and milestones
- see tag (first only)
- manage progress of an issue

Here is what it looks like.

![](https://cloud.githubusercontent.com/assets/46549/3267119/59a39fda-f2c4-11e3-9106-d8d71e6de3d9.png)

And here is the progress bar.

![](https://cloud.githubusercontent.com/assets/46549/3267114/418bf58c-f2c4-11e3-9d7c-a772b1b23357.png)

## Todo

- more filters
- show a preview issue description with filtering
- add commenting from community (via disqus)
- add voting (via disqus favorite)

* Implementing disqus for ease of use, but will be looking at rolling our own
