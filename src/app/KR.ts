export interface KR {
  id?: string,
  name: string,
  description?: string,
  owner: {
    id: number,
    name: string,
    photo: string
  } | null,
  type: string,
  value?: number,
  unit?: string,
  objective: string,
  percent?: number,
  progress: number,
  tasks: Array<{
    id: string,
    name: string,
    checked: boolean
  }>
}
