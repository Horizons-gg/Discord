import { Tickets } from "@interfaces/index"



export function main(interaction, flag) {
    Tickets.create(interaction, flag)
}