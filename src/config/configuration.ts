export default() => ({
    app: {
        host: process.env.HOT || 'localhost',
        port: parseInt(process.env.PORT, 10) || 3000
    },
    db: {
        type: 'mariadb',
        host: 'localhost',
        port: 3306,
        username: 'mynote',
        password: '1111',
        database: 'mynote'
    }
})