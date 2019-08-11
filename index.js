let express = require('express');        // Utilizaremos express, aqui lo mandamos llamar

let app = express();                 // definimos la app usando express
let bodyParser = require('body-parser'); //

// configuramos la app para que use bodyParser(), esto nos dejara usar la informacion de los POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let port = process.env.PORT || 8080;        // seteamos el puerto

let router = express.Router();   //Creamos el router de express

// Seteamos la ruta principal
router.get('/', (req, res)=> {
    res.json({ message: 'Hooolaa :)'});
});

router.route('/dogs') //agregamos la ruta /dogs
  // El método POST es el estándar para crear
  .post((req, res)=> {
    let dog = new Dog(); // Creamos una nueva instancia del model Dog
    dog.name = req.body.name; // seteamos el nombre del perrito
    dog.age = req.body.age; // seteamos la edad del perrito
    // Guardamos el perrito, utilizando el modelo de mongoose
    dog((err)=> {
      if (err){ //Si hay un error, lo regresamos
        res.send(err);
      }
    //Si no hay errores, regresamos un mensaje de que todo salió bien
    res.json({ message: 'Creamos un perrito!' });
  });
});

// Le decimos a la aplicación que utilize las rutas que agregamos
app.use('/api', router);

// Iniciamos el servidor
app.listen(port);
console.log(`Aplicación creada en el puerto: ${port}`);

let mongoose = require('mongoose'); // Utilizamos la librería de mongoose
//Creamos la conexión con mongo
mongoose.connect('mongodb://localhost:27017/test');

// Obtenemos todos los perritos 
router.route('/dogs')
  //Para listar GET es el estandar
  .get((req, res)=> {
    //Usamos la funcion find de mongoose para encontrar todos los registros
    Dog.find((err, dogs)=> {
    //Si hay un error, lo regresamos
    if (err){
      res.send(err);
    }
    //Si no hay errores, regresamos los registros
    res.json(dogs);
  });
});

//Ruta para editar un perrito
router.route('/dogs/:dog_id')
  // El estandár para editar es PUT
  .put((req, res)=> {
    // Usamos la funcion findById de mongoose para encontrar
    // el perrito que queremos editar 
    Dog.findById(req.params.dog_id, (err, dog)=> {
      
      if (err){//si hay errores los regresamos
        res.send(err);
      }
      
      //Modificamos el registro
      dog.age = req.body.age; 
      // Guardamos
      dog.save((err) =>{
        if (err){
            res.send(err);
        }
        res.json({ message: `El perrito ${dog.name} fue actualizado correctamente`});
      });
    });
  });

  router.route('/dogs/:dog_id')
 //Como utilizamos la misma ruta para editar y eliminar
 
  // DELETE para borrar el perrito
  .delete((req, res) =>{
    Dog.remove({
      _id: req.params.dog_id
      }, (err, dog) =>{
        if (err){
          res.send(err);
        }
        
        res.json({ message: 'El perrito fue eliminado correctamente'});
    });
  });
