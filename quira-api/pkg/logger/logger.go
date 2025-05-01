package logger

import (
	"os"

	"github.com/rs/zerolog"

	"quira-api/pkg/config"
)

func NewLogger(c *config.LogConfig) *zerolog.Logger {
	zerolog.SetGlobalLevel(zerolog.Level(c.LogLevel))
	var logger zerolog.Logger
	if c.LogFormat == "json" {
		logger = zerolog.New(os.Stderr).With().Timestamp().Caller().Logger()
	} else {
		logger = zerolog.New(zerolog.ConsoleWriter{Out: os.Stderr}).With().Timestamp().Caller().Logger()
	}
	return &logger
}
