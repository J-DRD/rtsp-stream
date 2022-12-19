// credits: https://github.com/deepch/RTSPtoWebRTC

package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/joho/godotenv"
)

func loadEnv() {
	env:= os.Getenv("NODE_ENV")
	if (env == "") {
		env = "development"
	 }

	file, err := findUp(".env." + env + ".local")

	if err == nil {
		godotenv.Load(file)
	}


	if env != "test" {
		file, err = findUp(".env.local")
		if err == nil {
  		godotenv.Load(file)
		}
	}

	file, err = findUp(".env." + env)
	if err == nil {
		godotenv.Load(file)
	}

	file, err = findUp(".env")
	if err == nil {
		godotenv.Load(file)
	}

	godotenv.Load() 
}

func main() {

	loadEnv()

	log.SetFlags(0)
	go serveHTTP()
	go serveStreams()
	sigs := make(chan os.Signal, 1)
	done := make(chan bool, 1)
	signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		sig := <-sigs
		log.Println(sig)
		done <- true
	}()
	<-done
}
