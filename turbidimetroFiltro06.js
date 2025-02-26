
// Variáveis globais

var client = null; // Cliente
var userId = null; // ID do usuário
var groupId = null; // ID do grupo
//var dashboardId = null; // ID do painel
//var graficoInterval = null; // Intervalo para atualização do gráfico
//var listaIdCssDisplay = []; // Lista de IDs para exibição CSS
//var listaIdCssChart = []; // Lista de IDs para gráfico CSS
//var listaChart = []; // Lista de gráficos
//var listaTable = []; // Lista de tabelas
//var modelChart = {}; // Modelo de gráfico
//var modelDisplay = {}; // Modelo de exibição

// DADOS CONEXÃO
var nome = "bro00200";

// TÓPICO DE SUBSCRIÇÃO
var application = "test_device";
var topicSubscription = application + "/uplink";

// Document ready
$(document).ready(function () {
    $('.app').show(); // Exibe a aplicação principal
    exibirIndex(); // Exibe a tela principal diretamente ao abrir a página
    setInterval(atualizarHora, 1000); // Atualiza a hora a cada segundo
   
});


// Botão de fechar modal clicado
$('.modal-fechar').click(function () {
    fecharModalIntermediario(); // Fecha o modal intermediário
    fecharModalConfirmacao(); // Fecha o modal de confirmação
});

// Botão "Confirmar Saida" clicado
$('#btnConfirmarSaida').click(function () {
    sessionStorage.clear(); // Limpa os dados da sessão
    location.reload(); // Recarrega a página
    exibirIndex(); // Exibe a tela de login
});

// Botão "Cancelar Saida" clicado
$('#btnCancelarSaida').click(function () {
    fecharModalConfirmacao(); // Fecha o modal de confirmação
});



// Função para solicitar a localização
function solicitarLocalizacao() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                console.log("Latitude: " + position.coords.latitude);
                console.log("Longitude: " + position.coords.longitude);
            },
            function(error) {
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        console.log("Usuário negou a solicitação de geolocalização.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        console.log("Informações de localização indisponíveis.");
                        break;
                    case error.TIMEOUT:
                        console.log("A solicitação de localização expirou.");
                        break;
                    case error.UNKNOWN_ERROR:
                        console.log("Ocorreu um erro desconhecido.");
                        break;
                }
            }
        );
    } else {
        console.log("Geolocalização não é suportada por este navegador.");
    }
}
// Mapeamento de icones da API para icones personalizados
const iconMap = {
    '01d': 'https://conatus-site-assets.s3.amazonaws.com/images/Tempo_Sol_ensolarado.svg',       // ceu_limpo durante o dia
    '01n': 'https://conatus-site-assets.s3.amazonaws.com/images/Tempo_ceu_Limpo.svg',       // ceu_limpo durante a noite
    '02d': 'https://conatus-site-assets.s3.amazonaws.com/images/Tempo_Sol_entre_nuvens.svg',   // poucas nuvens durante o dia
    '02n': 'https://conatus-site-assets.s3.amazonaws.com/images/Tempo_ceu_entre_nuvens_noite.svg',   // poucas nuvens durante a noite
    '03d': 'https://conatus-site-assets.s3.amazonaws.com/images/Tempo_Sol_entre_nuvens.svg',   // nuvens dispersas durante o dia
    '03n': 'https://conatus-site-assets.s3.amazonaws.com/images/Tempo_ceu_entre_nuvens_noite.svg',   // nuvens dispersas durante a noite
    '04d': 'https://conatus-site-assets.s3.amazonaws.com/images/Tempo_Sol_ensolarado.svg',       // ceu_limpo durante o dia
    '04n': 'https://conatus-site-assets.s3.amazonaws.com/images/Tempo_ceu_entre_nuvens_noite.svg',   // nublado durante a noite
    '09d': 'https://conatus-site-assets.s3.amazonaws.com/images/Tempo_Sol_com_pouca_chuva_isolada.svg',     // _chuva_leve durante o dia
    '09n': 'https://conatus-site-assets.s3.amazonaws.com/images/Tempo_Noite_con_pouca_chuva_isolada.svg',     // _chuva_leve durante a noite
    '10d': 'https://conatus-site-assets.s3.amazonaws.com/images/Tempo_Sol_com_chuva_isolada.svg',     // _chuva_moderada durante o dia
    '10n': 'https://conatus-site-assets.s3.amazonaws.com/images/Tempo_Noite_com_chuva_isolada.svg',     // _chuva_moderada durante a noite
    '11d': 'https://conatus-site-assets.s3.amazonaws.com/images/Tempo_Tempestade_isolada.svg',  // trovoada durante o dia
    '11n': 'https://conatus-site-assets.s3.amazonaws.com/images/Tempo_Tempestade_isolada-1.svg',  // trovoada durante a noite
    '13d': 'https://conatus-site-assets.s3.amazonaws.com/images/neve.svg',      // neve durante o dia
    '13n': 'https://conatus-site-assets.s3.amazonaws.com/images/neve.svg',      // neve durante a noite
    '50d': 'https://conatus-site-assets.s3.amazonaws.com/images/nevoa.svg',     // nevoeiro durante o dia
    '50n': 'https://conatus-site-assets.s3.amazonaws.com/images/nevoa.svg'      // nevoeiro durante a noite
};



//TÓPICOS ASSOCIADOS
function buildAssociatedTopics(messageContent) {
    return Object.keys(messageContent).reduce((acc, key) => {
        switch (key) {
            case "lei1":
                acc.push({
                    "id": "display001",
                    "topico": topicSubscription,
                    "tipo": "display",
                    "formato": "lei1"
                });
                acc.push({
                    "id": "chart001",
                    "topico": topicSubscription,
                    "tipo": "chart",
                    "formato": "lei1"
                });
                break;
            case "rssi":
                // utilizado para tratamento de dados
                acc.push({
                    "id": "chart002",
                    "topico": topicSubscription,
                    "tipo": "chart",
                    "formato": "rssi"
                });
                acc.push({
                    "id": "display002",
                    "topico": topicSubscription,
                    "tipo": "display",
                    "formato": "rssi"
                });
                break;
            case "snr":
                acc.push({
                     "id": "chart003",
                    "topico": topicSubscription,
                    "tipo": "chart",
                    "formato": "snr"
                });
                acc.push({
                    "id": "display003",
                    "topico": topicSubscription,
                    "tipo": "display",
                    "formato": "snr"
                });
                break;
        }
        return acc;
    }, []);
}

//INSTANCIAR will topic e pegar mensagens do mqtt
var last_will = new Paho.MQTT.Message("0");
last_will.destinationName = nome + "/status";
last_will.qos = 1;
last_will.retained = true;

let associatedTopics = [];

// ALTERADO
function p4(){} 
p4.sign = function(key, msg) { 
    const hash = CryptoJS.HmacSHA256(msg, key); 
    return hash.toString(CryptoJS.enc.Hex); 
}; 
p4.sha256 = function(msg) { 
    const hash = CryptoJS.SHA256(msg); 
    return hash.toString(CryptoJS.enc.Hex); 
}; 
p4.getSignatureKey = function(key, dateStamp, regionName, serviceName) { 
    const kDate = CryptoJS.HmacSHA256(dateStamp, 'AWS4' + key); 
    const kRegion = CryptoJS.HmacSHA256(regionName, kDate); 
    const kService = CryptoJS.HmacSHA256(serviceName, kRegion); 
    const kSigning = CryptoJS.HmacSHA256('aws4_request', kService); 
    return kSigning; 
};


function getEndpoint() { 
    // WARNING!!! It is not recommended to expose 
    // sensitive credential information in code. 
    // Consider setting the following AWS values 
    // from a secure source. 
    
    // example: us-east-1 
    const REGION = "us-east-1";   
    // example: blahblahblah-ats.iot.your-region.amazonaws.com 
    const IOT_ENDPOINT = "a1e5v465mis8zc-ats.iot.us-east-1.amazonaws.com";  
    // your AWS access key ID 
    const KEY_ID = "AKIA3GAO3RT2WVPPEZFB"; 
    // your AWS secret access key 
    const SECRET_KEY = "tmn0pW1zp7wg2yKF0r0h1bWCujK/cAyLKUeljoMQ"; 

    // date & time 
    const dt = (new Date()).toISOString().replace(/[^0-9]/g, ""); 
    const ymd = dt.slice(0,8); 
    const fdt = `${ymd}T${dt.slice(8,14)}Z` 
    
    const scope = `${ymd}/${REGION}/iotdevicegateway/aws4_request`; 
    const ks = encodeURIComponent(`${KEY_ID}/${scope}`); 
    let qs = `X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=${ks}&X-Amz-Date=${fdt}&X-Amz-SignedHeaders=host`; 
    const req = `GET\n/mqtt\n${qs}\nhost:${IOT_ENDPOINT}\n\nhost\n${p4.sha256('')}`; 
    qs += '&X-Amz-Signature=' + p4.sign( 
        p4.getSignatureKey( SECRET_KEY, ymd, REGION, 'iotdevicegateway'), 
        `AWS4-HMAC-SHA256\n${fdt}\n${scope}\n${p4.sha256(req)}`
    ); 
    console.log(`wss://${IOT_ENDPOINT}/mqtt?${qs}`)
    return `wss://${IOT_ENDPOINT}/mqtt?${qs}`; 
}
// ALTERADO 

//CLIENT ID
function getId() {
    var min = 500;
    var max = 599;
    var numero =  Math.random() * (max - min) + min;
    console.log(nome + " " + String(numero));
    return (nome + String(numero))
}

//INSTANCIAR CONEXÃO MQTT
client = new Paho.MQTT.Client(getEndpoint(), getId());

// Configura um temporizador para verificar se uma nova mensagem foi recebida dentro de um determinado período
//RETORNO DA CHAMADA
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;


//CONECTAR
client.connect({
    onSuccess:onConnect,
    useSSL: true, 
    timeout: 3, 
    mqttVersion: 4, 
    willMessage: last_will,
    reconnect : true,
    //reconnectInterval: 10
    //https://github.com/eclipse/paho.mqtt.javascript/issues/48
});


//ONCONNECT
function onConnect() {
    console.log("Connected");
    client.subscribe(nome + "/#");
    client.subscribe(topicSubscription);
    console.log("Associated Topic: " + topicSubscription);
    message = new Paho.MQTT.Message("1");
    message.destinationName = nome + "/status";
    client.send(message);
}

//ONCONNECTIONLOST
function onConnectionLost(error) {
  
}



// Função que recebe a mensagem MQTT
function onMessageArrived(message) {
    console.log("Topic: " + message.destinationName + "," + " Message: " + message.payloadString);
    if (message.destinationName == topicSubscription) {
        const treatedMessage = treatMessage(message.payloadString);
        console.log("Treated Message: ", treatedMessage);
        associatedTopics = buildAssociatedTopics(treatedMessage);
        console.log("Associated Topics: ", associatedTopics);
        for (indice in associatedTopics) {
            if (associatedTopics[indice].topico.includes(message.destinationName)) {
                console.log("id: " + associatedTopics[indice].id + ", Type: " + associatedTopics[indice].tipo);
                // Agora a função também vai atualizar os gráficos, além dos displays
                tratarTopicoAssociado(associatedTopics[indice], treatedMessage);
            }
        }
    }
}
// TRATAR MENSAGEM
function treatMessage(message) {
    try {
        console.log("Message: " + message);
        const json = JSON.parse(message); // Convertendo a string JSON em um objeto JSON

        const values = {};
        const dataString = json.data; // Obtendo a string contida na propriedade "data"

        if (!dataString) {
            return message;
        }

        // Dividindo a string "data" em pares chave-valor e armazenando-os em um objeto
        dataString.split(",").forEach(pair => {
            const [key, value] = pair.split(":"); // Corrigir para ":"
            values[key] = parseFloat(value); // Convertendo o valor para número
        });

        return values;
    } catch (e) {
        console.log("Message: " + message);
        console.log("Error: " + e);
        debugger;
    }
}




/*
function treatMessage(message) {
	try{
        console.log("Message: " + message)
        console.log("Raw Message: ", message.payloadString);

        const json = JSON.parse(message); // Convertendo a string JSON em um objeto JSON
    
        const values = {};
        const dataString = json.data; // Obtendo a string contida na propriedade "data"
    
        if(!dataString){
            return message
        }

        // Dividindo a string "data" em pares chave-valor e armazenando-os em um objeto
        dataString.split(",").forEach(pair => {
            const [key, value] = pair.split("=");
            values[key] = parseFloat(value); // Convertendo o valor para número, se necessário
        });
        return values;
    }catch(e){
        console.log("Message: " + message)
        console.log("Error: " + e)
        debugger
    }
}
*/












function tratarTopicoAssociado(topicInfo, mensagem) {
    const id = topicInfo.id;
    const tipo = topicInfo.tipo;
    const formato = topicInfo.formato;

    // Se for um display
    if (tipo === "display") {
        switch (formato) {
            case "lei1":
                document.getElementById(id).innerHTML = mensagem.lei1;
                // Atualiza o gráfico correspondente (chart001 para lei1)
                updateDisplayAndChart(charts.chart001, mensagem.lei1);
                break;
            case "rssi":
                document.getElementById(id).innerHTML = mensagem.rssi;
                // Atualiza o gráfico correspondente (chart002 para rssi)
                updateDisplayAndChart(charts.chart002, mensagem.rssi);
                break;
            case "snr":
                document.getElementById(id).innerHTML = mensagem.snr;
                // Atualiza o gráfico correspondente (chart003 para snr)
                updateDisplayAndChart(charts.chart003, mensagem.snr);
                break;
            default:
                console.log("Formato não reconhecido:", formato);
        }
    }
}













/*******************************************************************************************************************/ 

/*******************************************************************************************************************/ 

/*******************************************************************************************************************/ 



// Função para exibir o modal intermediário ao clicar no Botao "btnLogout"
function exibirModalIntermediario() {
    document.getElementById('modalIntermediario').style.display = 'block'; // Exibe o modal intermediário alterando o estilo para 'block'
}

// Função para fechar o modal intermediário
function fecharModalIntermediario() {
    document.getElementById('modalIntermediario').style.display = 'none'; // Oculta o modal intermediário alterando o estilo para 'none'
}

// Função para exibir o modal principal de confirmação ao clicar no Botao "Sair"
function exibirModalConfirmacao() {
    fecharModalIntermediario(); // Fecha o modal intermediário
    document.getElementById('modalConfirmacao').style.display = 'block'; // Exibe o modal de confirmação alterando o estilo para 'block'
}

// Função para fechar o modal principal de confirmação
function fecharModalConfirmacao() {
    document.getElementById('modalConfirmacao').style.display = 'none'; // Oculta o modal de confirmação alterando o estilo para 'none'
}

// Adiciona o evento de clique ao elemento que cobre toda a tela, exceto o modal intermediário
window.onclick = function(event) {
    if (event.target.classList.contains('modal-overlay') && event.target.id === 'modalIntermediario') {
        fecharModalIntermediario(); // Fecha o modal intermediário se o clique ocorrer fora dele
    }
}




async function fetchWeather(latitude, longitude) {
    const apiKey = 'c78dcbf0f35de00ae56ffe7cc5d35883';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=pt_br&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        const cidadeElemento = document.getElementById('cidade');
        const weatherIconElement = document.getElementById('weather-icon');
        const temperaturaElemento = document.getElementById('temperatura');
        const pressaoUmidadeElemento = document.getElementById('pressao-umidade');

        cidadeElemento.textContent = data.name;

        // Obtém o ícone personalizado mapeado
        const iconCode = data.weather[0].icon;
        const customIcon = iconMap[iconCode] || 'https://conatus-site-assets.s3.amazonaws.com/images/default.svg'; // Use 'default.svg' se o ícone não estiver no mapa
        weatherIconElement.src = customIcon;
        weatherIconElement.alt = data.weather[0].description;

        temperaturaElemento.textContent = `${Math.round(data.main.temp)}°C`;
        
        // Atualize o conteúdo de pressão e umidade com ícone de gota
        pressaoUmidadeElemento.innerHTML = `${data.main.pressure} hPa     ${data.main.humidity}% <img src="https://conatus-site-assets.s3.amazonaws.com/images/gotinha.svg" alt="Umidade" style="width: 16px; height: 16px;">`;

    } catch (error) {
        console.error('Erro ao buscar dados climáticos:', error);
    }
}

function getLocationAndFetchWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            fetchWeather(latitude, longitude);
        }, error => {
            console.error('Erro ao obter localização:', error);
        });
    } else {
        console.error('Geolocalização não é suportada pelo seu navegador.');
    }
}

// Chame a função para obter a localização e buscar o clima
getLocationAndFetchWeather();


// Função para solicitar a permissão de localização e buscar o clima
function askForLocationPermission() {
    const userConfirmed = confirm("Podemos usar sua localização para fornecer a previsão do tempo?");
    if (userConfirmed) {
        getLocationAndFetchWeather();
    }
}

// Atrasar a solicitação de permissão de localização em 2 segundos após o carregamento completo da página
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(askForLocationPermission, 2000);
});


// Chama a função para pedir permissão ao carregar a página
window.onload = askForLocationPermission;
window.onload = function() {
    initializeCharts(); // Inicializa os gráficos
};
$(function() {
    const dateElement = $('#date');

    function updateDateTime() {
        const now = new Date();
        const day = now.getDate();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        // Obter o dia da semana (0 = Domingo, 1 = Segunda, ..., 6 = Sábado)
        const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const dayOfWeek = daysOfWeek[now.getDay()];

        const formattedDateTime = `${dayOfWeek}. ${day}/${month}/${year} | ${hours}:${minutes} <img src="https://conatus-site-assets.s3.amazonaws.com/images/relogio_mini_clima.svg" alt="icone de relogio" style="width: 16px; height: 16px;">`;
        
        // Use .html() para inserir HTML no elemento
        dateElement.html(formattedDateTime);
    }

    // Chama a função inicialmente para exibir a data e hora atual
    updateDateTime();
    // Define um intervalo para atualizar a cada segundo
    setInterval(updateDateTime, 1000);
});


document.addEventListener("DOMContentLoaded", function() {
    const btnShowHistorico = document.getElementById('selectHistorico');
    const modalHistorico = document.querySelector('.modal-historico');
    const overlayHistorico = document.querySelector('.modal-overlay-historico');
    const checkboxHistorico = document.querySelector('.checkbox-data-historico .checkbox');
    const selectsFinalDataHistorico = document.querySelectorAll('.selecao-data .select-group:nth-child(2) .selecao-historico');
    const selectsFinalHoraHistorico = document.querySelectorAll('.selecao-hora .select-group:nth-child(2) .selecao-historico');

    // Função para mostrar o modal e overlay
    function showHistoricoModal() {
        modalHistorico.style.display = 'block';
        overlayHistorico.style.display = 'block';
    }

    // Função para ocultar o modal e overlay
    function hideHistoricoModal() {
        modalHistorico.style.display = 'none';
        overlayHistorico.style.display = 'none';
    }

    // Função para verificar se o clique foi fora do modal
    function outsideClickHistorico(e) {
        if (e.target === overlayHistorico) {
            hideHistoricoModal();
        }
    }

    // Função para atualizar os selects finais_com_a data e hora atuais
    function updateHistoricoSelects() {
        if (checkboxHistorico.checked) {
            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleDateString('pt-BR');
            const formattedTime = currentDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

            selectsFinalDataHistorico.forEach(select => {
                select.innerHTML = `<option class="options-historico">${formattedDate}</option>`;
            });

            selectsFinalHoraHistorico.forEach(select => {
                select.innerHTML = `<option class="options-historico">${formattedTime}</option>`;
            });
        }
    }

    // Event listeners
    btnShowHistorico.addEventListener('click', showHistoricoModal);
    window.addEventListener('click', outsideClickHistorico);
    checkboxHistorico.addEventListener('change', updateHistoricoSelects);

    // Ocultar o modal e overlay inicialmente
    hideHistoricoModal();
});

function exibirModalFilter() {    
    $('#modal-filter').css({ "display": "block" });   
}

function salvarModalFilter() {    
    $('#modal-filter').css({ "display": "none" });   
}

function fecharModalFilter() {    
    $('#modal-filter').css({ "display": "none" });   
} 

function formatarDataParaString(datetime) {
    const newDatetime = new Date(datetime);

    // Obter componentes da data   
    const diaSemana = obterNomeDiaSemana(newDatetime.getDay());
    const dia = concatenaZero(newDatetime.getDate());
    const mes = concatenaZero(newDatetime.getMonth() + 1); // Os meses começam do zero
    const hora = concatenaZero(newDatetime.getHours());
    const minutos = concatenaZero(newDatetime.getMinutes());
    const segundos = concatenaZero(newDatetime.getSeconds());
  
    // Formatar a string final
    return `${diaSemana}. ${dia}/${mes} | ${hora}:${minutos}:${segundos}`;  
}

function obterNomeDiaSemana(diaSemana) {
    const diasSemana = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
    return diasSemana[diaSemana];
}


function atualizarHora() {
    // lógica da função
}



/*******************************************************************************************************************/ 

/*******************************************************************************************************************/ 

/*******************************************************************************************************************/ 
// Função para inicializar os gráficos
function initializeCharts() {
    const chartOptions = {
        type: 'line',
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // Esconder a legenda
                }
            },
            scales: {
                x: {
                    display: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    },
                    ticks: {
                        color: 'white' // Cor branca para os textos do eixo X
                    }
                },
                y: {
                    display: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    },
                    ticks: {
                        color: 'white' // Cor branca para os textos do eixo Y
                    }
                }
            }
        }
    };

    const ct = document.getElementById('chart001')?.getContext('2d');
    if (ct) {
        charts.chart001 = new Chart(ct, {
            ...chartOptions,
            data: {
                labels: [], // Eixo X
                datasets: [{
                    label: 'Lei1 Data',
                    data: [], // Dados iniciais
                    borderColor: 'white', // Cor da linha
                    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Cor do ponto
                    borderWidth: 1
                }]
            }
        });
    }

    const ctx = document.getElementById('chart002')?.getContext('2d');
    if (ctx) {
        charts.chart002 = new Chart(ctx, {
            ...chartOptions,
            data: {
                labels: [], // Eixo X
                datasets: [{
                    label: 'RSSI',
                    data: [], // Dados iniciais
                    borderColor: 'white', // Cor da linha
                    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Cor do ponto
                    borderWidth: 1
                }]
            }
        });
    }

    const ctxx = document.getElementById('chart003')?.getContext('2d');
    if (ctxx) {
        charts.chart003 = new Chart(ctxx, {
            ...chartOptions,
            data: {
                labels: [], // Eixo X
                datasets: [{
                    label: 'SNR',
                    data: [], // Dados iniciais
                    borderColor: 'white', // Cor da linha
                    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Cor do ponto
                    borderWidth: 1
                }]
            }
        });
    }
}

// Chama esta função ao inicializar a página
initializeCharts();

// Função para atualizar o display e o gráfico
function updateDisplayAndChart(chart, value) {
    if (!chart) return; // Verifica se o gráfico existe antes de tentar atualizar

    // Limita o gráfico a 10 pontos (remove os mais antigos quando atingir 10)
    if (chart.data.labels.length >= 10) {
        chart.data.labels.shift(); // Remove o primeiro rótulo do eixo X
        chart.data.datasets.forEach(dataset => {
            dataset.data.shift(); // Remove o primeiro dado da série
        });
    }

    // Adiciona o horário atual e o novo valor ao gráfico
    chart.data.labels.push(new Date().toLocaleTimeString());
    chart.data.datasets.forEach(dataset => {
        dataset.data.push(value); // Adiciona o novo valor ao gráfico
    });

    // Atualiza o gráfico com os novos dados
    chart.update();
}
//TÓPICOS ASSOCIADO
/*
function buildAssociatedTopics(messageContent) {
    return Object.keys(messageContent).reduce((acc, key) => {
        switch (key) {
            case "lei001":
                acc.push({
                    "id": "display002",  // Identificador de classe
                    "topico": topicSubscription,
                    "tipo": "display",
                    "formato": "lei001"
                });
                acc.push({
                    "id": "chart001",  // Identificador de classe
                    "topico": topicSubscription,
                    "tipo": "chart",
                    "formato": "lei001"
                });
                break;
            case "lei003":
                acc.push({
                    "id": "display004",  // Identificador de classe
                    "topico": topicSubscription,
                    "tipo": "display",
                    "formato": "lei003"
                });
                acc.push({
                    "id": "chart002",  // Identificador de classe
                    "topico": topicSubscription,
                    "tipo": "chart",
                    "formato": "lei003"
                });
                break;
            case "lei004":
                acc.push({
                    "id": "display001",  // Identificador de classe
                    "topico": topicSubscription,
                    "tipo": "display",
                    "formato": "lei004"
                });
                acc.push({
                    "id": "chart003",  // Identificador de classe
                    "topico": topicSubscription,
                    "tipo": "chart",
                    "formato": "lei004"
                });
                break;
            case "lei005":
                acc.push({
                    "id": "display003",  // Identificador de classe
                    "topico": topicSubscription,
                    "tipo": "display",
                    "formato": "lei001|lei005"
                });
                break;
            case "rssi":
                acc.push({
                    "id": "chart004",  // Identificador de classe
                    "topico": topicSubscription,
                    "tipo": "chart",
                    "formato": "rssi"
                });
                acc.push({
                    "id": "display005",  // Identificador de classe
                    "topico": topicSubscription,
                    "tipo": "display",
                    "formato": "rssi"
                });
                break;
            case "snr":
                acc.push({
                    "id": "chart005",  // Identificador de classe
                    "topico": topicSubscription,
                    "tipo": "chart",
                    "formato": "snr"
                });
                acc.push({
                    "id": "display006",  // Identificador de classe
                    "topico": topicSubscription,
                    "tipo": "display",
                    "formato": "snr"
                });
                break;
        }
        return acc;
    }, []);
}
*/

// TRATAR TÓPICO ASSOCIADO
/*
function tratarTopicoAssociado({ id, tipo, formato }, treatedMsg) {
    let value;
    if (tipo === "display") {
        switch (formato) {
            case "lei004":
                value = (treatedMsg.lei004 !== 0) ? "Funcionando" : "Parado";
                break;
            case "lei001":
                value = treatedMsg.lei001.toFixed(2).replace('.', ',');
                break;
            case "lei001|lei005":
                value = (treatedMsg.lei001 === treatedMsg.lei005) ? "Não" : "Sim";
                break;
            case "lei003":
                value = treatedMsg.lei003.toFixed(2).replace('.', ',');
                break;
            case "rssi":
                value = treatedMsg.rssi;
                break;
            case "snr":
                value = treatedMsg.snr.toFixed(2).replace('.', ',');
                break;
        }

        // Atualizar todos os elementos_com_a classe correspondente
        document.querySelectorAll(`.${id}`).forEach(element => {
            element.innerHTML = value;
        });
    } else if (tipo === "chart") {
        switch (formato) {
            case "lei001":
                value = treatedMsg.lei001.toFixed(2).replace('.', ',');
                break;
            case "lei003":
                value = treatedMsg.lei003.toFixed(2).replace('.', ',');
                break;
            case "lei004":
                value = treatedMsg.lei004.toFixed(2).replace('.', ',');
                break;
            case "rssi":
                value = treatedMsg.rssi.toFixed(0).replace('.', ',');
                break;
            case "snr":
                value = treatedMsg.snr.toFixed(2).replace('.', ',');
                break;
        }

        const numericValue = parseFloat(value.replace(',', '.'));

        document.querySelectorAll(`.${id}`).forEach(element => {
            element.innerHTML = value;
        });

        // Atualizar o gráfico correspondente
        if (charts[id]) {
            updateChart(charts[id], numericValue);
        }
    }
}*/



document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn-select-disp');
        
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove a classe 'selected' de todos os botões
            buttons.forEach(btn => btn.classList.remove('selected'));
        
            // Adiciona a classe 'selected' ao Botao clicado
            button.classList.add('selected');
        });
    });
});


$(document).ready(function() {
    $('#toggle-password').click(function() {
        // Alterna o tipo de input entre "password" e "text"
        const inputSenha = $('#senha');
        const olhoFechado = $('#olho-login-fechado');
        const olhoAberto = $('#olho-login-aberto');

        if (inputSenha.attr('type') === 'password') {
            inputSenha.attr('type', 'text'); // Mostra a senha
            olhoFechado.hide();
            olhoAberto.show();
        } else {
            inputSenha.attr('type', 'password'); // Oculta a senha
            olhoFechado.show();
            olhoAberto.hide();
        }
    });
});

$(document).ready(function() {
    $('#pilula1').click(function() {
        window.location.href = 'https://s3.us-east-1.amazonaws.com/site.vazao-aguabruta1-etamogimirim.com/vazaoAguaBruta01.html';
    });
    $('#pilula2').click(function() {
        window.location.href = 'https://s3.us-east-1.amazonaws.com/site.fluor-etamogimirim.com/fluor.html';
    });
    $('#pilula3').click(function() {
        window.location.href = 'https://s3.us-east-1.amazonaws.com/site.turbidimetro-bruta-etamogimirim.com/turbidimetroAguaBruta.html';
    });
    $('#pilula4').click(function() {
        window.location.href = 'https://s3.us-east-1.amazonaws.com/site.phmetro-bruta-etamogimirim.com/phmetroAguaBruta.html';
    });
    $('#pilula5').click(function() {
        window.location.href = 'https://s3.us-east-1.amazonaws.com/site.cloro-saidadecantador-etamogimirim.com/cloroSaidaDecantador.html';
    });
    $('#pilula6').click(function() {
        window.location.href = 'https://s3.us-east-1.amazonaws.com/site.gateways-etamogimirim.com/gateway.html';
    });

    $('#pilula7').click(function() {
        window.location.href = 'https://s3.us-east-1.amazonaws.com/site.turbidimetro-bruta-etamogimirim.com/turbidimetroAguaBruta.html';
    });
    $('#pilula8').click(function() {
        window.location.href = 'https://s3.us-east-1.amazonaws.com/site.turbidimetro-filtro01-etamogimirim.com/turbidimetroFiltro01.html';
    });
    $('#pilula9').click(function() {
        window.location.href = 'https://s3.us-east-1.amazonaws.com/site.turbidimetro-filtro02-etamogimirim.com/turbidimetroFiltro02.html';
    });
    $('#pilula10').click(function() {
        window.location.href = 'https://s3.us-east-1.amazonaws.com/site.turbidimetro-filtro03-etamogimirim.com/turbidimetroFiltro03.html';
    });
    $('#pilula11').click(function() {
        window.location.href = 'https://s3.us-east-1.amazonaws.com/site.turbidimetro-filtro04-etamogimirim.com/turbidimetroFiltro04.html';
    });
    $('#pilula12').click(function() {
        window.location.href = 'https://s3.us-east-1.amazonaws.com/site.turbidimetro-filtro05-etamogimirim.com/turbidimetroFiltro05.html';
    });

    $('#pilula13').click(function() {
        window.location.href = 'https://s3.us-east-1.amazonaws.com/site.turbidimetro-filtro06-etamogimirim.com/turbidimetroFiltro06.html';
    });
    $('#pilula14').click(function() {
        window.location.href = 'https://s3.us-east-1.amazonaws.com/site.turbidimetro-filtro07-etamogimirim.com/turbidimetroFiltro07.html';
    });
    $('#pilula15').click(function() {
        window.location.href = 'https://s3.us-east-1.amazonaws.com/site.turbidimetro-filtro08-etamogimirim.com/turbidimetroFiltro08.html';
    });
    $('#pilula16').click(function() {
        window.location.href = 'https://s3.us-east-1.amazonaws.com/site.turbidimetro-filtro09-etamogimirim.com/turbidimetroFiltro09.html';
    });
    $('#pilula17').click(function() {
        window.location.href = 'https://s3.us-east-1.amazonaws.com/site.turbidimetro-filtro10-etamogimirim.com/turbidimetroFiltro10.html';
    });
    $('#pilula18').click(function() {
        window.location.href = 'https://s3.us-east-1.amazonaws.com/site.turbidimetro-filtro11-etamogimirim.com/turbidimetroFiltro11.html';
    });
    $('#pilula19').click(function() {
        window.location.href = 'https://s3.us-east-1.amazonaws.com/site.turbidimetro-filtro12-etamogimirim.com/turbidimetroFiltro12.html';
    });
    $('#pilula20').click(function() {
        window.location.href = 'https://s3.us-east-1.amazonaws.com/site.turbidimetro-decantador01-etamogimirim.com/turbidimetroDecantador01.html';
    });
    $('#pilula21').click(function() {
        window.location.href = 'https://s3.us-east-1.amazonaws.com/site.turbidimetro-decantador02-etamogimirim.com/turbidimetroDecantador02.html';
    });
    $('#pilula22').click(function() {
        window.location.href = 'https://s3.us-east-1.amazonaws.com/site.turbidimetro-decantador03-etamogimirim.com/turbidimetroDecantador03.html';
    });
    $('#pilula23').click(function() {
        window.location.href = 'https://s3.us-east-1.amazonaws.com/site.turbidimetro-tratada-etamogimirim.com/turbidimetroAguaTratada.html';
    });
    

});
