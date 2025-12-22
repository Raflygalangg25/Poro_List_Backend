/*app.get('/', (req, res) => {
  db.query("SELECT * FROM login_user", (error, result) => {
      response(200, result, "get all data from login_user", res)
  }) 
})

app.get("/", (req, res) => {
  response(200, "API ready to go", "SUCCESS", res)
})

app.get("/mahasiswa", (req, res) => {
  const sql = "SELECT * FROM mahasiswa"
  db.query(sql, (err, fields) => {
    response(200, fields, "mahasiswa get list", res)
  })
})

app.get("/mahasiswa/:nim", (req, res) => {
  const nim = req.params.nim
  const sql = `SELECT * FROM mahasiswa WHERE nim = ${nim}`
  db.query(sql, (err, fields) => {
    if(err) throw err
    response(200, fields, "get detail mahasiswa", res)
  })
})

app.get('/find', (req, res) => {
  const nim = req.params.nim
  const sql = `SELECT nim FROM mahasiswa WHERE nim = ${req.query.nim}`
  db.query(sql, (error, result) => {
    response(200, result, "find login_user name", res)
  })
})

app.post('/login', (req, res) => {
  console.log({requestFromOutside : req.body})
  res.send('login sukses')
})

app.put('/username', (req, res) => {
  console.log({updateData : req.body})
  res.send('update sukses')
})**/