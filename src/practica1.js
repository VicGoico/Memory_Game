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
MemoryGame = function (gs) {
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
	var carta1 = null;
	var carta2 = null;
	var cartaID = -1;
	var miniMensaje = "Principio";
	var contadorDeClicks = 0;
	// gs -> es el servidor grafico

	// Inicializo todos los valores de la matriz, con el dibujo
	this.initGame = function () {
		var contador = 1;
		// Creo las cartas y las guardo en el array de Cartas
		for (var i = 0; i < 16; i++) {
			cartas.push(new MemoryGameCard(sprites[contador]));
			// Inicializo el contador, ya que he metido por lo menos
			// una vez cada tipo de carta y tengo que meter su pareja
			if (contador == 8) {
				contador = 0;
			}
			contador++;
		}
		// Aqui mezclo las cartas unas 50 veces
		for (var i = 0; i < 50; i++) {
			// Me guardo 2 posiciones del array de cartas creadas aleatoriamente
			var primeraCarta = Math.ceil((Math.random() * 16));
			var segundaCarta = Math.ceil((Math.random() * 16));
			// Le resto menos uno ya que se genera un numero entre 1 y 16
			primeraCarta--;
			segundaCarta--;
			// Guardo los datos de la posicion de la primeraCarta
			var card = cartas[primeraCarta];
			// Mezclo los datos de las 2 cartas
			cartas[primeraCarta] = cartas[segundaCarta];
			cartas[segundaCarta] = card;
		}
		//Llamar a la funcion loop()
		setInterval(this.loop, 16);
	};
	draw = function () {
		// 1. Escribe el mensaje con el estado actual del juego
		if (contadorDeParejas != 0) {
			if(miniMensaje == "Principio"){
				gs.drawMessage("Empezamos --- Clicks: " + contadorDeClicks);
			}
			else if(miniMensaje == "Correcto"){
				gs.drawMessage("Correcto :) --- Clicks: " + contadorDeClicks);
			}
			else if(miniMensaje == "Fallo"){
				gs.drawMessage("Fallo :( --- Clicks: " + contadorDeClicks);
			}
			else if(miniMensaje == "Misma carta"){
				gs.drawMessage("Misma carta --- Clicks: " + contadorDeClicks);
			}
		}
		else {
			gs.drawMessage("Gano --- Clicks: " + contadorDeClicks);
		}

		// 2. Pide a cada una de las cartas del tablero que se dibujen
		for (var i = 0; i < cartas.length; i++) {
			cartas[i].draw(gs, i);
		}


	}

	this.loop = function () {
		// Llama a la funcion draw
		draw();

	}
	this.onClick = function (cardId) {
		// Voy contando los clicks
		contadorDeClicks++;
		// Cambio de estado a la carta
		cartas[cardId].flip();
		// Compruebo que no sea null la primera carta a comparar
		if (carta1 == null) {
			carta1 = cartas[cardId];
			cartaID = cardId;
		}
		// Si carta1 != null, entonces es que ya hay una carta seleccionada y cogemos la otra
		else {
			carta2 = cartas[cardId];
		}
		// Si carta1 y carta2 estan cogidas y no son la misma carta en la misma posicion
		if (carta1 != null && carta2 != null && cardId != cartaID) {
			// Compruebo si son la misma carta
			if (carta1.compareTo(carta2)) {
				miniMensaje = "Correcto";
				// Cambio su estado a "Encontada"
				carta1.found();
				carta2.found();
				// Le resto a la varible menos uno, para saber luego si 
				// el juego a terminado
				contadorDeParejas--;	
				carta1 = null;
				carta2 = null;
			}
			// No son la misma, cambio su estado a "Espalda"
			else {
				miniMensaje = "Fallo";
				setTimeout(() => {
					carta1.flip();
					carta2.flip();
					carta1 = null;
					carta2 = null;
				}, 250);
			}
			
		}
		// Si carta1 y carta2 estan cogidas y son la misma carta en la misma posicion
		else if(cardId == cartaID && carta1 != null && carta2 != null){
			// Podria poner un mensaje por el juego
			miniMensaje = "Misma carta";
			carta1 = null;
			carta2 = null;
		}
	}
};



/**
 * Constructora de las cartas del juego. Recibe como parámetro el nombre del sprite que representa la carta.
 * Dos cartas serán iguales si tienen el mismo sprite.
 * La carta puede guardar la posición que ocupa dentro del tablero para luego poder dibujarse
 * @param {string} id Nombre del sprite que representa la carta
 */
// Esto es una carta
MemoryGameCard = function (id) {
	this.estado = "Espalda";// ["Encontrado", "Espalda", "Cara"];// array del estado de las cartas
	this.nombre = id;// Esto es el sprite

	// Cambia el estado de la carta
	this.flip = function () {

		// Para que no se cambie el estado de la carta
		if (this.estado != "Encontrada") {
			if (this.estado == "Espalda") {
				this.estado = "Cara";
			}
			else if (this.estado == "Cara") {
				this.estado = "Espalda";
			}
		}
		//console.log(this.estado);
	}
	// Cambia el estado a Encontrado
	this.found = function () {
		this.estado = "Encontrada";
	}
	// Mira si las 2 cartas son iguales
	this.compareTo = function (otherCard) {
		return this.nombre == otherCard.nombre;
		// Pongo 2
		/*if(this.nombre == otherCard.nombre){
			cierto = true;
		}
		return cierto;*/
	}
	// Pinta la carta en funcion del estado en el que se encuentre
	this.draw = function (gs, pos) {
		//console.log(this.estado);
		if (this.estado == "Espalda") {
			gs.draw("back", pos);
		}
		else {
			gs.draw(this.nombre, pos);
		}
	}

};