case_management)

Case Management
===============================

Project Layout
--------------

### Django

Apps go in the project directory `case_management`


### Python

Dependencies are managed via poetry in the docker container.

Add and lock dependencies in a temporary container:

    docker-compose run --rm web poetry add pkgname==1.2.3

Rebuild the image to contain the new dependencies:

    docker-compose build web

Make sure to commit updates to pyproject.toml and poetry.lock to git


Development setup
-----------------

Create file `development.env` at repo root with at least:

```text
APP_URL=http://localhost:3000
DASHBOARD_URL=http://localhost:3001
```

Initialise and run the django app

    docker-compose run --rm web python manage.py migrate
    docker-compose run --rm web python manage.py createsuperuser --email admin@test.test
    docker compose run --rm web python manage.py loaddata demo-data
    docker-compose up

To dump data from your db for updating demo/seed data:

     docker compose run --rm web python manage.py dumpdata --exclude=auth --exclude=contenttypes --exclude=sessions --exclude=admin --exclude=case_management.log --exclude=case_management.logchange --exclude=authtoken

If you need to destroy and recreate your dev setup, e.g. if you've messed up your
database data or want to switch to a branch with an incompatible database schema,
you can destroy all volumes and recreate them by running the following, and running
the above again:

    docker-compose down --volumes


Running tests
-------------

    docker-compose run --rm web python manage.py test

Tests might fail to connect to the databse if the docker-compose `db` service wasn't running and configured yet. Just check the logs for the `db` service and run the tests again.


Deploying
---------

Add the dokku app target as Git remote, then push to deploy:

```shell
git remote add prod dokku@hetzner1.openup.org.za:osf-case-management-prod
git push prod master
```

Current environments:

```shell
git push dokku-sandbox master
git push dokku-prod master
git push dokku-staging master
git push dokku-wasafiri master
```

Migrations are run automatically on deployment.

Other commands can be run on the production server;
- `ssh dokku@hetzner1.openup.org.za apps:list`
- `dokku run osf-case-management-prod python manage.py createsuperuser`

The dokku app environment is deployed using an [Ansible playbook](https://github.com/OpenUpSA/ansible-config/tree/master/apps/osf-case-management).

`CORS_ALLOWED_ORIGIN_REGEXES` defaults to just allowing requests from `netlify.app` and `casefile.org.za`. If you are deploying an instance with a different domain/host then make sure to set the environment variable appropriately.

Settings
--------

Undefined settings result in exceptions at startup to let you know they are not configured properly. It's one this way so that the defaults don't accidentally let bad things happen like forgetting analytics or connecting to the prod DB in development.


| Key | Default | Type | Description |
|-----|---------|------|-------------|
| `DATABASE_URL` | undefined | String | `postgresql://user:password@hostname/dbname` style URL |
| `DJANGO_DEBUG_TOOLBAR` | False | Boolean | Set to `True` to enable the Django Debug toolbar NOT ON A PUBLIC SERVER! |
| `DJANGO_SECRET_KEY` | undefined | String | Set this to something secret and unguessable in production. The security of your cookies and other crypto stuff in django depends on it. |
| `TAG_MANAGER_CONTAINER_ID` | undefined | String | [Google Tag Manager](tagmanager.google.com) Container ID. [Use this to set up Google Analytics.](https://support.google.com/tagmanager/answer/6107124?hl=en). Requried unless `TAG_MANAGER_ENABLED` is set to `False` |
| `TAG_MANAGER_ENABLED` | `False` | Boolean | Use this to disable the Tag Manager snippets, e.g. in dev or sandbox. |

Database
---------

Generate a dot visualisaton diagram of the database architecture with;
    
    docker-compose run --rm web python manage.py graph_models -a -g -o database_diagram.dot


Production
----------

Hosted on Vercel, `master` auto-deploys.

[![Powered by Vercel](powered-by-vercel.svg)](https://vercel.com/?utm_source=openup&utm_campaign=oss)
