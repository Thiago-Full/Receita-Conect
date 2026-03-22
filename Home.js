// ==========================================
// 1. AS FERRAMENTAS GERAIS (Lá no topo)
// ==========================================
const telaNome = document.querySelector('.nome_receita');
const Receita = document.querySelector('.descricao_receita');
const caixa = document.querySelector('.result_busca');
const CaixaImg = document.querySelector('.imagem_receita');
const buscar = document.getElementById('buscabtn');

const menu = document.getElementById('menu');
const menuclick = document.getElementById('menu_hamburguer');

// ATENÇÃO AQUI: Como eu vi no seu CSS que você usou o ID #Como_usar pro botão, eu coloquei ele aqui pra não quebrar!
const modalSobre = document.getElementById('modal_sobre');
const btnAbrirSobre = document.getElementById('Como_usar'); 
const btnFecharSobre = document.getElementById('btn_fechar_sobre');


// ==========================================
// 2. O MENU HAMBURGUER
// ==========================================
menuclick.addEventListener("click", function Close(e) {
    menu.classList.toggle('ativo');
    
    // A Mútua Exclusão: Se abriu o menu, fecha os outros!
    caixa.classList.remove('ativo');
    modalSobre.classList.remove('ativo'); 
});


// ==========================================
// 3. O MOTOR DA BUSCA (API)
// ==========================================
// VARIÁVEIS PRA GUARDAR A BANDEJA DE RECEITAS
let listaDeReceitas = [];
let receitaAtual = 0; // Começa no índice 0

const btnProxima = document.getElementById('btn_proxima');
const btnAnterior = document.getElementById('btn_anterior');

// A FUNÇÃO QUE JOGA A RECEITA CERTA NA TELA
function mostrarReceitaNaTela(indice) {
    let comida = listaDeReceitas[indice];

    telaNome.innerText = comida.strMeal;
    
    let textoBruto = comida.strInstructions;
    let textoFormatado = textoBruto.replace(/\n/g, '<br><br>');
    Receita.innerHTML = textoFormatado;
    CaixaImg.src = comida.strMealThumb;

    // Controla se o botão "Anterior" aparece (esconde se for a primeira)
    if (indice === 0) {
        btnAnterior.style.display = 'none';
    } else {
        btnAnterior.style.display = 'block';
    }

    // Controla se o botão "Próxima" aparece (esconde se for a última)
    if (indice === listaDeReceitas.length - 1) {
        btnProxima.style.display = 'none';
    } else {
        btnProxima.style.display = 'block';
    }
}

// O NOVO MOTOR DE BUSCA
buscar.addEventListener("click", async function testarMotor() {
    const inputBusca = document.getElementById('BuscaReceita');
    const Busca = inputBusca.value.trim();

    if (Busca === "") {
        alert("Mano, a barra tá vazia! Digita algo primeiro.");
        return;
    }

    const linkDaApi = `https://www.themealdb.com/api/json/v1/1/search.php?s=${Busca}`;
    let resposta = await fetch(linkDaApi);
    let dados = await resposta.json();

    if (dados.meals == null) {
        alert("Corrija a escrita ou digite em inglês!");
        return;
    }

    // AQUI TÁ A MÁGICA: Guarda a lista toda e zera o contador!
    listaDeReceitas = dados.meals;
    receitaAtual = 0; 

    // Chama a função pra mostrar a primeira receita
    mostrarReceitaNaTela(receitaAtual);

    caixa.classList.add('ativo');
    menu.classList.remove('ativo'); 
    modalSobre.classList.remove('ativo'); 
});

// CLICOU EM PRÓXIMA
btnProxima.addEventListener('click', function() {
    if (receitaAtual < listaDeReceitas.length - 1) {
        receitaAtual++; // Pula pra próxima
        mostrarReceitaNaTela(receitaAtual);
        Receita.scrollTop = 0; // Joga a barra de rolagem do texto pro topo de novo!
    }
});

// CLICOU EM ANTERIOR
btnAnterior.addEventListener('click', function() {
    if (receitaAtual > 0) {
        receitaAtual--; // Volta pra anterior
        mostrarReceitaNaTela(receitaAtual);
        Receita.scrollTop = 0; // Joga a barra de rolagem do texto pro topo!
    }
});

// ==========================================
// 4. O MODAL DE "COMO USAR"
// ==========================================
btnAbrirSobre.addEventListener('click', function(e) {
    e.preventDefault(); // Impede do botão bugar a tela se tiver um link <a> dentro
    modalSobre.classList.add('ativo');

    // A Mútua Exclusão: Se abriu o modal, fecha os outros!
    menu.classList.remove('ativo'); 
    caixa.classList.remove('ativo'); 
});

// Fechar pelo botão vermelho
btnFecharSobre.addEventListener('click', function() {
    modalSobre.classList.remove('ativo');
});

// TRUQUE SÊNIOR: Fechar clicando no fundo escuro
modalSobre.addEventListener('click', function(e) {
    // Se o clique foi EXATAMENTE no fundo escuro (e não na caixa branca)
    if (e.target === modalSobre) {
        modalSobre.classList.remove('ativo');
    }
});


// ==========================================
// 5. O CLIQUE FANTASMA (Fechar clicando fora)
// ==========================================
document.addEventListener("click", function fechar(e) {
    // Se não clicou na caixa de receita E não clicou no botão de buscar -> Fecha a Receita
    if (!caixa.contains(e.target) && !buscar.contains(e.target)) {
        caixa.classList.remove('ativo');
    }

    // Se não clicou no menu E não clicou no hambúrguer -> Fecha o Menu
    if (!menu.contains(e.target) && !menuclick.contains(e.target)) {
        menu.classList.remove('ativo');
    }
});
