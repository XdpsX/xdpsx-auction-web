import React from 'react'
import PageTitle from '../components/layout/PageTitle'
import NonRoleProtected from '../components/route/NonRoleProtected'
import LinkRouteType from './type'

const createUserRoutesFromLinks = (links: LinkRouteType[]) => {
  return links.map(({ title, path, element, exceptRole }) => ({
    path,
    element: exceptRole ? (
      <NonRoleProtected exceptRole={exceptRole}>
        {title && <PageTitle title={title} />}
        {React.createElement(element)}
      </NonRoleProtected>
    ) : (
      <>
        {title && <PageTitle title={title} />}
        {React.createElement(element)}
      </>
    ),
  }))
}

export default createUserRoutesFromLinks
