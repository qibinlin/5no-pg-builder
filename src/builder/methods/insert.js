export default function() {
  this.sql.push('INSERT INTO')
  this.sql.push(this.helpers.table())

  const data = this.helpers.insert()

  this.sql.push(`(${data.fields})`)
  this.sql.push('VALUES')
  this.sql.push(`(${data.values})`)

  const returning = this.helpers.returning()
  if (returning) {
    this.sql.push('RETURNING')
    this.sql.push(returning)
  }
}
