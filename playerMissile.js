class playerMissile {
    constructor(x, y, w, h, angle) {
        var options={
            friction: 1.0,
            restitution: 0.8
        }
        this.width=w;
        this.height=h;
        this.image=loadImage("playerMissile.png");
        this.launched=false;

        this.body=Bodies.rectangle(x, y, this.width, this.height, options);
        Matter.Body.setAngle(this.body, angle);

        World.add(world, this.body);

        this.sprite=createSprite(x, y, w, h);
        this.sprite.visible=false;
        this.sprite.setCollider("rectangle", 50, 0, w, h);
    }

    display() {
        var pos=this.body.position;
        var angle=this.body.angle;

        push();
        translate(pos.x, pos.y);
        rotate(angle);
        imageMode(CENTER);
        image(this.image, 0, 0, this.width, this.height);
        pop();

        this.sprite.x=this.body.position.x;
        this.sprite.y=this.body.position.y;
    }

    launch() {
        this.launched=true;
        Matter.Body.setVelocity(this.body, {x:60, y:0.5});
    }
}