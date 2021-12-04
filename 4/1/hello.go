package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

type square struct {
	checked bool
	value   string
}

func main() {
	// read file
	file, _ := os.Open("input")
	scanner := bufio.NewScanner(file)

	// first line is game
	scanner.Scan()
	game := parseGame(scanner.Text())
	fmt.Println(game)

	// advance scanner to first board
	scanner.Scan()

	// get board
	boards := populateBoard(scanner)
	fmt.Println(boards[0][1][1])
}

func parseGame(firstLine string) []string {
	return splitString(firstLine, []rune{','})
}

func splitString(s string, separators []rune) []string {
	f := func(r rune) bool {
		for _, s := range separators {
			if r == s {
				return true
			}
		}
		return false
	}
	return strings.FieldsFunc(s, f)
}

func populateBoard(scanner *bufio.Scanner) [][][5]square {
	boards := make([][][5]square, 0)

	existingBoard := make([][5]square, 5)
	boardIndex := 0

	for scanner.Scan() { // internally, it advances token based on sperator
		text := scanner.Text() // token in unicode-char
		if text == "" {
			boards = append(boards, existingBoard)
			existingBoard = make([][5]square, 5)
			boardIndex = 0
			// pop existing board into boards collections
			continue
		}
		newline := parseLine(text)
		existingBoard[boardIndex] = newline
		boardIndex++
	}

	return boards
}

func parseLine(line string) [5]square {
	var bingoLine [5]square
	bingoLineIndex := 0

	currentVal := make([]rune, 0)
	var pendingInt = false

	runeArray := []rune(line)
	for i := 0; i < len(runeArray); i++ {
		if runeArray[i] != ' ' {
			pendingInt = true
			currentVal = append(currentVal, runeArray[i])
		}

		// if we hit whitespace, currently parsed number can be added to row
		if runeArray[i] == ' ' || i == len(runeArray)-1 {
			// no value to pop
			if !pendingInt {
				continue
			}

			var currnet = string(currentVal)
			bingoLine[bingoLineIndex] = square{false, currnet}
			bingoLineIndex++
			pendingInt = false
			currentVal = make([]rune, 0)
			continue
		}
	}

	return bingoLine
}
