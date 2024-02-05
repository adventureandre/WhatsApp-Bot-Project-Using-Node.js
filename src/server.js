const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const natural = require('natural');

const client = new Client();

// Utilize um conjunto para armazenar os números de telefone que já receberam a saudação
const saudacaoEnviada = new Set();

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Bot está online!');
});

client.on('message', async (message) => {
    console.log(`Mensagem recebida: ${message.body}`);
    console.log(saudacaoEnviada);

    // Verifica se a mensagem é de um chat privado (não é de um grupo)
    if (!message.isGroupMsg) {
        // Verifica se a saudação já foi enviada para esse número
        if (!saudacaoEnviada.has(message.from)) {
            await client.sendMessage(message.from, 'Bem-vindo à Oficina de Funilaria e Pintura! Como podemos ajudar você hoje?');
            saudacaoEnviada.add(message.from); // Adiciona o número à lista de saudações enviadas
            return;
        }

        // Lógica de atendimento para oficina de funilaria e pintura
        const respostaAutomatica = await getRespostaAutomatica(message.body);
        client.sendMessage(message.from, respostaAutomatica);
    }
});

client.initialize();

// Função para obter resposta automática com base na mensagem recebida
async function getRespostaAutomatica(mensagemRecebida) {
    const pedido = mensagemRecebida.toLowerCase();

    // Verifica se a mensagem contém uma variação de "orçamento"
    if (verificarSimilaridade(pedido, 'orçamento')) {
        return 'Para solicitar um orçamento, por favor, forneça detalhes sobre os serviços que você precisa.';
    } else if (pedido.includes('confirmar pedido')) {
        // Implemente a lógica para confirmar o pedido e processar as informações.
        return 'Seu pedido foi recebido! Em breve entraremos em contato para discutir os detalhes adicionais.';
    } else {
        return 'Como mais posso ajudar você?';
    }
}

// Função para verificar a similaridade entre duas palavras
function verificarSimilaridade(palavraDigitada, palavraCorreta) {
    const similarity = natural.JaroWinklerDistance(palavraDigitada, palavraCorreta);
    // Defina um limiar de similaridade
    const limiarSimilaridade = 0.8;

    return similarity >= limiarSimilaridade;
}
