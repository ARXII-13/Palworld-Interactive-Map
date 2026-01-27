local Utils = require("utils")

local TeleportUtils = {}

function TeleportUtils.teleportPlayerToLocation(x, y, z)
    local player = Utils.getLocalPlayerCharacter(x, y, z)
    if not player then
        print("[Palworld Interactive Map]: Player not found...\n")
        return
    end

    print("[Palworld Interactive Map]: Player found!\n")
    
    local currentLoc = player:K2_GetActorLocation()
    local newLoc = {
        X=x,
        Y=y,
        Z=z + 300 -- Slightly above to avoid ground collision
    }

    print(string.format("[Palworld Interactive Map]: Current player position: X=%.2f Y=%.2f Z=%.2f\n",
        currentLoc.X, currentLoc.Y, currentLoc.Z))
    print(string.format("[Palworld Interactive Map]: Teleporting player to: X=%.2f Y=%.2f Z=%.2f\n",
        newLoc.X, newLoc.Y, newLoc.Z))
    
    local hitResult = {}
    local success = player:K2_SetActorLocation(newLoc, false, hitResult, false)
    
    if success then
        print("[Palworld Interactive Map]: SUCCESS: Teleport player return success \n")
    else
        print("[Palworld Interactive Map]: FAILED: Teleport player return false \n")
    end
    
end

return TeleportUtils