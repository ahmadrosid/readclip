package config

import (
	"github.com/caarlos0/env"
	"github.com/joho/godotenv"
)

type Config struct {
	Port              string `env:"PORT" envDefault:"8080"`
	GoogleCredentials string `env:"GOOGLE_APPLICATION_CREDENTIALS" envDefault:""`
	DatabaseUrl       string `env:"DATABASE_URL" envDefault:""`
}

func Load() *Config {
	godotenv.Load()
	cfg := Config{}
	env.Parse(&cfg)
	return &cfg
}
