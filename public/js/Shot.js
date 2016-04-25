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
    this.hit = false;

    for (var i = 0; i < myGrid.towers.length; i++) {
        if (myGrid.towers[i].id == this.towerID) {
        this.pos = new Victor(
            gridToPixel(myGrid.towers[i].loc[0] + 0.5),
            gridToPixel(myGrid.towers[i].loc[1]) + 0.5);
        }
    }

    this.draw = function() {
        if (!this.hit) {
            var creepPos = null;
            for (var j = 0; j < creeps.length && creepPos == null; j++) {
               if (creeps[j].id == this.creepID) {
                   creepPos = new Victor(
                   gridToPixel(creeps[j].loc[0] + creeps[j].cellPos[0]),
                   gridToPixel(creeps[j].loc[1] + creeps[j].cellPos[1]));
               }
            }
            if (creepPos == null) {
                this.hit = true;
                return;
            }
            // The direction the projectile needs to travel in to hit
            // the creep
            var direction = creepPos.clone();
            direction.subtract(this.pos);
            direction.normalize();

            // Calculate acceleration
            var acceleration = direction.clone();
            acceleration.multiplyScalar(this.speed);

            // Mix the acceleration into the velocity with a
            // factor of 2.0
            this.velocity.mix(acceleration, 2.0);
            this.velocity.normalize();
            this.velocity.multiplyScalar(this.speed);

            var newPos = this.pos.clone();
            newPos.add(this.velocity);
            var currentDistance = creepPos.distance(this.pos);
            var newDistance = creepPos.distance(newPos);
            // Checks to see if the projectile will hit, with a fudge factor
            // of 3 pixels
            if (Math.abs(currentDistance + newDistance - this.speed) < 3.0) {
                this.hit = true;
                this.velocity.normalize();
                this.velocity.multiplyScalar(currentDistance);
            }

            this.pos.add(this.velocity);

            this.ctx.fillStyle = "#000000";
            this.ctx.fillRect(this.pos.x, this.pos.y,
               5, 5);
        }
    };
};
