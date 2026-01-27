local Utils = {}

function Utils.getLocalPlayerCharacter()
    local player = FindFirstOf("PalPlayerCharacter")
    if player ~= nil and player:IsValid() then
        return player
    end
    return nil
end

return Utils