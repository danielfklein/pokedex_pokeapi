function buscaPokemon() {
    const pokemonInput = document.getElementById('pokemonInput').value;
    const buscaPokemonContainer = document.getElementById('buscaPokemon');

    buscaPokemonContainer.innerHTML = '';

    // Chama pokeAPI
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonInput.toLowerCase()}/`)
        .then(response => response.json())
        .then(data => {
            // Mostra detalhes
            const detalhes = `
                <h2>${data.name}</h2>
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png" alt="${data.name}" />
                <p>Altura: ${data.height/10} m</p>
                <p>Peso: ${data.weight/10} kg</p>
            `;
            buscaPokemonContainer.innerHTML = detalhes;
        })
        .catch(error => {
            //Mensagem de erro
            buscaPokemonContainer.innerHTML = '<p>Erro ao buscar informações do pokemon. Verifique se escreveu corretamente.</p>';
        });
}

// Variável para rastrear qual aba está ativa
let abaAtiva = 'all';

// Função para buscar Pokémon da região de Kanto
async function getKantoPokemon() {
    const kantoListContainer = document.getElementById('pokemonList');
    kantoListContainer.innerHTML = '';

    try {
        for (let i = 1; i <= 151; i++) {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
            const data = await response.json();

            const pokemonItem = document.createElement('div');
            pokemonItem.className = 'pokemon-item';
            pokemonItem.innerHTML = `
                <img src="${data.sprites.front_default}" alt="${data.name}" />
                <h3>${data.name}</h3>
                <p>ID: ${data.id}</p>
            `;
            kantoListContainer.appendChild(pokemonItem);
        }
    } catch (error) {
        console.error('Erro ao buscar os pokemons de Kanto:', error);
    }
}

// Função para buscar todos os Pokémon
function getAllPokemon() {
    const pokemonListContainer = document.getElementById('pokemonList');
    pokemonListContainer.innerHTML = '';

    const fetchPokemon = async (url) => {
        try {
            const response = await fetch(url);
            const data = await response.json();

            data.results.forEach(pokemon => {
                const pokemonItem = document.createElement('div');
                pokemonItem.className = 'pokemon-item';
                pokemonItem.innerHTML = `
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonId(pokemon.url)}.png" alt="${pokemon.name}" />
                    <h3>${pokemon.name}</h3>
                    <p>ID: ${getPokemonId(pokemon.url)}</p>
                `;
                pokemonListContainer.appendChild(pokemonItem);
            });

            // Verificar se há mais páginas
            if (data.next) {
                // Se houver mais páginas, buscar a próxima página
                await fetchPokemon(data.next);
            }
        } catch (error) {
            console.error('Erro na busca da lista de pokemon:', error);
        }
    };

    // Iniciar busca pela primeira página
    fetchPokemon('https://pokeapi.co/api/v2/pokemon');
}

// Função para exibir Pokémon com base na aba ativa
function mostraPokemonAba() {
    if (abaAtiva === 'all') {
        getAllPokemon();
    } else if (abaAtiva === 'kanto') {
        getKantoPokemon();
    }
}

// Função para alternar a aba ativa
function trocaAba(tab) {
    abaAtiva = tab;
    mostraPokemonAba();
}


// Função para obter o ID do Pokémon a partir da URL
function getPokemonId(url) {
    const parts = url.split('/');
    return parts[parts.length - 2];
}

// Função para filtrar a lista de Pokémon com base na pesquisa
function filterPokemonList() {
    const searchTerm = document.getElementById('pokemonSearch').value.toLowerCase();
    const pokemonItems = document.querySelectorAll('.pokemon-item');

    pokemonItems.forEach(item => {
        const pokemonName = item.innerText.toLowerCase();
        if (pokemonName.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Variável para rastrear se os Pokémon de Kanto já foram carregados
let kantoPokemonLoaded = false;

// Modificando a função showKantoPokemon para carregar Pokémon de Kanto apenas uma vez
async function showKantoPokemon() {
    abaAtiva = 'kanto';

    // Carregar Pokémon de Kanto apenas se ainda não foram carregados
    if (!kantoPokemonLoaded) {
        await getKantoPokemon();
        kantoPokemonLoaded = true;
    }

    mostraPokemonAba();
}


function showAllPokemon(){
    trocaAba('all');
}

// Função para obter dados detalhados de um Pokémon
async function getPokemonData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro na busca dos dados do pokemon:', error);
    }
}

// Chamar a função para buscar todos os Pokémon quando a página carrega
getAllPokemon();
