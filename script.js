window.onload = () => {
    const cvs = document.getElementById("cvs");
    const score = document.getElementById("score");
    const health = document.getElementById("health");
    const ctx = cvs.getContext("2d");

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function Intersect(x1, y1, sx1, sy1, x2, y2, sx2, sy2) {
        var xcoll = x1 < x2 + sx2 && x1 + sx1 > x2;
        var ycoll = y1 < y2 + sy2 && y1 + sy1 > y2;
        return xcoll && ycoll
    }

    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }

    function Bullet(blob, target)
    {
        this.iter = 0;
        this.blob = blob;
        this.target = target;
        this.target_center = new Vector(target.x - 10, target.y - 10);
        this.blob_center = new Vector(blob.x - 10, blob.y - 10);

        this.pos = this.blob_center;

        this.aimdir = new Vector(this.target_center.x - this.blob_center.x, this.target_center.y - this.blob_center.y);
        this.aimdirnorm = new Vector(this.aimdir.x / Math.sqrt(Math.pow(this.aimdir.x, 2) + Math.pow(this.aimdir.y, 2)), this.aimdir.y / Math.sqrt(Math.pow(this.aimdir.x, 2) + Math.pow(this.aimdir.y, 2)));
        this.aimvel = new Vector(this.aimdirnorm.x * 15, this.aimdirnorm.y * 15);

        this.draw = function()
        {
            ctx.beginPath();
            ctx.fillStyle = "yellow";
            ctx.arc(this.pos.x, this.pos.y, 5, 0, Math.PI*2)
            ctx.fill();
            ctx.closePath();
        }

        this.update = function()
        {

            this.pos.x += this.aimvel.x;
            this.pos.y += this.aimvel.y;
        }
    }

    function Team(blobs, color, xmin, xmax) {
        this.blobs = blobs;
        this.color = color;
        this.totalhealth = 0;
        this.border = xmax;

        for (let i in this.blobs) {
            this.blobs[i].color = this.color;
            this.blobs[i].x = getRandomInt(xmin, xmax);
            this.blobs[i].y = getRandomInt(0, 620);
            this.totalhealth += this.blobs[i].health;
        }

        this.draw = function() {
            for (let i in this.blobs) {
                if (blobs[i].draw) {
                    ctx.beginPath()
                    ctx.fillStyle = this.blobs[i].color;
                    ctx.fillRect(this.blobs[i].x, this.blobs[i].y, 20, 20)
                    ctx.closePath()
                }

                this.totalhealth = 0;
                this.totalhealth += this.blobs[i].health;
            }
        }

        this.rand = function(teams) {
            for (let i in this.blobs) {
                let x = this.blobs[i].x;
                let y = this.blobs[i].y;

                this.target = (blob) => {
                    let blob2 = teams.blobs[getRandomInt(0, teams.blobs.length-1)];

                    let desc = getRandomInt(1, 3) > 1 ? true : false;

                    let hi_health = this.totalhealth > teams.totalhealth;
                    
                    if(blob.health < blob2.health && (!hi_health || !desc))
                    {
                        if(blob.x < blob2.x)
                        {
                            blob.x -= 3;
                        }

                        if(blob.y < blob2.y)
                        {
                            blob.y -= 3;
                        }

                        if(blob.x > blob2.x)
                        {
                            blob.x += 3;
                        }

                        if(blob.y > blob2.y)
                        {
                            blob.y += 3;
                        }

                        return;
                    }

                    if(hi_health && desc)
                    {
                        if(blob.x < blob2.x)
                        {
                            blob.x += 3;
                        }

                        if(blob.y < blob2.y)
                        {
                            blob.y += 3;
                        }

                        if(blob.x > blob2.x)
                        {
                            blob.x -= 3;
                        }

                        if(blob.y > blob2.y)
                        {
                            blob.y -= 3;
                        }
                    }
                }

                if (y <= 0) {
                    this.blobs[i].y += 3;
                }
                if (y >= 620) {
                    this.blobs[i].y += -3;
                }
                else {
                    getRandomInt(1, 2) == 2 ? this.blobs[i].y += 3 : this.blobs[i].y += -3;
                }
                
                if (x <= 0) {
                    this.blobs[i].x += 3;
                }
                if (x >= 1260) {
                    this.blobs[i].x += -3;
                }
                else {
                    let res = getRandomInt(1, 5);
                    if(res > 1)
                    {
                        getRandomInt(1, 2) == 1 ? this.blobs[i].x += 3 : this.blobs[i].x += -3
                    }
                    else
                    {
                        this.target(this.blobs[i]);
                    }
                }
            }
        }
    }

    function Blob(pos) {
        this.health = 250;
        this.x = pos.x;
        this.y = pos.y;
        this.color = "#000000";
        this.draw = true;
        this.bullets = [];
    }

    function drawBorder()
    {
        ctx.beginPath();
        ctx.strokeStyle = "#4287f5";
        ctx.moveTo(team.border, 0);
        ctx.lineTo(team.border, 640);
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.strokeStyle = "#c71c1c";
        ctx.moveTo(team2.border, 0);
        ctx.lineTo(team2.border, 640);
        ctx.stroke();
        ctx.closePath();
    }

    var blues = [];
    var reds = [];

    for (let i = 0; i < 250; i++) {
        blues.push(new Blob(new Vector(0, 0)))
    }

    for (let i = 0; i < 250; i++) {
        reds.push(new Blob(new Vector(0, 0)))
    }

    var team = new Team(blues, "#4287f5", 20, 400);
    var team2 = new Team(reds, "#c71c1c", 900, 1260);

    let iter = 0;
    
    function update() {
        ctx.clearRect(0, 0, 1280, 640);

        for (let i in team.blobs) {
            if (team.blobs[i].health <= 0) {
                continue;
            }
            for (let x in team2.blobs) {
                if (team2.blobs[x].health <= 0) {
                    continue;
                }
                if (Intersect(team.blobs[i].x, team.blobs[i].y, 20, 20, team2.blobs[x].x, team2.blobs[x].y, 20, 20)) {
                    team.blobs[i].health -= getRandomInt(1, 3) / 2;
                    team2.blobs[x].health -= getRandomInt(1, 3) / 2;
                }
            }
        }

        for(let v in team.blobs)
        {
            for(let e in team.blobs[v].bullets)
            {
                for(let p in team2.blobs)
                { 
                    if(Intersect(team2.blobs[p].x, team2.blobs[p].y, 20, 20, team.blobs[v].bullets[e].pos.x, team.blobs[v].bullets[e].pos.y, 10, 10))
                    {
                        team2.blobs[p].health -= 2;
                    }
                 }
             }
        }

        for(let r in team2.blobs)
        {
            for(let m in team2.blobs[r].bullets)
            {
                for(let c in team.blobs)
                {
                    if(Intersect(team.blobs[c].x, team.blobs[c].y, 20, 20, team2.blobs[r].bullets[m].pos.x, team2.blobs[r].bullets[m].pos.y, 10, 10))
                    {
                        team.blobs[c].health -= 2;
                    }
                }
             }
        }
        

        for (let y in team.blobs) {
            if (team.blobs[y].health <= 0) {
                team.blobs[y].draw = false;
                team.blobs.splice(y, 1);
                continue;
            }

            if(getRandomInt(1, 50) < 2) team.blobs[y].bullets.push(new Bullet(team.blobs[y], team2.blobs[getRandomInt(0, team2.blobs.length-1)]));
        }

        for (let z in team2.blobs) {
            if (team2.blobs[z].health <= 0) {
                team2.blobs[z].draw = false;
                team2.blobs.splice(z, 1);
                continue;
            }

            if(getRandomInt(1, 50) < 2) team2.blobs[z].bullets.push(new Bullet(team2.blobs[z], team.blobs[getRandomInt(0, team.blobs.length-1)]));
        }

        team2.rand(team);
        team.rand(team2);
        team2.draw();
        team.draw();
        drawBorder();
        for(let u in team.blobs)
        {
             for(let o in team.blobs[u].bullets)
             {
                 team.blobs[u].bullets[o].update();
                 team.blobs[u].bullets[o].draw();
                 team.blobs[u].bullets[o].iter += 1;

                 if(team.blobs[u].bullets[o].iter > 75)
                 {
                     team.blobs[u].bullets.splice(o, 1);
                 }
             }
        }

        for(let p in team2.blobs)
        {
             for(let w in team2.blobs[p].bullets)
             {
                 team2.blobs[p].bullets[w].update();
                 team2.blobs[p].bullets[w].draw();
                 team2.blobs[p].bullets[w].iter += 1;

                 if(team2.blobs[p].bullets[w].iter > 75)
                 {
                     team2.blobs[p].bullets.splice(w, 1);
                 }
             }
        }

        score.innerHTML = `Blue: ${team.blobs.length},  Red: ${team2.blobs.length}`;

        let total_heath = 0;
        let total_heath2 = 0;
        for(let i in team.blobs)
        {
            total_heath += team.blobs[i].health;
            if(team.blobs[i].x > team.border)
            {
                team.border = team.blobs[i].x;
            }
        }
        for(let i in team2.blobs)
        {
            total_heath2 += team2.blobs[i].health;
            if(team2.blobs[i].x < team2.border)
            {
                team2.border = team2.blobs[i].x;
            }
        }

        if(team.border > team2.border && team2.border < team.border)
        {
            let last = 0;
            for(let i in team.blobs)
            {
                if(team.blobs[i].x <= team2.border)  
                {
                    if(team.blobs[i].x > last) last = team.blobs[i].x;
                }
            }
            
            let last2 = 0;
            for(let i in team2.blobs)
            {
                if(team2.blobs[i].x <= team.border)  
                {
                    if(team2.blobs[i].x > last2) last2 = team2.blobs[i].x;
                }
            }
            team2.border = last2;
            team.border = last;
        }
        

        health.innerHTML = `Blue Health: ${total_heath}, Red Health: ${total_heath2}`;

        if(iter%10 == 0)
        {
            team_blob = new Blob(new Vector(getRandomInt(20, team.border), getRandomInt(20, 360)))
            team_blob.color = "#4287f5"
            team.blobs.push(team_blob);
            team2_blob = new Blob(new Vector(getRandomInt(team2.border, 1260), getRandomInt(20, 360)))
            team2_blob.color = "#c71c1c"
            team2.blobs.push(team2_blob);
        }

        iter++;
    }

    const interval = setInterval(update, 20);
}