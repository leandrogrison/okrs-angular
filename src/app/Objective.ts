export interface Objective {
  id?: string,
  name: string,
  description?: string,
  category: {
    id: number,
    name: string
  } | null,
  owner: {
    id: number,
    name: string,
    photo: string
  } | null,
  supporters?: Array<{
    id: number;
    name: string;
    photo: string;
  }>,
  visibility: string,
  cycle: {
    id: string,
    name: string
  },
  associate?: {
    id: string,
    name: string
  } | null,
  startDate: string,
  deadline: string,
  endDate?: string,
  finished: number,
  conclusionPercent?: number,
  numberOfKRs?: number
}
