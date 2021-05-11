export default class Card {
    constructor(scene) {
        this.render = (x, y, sprite, current) => {
            let card = scene.add.image(x, y, sprite).setInteractive();
            if (current)
                card.setScale(1, 1);
            else
                card.setScale(0.5, 0.5);
            scene.input.setDraggable(card);
            return card;
        }
    }
}