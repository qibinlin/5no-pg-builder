export default function(data) {
  let values = []
  let fields = []

  Object.keys(data).forEach((field) => {
    fields.push(field)
    values.push(data[field] === null ? 'NULL' : this.helpers.bound(data[field]))
  })

  return {
    fields: fields,
    values: values,
  }
}
