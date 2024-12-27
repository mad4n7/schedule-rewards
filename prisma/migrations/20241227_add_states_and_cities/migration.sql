-- CreateTable
CREATE TABLE "states" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "name_pt" VARCHAR(255),
    "abbreviation" VARCHAR(2) NOT NULL,
    "country_code" VARCHAR(2) NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "name_pt" VARCHAR(255),
    "state_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(0),
    "updated_at" TIMESTAMP(0),

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "states_country_code_idx" ON "states"("country_code");

-- CreateIndex
CREATE INDEX "cities_state_id_idx" ON "cities"("state_id");

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- Insert US States
INSERT INTO "states" ("id", "name", "abbreviation", "country_code") VALUES
('CA', 'California', 'CA', 'US'),
('NY', 'New York', 'NY', 'US'),
('TX', 'Texas', 'TX', 'US');

-- Insert BR States
INSERT INTO "states" ("id", "name", "name_pt", "abbreviation", "country_code") VALUES
('SP', 'São Paulo', 'São Paulo', 'SP', 'BR'),
('RJ', 'Rio de Janeiro', 'Rio de Janeiro', 'RJ', 'BR'),
('MG', 'Minas Gerais', 'Minas Gerais', 'MG', 'BR');

-- Insert US Cities
INSERT INTO "cities" ("id", "name", "state_id") VALUES
(gen_random_uuid(), 'Los Angeles', 'CA'),
(gen_random_uuid(), 'Torrance', 'CA'),
(gen_random_uuid(), 'San Francisco', 'CA'),
(gen_random_uuid(), 'New York City', 'NY'),
(gen_random_uuid(), 'Buffalo', 'NY'),
(gen_random_uuid(), 'Houston', 'TX'),
(gen_random_uuid(), 'Austin', 'TX');

-- Insert BR Cities
INSERT INTO "cities" ("id", "name", "name_pt", "state_id") VALUES
(gen_random_uuid(), 'São Paulo', 'São Paulo', 'SP'),
(gen_random_uuid(), 'Campinas', 'Campinas', 'SP'),
(gen_random_uuid(), 'Rio de Janeiro', 'Rio de Janeiro', 'RJ'),
(gen_random_uuid(), 'Niterói', 'Niterói', 'RJ'),
(gen_random_uuid(), 'Belo Horizonte', 'Belo Horizonte', 'MG'),
(gen_random_uuid(), 'Uberlândia', 'Uberlândia', 'MG');
