export function parseBackendDate(iso: string) {
  // Backend currently stores timestamps without timezone (Postgres "timestamp without time zone").
  // JS interprets those as *local time* which makes "time ago" wrong in many timezones.
  // Treat timezone-less strings as UTC.
  const hasTz = /([zZ]|[+-]\d\d:\d\d)$/.test(iso)
  const d = new Date(hasTz ? iso : `${iso}Z`)
  return Number.isNaN(d.getTime()) ? null : d
}

export function minutesSince(iso: string) {
  const d = parseBackendDate(iso)
  if (!d) return null
  return (Date.now() - d.getTime()) / 60000
}

