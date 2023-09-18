export interface Objective {
  id?: string,
  name: string,
  description?: string,
  category: {
    id: number,
    name: string
  } | null,
  owner: any | null,
  supporters?: any[],
  visibility: string,
  cycle: {
    id: string,
    name: string
  },
  associate?: string | null,
  createdAt: Date,
  startDate: string,
  deadline: string,
  endDate?: string | null,
  finished: number,
  conclusionPercent?: number,
  numberOfKRs?: number,
  numberOfKRsCompleted?: number,
  children?: any
}
