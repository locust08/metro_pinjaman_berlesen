import type { Endpoint, GlobalConfig } from 'payload'
import {
  headersWithCors,
  restoreVersionOperationGlobal,
  sanitizePopulateParam,
} from 'payload'

import {
  restoreGlobalVersionAndTriggerPagesDeploy,
  type RestoreGlobalVersionOperation,
} from '../hooks/triggerPagesDeploy'

function parseOptionalNumber(value: string | null): number | undefined {
  if (value === null || value.trim() === '') return undefined

  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : undefined
}

type RestoreGlobalVersionEndpointOptions = {
  restoreVersionOperation?: RestoreGlobalVersionOperation
}

export function restoreGlobalVersionWithDeployEndpoint(
  globalConfig: GlobalConfig,
  options: RestoreGlobalVersionEndpointOptions = {},
): Endpoint {
  return {
    handler: async (req) => {
      const depth = parseOptionalNumber(req.searchParams.get('depth'))
      const draft = req.searchParams.get('draft') === 'true' ? true : undefined
      const { id } = req.routeParams

      req.payload.logger?.info?.({
        global: globalConfig.slug,
        id,
        draft: draft ?? false,
        msg: 'Payload restore-with-deploy endpoint entered.',
      })

      if (typeof id !== 'string' && typeof id !== 'number') {
        return Response.json({ errors: [{ message: 'Missing ID of version to restore.' }] }, { status: 400 })
      }

      const doc = await restoreGlobalVersionAndTriggerPagesDeploy({
        depth,
        draft,
        globalConfig,
        id,
        populate: sanitizePopulateParam(req.query.populate),
        req,
        restoreVersionOperation: options.restoreVersionOperation ?? (restoreVersionOperationGlobal as RestoreGlobalVersionOperation),
      })

      return Response.json({
        doc,
        message: req.t?.('version:restoredSuccessfully') ?? 'Restored successfully',
      }, {
        headers: headersWithCors({
          headers: new Headers(),
          req,
        }),
        status: 200,
      })
    },
    method: 'post',
    path: '/versions/:id',
  }
}

export function withRestoreDeployEndpoint<TGlobal extends GlobalConfig>(globalConfig: TGlobal): TGlobal {
  globalConfig.endpoints = [
    restoreGlobalVersionWithDeployEndpoint(globalConfig),
    ...(globalConfig.endpoints || []),
  ]

  return globalConfig
}
