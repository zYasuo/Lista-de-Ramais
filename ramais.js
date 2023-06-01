$(document).ready(function() {
    //Definindo os Setores e o Range dos Ramais
    const departamentos = {
        "Diretoria": { min: 1001, max: 1005 },
        "Atendimento Comercial - Rio Claro": { min: 1101, max: 1119 },
        "Comercial BackOff - Rio Claro": { min: 1120, max: 1135 },
        "Contabilidade": { min: 1201, max: 1207 },
        "Departamento Pessoal": { min: 1241, max: 1241 },
        "RH": { min: 1242, max: 1243 },
        "Marketing": { min: 1321, max: 1322 },
        "SGI": { min: 1341, max: 1342 },
        "Qualidade": { min: 1330, max: 1330 },
        "Financeiro - Contas à Pagar": { min: 1501, max: 1504 },
        "Financeiro - Contas à Receber": { min: 1511, max: 1519 },
        "Cobrança": { min: 1520, max: 1525 },
        "Caixa": { min: 1531, max: 1531 },
        "NOC": { min: 1753, max: 1758 },
        "SYS / T.I": { min: 1711, max: 1712 },
        "Suporte N1": { min: 1821, max: 1829 },
        "Suporte N2": { min: 1882, max: 1882 },
        "Juridico": { min: 1901, max: 1901 },
        "Operacional": { min: 2601, max: 2601 },
        "Administrativo": { min: 2621, max: 2622 },
        "Frota": { min: 2651, max: 261 },
        "Almoxarifado": { min: 2681, max: 2683 },
        "Comercial - Ajapi": { min: 3101, max: 3101 },
        "Comercial - Santa Gertrudes": { min: 4101, max: 4101 },
        "Administrativo - Leme": { min: 5001, max: 5001 },
        "Comercial - Leme": { min: 5101, max: 5106 },
        "Comercial - Mogi Guaçu": { min: 6102, max: 6105 },
        "Comercial - Iturama": { min: 7121, max: 7121 },
        "Comercial - LMTE": { min: 7122, max: 7122 },
        "Comercial - CRNE": { min: 7124, max: 7124 },
    };
    

    //Estou dando o Ramal como argumento e com esse argumento eu defino em qual departamente o ramal pertence com um Loop para se repetir toda vez q um novo ramal é adicionado
    const getDepartamento = (ramal) => {
        for (let departamento in departamentos) {
            if (ramal >= departamentos[departamento].min && ramal <= departamentos[departamento].max) {
                //Se o ramal está dentro do departamento eu retorno aquele ramal
                return departamento;
            }
        }
        return "Ramal não encontrado";
    }


    const createTable = (departamento, response) => {
        let table = $("<table border='1'></table>");
        let thead = $("<thead></thead>");
        let tbody = $("<tbody></tbody>");

        thead.append(`<tr><th colspan='2'>${departamento}</th></tr>`);
        thead.append("<tr><th>Nome</th><th>Ramal</th></tr>");
        table.append(thead);

        let departamentoData = [];
        for (let i = 0; i < response.length; i++) {
            let nome = response[i].nome;
            let ramal = response[i].ramal;
            if (getDepartamento(ramal) === departamento) {
                // transforma o nome
                nome = nome.replace(/_/g, ' '); // substitui todos os sublinhados por espaços
                nome = nome.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' '); // transforma a primeira letra de cada palavra em maiúscula
                
                departamentoData.push({nome, ramal});
            }
        }

        // Ordena o departamentoData por ramal em ordem crescente
        departamentoData.sort((a, b) => a.ramal - b.ramal);

        for (let i = 0; i < departamentoData.length; i++) {
            let {nome, ramal} = departamentoData[i];
            let tr_str = `<tr>
                            <td align='center'>${nome}</td>
                            <td align='center'>${ramal}</td>
                          </tr>`;
            tbody.append(tr_str);
        }
        table.append(tbody);
        $('body').append(table);
        
    }

    $.ajax({
        url: 'php/returnRamais.php',
        type: 'get',
        dataType: 'JSON',
        success: function(response) {
            for (let departamento in departamentos) {
                createTable(departamento, response);
                
            }  
        }
    });

    $("#searchInput").on("keyup", function() {
        const value = $(this).val().toLowerCase();
        
        // Se a pesquisa foi apagada, remova a formatação e mostre todas as tabelas
        if (value === '') {
            $("table td").css('background-color', '').css('color', '').css('opacity', '');
            $("table").show();
            return;
        }
        
        $("table").each(function() {
            let found = false;
            $(this).find("tr").each(function() {
                // Verifica se a linha atual contém o valor pesquisado
                if ($(this).text().toLowerCase().indexOf(value) > -1) {
                    found = true;
                    // Encontra as células de nome e ramal nesta linha e aplica a formatação
                    $(this).find("td:nth-child(1), td:nth-child(2)").css('background-color', '#0388d4').css('color', 'white').css('opacity', '1');
                }
                else {
                    // Remove a formatação se a célula não corresponder à pesquisa
                    $(this).find("td:nth-child(1), td:nth-child(2)").css('background-color', '').css('color', '').css('opacity', '0.5');
                }
            });
            if (found) {
                $(this).stop(true, true).fadeIn().effect('slide', {direction: 'right'}, 500);
            } else {
                $(this).stop(true, true).fadeOut().hide('slide', {direction: 'left'}, 500);
            }
        });
    });
    
});
