package config

import (
	"os"
	"strconv"
	
	"github.com/gofiber/fiber/v2/log"
	"github.com/joho/godotenv"
)

type Env struct {
	DB  DbConfig
	Log LogConfig
}

type DbConfig struct {
	DatabaseUrl string
}

type LogConfig struct {
	LogLevel  int
	LogFormat string
}

func getString(key, defaultValue string) string {
	val := os.Getenv(key)
	if val == "" {
		return defaultValue
	}
	return val
}

func getBool(key string, defaultValue bool) bool {
	val := os.Getenv(key)
	i, err := strconv.ParseBool(val)
	if err != nil {
		return defaultValue
	}
	return i
}

func getNumber(key string, defaultValue int) int {
	val := os.Getenv(key)
	i, err := strconv.Atoi(val)
	if err != nil {
		return defaultValue
	}
	return i
}

func LoadEnv() *Env {
	
	if err := godotenv.Load(); err != nil {
		log.Error("Error loading .env file")
		return nil
	}
	
	return &Env{
		DB: DbConfig{
			DatabaseUrl: getString(
				"DATABASE_URL",
				"postgresql://postgres:postgres@localhost:5432/postgres?schema=public",
			),
		},
		Log: LogConfig{
			LogLevel:  getNumber("LOG_LEVEL", 0),
			LogFormat: getString("LOG_FORMAT", "json"),
		},
	}
}
