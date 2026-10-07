-- Ativar a extensão PostGIS para dados geográficos
CREATE EXTENSION IF NOT EXISTS postgis;

-- Tabela de Ambulantes (Dados cadastrais e formalização MEI)
CREATE TABLE IF NOT EXISTS ambulantes (
    id SERIAL PRIMARY KEY,
    nome_completo VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    data_nascimento DATE NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(100),
    tipo_atividade VARCHAR(100),
    possui_mei BOOLEAN DEFAULT FALSE,
    cnpj_mei VARCHAR(20),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Pontos de Venda / Localizações (utilizando PostGIS)
CREATE TABLE IF NOT EXISTS pontos_venda (
    id SERIAL PRIMARY KEY,
    ambulante_id INT REFERENCES ambulantes(id) ON DELETE CASCADE,
    descricao_local VARCHAR(255),
    bairro VARCHAR(100),
    -- Coordenada geográfica (latitude e longitude)
    geometria GEOMETRY(Point, 4326),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);