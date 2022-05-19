import express from 'express';
import {MongoClient, ObjectId} from 'mongodb';
const port = '3000';
const app = express();

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.urlencoded());

app.use(express.static('./views/pages'));

const client = new MongoClient('mongodb://127.0.0.1:27017');
await client.connect();
//'circus' från mongodb i terminalen, samma med 'users'
const db = client.db('circus');
const membersCollection = db.collection('users');


//startpage
app.get('/pages/startpage', async (req, res) => {
  res.render('pages/startpage', {});
});

//navigerar till pages map, file members.ejs
app.get('/pages/members', async (req, res) => {
  const members = await membersCollection.find({}).toArray();
  res.render('pages/members', {
    members
  });
});

//About user info
//router navigering
app.get('/pages/user/:id', async (req, res) => {
  const user = await membersCollection.findOne({_id: ObjectId(req.params.id) });
  //i mappar navigering
  res.render('pages/user', {
    title: 'Users',
    ...user
  });
});

app.get('/pages/createuser', async (req, res) => {
  //navigering!!!
  res.render('pages/createuser');
})

//post används för att skapa data
app.post('/pages/members/createuser', async (req, res) => {
  console.log(req.body); //får i terminalen skapat user info
  await membersCollection.insertOne(req.body);
  res.redirect('/pages/members');
});

//delete member
app.post('/pages/user/delete/:id', async (req, res) => {
  await membersCollection.deleteOne({_id: ObjectId(req.params.id)});
  res.redirect('/pages/members');
})

//sortera members
app.get('/pages/members/sort/asc', async (req, res) => {
  const members = await membersCollection.find({}).sort({name:1}).toArray();
  console.log(members);

  res.render('pages/members', { 
    members
  });
}); 

app.get('/pages/members/sort/desc', async (req, res) => {
  const members = await membersCollection.find({}).sort({name:-1}).toArray();
  console.log(members);
 
  res.render('pages/members', {
    members
  });
});
//--sortering slut

//uppdatera medlem //fixa date date: new Date(req.body.date)
app.post('/pages/members/update/:id', async (req, res) => {
  await membersCollection.updateOne({_id: ObjectId(req.params.id)}, {$set:{name: req.body.name, email: req.body.email, mobile: req.body.mobile, date: req.body.date, role: req.body.role} });
  
  res.redirect('/pages/members');
})

app.listen(port, () => console.log(`Listening on port ${port}`));
