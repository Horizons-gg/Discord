import Config from "config"
import fs from 'node:fs'
import xml2js from 'xml2js'



let Factions: Faction[] = []

export default async function SE_Stations() {

    const Factions = await fetchData()
    console.log(Factions)

}



interface Faction {
    name: string
    tag: string
    type: string
    stations: {
        type: string
        prefab: string
        position: {
            x: number
            y: number
            z: number
        }
    }[]
}

async function fetchData() {
    const File = fs.readFileSync(Config.discord.se_sandboxPath, 'utf-8')
    return (await xml2js.parseStringPromise(File)
        .then((result: any) => result.MyObjectBuilder_Checkpoint.Factions[0].Factions[0].MyObjectBuilder_Faction))
        .map((faction: any) => {

            if (faction.Stations[0].MyObjectBuilder_Station === undefined) return false

            const stations = faction.Stations[0].MyObjectBuilder_Station.map((station: any) => {
                return {
                    type: station.StationType[0],
                    prefab: station.PrefabName[0],
                    position: station.Position[0].$,
                }
            })

            return {
                name: faction.Name[0],
                tag: faction.Tag[0],
                type: faction.FactionType[0],
                stations: stations,
            }
        }) as Faction[]
}