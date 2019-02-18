/**
 * MemoryGame es la clase que representa nuestro juego. Contiene un array con la cartas del juego,
 * el número de cartas encontradas (para saber cuándo hemos terminado el juego) y un texto con el mensaje
 * que indica en qué estado se encuentra el juego
 */
var MemoryGame = MemoryGame || {};

/**
 * Constructora de MemoryGame
 */
 // Esto es un tablero
MemoryGame = function(gs) {
	 var sprites = [
		"back",
		"8-ball",
		"potato",
		"dinosaur",
		"kronos",
		"rocket",
		"unicorn",
		"guy",
		"zeppelin"
	];
	var cartas = [];
	var contadorDeParejas = 8;
	var comparar = false;
	// gs -> es el servidor grafico
	
	// Inicializo todos los valores de la matriz, con el dibujo
	this.initGame = function(){
		var contador = 1;
		// Creo las cartas y las guardo en el array de Cartas
		for(var i = 0; i < 16; i++){
			cartas.push(new MemoryGameCard(sprites[contador]));
			// Inicializo el contador, ya que he metido por lo menos
			// una vez cada tipo de carta y tengo que meter su pareja
			if(contador == 8){
				contador = 0;
			}
			contador++;
		}
		// Aqui barajeoo
		for(var i = 0; i < 50; i++){
			var primeraCarta = Math.ceil((Math.random()*16));
			var segundaCarta = Math.ceil((Math.random()*16));
			primeraCarta--;
			segundaCarta--;
			var card = cartas[primeraCarta];
			cartas[primeraCarta] = cartas[segundaCarta];
			cartas[segundaCarta] = card;
		}
		console.log(max);
		console.log(min);
		//Llamar a la funcion loop()
		setInterval(this.loop, 10);
	};
	draw = function(){
		// 1. Escribe el mensaje con el estado actual del juego
		if(contadorDeParejas != 0){
			gs.drawMessage("Jugando");
		}
		else{
			gs.drawMessage("Gano");
		}
		
		// 2. Pide a cada una de las cartas del tablero que se dibujen
		for(var i = 0; i < cartas.length; i++){
			cartas[i].draw(gs, i);
		}

	}
	this.onClick = function(cardId){
		cartas[cardId].flip();	
		var i = 0, encontrado = false;
		while(i < cartas.length && !encontrado){
			console.log("Se metio");
			if(cartas[i].estado == "Cara" && i != cardId){
				encontrado = true;
				if(cartas[cardId].compareTo(cartas[i])){
					console.log(cartas[cardId].nombre);
					console.log(cartas[i].nombre);
					cartas[cardId].found();
					cartas[i].found();
					contadorDeParejas--;
					console.log(cartas[cardId].nombre);
					console.log(cartas[i].nombre);
				}
				// No son la misma, cambio su estado a Espalda
				else{
					//setInterval(3000);
					cartas[cardId].flip();
					cartas[i].flip();
				}
			}
			i++;
		}
	}

	this.loop = function(){
		draw();
	}
	
};



/**
 * Constructora de las cartas del juego. Recibe como parámetro el nombre del sprite que representa la carta.
 * Dos cartas serán iguales si tienen el mismo sprite.
 * La carta puede guardar la posición que ocupa dentro del tablero para luego poder dibujarse
 * @param {string} id Nombre del sprite que representa la carta
 */
 // Esto es una carta
MemoryGameCard = function(id) {
	this.estado = "Espalda";// ["Encontrado", "Espalda", "Cara"];// array del estado de las cartas
	this.nombre = id;// Esto es el sprite

	// Cambia el estado de la carta
	this.flip = function(){

		// Para que no se cambie el estado de la carta
		if(this.estado != "Encontrada"){
			if(this.estado == "Espalda"){
				this.estado = "Cara";
			}
			else if(this.estado == "Cara"){
				this.estado = "Espalda";
			}
		}
		//console.log(this.estado);
	}
	// Cambia el estado a Encontrado
	this.found = function(){
		this.estado = "Encontrada";
	}
	// Mira si las 2 cartas son iguales
	this.compareTo = function(otherCard){
		return this.nombre == otherCard.nombre;
		// Pongo 2
		/*if(this.nombre == otherCard.nombre){
			cierto = true;
		}
		return cierto;*/
	}
	// Pinta la carta en funcion del estado en el que se encuentre
	this.draw = function(gs, pos){
		//console.log(this.estado);
		if(this.estado == "Espalda"){
			gs.draw("back", pos);
		}
		else{
			gs.draw(this.nombre, pos);
		}
	}

};