package config

import (
	"log"

	"github.com/caarlos0/env/v11"
	"github.com/joho/godotenv"
)

type Config struct {
	Port              string `env:"PORT" envDefault:"8080"`
	GoogleCredentials string `env:"GOOGLE_APPLICATION_CREDENTIALS" envDefault:""`
	DatabaseUrl       string `env:"DATABASE_URL" envDefault:""`
	Uptash            Uptash `envPrefix:"UPSTASH_"`
	DebugMode         bool   `env:"DEBUG_MODE" envDefault:"false"`
}

type Uptash struct {
	VectorDatabaseUrl   string `env:"VECTOR_DB_URL"`
	VectorDatabaseToken string `env:"VECTOR_DB_TOKEN"`
}

func Load() *Config {
	godotenv.Load()
	cfg := &Config{}
	if err := env.Parse(cfg); err != nil {
		log.Fatal(err)
	}
	return cfg
}
