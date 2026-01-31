-- PlayerLocation.lua
-- Reads the local player's world position and prints it

local commandFile = "ue4ss\\Mods\\PalworldInteractiveMap\\command.txt"
local Commands = require("commands")

local scriptStartTime = os.time()
print(string.format("[Palworld Interactive Map]: Script loaded at %s\n", os.date("%Y-%m-%d %H:%M:%S", scriptStartTime)))

local function splitByNewline(content)
    local lines = {}
    for line in content:gmatch("[^\r\n]+") do
        table.insert(lines, line)
    end
    return lines
end

local function parseCommand(content)
    local lines = splitByNewline(content)
    if next(lines) == nil then
        return nil
    end

    local commands = {}
    for _, line in ipairs(lines) do
        local parts = {}
        for value in line:gmatch("[^%s,]+") do
            table.insert(parts, value)
        end

        local functionName = parts[1]
        
        local params = {}
        for i = 2, #parts do
            local num = tonumber(parts[i])
            params[i-1] = num or parts[i]
        end
        
        local command = {functionName, params}
        table.insert(commands, command)
    end

    return commands
end

local function checkForCommands()

    local file = io.open(commandFile, "r")

    if not file then
        return
    end
    file:close()

    -- Just to skip some lingering commands created before the game started
    local currentTime = os.time() - scriptStartTime
    if currentTime < 30 then
        print("[Palworld Interactive Map]: Ignoring commands during initial 30 seconds after script load\n")
        os.remove(commandFile)
        return
    end

    file = io.open(commandFile, "r")
    local content = file:read("*all")
    file:close()

    if content and content ~= "" then
        print("[Palworld Interactive Map]: Command file found, processing...\n")
        local commands = parseCommand(content)
        if not commands then
            return
        end

        for _, command in ipairs(commands) do
            local functionName = command[1]
            local params = command[2]

            if Commands[functionName] then
                print(string.format("[Palworld Interactive Map]: Executing command: %s\n", functionName))
                Commands[functionName](params)
            else
                print(string.format("[Palworld Interactive Map]: Unknown command: %s\n", functionName))
            end
        end
    end

    os.remove(commandFile)
end

LoopAsync(2000, function()
    checkForCommands()
end)

print("[Palworld Interactive Map]: Watching for commands in: " .. commandFile .. "\n")
print("[Palworld Interactive Map]: Mod loaded\n")
