# AbleMail Backend
This repository holds the server code for AbleMail. Check out the [api](#API).

## API
### GET
#### GET `/`
Redirects to the [AbleMail client](https://ablemail.github.io).
#### GET `/auth/signup`
Signs up a new non-Google user and generates a session.

##### Query

|                         `email`                          |      `pass`      |      `first`       |      `pass`       |
| :------------------------------------------------------: | :--------------: | :----------------: | :---------------: |
|                          String                          |      String      |       String       |      String       |
| User's email. Make sure it does not end in `@gmail.com`. | User's password. | User's first name. | User's last name. |

#### GET `/auth/google`

Authorizes a Google user

##### Query

|                         `email`                          |      `pass`      |
| :------------------------------------------------------: | :--------------: |
|                          String                          |      String      |
| User's email. Make sure it does not end in `@gmail.com`. | User's password. |

#### GET `/auth/google/redirect`

Redirects to Google auth page.

##### Query

None

#### GET `/auth/google/callback`

Redirects to the [AbleMail client](https://ablemail.github.io) with the access token.

##### Query

|        `code`        |
| :------------------: |
|        String        |
| Google access token. |

#### GET `/get-mail/google`

Gets last 6 messages from Google.

##### Query

|       `token`        |
| :------------------: |
|        String        |
| Google access token. |

#### GET `/get-mail/google/get-one`

Gets one specific message.

##### Query

|       `token`        |        `id`        |
| :------------------: | :----------------: |
|        String        |       String       |
| Google access token. | Google message ID. |

#### GET `/get-mail`

Gets mail from a non-Google user.

##### Query

|               `id`               |
| :------------------------------: |
|              String              |
| Mongo ID of the non-Google user. |

### POST

#### POST `/auth/other`
Logs in a returning user and generates a session.
##### Body

|                        `username`                        |    `password`    |
| :------------------------------------------------------: | :--------------: |
|                          String                          |      String      |
| User's email. Make sure it does not end in `@gmail.com`. | User's password. |

#### POST `/send`

Sends mail.

##### Query

|                   `to`                    |         `subject`         |         `body`         |
| :---------------------------------------: | :-----------------------: | :--------------------: |
|                  String                   |          String           |         String         |
| The email address to send the message to. | The subject of the email. | The body of the email. |

