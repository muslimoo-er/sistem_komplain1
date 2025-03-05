const express = require('express')
const app = express()
const mariadb = require('mariadb')
const { render } = require('pug')
const nam = require('readline')
const session = require("express-session")


app.locals.dataa = []
app.locals.done = [];
app.locals.search = [];

app.use(session({
    secret: "sessionsecret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));




app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.set('views','view')
app.set('view engine','ejs')

const pool = mariadb.createPool({
    host : 'localhost',
    user : 'root',
    password : 'muslim',
    database : 'komplain',
    
})

app.get('/',(req,res)=>{
    res.render('login',{msg:''})
    return
})
app.post('/login', (req, res) => {
    const username = req.body.nama;
    const password = req.body.password;

    if (username === "humas" && password === "1h2m3s") {
        req.session.user = { username } ;  //
        res.redirect('/daftar.ejs')
        return
    } else {
        res.render('login',{msg:'password atau username salah'})
        return
    }
});


app.get('/index.ejs',(req,res)=>{
    res.render('index')
    return
})


app.post('/input',async (req,res) => {
    let keran;
    
    try {
        if(!req.session.user) res.redirect('/')
        
        const now = Date.now
        const date = new Date();
        const formattedDate = date.toISOString().split('T')[0].replace(/-/g, ''); 

        const dadu = Math.floor(Math.random()* 1000)

        const daduC = dadu.toString().split('.')[0]

        const data = [
            formattedDate + daduC,
            req.body.nama_pelanggan,
            req.body.kontak,
            req.body.komplain,
            req.body.detail_komplain,
            req.body.status,
                        
        ]

   
        
        keran = await pool.getConnection();
        
        await keran.query('INSERT INTO komplain VALUES(?,?,?,?,?,?)',data);
    
        res.redirect('/index.ejs')
        return
        
    } catch (error) {
        console.error('terjadi error',error)
        
    }
    finally{
        if(keran) keran.release()

    }
    
})

app.get('/daftar.ejs',async(req,res)=>{
    let keran;
    try{
        if(!req.session.user) {
            res.redirect('/')
            return

        }

        keran = await pool.getConnection();
        let komplain = await keran.query('SELECT * FROM komplain ')
        res.render('daftar.ejs',{komplain,pool : pool})
        


    }catch(err){
        console.error('terjadi kesalahan',err)
    }finally{
        if(keran) keran.release()
    }

})



app.post('/hapus',async(req,res)=>{ 
    let keran;
    
    try {
       const lap = [
        req.body.nam
       ]

        keran = await pool.getConnection();
        
        const sql = 'DELETE FROM komplain WHERE Nama = (?)'
        await keran.query(sql,lap,(err,result)=>{
            if(err) {throw err }
            else{
                console.log(result)
            }
        })
        
        res.redirect('/daftar.ejs')
    
    } catch (error) {
        console.error(error)
        
    }finally{
        if(keran) keran.release()
    }
})

app.post('/ubah',(req,res)=>{
    res.render('ubah')
    app.locals.dataaa = req.body.nam
    return
    
})
app.post('/terubah',async(req,res)=>{
    let keran;
    try {
        if(!req.session.user) {
            res.redirect('/') 
            return
        }
        
        keran = await pool.getConnection()
        let aksi = await keran.query('UPDATE komplain SET Status = ? WHERE Nama = ?',[req.body.terubah,app.locals.dataaa])
        res.redirect('/daftar.ejs')
        return

        
    } catch (error) {
        console.error(error)
        
    }finally{
        if(keran) keran.release()
    }
})
app.get('/done.ejs',async(req,res)=>{
    let keran;
    try{
        if(!req.session.user) {
            res.redirect('/')
            return
        }
        keran = await pool.getConnection();
        let aksi = await keran.query('SELECT * FROM komplain WHERE Status LIKE "Don%"')
        
        res.render('done.ejs',{aksi})
        return

    }catch(err){
        console.error('terjadi kesalahan',err)
    }finally{
        if(keran) keran.release()
    }

})
app.get('/not.ejs',async(req,res)=>{
    let keran;
    try{
        if(!req.session.user) {
            res.redirect('/')
            return
        }
        keran = await pool.getConnection();
        let aksi = await keran.query('SELECT * FROM komplain WHERE Status LIKE "Not%"')
        
        res.render('not.ejs',{aksi})

    }catch(err){
        console.error('terjadi kesalahan',err)
    }finally{
        if(keran) keran.release()
    }

})
app.get('/progress.ejs',async(req,res)=>{
    let keran;
    try{
        if(!req.session.user) {
            res.redirect('/')
            return
        }
        keran = await pool.getConnection();
        let aksi = await keran.query('SELECT * FROM komplain WHERE Status LIKE "In%"')
        
        res.render('progress.ejs',{aksi})

    }catch(err){
        console.error('terjadi kesalahan',err)
    }finally{
        if(keran) keran.release()
    }
})


app.post('/hapusNot',async(req,res)=>{ 
    let keran;
    
    try {
       const lap = [
        req.body.nam
       ]

        keran = await pool.getConnection();
        
        const sql = 'DELETE FROM komplain WHERE Nama = (?)'
        await keran.query(sql,lap,(err,result)=>{
            if(err) {throw err }
            else{
                console.log(result)
            }
        })
        
        res.redirect('/not.ejs')
    
    } catch (error) {
        console.error(error)
        
    }finally{
        if(keran) keran.release()
    }
})


app.post('/hapusPro',async(req,res)=>{ 
    let keran;
    
    try {
       const lap = [
        req.body.nam
       ]

        keran = await pool.getConnection();
        
        const sql = 'DELETE FROM komplain WHERE Nama = (?)'
        await keran.query(sql,lap,(err,result)=>{
            if(err) {throw err }
            else{
                console.log(result)
            }
        })
        
        res.redirect('/progress.ejs')
    
    } catch (error) {
        console.error(error)
        
    }finally{
        if(keran) keran.release()
    }
})
app.post('/ubahNot',(req,res)=>{
    res.render('ubah')
    app.locals.dataaa = req.body.nam
    
})
app.post('/ubahPro',(req,res)=>{
    res.render('ubah')
    app.locals.dataaa = req.body.nam
    
})



app.post('/search',async(req,res)=>{
    app.locals.search = req.body.search
    res.redirect('/cari.ejs')    

})

app.get('/cari.ejs',async(req,res)=>{
    let keran;
    try{
        if(!req.session.user) {
            res.redirect('/')
            return
        }

        keran = await pool.getConnection();
        const value = app.locals.search.toString()
        
        let komplain = await keran.query('SELECT * FROM komplain WHERE Nama LIKE ? OR Nama LIKE ? OR Nama LIKE ? OR Nama LIKE ? OR Detail_Komplain LIKE ? OR Detail_Komplain LIKE ? OR Detail_Komplain LIKE ? OR Detail_Komplain LIKE ? OR Jenis_Komplain LIKE ? OR Jenis_komplain LIKE ? OR Jenis_komplain LIKE ? OR Jenis_komplain LIKE ?',[value,value + "%", "%"+ value,"%" + value + "%",value,value + "%","%"+value,"%" + value + "%",value,value + "%","%"+value,"%" + value + "%"])
        
        
        res.render('cari.ejs',{komplain})


    }catch(err){
        console.error('terjadi kesalahan',err)
    }finally{
        if(keran) keran.release()
    }
})

app.post('/hapusCari',async(req,res)=>{ 
    let keran;
    
    try {
       const lap = [
        req.body.nam
       ]

        keran = await pool.getConnection();
        
        const sql = 'DELETE FROM komplain WHERE Nama = (?)'
        await keran.query(sql,lap,(err,result)=>{
            if(err) {throw err }
            else{
                console.log(result)
            }
        })
        
        res.redirect('/cari.ejs')
    
    } catch (error) {
        console.error(error)
        
    }finally{
        if(keran) keran.release()
    }
})

app.listen(8080)
console.log('server is running ')
