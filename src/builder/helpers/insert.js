export default function() {
  if (this.state.insert) {
    return {
      fields: this.state.insert.fields.join(', '),
      values: this.state.insert.values.join(', '),
    }
  }

  return null
}
