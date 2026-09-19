export type Img = { k: string; c?: string; w?: number; sm?: number }
export type Num = { l: string; b?: string; a: string; note?: string }
export type Node = { t: string; s?: string; q?: string; a?: string; table?: string[][]; num?: Num[]; imgs?: Img[] }
export type Item = {
  id: string; y: string; t: string; ko?: string; cover?: string; tags?: string[]; links?: [string, string][]; meta?: string
  intro: { html: string; imgs?: Img[] }; nodes: Node[]
  // pub
  st?: string; venue?: string; role?: string; authors?: string
  // proj
  who?: string; res?: string
}
export type Kind = 'pub' | 'proj'
export type Event = { d: string; ms?: string; k?: Kind; id?: string; sum?: string }
export type Site = { PUBS: Item[]; PROJECTS: Item[]; EVENTS: Event[]; IMG: Record<string, string> }
