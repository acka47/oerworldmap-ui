export default (action, user, context) => {
  switch (action) {
  case 'deleteEntry':
    return context['@id'] && user && user.groups.includes('admin')
  case 'editEntry':
    return user
      && (user.groups.includes('admin')
        || (context['@type'] !== 'Person' || context['@id'] === user.id)
      )
  case 'logEntry':
    return user && user.groups.includes('admin')
  case 'userActions':
    return !!user
  case 'userMenu':
    return !!user
  case 'addEntry':
    return !!user
  case 'groupAdmin':
    return user && user.groups.includes('admin')
  }
}
