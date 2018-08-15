export interface ICreateLogger {
  name: string
  level?: string
  prettyPrint?: boolean
}

export function create (opts: ICreateLogger) {
  return {
    name: opts.name,
    level: opts.level || 'info',
    prettyPrint: opts.prettyPrint || false
  }
}
