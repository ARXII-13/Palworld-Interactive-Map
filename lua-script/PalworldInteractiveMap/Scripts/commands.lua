local TeleportUtils = require("teleport")

local Commands = {}

function Commands.teleport(params)
    local x, y, z = params[1], params[2], params[3]
    print(string.format("[Palworld Interactive Map]: Teleport command received with parameters: x=%s, y=%s, z=%s\n",
        tostring(x), tostring(y), tostring(z)))
    if not x or not y or not z then
        print("[Palworld Interactive Map]: Error: teleport requires 3 parameters: x, y, z\n")
        return
    end

    TeleportUtils.teleportPlayerToLocation(x, y, z)
    
end

function Commands.updateActors(params)
    print("[Palworld Interactive Map]: Dump all actors using ue4ss\n")
    DumpAllActors()
end

return Commands