export const ADMIN_ROLES = ['admin', 'editor', 'clinical_reviewer'] as const

export type AdminRole = (typeof ADMIN_ROLES)[number]

export const ADMIN_PERMISSIONS = [
  'dashboard:view',
  'content:view',
  'content:create',
  'content:update',
  'content:submit_review',
  'content:publish',
  'content:archive',
  'clinical_review:view',
  'clinical_review:approve',
  'clinical_review:reject',
  'media:view',
  'media:manage',
  'site_settings:view',
  'site_settings:manage',
  'users:view',
  'users:manage',
  'audit:view',
] as const

export type AdminPermission = (typeof ADMIN_PERMISSIONS)[number]

export const ROLE_PERMISSIONS = {
  admin: ADMIN_PERMISSIONS,
  editor: [
    'dashboard:view',
    'content:view',
    'content:create',
    'content:update',
    'content:submit_review',
    'clinical_review:view',
    'media:view',
    'media:manage',
    'site_settings:view',
  ],
  clinical_reviewer: [
    'dashboard:view',
    'content:view',
    'clinical_review:view',
    'clinical_review:approve',
    'clinical_review:reject',
  ],
} as const satisfies Record<AdminRole, readonly AdminPermission[]>

export function isAdminRole(value: unknown): value is AdminRole {
  return typeof value === 'string' && ADMIN_ROLES.includes(value as AdminRole)
}

export function hasPermission(role: AdminRole, permission: AdminPermission) {
  return (ROLE_PERMISSIONS[role] as readonly AdminPermission[]).includes(permission)
}

export const ROLE_LABELS: Record<AdminRole, string> = {
  admin: 'Yönetici',
  editor: 'Editör',
  clinical_reviewer: 'Klinik inceleyen',
}
