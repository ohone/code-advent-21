package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

type square struct {
	checked bool
	value   string
}

//type card [][5]square

func main() {
	// read file
	file, _ := os.Open("testinput")
	scanner := bufio.NewScanner(file)

	// first line is game
	scanner.Scan()
	game := parseGame(scanner.Text())

	// advance scanner to first board
	scanner.Scan()

	// get board
	boards := populateBoard(scanner)

	updateBoards(game, &boards)
}

func updateBoards(game []string, boards *[]*[]*[5]square) {
	for i := 0; i < len(game); i++ {
		num := game[i]
		fmt.Println(num)
		for y := 0; y < len(*boards); y++ {
			board := (*boards)[y]
			for z := 0; z < len(*board); z++ {
				row := (*board)[z]
				for x := 0; x < len(row); x++ {
					if row[x].value == num {
						row[x].checked = true
					}
				}
			}
			if evaluateBoard(*board) {
				fmt.Print("board: ")
				fmt.Println(y)
				total := winningBoardTotal(*board)
				parsedInt, _ := strconv.Atoi(num)
				fmt.Println(total)
				fmt.Println(total * parsedInt)
				panic("no")
			}
		}
	}
}

func winningBoardTotal(board []*[5]square) int {
	total := 0
	for i := 0; i < len(board); i++ {
		row := *board[i]
		for y := 0; y < len(row); y++ {
			if !row[y].checked {
				i, _ := strconv.Atoi(row[y].value)
				total += i
			}
		}
	}

	return total
}

func evaluateBoard(board []*[5]square) bool {
	// evaluate rows
	for i := 0; i < len(board); i++ {
		row := board[i]
		for y := 0; y < len(row); y++ {
			if !row[y].checked {
				break
			}

			if y == len(row)-1 {
				return true
			}
		}
	}

	// evaluate columns

	for i := 0; i < len(board[0]); i++ {
		for y := 0; y < len(board); y++ {
			if !board[i][y].checked {
				break
			}

			if y == len(board[0])-1 {
				return true
			}
		}
	}

	return false
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

func populateBoard(scanner *bufio.Scanner) []*[]*[5]square {
	boards := make([]*[]*[5]square, 0)

	existingBoard := make([]*[5]square, 5)
	boardIndex := 0

	for scanner.Scan() { // internally, it advances token based on sperator
		text := scanner.Text() // token in unicode-char
		if text == "" {
			boards = append(boards, &existingBoard)
			existingBoard = make([]*[5]square, 5)
			boardIndex = 0
			// pop existing board into boards collections
			continue
		}
		newline := parseLine(text)
		existingBoard[boardIndex] = &newline
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
