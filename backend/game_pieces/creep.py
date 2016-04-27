# this will store data about the different varieties of creeps
# I don't know if I like this way of designating types, but it works for now
import engine.util
CREEP_TYPES = {
    'basic': {'speed': 10, 'health': 100},
    'medium': {'speed': 10, 'health': 150},
    'advanced': {'speed': 10, 'health': 300},
}

class Creep:
    """So far this is just an example implementation"""

    def factory(type,id):
        type = str(type)
        if type == "Default": return Creep((0,0),"Default",.05,100,id, 15)
        if type == "Slow": return Creep((0,0),"Slow",.01,500,id,30)
        if type == "Fast": return Creep((0,0),"Fast",.15,50,id,30)
        else: return Creep((0,0),"Default",.05,100,id, 15)
    factory = staticmethod(factory)

    def __init__(self, loc, creep_type, speed, health,id, bounty):
        self.loc = loc
        self.type = creep_type
        self.speed = speed # Gotta go fast
        self.base_speed = speed # needed for slow modifiers
        self.health = health
        self.cellPos = (0,0)
        self.id = id # The unique ID of the creep
        self.bounty = bounty
        self.live = True
        self.modifiers = []


    #Calls creep move on all the effect tiles.????
    def creepMove(self, gamestate):
        temp = gamestate.world.effects[self.loc[0]][self.loc[1]].effects
        for i in range(0, len(temp)):
            gamestate.world.effects[self.loc[0]][self.loc[1]].effects[i].on_move(self,gamestate)

    # We generate a json for movement. Passed up to the gameplay_state
    def update(self, path, dt, gameState):
        if self.live:

            #Update counters for creep modifiers
            for i in range(0, len(self.modifiers)):
                self.modifiers[i].update(self.id, gameState)

            # Remove the expired modifiers
            a = self.modifiers
            for b in reversed(a):
                if b.counter <0:
                    a.remove(b)
            self.modifiers = a



         #   print(self.cellPos)
            direction = (self.dest(path)[0]-self.loc[0], self.dest(path)[1]-self.loc[1])    #figure out in-cell movement vector
            #self.cellPos = (self.cellPos[0] + (self.speed*direction[0]), self.cellPos[1] + (self.speed*direction[1])) # move position in cell
            #gameState.world.effects[self.loc[0]][self.loc[1]].effects[0].on_move(self,gameState); #We assumed there was fire.
           # print("------")
           # print(self.loc)
           # print(self.dest(path))
           # print(direction)
           # print(self.cellPos)
           # print("------")

            edgeConf = engine.util.edge(self.cellPos , direction) #check if at edge and new position

            if edgeConf[0]: # returns true if creep should move
                if(self.dest(path) == gameState.world.endpoint):
                    self.killPlayer(gameState)
                    return {self.id : self.loc} , {self.id : (self.cellPos)}
                else:
                    self.cellPos = edgeConf[1] #this is where the creep should be in the next cell if edgeConf[0] is true
                    #print("THE PIECE SHOULD MOVE HERE: "+str(self.cellPos[0])+" "+str(self.cellPos[1]))
                    pos = self.move_on_path(path) #move to next cell
            else: #then edgeConf[1] holds the direction
                self.cellPos = (self.cellPos[0] + (self.speed*edgeConf[1][0]), self.cellPos[1] + (self.speed*edgeConf[1][1])) # move position in cell

            self.creepMove(gameState)
            return {self.id : self.loc} , {self.id : (self.cellPos)}

    def move_to_dest(self, dest):
        self.loc = dest
        return self.loc

    def move_on_path(self, path):
        self.loc = path[self.loc]
        return self.loc

    def dest(self, path):
        return path[self.loc]

    #The creep has an array of modifiers and we append the modifications to this array. For each tick, we check if the modifier has expired.
    #If it has not expired, we renew the effect for another tick.
    def modify(self, modification):
        self.modifiers.append(modification)

    def take_damage(self, amount, gameState):
        self.health -= amount
        if (self.health <= 0):
            self.die(gameState)
            return 0
        else:
            return self.health

    def die(self, gameState):
            gameState.gold += self.bounty
            self.live=False

    def killPlayer(self, gameState):
            gameState.lives -=1
            self.live = False

    def adjust_speed(self, amount):
        self.speed += amount

    def get_position(self):
        return self.loc[0], self.loc[1]

    def __str__(self):  # like toString() in Java
        return 'speed,loc,health,cellpos: ' + str(self.speed) + ',' + str(self.loc) + ',' + str(self.health) + ',' + str(self.cellPos)
