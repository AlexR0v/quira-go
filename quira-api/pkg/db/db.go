package db

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/rs/zerolog"

	"quira-api/pkg/config"
)

func CreateDBPool(config *config.DbConfig, log *zerolog.Logger) *pgxpool.Pool {
	dbPool, err := pgxpool.New(context.Background(), config.DatabaseUrl)
	if err != nil {
		log.Error().Msg(err.Error())
		panic(err)
	}
	log.Info().Msg("Connected to database")
	return dbPool
}
