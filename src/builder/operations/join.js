export default function(builder, primaryTableField, secondaryTableField) {
  if (!this.state.join) {
    this.state.join = []
  }

  this.state.join.push(this.helpers.joinData({
    type: 'JOIN',
    builder: builder,
    primaryTableField: primaryTableField,
    secondaryTableField: secondaryTableField,
  }))

  return this.operations
}
