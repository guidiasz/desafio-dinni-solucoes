import View from './view.js';
import Store from './store.js';
function init() {
    const view = new View();
    const store = new Store();
    view.bindStartGameEvent((e) => {
        const playerNames = view.getPlayerNames();
        if (!playerNames)
            return;
        store.setPlayers(playerNames);
        view.setPlayerName(playerNames);
        view.showBoard();
    });
    view.bindNewRoundEvent((e) => {
        view.clearBoard();
        store.reset();
    });
    view.bindExitGameEvent((e) => {
        view.clearBoard();
        store.reset(true);
        view.resetScore();
        view.showHome();
    });
    view.bindResetGameEvent((e) => {
        view.clearBoard();
        store.reset(true);
        view.resetScore();
        view.showHome();
    });
    view.bindPlayerMoveEvent((e) => {
        if (!(e.currentTarget instanceof HTMLElement))
            return;
        view.handlePlayerMove(e.currentTarget, store.game.turn);
        store.playerMove(Number(e.currentTarget.id));
        if (store.game.winner) {
            const winner = store.game.winner;
            view.setWinnerState(winner, store.game.players[winner]);
            view.toggleModal('gameCompleteModal', 'visible');
            view.highlightCells(store.game.winnerCombo || []);
            store.incrementScore(winner);
            view.setScore(winner, store.game.score[winner]);
        }
        else if (store.game.status === 'tied') {
            store.incrementScore('ties');
            view.setWinnerState('tie');
            view.setScore('ties', store.game.score.ties);
            view.toggleModal('gameCompleteModal', 'visible');
        }
        view.changeTurnIndicator(store.game.turn);
    });
}
window.addEventListener('load', init);
