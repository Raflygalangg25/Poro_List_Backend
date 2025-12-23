const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
//const bodyParser = require('body-parser')
const db = require('./connection')
const cors = require('cors')
const passport = require('passport')
const GoogleLogin = require('passport-google-oauth20')
require('dotenv').config();

//app.use(bodyParser.json())
app.use(express.json())
app.use(cors())
app.use(passport.initialize())

db.connect((err) => {
  if(err){
  console.error('Gagal terhubung ke database', err);
  } else {
  console.log('Berhasil terhubung ke database');
  }
});

app.get("/", (req, res) => {
  res.send("Poro_List Backend is Running!");
});

app.get("/tasks", (req,res) => {
  const sql = `SELECT id, title, description, created_at, is_completed AS completed FROM task ORDER BY created_at DESC`;
  
  db.query(sql, (err, result) => {
    if (err) return res.status(500).send(err);
    const formatted = result.map(item => ({
      ...item,
      completed: item.completed === 1
    }));
    res.json(formatted);
  });
});

app.post("/tasks", (req, res) =>{
  const {title, description} = req.body;
  const sql = `INSERT INTO task (title, description) VALUES(?,?)`;

  db.query(sql, [title, description], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json ({
      message: "Sukses",
      id: result.insertId,
      title: title,
      description: description,
      completed: false
     });
   });
});

app.put("/tasks/:id", (req, res) => {
  const {id} = req.params;

  const { title, description, completed} = req.body;

  console.log(`LOG UPDATE: Menerima req update ID: ${id}`);

  if (description && description.length > 200) {
    return res.status(400).json({ error: "Deskripsi tidak boleh lebih dari 200 character!"});
  }

  let sql;
  let params;

  if (title !== undefined && description !== undefined) {
    sql = `UPDATE task SET title = ?, description = ? WHERE id = ?`;
    params = [title, description, id];
  } else if (completed !== undefined) {
    const isCompletedInt = completed ? 1 : 0;
    sql = `UPDATE task SET is_completed = ? WHERE id = ?`;
    params = [isCompletedInt, id];
  } else {
    return res.status(400).json({ message: "Data tidak valid"});
  }

  db.query (sql, params, (err, result) => {
    if(err) {
      console.error("Error SQL Update:", err);
      return res.status(500).json({ error: err.message });
    }
      
    console.log(`Berhasil Update ID: ${id}`);
    res.json ({ message: "Tugas berhasil diupdate"});
  })
})

app.delete("/tasks/:id", (req, res) => {
  const {id} = req.params;
  
  console.log(`LOG MASUK: Backend menerima request delete untuk ID: ${id}`);
  
  const sql = `DELETE FROM task WHERE id = ?`;

  db.query (sql, [id], (err, result) => {
    if (err) {
      console.error("Error SQL Delete:", err)
      return res.status(500).json({ error: err.message});
    }

    if (result.affectedRows === 0) {
      console.log(`Gagal menghapus id: ${id}`);
      return res.status(404).json({ message: "ID tidak ditemukan"});
    } 

    console.log(`Berhasil menghapus ID!: ${id}`);
    res.json ({ message: "Tugas berhasil dihapus"});
  })
})


passport.use(new GoogleLogin({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://porolistbackend-production.up.railway.app/auth/google/callback"
},
(accessToken, refreshToken, profile, done) => {
  const { id, displayName, emails, photos } = profile;
  const userData = {
    google_id: id,
    name: displayName,
    email: emails[0].value,
    profile_pic: photos[0].value
  };

  const sql = `INSERT INTO users (google_id, name, email, profile_pic) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = ?, profile_pic = ?`;
  db.query(sql, [userData.google_id, userData.name, userData.email, userData.profile_pic, userData.name, userData.profile_pic], (err, result) => {
    if (err) return done(err);
    return done(null, userData);
  });
  }
));

  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  app.get('/auth/google/callback',
    passport.authenticate('google', {failureRedirect : '/login', session : false}),
    (req, res) => {
      const userString = encodeURIComponent(JSON.stringify(req.user));
      res.redirect(`https://poro-list-frontend.vercel.app/dashboard?user=${userString}`);
    }
  );



  






app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})