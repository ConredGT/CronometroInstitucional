document.addEventListener("DOMContentLoaded", () => {
	const $tiempoRestante = document.querySelector("#tiempoRestante"),
		$btnIniciar = document.querySelector("#btnIniciar"),
		$btnPausar = document.querySelector("#btnPausar"),
		$btnDetener = document.querySelector("#btnDetener"),
		$minutos = document.querySelector("#minutos"),
		$segundos = document.querySelector("#segundos"),
		$contenedorInputs = document.querySelector("#contenedorInputs");
	let idInterval = null, diferenciaTemporal = 0,
		fechaFuturo = null;
	// Carga un sonido a través de su fuente y lo inyecta de manera oculta

	function establecerVisibilidadImagen(id, visibilidad) {
		var img = document.getElementById(id);
		img.style.visibility = (visibilidad ? 'visible' : 'hidden');

	}

	establecerVisibilidadImagen('red', false);
	establecerVisibilidadImagen('yellow', false);
	establecerVisibilidadImagen('green', false);

	const cargarSonido = function (fuente) {
		const sonido = document.createElement("audio");
		sonido.src = fuente;
		sonido.loop = true;
		sonido.setAttribute("preload", "auto");
		sonido.setAttribute("controls", "none");
		sonido.style.display = "none"; // <-- oculto
		document.body.appendChild(sonido);
		return sonido;
	};

	const sonido = cargarSonido("timer.wav");
	const ocultarElemento = elemento => {
		elemento.style.display = "none";
	}

	const mostrarElemento = elemento => {
		elemento.style.display = "";
	}

	const iniciarTemporizador = (minutos, segundos) => {
		ocultarElemento($contenedorInputs);
		mostrarElemento($btnPausar);
		ocultarElemento($btnIniciar);
		ocultarElemento($btnDetener);

		establecerVisibilidadImagen('green', true);

		if (fechaFuturo) {
			fechaFuturo = new Date(new Date().getTime() + diferenciaTemporal);
			diferenciaTemporal = 0;
		} else {
			const milisegundos = (segundos + (minutos * 60)) * 1000;
			fechaFuturo = new Date(new Date().getTime() + milisegundos);
		}
		clearInterval(idInterval);
		idInterval = setInterval(() => {
			const tiempoRestante = fechaFuturo.getTime() - new Date().getTime();

			console.log(tiempoRestante)
			if(tiempoRestante <=29999){
				establecerVisibilidadImagen('yellow', true);
				establecerVisibilidadImagen('green', false);
				establecerVisibilidadImagen('red', false);
			}
			
			if(tiempoRestante <=4999){
				establecerVisibilidadImagen('yellow', false);
				establecerVisibilidadImagen('green', false);
				establecerVisibilidadImagen('red', true);
			}

			if (tiempoRestante <= 0) {
				clearInterval(idInterval);
				sonido.play();
				ocultarElemento($btnPausar);
				mostrarElemento($btnDetener);
			} else {
				$tiempoRestante.textContent = milisegundosAMinutosYSegundos(tiempoRestante);
			}
		}, 50);
	};

	const pausarTemporizador = () => {
		ocultarElemento($btnPausar);
		mostrarElemento($btnIniciar);
		mostrarElemento($btnDetener);
		diferenciaTemporal = fechaFuturo.getTime() - new Date().getTime();
		clearInterval(idInterval);
	};

	const detenerTemporizador = () => {
		clearInterval(idInterval);
		fechaFuturo = null;
		diferenciaTemporal = 0;
		sonido.currentTime = 0;
		sonido.pause();
		$tiempoRestante.textContent = "00:00.0";
		establecerVisibilidadImagen('yellow', false);
		establecerVisibilidadImagen('green', false);
		establecerVisibilidadImagen('red', false);
		init();
		
	};

	const agregarCeroSiEsNecesario = valor => {
		if (valor < 10) {
			return "0" + valor;
		} else {
			return "" + valor;
		}
	}
	const milisegundosAMinutosYSegundos = (milisegundos) => {
		const minutos = parseInt(milisegundos / 1000 / 60);
		milisegundos -= minutos * 60 * 1000;
		segundos = (milisegundos / 1000);
		return `${agregarCeroSiEsNecesario(minutos)}:${agregarCeroSiEsNecesario(segundos.toFixed(1))}`;
	};
	const init = () => {
		$minutos.value = "";
		$segundos.value = "";
		mostrarElemento($contenedorInputs);
		mostrarElemento($btnIniciar);
		ocultarElemento($btnPausar);
		ocultarElemento($btnDetener);
	};


	$btnIniciar.onclick = () => {
		const minutos = parseInt($minutos.value);
		const segundos = parseInt($segundos.value);
		if (isNaN(minutos) || isNaN(segundos) || (segundos <= 0 && minutos <= 0)) {
			return;
		}
		iniciarTemporizador(minutos, segundos);
	};
	init();
	$btnPausar.onclick = pausarTemporizador;
	$btnDetener.onclick = detenerTemporizador;
});
