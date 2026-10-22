## profileRouter 

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password


## ConnectionRequestRouter

- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

## UserRouter

- GET /user/requests
- GET /user/connections
- GET /user/feed - Get you the profiles of other users on platform