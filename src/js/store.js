const initialState = {
    moveHistory: [],
    turn: 'cross',
    score: {
        cross: 0,
        ties: 0,
        circle: 0,
    },
};
export default class Store {
    state = structuredClone(initialState);
    players = { cross: '', circle: '' };
    constructor() { }
    setPlayers(nameObj) {
        this.players = { ...nameObj };
    }
    get game() {
        const state = this.getState();
        const winningCombos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        let winner = '';
        let status = 'in-progress';
        let winnerCombo = null;
        const crossMoves = state.moveHistory
            .filter(({ move }) => move === 'cross')
            .map(({ cellID }) => cellID);
        const circleMoves = state.moveHistory
            .filter(({ move }) => move === 'circle')
            .map(({ cellID }) => cellID);
        for (const combo of winningCombos) {
            winner = combo.every((cellIndex) => crossMoves.includes(cellIndex))
                ? 'cross'
                : combo.every((cellIndex) => circleMoves.includes(cellIndex))
                    ? 'circle'
                    : '';
            if (!winner)
                continue;
            status = 'won';
            winnerCombo = combo;
            break;
        }
        if (state.moveHistory.length === 9 && !winner)
            status = 'tied';
        const turn = state.moveHistory.length % 2 === 0 ? 'cross' : 'circle';
        return {
            ...state,
            turn,
            status,
            winnerCombo,
            winner,
            players: this.players,
        };
    }
    playerMove(cellID) {
        const state = this.getState();
        state.moveHistory.push({
            cellID,
            move: this.game.turn,
        });
        this.saveState(state);
    }
    incrementScore(side) {
        this.state.score[side]++;
    }
    reset(all = false) {
        if (all) {
            this.saveState(structuredClone(initialState));
            return;
        }
        const { score } = this.getState();
        const object = {
            ...initialState,
            score,
        };
        this.saveState(structuredClone(object));
    }
    getState() {
        return structuredClone(this.state);
    }
    saveState(newState, fun) {
        const prevState = this.state;
        if (typeof fun === 'function') {
            this.state = fun(prevState);
            return;
        }
        if (typeof newState === 'object') {
            this.state = newState;
            return;
        }
        throw new Error('saveState(): argumento invalido');
    }
}
