export const GameResultSimplified = {
  WIN: 'win',
  LOSS: 'loss',
  TIE: 'tie',
};

export const GameResult = {
  WIN: 'win', //Win
  CHECKMATED: 'checkmated', //Checkmated
  AGREED: 'agreed', //Draw agreed
  REPETITION: 'repetition', //Draw by repetition
  TIMEOUT: 'timeout', //Timeout
  RESIGNED: 'resigned', //Resigned
  STALEMATE: 'stalemate', //Stalemate
  LOSE: 'lose', //Lose
  INSUFFICIENT: 'insufficient', //Insufficient material
  MOVE50: '50move', //Draw by 50-move rule
  ABANDONED: 'abandoned', //Abandoned
  KINGOFTHEHILL: 'kingofthehill', //Opponent king reached the hill
  THREECHECK: 'threecheck', //Checked for the 3rd time
  TIMEVSINSUFFICIENT: 'timevsinsufficient', //Draw by timeout vs insufficient material
  BUGHOUSEPARTNERLOSE: 'bughousepartnerlose', //Bughouse partner lost

  simplified: function (str) {
    switch (str) {
      case GameResult.WIN:
        return GameResultSimplified.WIN;
      case GameResult.AGREED:
      case GameResult.REPETITION:
      case GameResult.STALEMATE:
      case GameResult.INSUFFICIENT:
      case GameResult.MOVE50:
      case GameResult.TIMEVSINSUFFICIENT:
        return GameResultSimplified.TIE;
      case GameResult.CHECKMATED:
      case GameResult.TIMEOUT:
      case GameResult.RESIGNED:
      case GameResult.LOSE:
      case GameResult.ABANDONED:
      case GameResult.KINGOFTHEHILL:
      case GameResult.THREECHECK:
      case GameResult.BUGHOUSEPARTNERLOSE:
        return GameResultSimplified.LOSS;
      default:
        throw new Error('Invalid game result string: ' + str);
    }
  },
};

/**
 * Gives won, lost, or drew based on the result.
 * @param {string} result - The result of the game ('win', 'resigned', 'lose', 'checkmated' aka GameResult)
 * @returns {[number, number, number]} - An array with the updated win, loss, and draw counts.
 */
export function getResults(result) {
  let win = 0;
  let loss = 0;
  let draw = 0;

  try {
    // If the result string is valid and has a corresponding GameResult object
    // Get the simplified result (win, loss, or tie)
    const simplifiedResult = GameResult.simplified(result.toLowerCase());

    switch (simplifiedResult) {
      case GameResultSimplified.WIN:
        win = 1;
        break;
      case GameResultSimplified.LOSS:
        loss = 1;
        break;
      case GameResultSimplified.TIE:
        draw = 1;
        break;
    }
  } catch (err) {
    // If the result string is not valid, display an error message
    console.log(err.message);
    return [0, 0, 0];
  }

  return [win, loss, draw];
}
