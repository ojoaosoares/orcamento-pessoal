

class Despesa {
    constructor(ano,mes,dia,tipo,descricao,valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }


    validarDados() {
        for(let i in this) {

            if(!this[i]){
                return false
            }
        }

        return true
    }
}

class BD {

    constructor() {
        let id = localStorage.getItem('id')

        if(!id) {
            localStorage.setItem('id',0)
        }
    }

    getProximoID() {
        return Number(localStorage.getItem('id')) + 1
        
    }
    gravar(d) {
        
        let id = this.getProximoID()
        localStorage.setItem(id,JSON.stringify(d))

        localStorage.setItem('id',id)
    }

    recuperarTodosRegistros() {
        let despesas = Array()
        let id = localStorage.getItem("id")
        for(let i = 1; i <= id; i++){

            let despesa = JSON.parse(localStorage.getItem(i))
            if(!despesa)
            {
               continue 
            }
            despesa.id = i
            despesas.push(despesa)

            

        }

        
        return despesas
    }


    pesquisar(despesa) {
        
    
        let despesasFiltradas = this.recuperarTodosRegistros().filter(i => {
            if(i.ano != despesa.ano && despesa.ano != '') {
                return false
            }

            if(i.mes != despesa.mes && despesa.mes != '') {
                return false
            }

            if(i.dia != despesa.dia && despesa.dia != '') {
                return false
            }

            if(i.tipo != despesa.tipo && despesa.tipo!= '') {
                return false
            }

            if(i.descricao != despesa.descricao && despesa.descricao!= '') {
                return false
            }

            if(i.valor != despesa.valor && despesa.valor!= '') {
                return false
            }

            

            return true
        })
        console.log(despesa)
        console.log(despesasFiltradas)

        return despesasFiltradas

        
    }

    remover(id) {
        localStorage.removeItem(id)
    }
}


let bd = new BD()


function cadastrarDespesa() {
    let ano = window.document.getElementById('ano')
    let mes = window.document.getElementById('mes')
    let dia = window.document.getElementById('dia')
    let tipo = window.document.getElementById('tipo')
    let descricao = window.document.getElementById('descricao')
    let valor = window.document.getElementById('valor')


    let nova_despesa = new Despesa(ano.value,mes.value,dia.value,tipo.value,descricao.value,valor.value)
    
    if(nova_despesa.validarDados()) {
        bd.gravar(nova_despesa)

        ano.value = ''
        mes.value = ''
        dia.value =''
        tipo.value=''
        descricao.value = ''
        valor.value = ''
        
        criarModal('Registro inserido com sucesso','A despesa foi cadastrada com sucesso','Voltar',true)

        console.log('Dados válidos')
        $("#modalRegistroDespesa").modal('show')

        
    }


    else {

        criarModal('Erro na gravação','Existem campos obrigatórios que não foram preenchidos','Voltar e corrigir',false)

        console.log('Dados inválidos')
        $("#modalRegistroDespesa").modal('show')
       
    }
    
}



function criarModal(textoTitulo,textoCorpo,textoBotao, valorBool) {

        let modal_header = window.document.querySelector(".modal-header")
        let modal_titulo = window.document.querySelector(".modal-header h5")
        let modal_body = window.document.querySelector('.modal-body')
        let botao = window.document.querySelector('#modalRegistroDespesa .modal-footer .btn')

        modal_titulo.innerHTML = textoTitulo
        modal_body.innerHTML = textoCorpo
        botao.innerHTML = textoBotao
        
        if(valorBool) {
            modal_header.classList.remove('text-danger')
            modal_header.classList.add('text-success')
            botao.classList.remove('btn-danger')
            botao.classList.add('btn-success')
        }


        else {
            modal_header.classList.add('text-danger')
            modal_header.classList.remove('text-success')
            botao.classList.add('btn-danger')
            botao.classList.remove('btn-success')
        }
        
        

        
}



function carregaListaDespesas(despesas = bd.recuperarTodosRegistros()) {
        
    
    let listaDespesas = window.document.getElementById("listaDespesas")
    listaDespesas.innerHTML = ''
    let total = 0

    despesas.forEach(i => {
        console.log(i)
        let tabelaLinha = listaDespesas.insertRow()

        total += Number(i.valor)

        tabelaLinha.insertCell(0).innerText = `${i.dia}/${i.mes}/${i.ano}`

        let tabelaTipo = window.document.createElement("td")
        switch(Number(i.tipo)) {
            case (1) :
                tabelaTipo.innerText = 'Alimentação' 
                break
            case (2) :
                tabelaTipo.innerText = 'Educação' 
                break
            case (3) :
                tabelaTipo.innerText = 'Lazer' 
                break
            case (4) :
                tabelaTipo.innerText = 'Saúde' 
                break
            case (5) :
                tabelaTipo.innerText = 'Transporte' 
                break

        }
        tabelaLinha.appendChild(tabelaTipo)

        tabelaLinha.insertCell(2).innerText = i.descricao


        tabelaLinha.insertCell(3).innerText = `R$${i.valor}`
        

        let btn = window.document.createElement("btn")
        btn.className = 'btn btn-danger'
        btn.id = `id_despesa_${i.id}`
        btn.innerHTML = '<i class="fas fa-times"> </i>'
        btn.onclick = function removerDespesa() {
            bd.remover(this.id.replace('id_despesa_',''))
            criarModal('Despesa removida','A despesa selecionada foi removida com sucesso','Voltar', false)
            $("#modalRegistroDespesa").modal('show')
            carregaListaDespesas()
        }
        tabelaLinha.insertCell(4).appendChild(btn)
        

    })

    let tabela = listaDespesas.insertRow()
    let coluna = window.document.createElement('th')
    coluna.setAttribute('colspan','3')
    
    tabela.appendChild(coluna)
    coluna.style.textAlign = 'right'
    coluna.innerHTML = 'Total :'

    coluna = window.document.createElement('td')
    tabela.appendChild(coluna)
    coluna.setAttribute('colspan','2')
    coluna.innerHTML = `R$${total}`
    

    
  

}


function pesquisarDespesas() {
    console.log("Pesquisou")

    let ano = window.document.getElementById('ano').value
    let mes = window.document.getElementById('mes').value
    let dia = window.document.getElementById('dia').value
    let tipo = window.document.getElementById('tipo').value
    let descricao = window.document.getElementById('descricao').value
    let valor = window.document.getElementById('valor').value

    let despesa = new Despesa(ano,mes,dia,tipo,descricao,valor)
    
    
    
    carregaListaDespesas(bd.pesquisar(despesa))

    
   
    

    
}


