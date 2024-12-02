# ground-backend

access using `hostname/api/`

## GET routes:

- /
  - return: message
- /user/[username]
  - return: list(messages)
- /users
  - return: list(users)

## POST routes:

- /register
  - username, password
  - return: message
- /unregister
  - token, password
  - return: message
- /login
  - username, password
  - return: token
- /home
  - token
  - return: list(messages)
- /new
  - token, message
  - return: message
- /delete
  - token, messageID
  - return: message
- /follow
  - token, followingName
  - return: message
- /unfollow
  - token, followingName
  - return: message
- /followstate
  - token, followingName
  - return: success, message
- /followtoggle
  - token, followingName
  - return: message
- /me
  - token
  - return: list(messages)
