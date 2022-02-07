const express = require('express');
const cors = require('cors');
//Esto es una co0nstante con el array de peliculas que me he importado
const movies = require('./data/movies.json');
const users = require('./data/users.json');

// create and config server
const app = express();
app.use(cors());
app.use(express.json());

// init express aplication
const serverPort = 4000;
app.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});
//Voy a crear un endpoint para movies
app.get('/movies', (req, res) => {
  const genderFilterParam = req.query.gender;
  const sortParam = req.query.sort;
  console.log(req.query);
  console.log(genderFilterParam);
  console.log(sortParam);
  // console.log(movies);
  //Guaradamos en una variable el filtri de cada pelic comparamos el genero con el filtro que nos han pasado, no llevas llaves con return o no las pones, cuando filtras en select por todos no te salen las pelis,No salwe nada xq le has dixo q compare el genero con el filtro y cuando le pones todos el filtro esta vacío y no coincide con ninguno hay que hacer un ternario para que si el filtro esta vacío devuelva todos los resultados.
  //Si el filtro esta vacio  devuelvce true de forma que te lo devolverá todos si tiene algo comparalo.
  const filteredResults = movies.filter((movie) => genderFilterParam === '' ? true : movie.gender === genderFilterParam);

  //Ordenacion
  filteredResults.sort((a, b) => {
    if (sortParam === 'asc' && a.title > b.title || sortParam === 'desc' && a.title < b.title) {
      return 1;
    } else {
      return -1;
    }
  });

  res.json({
    success: true,
    // movies: movies, en sustitucion de devolver el array entero vamos a devolver filtrado pero dentro del atributo movies
    movies: filteredResults
  })
});

//Voy a crear un endpoint para login
app.post('/login', (req, res) => {
  console.log('soyunmuñeco');
  console.log(req.body);
  const emailParam = req.body.email;
  const passwordParam = req.body.password;

  const findResult = users.find((user) => user.email === emailParam && user.password === passwordParam);

  //Si la usuaria existe responde a la petición con:
  if (findResult !== undefined) {
    res.json({

      "success": true,
      //findResult es el objeto encontrado y tenemios que acceder a su id
      "userId": findResult.id
    })
  } else {
    res.json({
      "success": false,
      "errorMessage": "Usuaria/o no encontrada/o"
    })
  }
});

//Voy a crear un endpoint
//Se crea un atibuto en req.params que va a tener el nombre que ponga despues de :
//En este caso, el nombre del atributo será movieId, por tanto para recoger el valor accedemos a req.params.movieId
//Este valor será cualquier cosa que haya despues de movie/ en la url del fetch o del navegador
app.get('/movie/:movieId', (req, res) => {
  //Lo consoleamos para poder utilizar movieId
  console.log(req.params);
  //busca en ese array de películas que has importado la que tenga el mismo id que estás recibiendo por URL params
  const idParam = req.params.movieId;

  const foundMovie = movies.find((movie) => movie.id === idParam);
  console.log(foundMovie);
});




//Añadimos servidor de estáticos de react
//la ruta del proyecto compilado de react ya es front da igual lo que haya sido, es  mi proyecto de front compilado, public-react es servidor.Le estas diciendo al servidor donde esta la parte de rect
const staticServerPathWeb = "./src/public-react";
//le dice al servidor donde esta el servidor de estaticos para cuando desde el navegador sdde le pregunte por un recurso sepa donde tiene que ir a buscarlo.
// ej: localhost 4000 el servidor irá a buscar index html a su servidor de estaicos
//Asigna al servidor esa carpeta de estaticos esta dos simprer van juntas siempre hacen lo mosmo
app.use(express.static(staticServerPathWeb));
//Añadimos el servidor de estaticos de imagenes
const staticServerPathImages = "./src/public-movies-images";
app.use(express.static(staticServerPathImages));