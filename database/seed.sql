-- Inserir dados de teste na tabela de ambulantes
INSERT INTO ambulantes (nome_completo, cpf, data_nascimento, telefone, email, tipo_atividade, possui_mei, cnpj_mei) 
VALUES 
('João da Silva', '123.456.789-00', '1985-05-12', '(92) 99111-2222', 'joao.silva@email.com', 'Venda de Lanches e Salgados', TRUE, '12.345.678/0001-90'),
('Maria Oliveira', '987.654.321-11', '1990-08-20', '(92) 98888-7777', 'maria.oliveira@email.com', 'Comércio de Artesanato', FALSE, NULL);

-- Inserir pontos de venda de teste associados (ex: Centro de Manaus com coordenadas geográficas)
INSERT INTO pontos_venda (ambulante_id, descricao_local, bairro, geometria) 
VALUES 
(1, 'Próximo ao Mercado Municipal Adolpho Lisboa', 'Centro', ST_SetSRID(ST_MakePoint(-60.0232, -3.1302), 4326)),
(2, 'Praça da Matriz', 'Centro', ST_SetSRID(ST_MakePoint(-60.0217, -3.1317), 4326));