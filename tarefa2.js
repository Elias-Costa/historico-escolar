//ELIAS DA COSTA RODRIGUES

//------------- FUNÇÕES AUXILIARES -------------

const somarColunas = (coluna) => (acc, x) => acc + x[coluna]
const soma = (a, b) => a + b 
const ordenarRelColunaCres = (coluna) => (a, b) => a[coluna] - b[coluna]
const ordenarRelColunaDecres = (coluna) => (a, b) => b[coluna] - a[coluna]
const tratarCodigo = (cod) =>{
	/*RETORNA SÓ AS LETRAS DO CÓDIGO DO CÓDIGO DA DISCIPLINA*/
	const listaChar = cod.split('')
	return listaChar.filter(x => /[A-Z]/i.test(x)).join('')
}
//----------------------------------------------

const elementosDaTabela = (tab, qtdLinhas, aux=1, lista=[]) =>{
	if(aux < qtdLinhas){
		const ano = tab.rows[aux].cells[0].innerText
		const codigo = tab.rows[aux].cells[1].innerText
		const ch = parseInt(tab.rows[aux].cells[2].innerText)
		const freq = parseFloat(tab.rows[aux].cells[3].innerText)
		const nota = parseFloat(tab.rows[aux].cells[4].innerText)

		lista.push([ano, codigo, ch, freq, nota])
		elementosDaTabela(tab, qtdLinhas, aux+1, lista)
	}
	return lista
}

const salvarDados = () =>{
	/*SALVA OS DADOS NA TABELA E VERIFICA POSSÍVEIS ERROS DE DIGITAÇÃO NOS CAMPOS*/

	const ano = document.getElementById('ano').value
	const codigo = document.getElementById('codigo').value
	const ch = document.getElementById('ch').value
	const freq = document.getElementById('freq').value
	const nota = document.getElementById('nota').value

	const verificarAnoPeriodo = (str) =>{
		/*
			SÓ ACEITA ESTE PADRÃO -> [DE 1963 à 2022][.][1 ou 2]
		*/
	    if(/\b[0-9]{4}\b[.]\b[1-2]{1}\b/.test(str)){
	    	const num = parseInt(str.slice(0, 4))
	    	if(num > 2022 || num < 1963) return false
	    	else return true
	    }else return false
	}

	const verificarCodigo = (str) =>{
		/*
			SÓ ACEITA ESTE PADRÃO -> [LETRA(S)][4 DIGITOS]
		*/

		if(/[A-Z][0-9][0-9][0-9][0-9]$/i.test(str)){
	        const qtdnum = str.split('').filter(x => Number.isInteger(parseInt(x))).length
	        if(qtdnum>4) return false
	        else if(qtdnum == 4) return true
    	}
	}

	const verificarCH = (str) =>{
		const num = parseFloat(str)
		
		if(num > 0 && num % 15 == 0) return true
		else return false
	}
	
	const verificarFrequencia = (str) =>{
		const num = parseFloat(str)

		if(num >= 0 && num <= 100.00 ) return true
		else return false
	}
	
	const verificarNota = (str) =>{
		const num = parseFloat(str)

		if(num >= 0 && num <= 10.00 ) return true
		else return false
	}

	if(ano=='' || codigo=='' || ch=='' || freq=='' || nota==''){
		alert('ERRO: Preencha todos os campos!')
	}else if(!verificarAnoPeriodo(ano)){
		alert('ERRO: Preencha o campo Ano/Período corretamente!')
	}else if(!verificarCodigo(codigo)){
		alert('ERRO: Preencha o campo Código corretamente!')
	}else if(!verificarCH(ch)){
		alert('ERRO: Preencha o campo Carga Horária corretamente! ')
	}else if(!verificarFrequencia(freq)){
		alert('ERRO: Preencha o campo Frequência corretamente!')
	}else if(!verificarNota(nota)){
		alert('ERRO: Preencha o campo Nota corretamente!')
	}
	else{
		const tb = document.getElementById('tabela')
		const qtdLinhas = tb.rows.length

		const verificarTabela = (tabela, qtdLinhas, ano, cod, ch, aux=1) =>{
			/*
				NÃO ACEITA DISCIPLINAS IGUAIS NO MESMO PERÍODO E NÃO ACEITA
				QUE UMA MESMA DISCIPLINA TENHA CARGA HORÁRIA DIFERENTE EM PERÍODOS
				DISTINTOS.
			*/
			if(aux<qtdLinhas){
				if((tabela.rows[aux].cells[0].innerText == ano && tabela.rows[aux].cells[1].innerText == cod.toUpperCase()) || (tabela.rows[aux].cells[1].innerText == cod.toUpperCase() && tabela.rows[aux].cells[2].innerText != ch)){
					return false
				}
				verificarTabela(tabela, qtdLinhas, ano, cod, ch, aux+1)
			}
			return true
		}
		
		if(verificarTabela(tb, qtdLinhas, ano, codigo, ch)){

			const linha = tb.insertRow(qtdLinhas)
			const colano = linha.insertCell(0)
			const colcodigo = linha.insertCell(1)
			const colch = linha.insertCell(2)
			const colfreq = linha.insertCell(3)
			const colnota = linha.insertCell(4)
			colano.innerHTML = ano
			colcodigo.innerHTML = codigo.toUpperCase()
			colch.innerHTML = ch
			colfreq.innerHTML = parseFloat(freq).toFixed(2)
			colnota.innerHTML = parseFloat(nota).toFixed(2)
			document.getElementById('ano').value = ''
			document.getElementById('codigo').value = ''
			document.getElementById('ch').value = ''
			document.getElementById('freq').value = ''
			document.getElementById('nota').value = ''
		}else{
			alert('ERRO: Disciplina já existente no mesmo período ou mesma disciplina\ncom carga horária diferente!')
		}

	}
}

const dAprovadas = () =>{
	/*
		PEGA OS DADOS DA TABELA E VERIFICA QUAIS MATÉRIAS TEM NOTA >= 5
	*/
	const tb = document.getElementById('tabela')
	const qtdLinhas = tb.rows.length

	if(qtdLinhas-1 == 0){
		alert('ERRO: Adicione alguma disciplina primeiro!')
	}else{
		
		const listaAprovadas = Object.freeze(elementosDaTabela(tb, qtdLinhas).filter(x => x[4] >= 5 && x[3] >= 75))
		const listaCodAp = Object.freeze(listaAprovadas.map(x => x[1]))
		
		if(listaAprovadas.length==0){
			document.getElementById('aprovadas').innerHTML = 'Nenhuma'
		}else{
			document.getElementById('aprovadas').innerHTML = listaCodAp.join('<br><br>')
		}
	}
}

const dReprovadas = () =>{
	/*
		REPROVA POR NOTA OU POR FALTA. PEGA OS DADOS DA TABELA E VERIFICA QUAIS
		MATÉRIAS TEM NOTA < 5 OU QUAIS TÊM FREQUÊNCIA ABAIXO DE 75%.
	*/

	const tb = document.getElementById('tabela')
	const qtdLinhas = tb.rows.length

	if(qtdLinhas-1 == 0){
		alert('ERRO: Adicione alguma disciplina primeiro!')
	}else{
		
		const listaReprovadas = Object.freeze(elementosDaTabela(tb, qtdLinhas)).filter(x => x[3] < 75 || x[4] < 5)
		const listaCodRp = Object.freeze(listaReprovadas.map(x => x[3] < 75 ? x[1]+' (POR FALTA)' : x[1]))

		if(listaReprovadas.length==0){
			document.getElementById('reprovadas').innerHTML = 'Nenhuma'
		}else{
			document.getElementById('reprovadas').innerHTML = listaCodRp.join('<br><br>')
		}
	}
}

const tCurso = () =>{
	/*
		COMPARA O ANO/PERÍODO MAIS ANTIGO COM O MAIS RECENTE E CALCULA QUANTOS
		PERÍODOS SE PASSARAM
	*/
	const tb = document.getElementById('tabela')
	const qtdLinhas = tb.rows.length

	if(qtdLinhas-1 == 0){
		alert('ERRO: Adicione alguma disciplina primeiro!')
	}else{

		const listaPeriodos = Object.freeze(elementosDaTabela(tb, qtdLinhas).sort(ordenarRelColunaCres(0)).map(x => x[0]))
		const periodosSemRep = Object.freeze([...new Set(listaPeriodos)])
		const diferencaAnos = parseInt(periodosSemRep[periodosSemRep.length-1].slice(0,4)) - parseInt(periodosSemRep[0].slice(0,4))
		const periodoInicial = parseInt(periodosSemRep[0].slice(-1))
		const periodoFinal = parseInt(periodosSemRep[periodosSemRep.length-1].slice(-1))
		
		if(periodoInicial==periodoFinal){
			const totalPeriodos = (diferencaAnos*2)+1
			if(totalPeriodos>1){
				document.getElementById('tempocurso').innerHTML = totalPeriodos+' períodos'
			}else{
				document.getElementById('tempocurso').innerHTML = totalPeriodos+' período'
			}
		}else if(periodoInicial < periodoFinal){
			const totalPeriodos = (diferencaAnos*2)+2
			if(totalPeriodos>1){
				document.getElementById('tempocurso').innerHTML = totalPeriodos+' períodos'
			}else{
				document.getElementById('tempocurso').innerHTML = totalPeriodos+' período'
			}
		}else if(periodoInicial > periodoFinal){
			const totalPeriodos = diferencaAnos*2
			if(totalPeriodos>1){
				document.getElementById('tempocurso').innerHTML = totalPeriodos+' períodos'
			}else{
				document.getElementById('tempocurso').innerHTML = totalPeriodos+' período'
			}
		}
	}
}

const totalCargaH = () =>{
	/*
		PEGA A CARGA HORÁRIA DE CADA LINHA DA TABELA E SOMA TODAS
	*/
	const tb = document.getElementById('tabela')
	const qtdLinhas = tb.rows.length

	if(qtdLinhas-1 == 0){
		alert('ERRO: Adicione alguma disciplina primeiro!')
	}else{
		
		const totalCarga = elementosDaTabela(tb, qtdLinhas).reduce(somarColunas(2), 0)

		document.getElementById('cargah').innerHTML = totalCarga+' horas'
	}
}

const mediapCH = () => {
	/*
		[FUNCIONAMENTO] --> CADA CARGA HORÁRIA É UM MÚLTIPLO DE 15 E CADA NOTA TEM
		SUA RESPECTIVA DISCIPLINA COM UMA CARGA HORÁRIA. A MÉDIA SERÁ CALCULADA
		DA SEGUINTE MANEIRA:
			(NOTA1 * CH1/15 + NOTA2 * CH2/15 +...) / (CH1/15 + CH2/15+...)
		CADA NOTA TEM SUA RESPECTIVA CARGA HORÁRIA ASSOCIADA E QUANTO MAIOR A CH,
		MAIOR SERÁ O PESO.
			RESUMO: PESO 2 = CH DE 30
					PESO 3 = CH DE 60
					PESO 4 = CH DE 90
					       ....

	*/
	const tb = document.getElementById('tabela')
	const qtdLinhas = tb.rows.length

	if(qtdLinhas-1 == 0){
		alert('ERRO: Adicione alguma disciplina primeiro!')
	}else{

		const listaCarga = Object.freeze(elementosDaTabela(tb, qtdLinhas).map(x => x[2]))

		const denominador = listaCarga.map(x => x/15).reduce(soma,0)

		const listaNotas = Object.freeze(elementosDaTabela(tb, qtdLinhas).map(x => x[4]))

		const media = listaNotas.map((x, i) => x*(listaCarga[i])/15).reduce(soma,0) / denominador

		if(Number.isInteger(media)){
			document.getElementById('mediapch').innerHTML = media.toFixed(2)
		}else{
			document.getElementById('mediapch').innerHTML = '≅ '+media.toFixed(2)
		}
	}	
}

const dpMedia = () => {
	/*
		CALCULA O DESVIO PADRÃO EM RELAÇÃO À MÉDIA SIMPLES DAS NOTAS
	*/

	const tb = document.getElementById('tabela')
	const qtdLinhas = tb.rows.length

	if(qtdLinhas-1 == 0){
		alert('ERRO: Adicione alguma disciplina primeiro!')
	}else{

		const listaNotas = Object.freeze(elementosDaTabela(tb, qtdLinhas).map(x => x[4]))
		const media = listaNotas.reduce(soma,0)/listaNotas.length
		const variancia = listaNotas.reduce((acc,x)=>acc+((x-media)**2)/listaNotas.length,0)
		const desvioPadrao = Math.sqrt(variancia)

		if(Number.isInteger(desvioPadrao)){
			document.getElementById('dpmedia').innerHTML = desvioPadrao
		}else{
			document.getElementById('dpmedia').innerHTML = '≅ '+desvioPadrao.toFixed(4)
		}
	}
}

const mediapDEP = () =>{
	/*
		A MÉDIA PONDERADA É EM RELAÇÃO À CARGA HORÁRIA. INICIALMENTE SEPARA UMA
		LISTA COM CÓDIGO, CH E NOTA DE CADA MATÉRIA NA TABELA. DEPOIS SEPARA UMA
		LISTA PARA DEPARTAMENTOS IGUAIS (VERIFICANDO OS CÓDIGOS COM SIGLA IGUAIS,
		IGNORANDO OS NÚMEROS), REALIZA A MÉDIA PONDERADA DO DEPARTAMENTO E ADICIONA
		EM UMA LISTA FINAL. A ORDEM EXIBIDA DAS MÉDIAS SERÁ EM ORDEM DECRESCENTE.

	*/
	const tb = document.getElementById('tabela')
	const qtdLinhas = tb.rows.length

	if(qtdLinhas-1 == 0){
		alert('ERRO: Adicione alguma disciplina primeiro!')
	}else{
		
		const listaCodChNota = Object.freeze(elementosDaTabela(tb, qtdLinhas).map(x => [x[1], x[2], x[4]]))

		const gerarMediaDep = (lista, tratarCod, listaDep = [...new Set(lista.map(x => tratarCod(x[0])))], aux=0, listaDepMedia=[]) =>{
			if(aux<listaDep.length){
				const listaSoSigla = Object.freeze(lista.map(x => tratarCod(x[0])))
				const listaDepIguais = Object.freeze(lista.filter((x,i) => listaSoSigla[i]==listaDep[aux]))
				const denominador = listaDepIguais.map(x => x[1]/15).reduce(soma,0)
				const mediaDep = listaDepIguais.reduce((acc,x)=> acc + x[2]*(x[1]/15), 0)/denominador
				listaDepMedia.push([listaDep[aux], mediaDep])
				gerarMediaDep(lista, tratarCod, listaDep, aux+1, listaDepMedia)
			}
			return listaDepMedia
		}

		const listaDepMedia = Object.freeze(gerarMediaDep(listaCodChNota, tratarCodigo))
		const listaOrdenada = Object.freeze([...listaDepMedia].sort(ordenarRelColunaDecres(1)))
		const strMediasDep = listaOrdenada.map(x => x[0]+': '+x[1].toFixed(2)).join('<br><br>')

		document.getElementById('mediapdep').innerHTML = strMediasDep
	}
}