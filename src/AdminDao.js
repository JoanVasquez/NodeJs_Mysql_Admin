const dbConnection = require('./dbConnection');

class AdminDao {

    constructor() {
        this.pool = dbConnection.getPool();
    }

    readAdmin(user, password) {
        return new Promise((resolve, reject) => {
            new Promise((resolve, reject) => {
                this.pool.query('SELECT user, authentication_string AS password FROM mysql.user WHERE user = ?', [user], (err, result) => {
                    if (err) reject(`Error while retrieving the user! ${err}`);
                    if (!result.length) reject('User not found!');
                    resolve(JSON.parse(JSON.stringify(result))[0]);
                    this.pool.on('release', function (connection) {
                        connection.destroy();
                    });
                });
            }).then((user) => {
                this.pool.query('SELECT UPPER(SHA1(UNHEX(SHA1("' + password + '")))) AS password', (err, result) => {
                    if (err) reject(`Error while retrieving the hash! ${err}`);
                    let passObject = JSON.parse(JSON.stringify(result))[0];
                    if (user.password == '*'+passObject.password) resolve(user);
                    else reject('Ooops, wrong password!');
                    this.pool.on('release', function (connection) {
                        connection.destroy();
                    });
                })
            })
        }).catch((err) => {
            reject(`An error occurred! ${err}`);
        });
    }
}

new AdminDao().readAdmin('root', 'pass').
then((result) => {
    console.log(result);
}).catch((err) => {
    console.error(err);
});