Bluz Open Sesame
==========
Node.js app that allows a guest and homeowner to share keys. This is just a sample project, not meant for production or real usage.

Also includes sketch for Bluz and Core/Photon to lock/unlock the door. As Bluz is not released yet, this should work on the Core, though it hasn't been tested

Code is not fully tested. Code is not production quality. It is just an example for a demo project

## To run:
1. Clone the repository
2. Create file credentials.txt in the created directory, add your Spark username and password as json
3. Run
```sh
$ node sesame_server.js
```
4. Open localhost:8080/admin and localhost:8080/access in your browser
5. In /access, enter your name (no spaces or special characters) and click Request Key
6. In /admin, click Grant on the requested key. This will create an access token in the Spark Cloud on your account
7. In /access, you can now use the Lock/Unlock buttons to trigger the function on Bluz

