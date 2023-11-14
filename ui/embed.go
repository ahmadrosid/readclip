package ui

import "embed"

//go:embed template/*
var Template embed.FS

//go:embed dist/*
var Index embed.FS
