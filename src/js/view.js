export default class View {
    $;
    $$;
    constructor() {
        this.$ = {
            homeScreen: this.qs('#homeScreen'),
            gameScreen: this.qs('#gameScreen'),
            settingsForm: this.qs('#settingsForm'),
            startBtn: this.qs('#startBtn'),
            openRestartModalBtn: this.qs('#openRestartModalBtn'),
            gameCompleteModal: this.qs('#gameCompleteModal'),
            gameCompleteText: this.qs('#gameCompleteText'),
            gameCompleteExitBtn: this.qs('#gameCompleteExitBtn'),
            gameCompleteNextRoundBtn: this.qs('#gameCompleteNextRoundBtn'),
            restartModal: this.qs('#restartModal'),
            restartYesBtn: this.qs('#restartYesBtn'),
            restartNoBtn: this.qs('#restartNoBtn'),
            tiesScore: this.qs('#tiesScore'),
            crossScore: this.qs('#crossScore'),
            circleScore: this.qs('#circleScore'),
            circleName: this.qs('#circleName'),
            crossName: this.qs('#crossName'),
        };
        this.$$ = {
            cells: this.qsa('[data-id=cell]'),
        };
        this.$.openRestartModalBtn.addEventListener('click', () => this.toggleModal('restartModal', 'visible'));
        this.$.restartNoBtn.addEventListener('click', () => this.toggleModal('restartModal', 'hidden'));
    }
    bindStartGameEvent(handler) {
        this.$.startBtn?.addEventListener('click', handler);
    }
    bindNewRoundEvent(handler) {
        this.$.gameCompleteNextRoundBtn?.addEventListener('click', handler);
    }
    bindExitGameEvent(handler) {
        this.$.gameCompleteExitBtn?.addEventListener('click', handler);
    }
    bindResetGameEvent(handler) {
        this.$.restartYesBtn?.addEventListener('click', handler);
    }
    bindPlayerMoveEvent(handler) {
        this.$$.cells.forEach((element) => {
            element.addEventListener('click', handler);
        });
    }
    // helper methods
    getPlayerNames() {
        const $form = this.$.settingsForm;
        if (!($form instanceof HTMLFormElement))
            throw new Error('getPlayerNames(): o elemento settings não é formulário');
        if (!$form.reportValidity())
            return null;
        const nameP1 = $form['nameP1']?.value;
        const nameP2 = $form['nameP2']?.value;
        if (nameP1 && nameP2) {
            return { cross: nameP1, circle: nameP2 };
        }
        throw new Error('getPlayerNames(): Não foi possível obter os nomes dos jogadores');
    }
    setPlayerName(names) {
        this.$.circleName.innerText = names.circle;
        this.$.crossName.innerText = names.cross;
    }
    resetScore() {
        this.$.crossScore.innerText = '0';
        this.$.circleScore.innerText = '0';
        this.$.tiesScore.innerText = '0';
    }
    setScore(symbol, value) {
        if (symbol === 'cross')
            this.$.crossScore.innerText = value.toString();
        if (symbol === 'circle')
            this.$.circleScore.innerText = value.toString();
        if (symbol === 'ties')
            this.$.tiesScore.innerText = value.toString();
    }
    showHome() {
        this.$.homeScreen.dataset.visibility = 'visible';
        this.$.gameScreen.dataset.visibility = 'hidden';
    }
    showBoard() {
        this.$.homeScreen.dataset.visibility = 'hidden';
        this.$.gameScreen.dataset.visibility = 'visible';
    }
    clearBoard() {
        this.$.gameScreen.dataset.turn = 'cross';
        this.$.gameScreen.dataset.visibility = 'visible';
        delete this.$.gameScreen.dataset.winner;
        this.$.homeScreen.dataset.visibility = 'hidden';
        this.$.gameCompleteModal.dataset.visibility = 'hidden';
        this.$.restartModal.dataset.visibility = 'hidden';
        this.$$.cells.forEach((cell) => {
            delete cell.dataset.move;
            delete cell.dataset.highlight;
        });
    }
    toggleModal(selector, value) {
        if (value) {
            this.$[selector].dataset.visibility = value;
        }
        else {
            const status = this.$[selector].dataset.visibility;
            this.$[selector].dataset.visibility = status === 'hidden' ? 'visible' : 'hidden';
        }
    }
    setWinnerState(winner, name) {
        if (winner === 'tie') {
            this.$.gameScreen.dataset.winner = 'tie';
            this.$.gameCompleteText.innerText = `Empate`;
        }
        else {
            this.$.gameScreen.dataset.winner = winner;
            this.$.gameCompleteText.innerText = `${name} venceu`;
        }
    }
    highlightCells(combo) {
        combo.forEach((index) => (this.$$.cells[index].dataset.highlight = ''));
    }
    handlePlayerMove(cell, move) {
        cell.dataset.move = move;
    }
    changeTurnIndicator(newTurn) {
        this.$.gameScreen.dataset.turn = newTurn;
    }
    qs(selector, parent) {
        const elem = parent ? parent.querySelector(selector) : document.querySelector(selector);
        if (!(elem instanceof HTMLElement))
            throw new Error('qs(): não foi possível selecionar o elemento ' + selector);
        return elem;
    }
    qsa(selector, parent) {
        const elems = parent
            ? parent.querySelectorAll(selector)
            : document.querySelectorAll(selector);
        if (elems.length === 0)
            throw new Error('qsa(): não foi possível selecionar o elemento ' + selector);
        elems.forEach((elem) => {
            if (!(elem instanceof HTMLElement)) {
                throw new Error('qsa(): nem todos os elementos são HTMLElements');
            }
        });
        return elems;
    }
}
