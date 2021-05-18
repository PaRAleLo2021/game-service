export default class Card {
    constructor(scene) {
        this.render = (x, y, sprite, current) => {
            let card = scene.add.image(x, y, sprite).setInteractive().setDataEnabled().setTint(0x7885cb);
            if (current)
                card.setScale(1.3, 1.3);
            else
                card.setScale(0.5, 0.5);
            return card;
        }
    }
}