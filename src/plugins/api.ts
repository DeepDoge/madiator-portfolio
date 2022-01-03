import type { Show } from "$/routes/api/get_show"
import type { ShowInfo } from "$/routes/api/get_shows"

export async function GetShows(): Promise<ShowInfo[]>
{
    return JSON.parse(await (await fetch('/api/get_shows')).text())
}

export async function GetShow(name: string): Promise<Show>
{
    return JSON.parse(await (await fetch(`/api/get_show?name=${encodeURIComponent(name)}`)).text())
}