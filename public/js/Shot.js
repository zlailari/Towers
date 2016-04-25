drawShot = function(ctx, towerID, creepID) {
    ctx.beginPath();

    for (var i = 0; i < myGrid.towers.length; i++) {
        if (myGrid.towers[i].id == towerID) {
            // Start line at center of square
            ctx.moveTo(
                gridToPixel(myGrid.towers[i].loc[0] + 0.5),
                gridToPixel(myGrid.towers[i].loc[1] + 0.5)
            );
        }
    }

    for (var j = 0; j < creeps.length; j++) {
        if (creeps[j].id == creepID) {
            ctx.lineTo(
                gridToPixel(creeps[j].loc[0] + creeps[j].cellPos[0]),
                gridToPixel(creeps[j].loc[1] + creeps[j].cellPos[1])
            );
        }
    }
    ctx.stroke();
};

var Projectile = function(ctx, towerID, creepID, speed) {
    this.speed = speed;
    this.ctx = ctx;
    this.towerID = towerID;
    this.creepID = creepID;
    this.velocity = new Victor(0, 0);

    for (var i = 0; i < myGrid.towers.length; i++) {
        if (myGrid.towers[i].id == this.towerID) {
        this.pos = new Victor(
            gridToPixel(myGrid.towers[i].loc[0] + 0.5),
            gridToPixel(myGrid.towers[i].loc[1]) + 0.5);
        }
    }

    this.hit = false;

    this.draw = function() {
        if (!this.hit) {
            var direction = null;
            for (var j = 0; j < creeps.length && direction == null; j++) {
               if (creeps[j].id == this.creepID) {
                   direction = new Victor(
                   gridToPixel(creeps[j].loc[0] + creeps[j].cellPos[0]),
                   gridToPixel(creeps[j].loc[1] + creeps[j].cellPos[1]));
               }
            }
            if (direction == null) {
                this.hit = true;
                return;
            }
            // The direction the projectile needs to travel in to hit
            // the creep
            direction.subtract(this.pos);
            // Distance from the target
            var distance = direction.length();

            // If the distance is less than the speed,
            // it will hit on this frame
            if (distance < this.speed) {
                this.hit = true;
            } else {
                distance = this.speed;
            }

            // Calculate acceleration
            var acceleration = direction.clone();
            acceleration.normalize();
            acceleration.multiplyScalar(this.speed);

            // Mix the acceleration into the velocity with a
            // factor of 0.5
            this.velocity.mix(acceleration, 0.5);
            // If the ||velocity|| is greater than the distance it can
            // travel in this frame, set ||velocity|| = distance
            if (this.velocity.length() > distance) {
                this.velocity.normalize();
                this.velocity.multiplyScalar(distance);
            }

            this.pos.add(this.velocity);

            this.ctx.fillStyle = "#000000";
            this.ctx.fillRect(this.pos.x, this.pos.y,
               5, 5);
        }
    };
};
