/*
* Algoritmo de Dijkstra
* Autor: Fábio Couto
* Data: 13/05/2016
* Referência: http://www.inf.ufsc.br/grafos/temas/custo-minimo/dijkstra.html
*/

//Definição de classe para representar os vértices do Grafo
function Vertice(nome) {
    this.Nome = nome;
    this.Estimativa = null;
    this.Precedente = null;
    this.Fechado = false;
    this.Sucessores = new Array();
};

//Retorna todos os vértices sucessores ao vértice atual, desde que estejam abertos
Vertice.prototype.ObterSucessoresAbertos = function () {
    return this.Sucessores.filter(function (v) { return !v.Vertice.Fechado; });
};

//Definição de classe para representar um vértice sucessor
function Sucessor(vertice, custo) {
    this.Vertice = vertice;
    this.Custo = custo;
};

//Definição de classe para armazenar o resultado do algoritmo de Dijkstra
function Resultado(caminho, custo) {
    this.CaminhoMaisCurto = caminho;
    this.CustoTotal = custo;
};

//Definição de classe para representar o Grafo
function Grafo() {
    this.Vertices = {};
};

//Adiciona um novo vértice ao Grafo
Grafo.prototype.AdicionarVertice = function (nome) {
    this.Vertices[nome] = new Vertice(nome);
};

//Retorna um vértice do Grafo a partir do nome
Grafo.prototype.ObterVertice = function (nome) {
    return this.Vertices[nome];
};

//Adiciona uma nova aresta bidirecional ao Grato
Grafo.prototype.AdicionarAresta = function (vA, vB, custo) {
    this.Vertices[vA].Sucessores.push(new Sucessor(this.Vertices[vB], custo));
    this.Vertices[vB].Sucessores.push(new Sucessor(this.Vertices[vA], custo));
};

//Remove/Limpa o valor de estimativa calculado para todos os vértices do Grafo
Grafo.prototype.LimparEstimativaDosVertices = function () {
    for (var key in this.Vertices) {
        this.Vertices[key].Estimativa = null;
        this.Vertices[key].Fechado = false;
    }
};

//Atribui o valor informado à todos os precedentes no Grafo
Grafo.prototype.AtribuirValorAosPrecedentes = function (valor) {
    for (var key in this.Vertices)
        this.Vertices[key].Precedente = valor;
};

//Verifica se existem vértices abertos no Grafo
Grafo.prototype.ExisteVerticeAberto = function () {
    for (var key in this.Vertices) {
        if (!this.Vertices[key].Fechado)
            return true;
    }
    return false;
};

//Retorna o vértice do grafo que esteja aberto, e possua a menor estimativa entre os demais vertices abertos
Grafo.prototype.ObterVerticeAbertoComMenorEstimativa = function () {
    var verticeFinal = null;
    for (var key in this.Vertices) {
        if (!this.Vertices[key].Fechado && this.Vertices[key].Estimativa != null) {
            if (verticeFinal == null)
                verticeFinal = this.Vertices[key];
            else if (this.Vertices[key].Estimativa < verticeFinal.Estimativa)
                verticeFinal = this.Vertices[key];
        }
    }
    return verticeFinal;
};

//Calcula o caminho mais curto entre os vértices informados utilizando o algoritmo de Dijkstra
Grafo.prototype.Dijkstra = function (vOrigem, vDestino) {

    //1. Atribua valor zero à estimativa do custo mínimo do vértice s (a raiz da busca) e infinito às demais estimativas; 
    this.LimparEstimativaDosVertices();
    this.ObterVertice(vOrigem).Estimativa = 0;

    //2. Atribua um valor qualquer aos precedentes (o precedente de um vértice t é o vértice que precede t no caminho de custo mínimo de s para t); 
    this.AtribuirValorAosPrecedentes(null);

    //3. Enquanto houver vértice aberto: 
    while (this.ExisteVerticeAberto()) {

        // - seja k um vértice ainda aberto cuja estimativa seja a menor dentre todos os vértices abertos; 
        var k = this.ObterVerticeAbertoComMenorEstimativa();

        // - feche o vértice k 
        k.Fechado = true;

        // - Para todo vértice j ainda aberto que seja sucessor de k faça: 
        var sucessores = k.ObterSucessoresAbertos();
        for (var i in sucessores) {

            var j = sucessores[i];

            // - some a estimativa do vértice k com o custo do arco que une k a j; 
            var estimativa = k.Estimativa + j.Custo;

            // - caso esta soma seja melhor que a estimativa anterior para o vértice j, substitua-a e anote k como precedente de j
            if (j.Vertice.Estimativa == null || estimativa < j.Vertice.Estimativa) {
                j.Vertice.Estimativa = estimativa;
                j.Vertice.Precedente = k.Nome;
            }
        }
    };

    //4. Apura o resultado calculado
    var vAtual = vDestino;
    var strCaminho = vAtual;
    var custo = this.ObterVertice(vDestino).Estimativa;

    while (vAtual != vOrigem) {
        var v = this.ObterVertice(vAtual);
        strCaminho = v.Precedente + " -> " + strCaminho;
        vAtual = v.Precedente;
    }

    //5. Retorna o resultado calculado!! \o/
    return new Resultado(strCaminho, custo);
};
