package config

import (
	"encoding/json"

	"github.com/caarlos0/env"
	"github.com/joho/godotenv"
)

type Config struct {
	Port              string `env:"PORT" envDefault:"3000"`
	GoogleCredentials string `env:"GOOGLE_APPLICATION_CREDENTIALS" envDefault:""`
	DatabaseUrl       string `env:"DB_CONNECTION_STRING" envDefault:""`
}

func (c Config) GoogleCredentialsJson() ([]byte, error) {
	data, err := json.Marshal(c.GoogleCredentials)
	if err != nil {
		return nil, err
	}
	return data, nil
}

func Load() *Config {
	godotenv.Load()
	cfg := Config{}
	env.Parse(&cfg)
	return &cfg
}
