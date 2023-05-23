import {test, expect} from 'vitest';
import mariadb from "mariadb";

const pool = mariadb.createPool({
    host: 'localhost',
    port: 4000,
    user: 'root',
    password: 'rootpwd',
    database: 'liveAddict',
    connectionLimit: 5
});

/**
 * It ensures that there are 9 styles
 **/
test('Retrieves All style', async () => {

    let counter = await pool.getConnection()
        .then(conn => {
            return conn.query(`SELECT count(*) as counter FROM Style`)
                .then((rows) => {
                    return parseInt(rows[0].counter)
                })
                .catch(err => {
                    //handle error
                    console.log(err);

                })
                .finally(() => {
                    conn.end();
                })
        }).catch(err => {
            //not connected
            console.log(err);
        });

    expect(counter).toBe(9)
})

/**
 * It ensures that there are 11 town
 **/
test('Retrieves All Cities', async () => {

    let counter = await pool.getConnection()
        .then(conn => {
            return conn.query(`SELECT count(*) as counter FROM Ville`)
                .then((rows) => {
                    return parseInt(rows[0].counter)
                })
                .catch(err => {
                    //handle error
                    console.log(err);

                })
                .finally(() => {
                    conn.end();
                })
        }).catch(err => {
            //not connected
            console.log(err);
        });

    expect(counter).toEqual(11)
})

/**
 * Test add and remove on DB
 **/
test('Add and Remove Cities', async () => {


    let state = await pool.getConnection()
        .then(conn => {
            return conn.query(`INSERT INTO \`Ville\`(\`idVille\`, \`nom\`, \`coordonnees\`) VALUES (null,"TestCities", null)`)
                .then(async (rows) => {
                    if(rows.affectedRows === 1){

                        let insertID = parseInt(rows.insertId);

                        return await pool.getConnection().then(conn => {
                            return conn.query(`DELETE FROM \`Ville\` WHERE idVille = ${insertID} `).then(() => {
                                console.log(rows)
                                return rows.affectedRows !== 0;

                            })
                        })
                    }else{
                        return false
                    }

                })
                .catch(err => {
                    //handle error
                    console.log(err);
                    return false
                })
                .finally(() => {
                    conn.end();
                })
        }).catch(err => {
            //not connected
            console.log(err);
        });

    expect(state).toBeTruthy()
})

/**
 * It ensures we have at least one Concert
 **/
test('At least One citie', async () => {

    let counter = await pool.getConnection()
        .then(conn => {
            return conn.query(`SELECT count(*) as counter FROM Concert`)
                .then((rows) => {
                    return parseInt(rows[0].counter)
                })
                .catch(err => {
                    //handle error
                    console.log(err);

                })
                .finally(() => {
                    conn.end();
                })
        }).catch(err => {
            //not connected
            console.log(err);
        });

    expect(counter).toBeGreaterThan(1)
})