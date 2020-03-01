# AbleMail Backend
This repository holds the server code for AbleMail. Check out the [api](#API).

## API
### GET
#### GET `/`
Redirects to the [AbleMail client](https://ablemail.github.io).
#### GET `/auth/signup`
Signs up a new non-Google user and generates a session.
##### Query
###### `key`
A key that authorizes the connection.
###### `email`
User's email. Make sure it does not end in `@gmail.com`.
###### `pass`
User's password.
###### `first`
User's first name.
###### `last`
User's last name.

### POST
#### POST `/auth/other`
Logs in a returning user and generates a session.
##### Body
###### `key`
A key that authorizes the connection.
###### `email`
User's email. Make sure it does not end in `@gmail.com`.
###### `pass`
User's password.