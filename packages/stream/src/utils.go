package main

import (
	"os"
	"path"
)

// Find a file or directory by walking up parent directories
func findUp(fileName string) (string, error) {

	file := path.Base(fileName)

	for i := 0; i < 5; i++ {
		if _, err := os.Stat(file); err == nil {
			return file, nil
		}

		file = path.Join("..", file)
	}

	return fileName, os.ErrNotExist
}
